import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ProForm, { ProFormInstance, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Image, InputProps, Upload, UploadProps, message } from 'antd';
import { ContentState, DraftEntityType, EditorState, RichUtils, convertFromHTML, convertToRaw } from 'draft-js';
import React, { MutableRefObject, useRef } from 'react';

//editor 
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
//style
import styles from './index.less';
import { toolbarEditor } from '@/components/EditorToolbar';
import mammoth from 'mammoth';
import { fileToByteArray } from '@/utils/fileToByteArray';
import { uploadBase64 } from '@/utils/uploadFile';

interface AddNewsFormProps {
    formRef: MutableRefObject<ProFormInstance<Record<string, any>>>;
    imgLinkBanner: string;
    handleUploadFile: (value: any) => any;
    handleSubmitAddNews: (values: any) => any;
    handleUploadImgEditor: (values: any) => any;
}


const AddNewsForm = (props: AddNewsFormProps) => {

    const {
        formRef,
        imgLinkBanner,
        handleUploadFile,
        handleSubmitAddNews,
        handleUploadImgEditor,
    } = props;

    const editorRef = useRef<any>(null);

    const [editorValue, setEditorValue] = React.useState<EditorState>(() => EditorState.createEmpty());
    const [loadingUploadImg, setLoadingUploadImg] = React.useState(false);
    const [loadingUploadDocx, setLoadingUploadDocx] = React.useState(false);

    React.useEffect(() => {
        if (formRef !== null) {
        //    let htmlContent = convertToHTML(editorValue.getCurrentContent());
            let raw = convertToRaw(editorValue.getCurrentContent());
            console.log('raw   ---- ', raw);
            let htmlContent = draftToHtml(raw, undefined, false, customEntityTransform);
            console.log('htmlContent use effect', htmlContent);
           formRef?.current?.setFieldValue('editorContent', htmlContent);
        }
    }, [editorValue]);
    React.useEffect(() => {
        if (loadingUploadDocx) {
            message.loading('Đang tải...', 9999);
        } else {
            message.destroy();
        }
        return () => {
            message.destroy();
        };
    }, [loadingUploadDocx]);

    const customEntityTransform = (entity: any, text: string) => {
        if (entity.type !== "IMAGE") return;
        return `<figure style="text-align:center"><img src="${entity.data.src}" alt="${entity.data.alt}" style="max-width:100%;height:auto;${entity.data.style}" /></figure>`
    };

    const onChangeValueEditor = (editorState: EditorState) => {
        setEditorValue(editorState);
    };

    const handleButtonSubmit = (value: any) => {
        if (value) {
            value.form?.submit();
        }
    };

    const handleButtonReset = (value: any) => {
   
    };

    const myBlockRenderer = (contentBlock: any) => {
        const type = contentBlock.getType();
        if (type === 'atomic') {
            return {
                component: MediaComponent,
                editable: false,
                props: {
                    foo: 'bar',
                },
            };
        }
    };

    const onUploadFile = async (info: any) => {
        setLoadingUploadDocx(true);
        let byteArray = await fileToByteArray(info);
        let options = {
            convertImage: mammoth.images.imgElement((image: any) => {
                return image.read("base64").then(async (imageBuffer: any) => {
                    console.log('image, ', image);
                    const urlImg = await uploadBase64('newscontent', imageBuffer);
                    return {
                        src: urlImg
                    };
                })
            })
        }
        mammoth.convertToHtml({arrayBuffer: byteArray}, options)
            .then((result) => {
                let html = result.value;
                let message = result.messages;
                console.log('html -> ', html);
                setEditorValue(htmlToDraftBlock(html));
                setLoadingUploadDocx(false);
            })
            .catch((error) => {
                console.log('convert error ', error);
                setLoadingUploadDocx(false);
            });
    };

    const htmlToDraftBlock = (html: any) => {
        const blockFromHtml = htmlToDraft(html, (nodeName, node) => {
            if (nodeName === 'img' && node instanceof HTMLImageElement) {
                const entityConfig = {
                    alignment: '',
                    src: '',
                    alt: '',
                };
                const parentElement = node.parentElement;
                if (parentElement?.style.float) {     
                    entityConfig.alignment = parentElement.style.float;
                } else if (parentElement?.style.textAlign) {  
                    entityConfig.alignment = parentElement.style.textAlign;
                }

                entityConfig.src = node.getAttribute
                    ? node.getAttribute('src') || node.src
                    : node.src;
                entityConfig.alt = node.alt;
                const data = {
                    ...entityConfig,
                    style: node.style.cssText,
                };
                console.log('data -> ', data);
                return {
                    type: 'IMAGE',
                    mutability: 'MUTABLE',
                    data: data
                };
            }
        });
        console.log('block form html -> ', blockFromHtml);
        const { contentBlocks, entityMap } = blockFromHtml;
        console.log('contentBlock', contentBlocks);
        console.log('enttity Map', entityMap);
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        console.log('content state', contentState);
        const editorState = EditorState.createWithContent(contentState);
        console.log('editor state', editorState);
        return editorState;
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
                layout='vertical'
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
                 <ProForm.Group title={'Path:'}>
                    <ProFormText 
                        width={'lg'}
                        name={'idPath'}
                        placeholder={'Nhập đường dẫn cho bài viết...'}
                        rules={[{
                            required: true,
                            message: 'Nhập tiêu đề trước khi tạo bài viết!'
                        }]}
                    />
                </ProForm.Group>
                <ProForm.Group title={'Tiêu Đề Page:'}>
                    <ProFormText 
                        width={'lg'}
                        name={'titlePage'}
                        placeholder={'Nhập tiêu đề trang...'}
                        rules={[{
                            required: true,
                            message: 'Nhập tiêu đề trước khi tạo bài viết!'
                        }]}
                    />
                </ProForm.Group>
                <ProForm.Group title={'Tiêu Đề Bài Viết:'}>
                    <ProFormText 
                        width={'lg'}
                        name={'titleContent'}
                        placeholder={'Nhập tiêu đề bài viết...'}
                        rules={[{
                            required: true,
                            message: 'Nhập tiêu đề trước khi tạo bài viết!'
                        }]}
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
                        rules={[{
                            required: true,
                            message: 'Nhập nội dung thẻ meta trước khi tạo bài viết!'
                        }]}
                    />
                </ProForm.Group>
                <ProForm.Group 
                    title={'Hình Banner'}
                    direction='vertical'
                >
                    {
                        imgLinkBanner !== null && imgLinkBanner !== undefined && imgLinkBanner !== '' ? 
                        (
                            <Image
                                width={250}
                                src={imgLinkBanner}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
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
                    <ProForm.Item
                        style={{
                            paddingTop: '10px',
                        }}
                    >
                        <ProFormText 
                            key={'altImgBanner'}
                            name={'altImgBanner'}
                            placeholder={'Nhập mô tả cho hình ảnh...'}
                            rules={[{
                                required: true,
                                message: 'Nhập mô tả cho banner trước khi tạo bài viết!'
                            }]}
                        />
                    </ProForm.Item>
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
                    
                </ProForm.Group>

                <ProForm.Group 
                    title={'Nội dung bài viết'}
                    direction='vertical'
                >
                    <Upload 
                        name='file'
                        beforeUpload={onUploadFile}
                    >
                        <Button icon={<UploadOutlined />}>Upload File</Button>
                    </Upload>
                    <Editor 
                        ref={editorRef}
                        editorState={editorValue}
                        editorStyle={{
                            width: '100% !important',
                            height: '500px',
                            border: '1px solid #f3f3f3',
                            padding: '10px',
                            lineHeight: '1.0',
                            backgroundColor: '#FEFEFE',
                            fontFamily: 'Roboto',
                            fontSize: 18,
                            letterSpacing: 0.7,
                            lineHeight: 1.5,
                          }}
                        toolbar={{
                            ...toolbarEditor,
                            image: {
                                uploadEnabled: true,
                                uploadCallback: handleUploadImgEditor,
                                previewImage: true,
                                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                alt: { present: true, mandatory: true },
                                defaultSize: {
                                     height: 'auto',
                                     maxWidth: '100%',
                                },
                            }
                        }}
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                        // customStyleMap={editorStyleMap}
                        // toolbarCustomButtons={[<ShowMore />]}
                        handlePastedText={() => false}
                        customBlockRenderFunc={myBlockRenderer}
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

const MediaComponent: React.FC = (props: any) => {
    const {
        block,
        contentState,
    } = props;
    const { foo } = props.blockProps;
    const data = contentState.getEntity(block.getEntityAt(0)).getData();

    const emptyHtml = ' ';
    return (
        <div>
            {emptyHtml}
            <img 
                src={data.src}
                alt={data.alt || ''}
                style={{
                    height: data.height || 'auto',
                    width: data.width || 'auto',
                    maxWidth: '100%',
                }}
            />
        </div>
    );
};

export default AddNewsForm;