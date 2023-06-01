import React from "react";
import AddNewsForm from "../component/add-news-form";

import styles from './index.less';

const AddNews: React.FC = () => {

    const handleSubmitAddNews = (value: any) => {
        console.log('Test Add service: ', value);
    };

    return (
        <React.Fragment>
            <div className={styles.page_warpper}>
                <h1 className={styles.title_page}>Tạo Tin Tức Mới</h1>
                <AddNewsForm 
                    handleSubmitAddNews={handleSubmitAddNews}
                />
            </div>
        </React.Fragment>
    );
};

export default AddNews;