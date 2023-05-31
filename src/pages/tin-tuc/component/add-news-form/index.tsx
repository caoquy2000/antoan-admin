import { toolbarEditor } from '@/components/EditorToolbar';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Upload } from 'antd';
import { EditorState, convertToRaw } from 'draft-js';
import React, { useRef } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

//editor 
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface AddNewsFormProps {
    handleSubmitAddNews: (values: any) => any;
}


const AddNewsForm = (props: AddNewsFormProps) => {

    const {
        handleSubmitAddNews
    } = props;

    const formRef = useRef<any>(null);
    const editorRef = useRef<any>(null);

    const [editorValue, setEditorValue] = React.useState<EditorState>(() => EditorState.createEmpty());
    const [loadingUploadImg, setLoadingUploadImg] = React.useState(false);

    React.useEffect(() => {
        if (formRef !== null) {
        //    let htmlContent = convertToHTML(editorValue.getCurrentContent());
            let htmlContent = draftToHtml(convertToRaw(editorValue.getCurrentContent()));
           formRef?.current?.setFieldValue('editorContent', htmlContent);
        }
    }, [editorValue]);

    // const toRaw = (editorState: EditorState) => {
    //     return convertToRaw(editorState.getCurrentContent());
    // };

    const onChangeValueEditor = (value: EditorState) => {
        setEditorValue(value);
    };

    const uploadButton = (
        <div>
            {loadingUploadImg ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{
                marginTop: 8
            }}>Upload</div>
        </div>
    );

    return (
        <div style={{
            width: '100%',
        }}>
            <ProForm
                formRef={formRef}
                onFinish={
                    (values) => handleSubmitAddNews(values)
                }
            >
                <ProForm.Group>
                    <ProFormText 
                        width={'lg'}
                        name={'titlePage'}
                        label={'Tiêu Đề Trang:'}
                        placeholder={'Nhập tiêu đề trang...'}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText 
                        width={'lg'}
                        name={'titleContent'}
                        label={'Tiêu Đề Bài Viết:'}
                        placeholder={'Nhập tiêu đề bài viết...'}
                    />
                </ProForm.Group>
                <ProForm.Group 
                    style={{
                        width: '100%',
                    }}
                >
                    <ProFormTextArea 
                        width={'lg'}
                        name={'metaDescription'}
                        label={'Thẻ Meta Description:'}
                        placeholder={'Nhập nội dung thẻ meta...'}
                    />
                </ProForm.Group>
                <ProForm.Group title={'Hình Banner'}>
                    <Upload
                         name="avatar"
                         listType="picture-card"
                         className="avatar-uploader"
                         showUploadList={false}
                         action=""
                    >
                        {uploadButton}
                    </Upload>
                </ProForm.Group>
                <ProForm.Group title={'Nội dung bài viết'}>
                    <Editor 
                        ref={editorRef}
                        editorState={editorValue}
                        editorStyle={{
                            width: '100%',
                            height: '300px',
                            border: '1px solid #f3f3f3',
                            padding: '10px',
                            lineHeight: '1.0',
                            backgroundColor: '#FEFEFE',
                            fontFamily: 'Mulish',
                          }}
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                        onEditorStateChange={(editorState) => onChangeValueEditor(editorState)}
                    />
                    <ProForm.Item
                        style={{
                            display: 'none',
                        }}
                    >
                        <ProFormTextArea
                            style={{
                                display: 'none !important',
                            }}
                            name={'editorContent'}
                            disabled
                        />
                    </ProForm.Item>
                </ProForm.Group>
            </ProForm>
        </div>
        
    );
};

export default AddNewsForm;