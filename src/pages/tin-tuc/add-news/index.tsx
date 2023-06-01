import React, { useState } from "react";
import AddNewsForm from "../component/add-news-form";

import styles from './index.less';
import { message } from "antd";
import { uploadFile } from "@/utils/uploadFile";
import { db } from "@/utils/firebase";
import { collection } from "@/utils/variable";

const AddNews: React.FC = () => {

    const formRef = React.useRef<any>(null);

    const [loadingUploadImgFirebase, setLoadingUploadImgFirebase] = useState(false);
    const [linkBannerImgFirebase, setLinkBannerImgFirebase] = useState<string>('');
    React.useEffect(() => {
        if (loadingUploadImgFirebase) {
            message.loading('Uploading', 9999);
        } else {
            message.destroy();
        }
        return () => {
            message.destroy();
        };
    }, [loadingUploadImgFirebase]);

    const handleSubmitAddNews = (value: any) => {
        setLoadingUploadImgFirebase(true);
        db.collection(collection.news)
            .doc(value.idPath)
            .set(value)
            .then(() => {
                setLoadingUploadImgFirebase(false);
                message.success('Thêm bài viết thành công!');
            })
            .catch(() => {
                setLoadingUploadImgFirebase(false);
                message.error('Thêm bài viết thất bại!');
            });
    };

    const handleUploadFile = async ({ onError, onSuccess, file }: any) => {
        const isImage = file.type.indexOf('image/') === 0;
        if (!isImage) {
            setLoadingUploadImgFirebase(false);
            message.destroy();
            message.error('Chỉ có thể Upload HÌNH ẢNH!');
            return isImage;
        }
        const isLt4M = file.size / 1024 / 1024 < 4;
        if (!isLt4M) {
            message.error('Kích thước hình ảnh phải nhỏ hơn 4MB!');
            return isLt4M;
        }
        try {
            setLoadingUploadImgFirebase(true);
            const imgLink = await uploadFile(file, 'news');
            if (imgLink) {
                setLinkBannerImgFirebase(imgLink);
                formRef?.current?.setFieldsValue({
                    ['uploadBannerImg']: imgLink,
                });
                setLoadingUploadImgFirebase(false);
                message.success('Upload hình ảnh thành công!')
            }
        } catch (error) {
            setLoadingUploadImgFirebase(false);
            onError(error);
        }
    };

    const handleUploadImgInEditor = async (file: any) => {
        const isImage = file.type.indexOf('image/') === 0;
        if (!isImage) {
            setLoadingUploadImgFirebase(false);
            message.destroy();
            message.error('Chỉ có thể Upload HÌNH ẢNH!');
            return isImage;
        }
        const isLt4M = file.size / 1024 / 1024 < 4;
        if (!isLt4M) {
            message.error('Kích thước hình ảnh phải nhỏ hơn 4MB!');
            return isLt4M;
        }
        try {
            setLoadingUploadImgFirebase(true);
            const imgLink = await uploadFile(file, 'newsbody');
            if (imgLink) {
                setLoadingUploadImgFirebase(false);
                message.success('Upload hình ảnh thành công!')
                return {
                    data: {
                        link: imgLink,
                    },
                };
            }
        } catch (error) {
            setLoadingUploadImgFirebase(false);
            console.log('error at upload img in editor -> add news page: ', error);
        }
    };

    return (
        <React.Fragment>
            <div className={styles.page_warpper}>
                <h1 className={styles.title_page}>Tạo Tin Tức Mới</h1>
                <AddNewsForm 
                    formRef={formRef}
                    imgLinkBanner={linkBannerImgFirebase}
                    handleUploadFile={handleUploadFile}
                    handleSubmitAddNews={handleSubmitAddNews}
                    handleUploadImgEditor={handleUploadImgInEditor}
                />
            </div>
        </React.Fragment>
    );
};

export default AddNews;