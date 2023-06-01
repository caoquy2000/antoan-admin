import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ProForm, { ProFormInstance, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Image, Upload } from 'antd';
import { EditorState, convertToRaw } from 'draft-js';
import React, { MutableRefObject, useRef } from 'react';

//editor 
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

//style
import styles from './index.less';
import { toolbarEditor } from '@/components/EditorToolbar';

interface AddNewsFormProps {
    formRef: MutableRefObject<ProFormInstance<Record<string, any>>>;
    imgLinkBanner: string;
    handleUploadFile: (value: any) => any;
    handleSubmitAddNews: (values: any) => any;
}


const AddNewsForm = (props: AddNewsFormProps) => {

    const {
        formRef,
        imgLinkBanner,
        handleUploadFile,
        handleSubmitAddNews,
    } = props;

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

    const handleButtonSubmit = (value: any) => {
        if (value) {
            value.form?.submit();
        }
    };

    const handleButtonReset = (value: any) => {
   
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
                submitter={{
                    render: (props, doms) => {
                        return [
                           <React.Fragment>
                                <div className={styles.button_wrapper}>
                                    <div className={styles.button_left}>
                                        <Button
                                            key={'submit'}
                                            type='primary'
                                            onClick={() => handleButtonSubmit(props)}
                                        >
                                            Tạo Mới
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            key={'reset'}
                                            type='ghost'
                                            onClick={() => handleButtonReset(props)}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                           </React.Fragment>
                        ];
                    },
                }}
            >
                <ProForm.Group title={'Tiêu Đề Page:'}>
                    <ProFormText 
                        width={'lg'}
                        name={'titlePage'}
                        placeholder={'Nhập tiêu đề trang...'}
                    />
                </ProForm.Group>
                <ProForm.Group title={'Tiêu Đề Bài Viết:'}>
                    <ProFormText 
                        width={'lg'}
                        name={'titleContent'}
                        placeholder={'Nhập tiêu đề bài viết...'}
                    />
                </ProForm.Group>
                <ProForm.Group 
                    style={{
                        width: '100%',
                    }}
                    title={'Thẻ MetaDescription:'}
                >
                    <ProFormTextArea 
                        width={'lg'}
                        name={'metaDescription'}
                        placeholder={'Nhập nội dung thẻ meta...'}
                    />
                </ProForm.Group>
                <ProForm.Group 
                    title={'Hình Banner'}
                    style={{
                        gap: '0',
                    }}
                >
                    <ProForm.Item
                        style={{
                            display: 'none',
                        }}
                    >
                        <ProFormText 
                            key={'uploadBanner'}
                            name={'uploadBannerImg'}
                        />
                    </ProForm.Item>
                    {
                        imgLinkBanner ? 
                        (
                            <Image
                                width={250}
                                src={imgLinkBanner}
                            />
                        )
                        : 
                        (
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                customRequest={handleUploadFile}
                            >
                                {uploadButton}
                            </Upload>
                        )
                    }
                </ProForm.Group>
                <ProForm.Group title={'Nội dung bài viết'}>
                    <Editor 
                        ref={editorRef}
                        editorState={editorValue}
                        editorStyle={{
                            width: '100%',
                            height: '500px',
                            border: '1px solid #f3f3f3',
                            padding: '10px',
                            lineHeight: '1.0',
                            backgroundColor: '#FEFEFE',
                            fontFamily: 'Mulish',
                            overflowY: 'hidden',
                          }}
                        toolbar={toolbarEditor}
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