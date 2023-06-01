import { db } from "@/utils/firebase";
import { collection } from "@/utils/variable";
import React from "react";
import DOMPurify from 'dompurify';

//style
import styles from './index.less';

const DetailNews:React.FC = (props: any) => {
    const {
        history: {},
        match: {
            params: { newsId },
        },
    } = props;

    const [newsDetail, setNewsDetail] = React.useState<any>();
    const [safeBody, setSafeBody] = React.useState<any>();

    React.useEffect(() => {
        (async () => {
            const data = await db.collection(collection.news).doc(newsId).get();
            console.log('data', data.data());
            const safeContent = DOMPurify.sanitize(data.data()?.editorContent);
            setSafeBody(safeContent);
            setNewsDetail(data.data());
        })()
    }, []);

    return (
        <React.Fragment>
            <div className={styles.page_warpper}>
                <h2
                    style={{
                        textAlign: "center",
                        padding: '20px 0px',
                        fontFamily: 'Oswald'
                    }}
                >{newsDetail?.titleContent}</h2>
                <div dangerouslySetInnerHTML={{ __html: safeBody}} />
            </div>
        </React.Fragment>
    );
};

export default DetailNews;