import { formats } from '@/components/EditorToolbar';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Upload } from 'antd';
import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import "@/global.css";

interface AddServiceFormProps {
    handleSubmitAddService: (values: any) => any;
}


const AddServiceForm = (props: AddServiceFormProps) => {

    const {
        handleSubmitAddService
    } = props;

    const formRef = useRef<any>(null);

    const [editorValue, setEditorValue] = React.useState('');
    const [loadingUploadImg, setLoadingUploadImg] = React.useState(false);

    React.useEffect(() => {
        console.log('editor', editorValue);
    });

    const Quill = ReactQuill.Quill;
    let Font = Quill.import('formats/font');
    Font.whitelist = ['Ubuntu', 'Raleway', 'Roboto'];
    Quill.register(Font, true);

    const modules = useMemo(
        () => ({
          toolbar: {
            container: [
              [{ font: [] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ script: "sub" }, { script: "super" }],
              ["blockquote", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }],
    
              [
                { indent: "-1" },
                { indent: "+1" },
                { align: [] },
              ],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              ["link", "image", "video"],
              ["clean"],
            ],
    
            handlers: {
            },
            history: {
              delay: 500,
              maxStack: 100,
              userOnly: true,
            },
          },
        }),
        []
      );

    const onChangeValueEditor = (value: any) => {
        if (formRef != null) {
            formRef?.current?.setFieldValue('editorContent', value);
        }
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
                    (values) => handleSubmitAddService(values)
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
                    {/* <QuillToolbar />/\ */}
                    <ReactQuill 
                        theme='snow'
                        style={{
                            width: '100%',
                            overflow: 'scroll',
                            overflowX: 'hidden',
                            overflowY: 'hidden',
                            height: '900px',
                        }}
                        modules={modules}
                        bounds={'.app'}
                        formats={formats}
                        onChange={(content) => onChangeValueEditor(content)}
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
                            valuePropName={editorValue}
                        />
                    </ProForm.Item>
                </ProForm.Group>
            </ProForm>
        </div>
        
    );
};

export default AddServiceForm;