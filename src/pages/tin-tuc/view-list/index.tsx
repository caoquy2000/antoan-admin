import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import ProTable from "@ant-design/pro-table";
import { Anchor, Button, Image, Modal, Space } from "antd";
import React, { ReactText, useState } from "react";
import AddNewsForm from "../component/add-news-form";
import { db } from "@/utils/firebase";
import { collection } from "@/utils/variable";
import { SortOrder } from "antd/lib/table/interface";

const News: React.FC = () => {
    const newsTableRef = React.useRef(null);

    const column: any = [
        {
            title: 'No.',
            dataIndex: 'number',
            sorter: (a: any, b: any) => a.number - b.number,
            search: false,
            align: 'center',
            width: '15%',
        },
        {
            title: 'Tiêu Đề Tin Tức',
            dataIndex: 'titleContent',
            copyable: true,
            sorter: (a: any, b:any) => a.name.localCompare(b.name),
            filters: true,
            onFilter: true,
            align: 'center',
            formItemProps: {
                rules: [
                    {
                        require: true,
                        message: 'Nhập tiêu đề Tin Tức để tìm kiếm',
                    }
                ]
            },
            width: '35%',
        },
        {
            title: 'Banner',
            dataIndex: 'uploadBannerImg',
            copyable: false,
            search: false,
            align: 'center',
            render: (_:any, record:any) => {
                return (
                    <Space>
                        <Image width={50} src={record.uploadBannerImg}  />
                    </Space>
                )
            },
            width: '20%',
        },
        {
            title: 'Hành Động',
            dataIndex: 'action',
            center: true,
            search: false,
            align: 'center',
            render: (_: any, record: any) => {
                return (
                    <div 
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '50%',
                                marginRight: '8px',
                            }}
                        >
                            <Button
                                key='btnEditService'
                                type='primary'
                                size='middle'
                                block={true}
                                icon={<EditOutlined />}
                                onClick={() => handleEditNews(record)}
                            >
                                Sửa 
                            </Button>
                        </div>
                        <div
                            style={{
                                width: '50%',
                            }}
                        >
                            <Button
                                key='btnDeleteService'
                                type='default'
                                size='middle'
                                block={true}
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteNews(record)}
                            >
                                Xóa 
                            </Button>
                        </div>
                    </div>
                )
            }
        }
    ]

    const { Link } = Anchor;

    const [flagEditAddForm, setFlagEditAddForm] = useState('edit');
    const [showModelForm, setShowModalForm] = useState(false);

    React.useEffect(() => {
        console.log(showModelForm);   
    })

    const handleModel = () => {
        setShowModalForm(!showModelForm);
    };

    const handleEditNews = (record: any) => {

    };

    const handleDeleteNews = (record: any) => {

    };

    const handleCancelModal = () => {
        setShowModalForm(false);
    };

    const handleSubmitAddNews = (values: any) => {
        console.log('Test add service: ', values);
    };

    return (
        <React.Fragment>
            <ProTable 
                columns={column}
                actionRef={newsTableRef}
                search={{
                    labelWidth: 'auto',
                    searchText: 'Tìm Kiếm',
                    resetText: 'Reset',
                }}
                toolBarRender={(action) => [
                    <Link href="/tin-tuc/them-moi" title={<PlusOutlined />} />
                ]}
                request={ async (params: any, 
                    sort: Record<string, SortOrder>, 
                    filter: Record<string, ReactText[] | null>) => {
                    let data = await db.collection(collection.news).get();
                    console.log('data', data);
                    return {
                        data: data.docs.map((doc, index) => ({...doc.data(), number: index + 1})),
                        success: true,
                        total: data.size,
                    }
                }}
            />
        </React.Fragment>
    );
};

export default News