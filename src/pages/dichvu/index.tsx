import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import ProTable from "@ant-design/pro-table";
import { Button, Image, Modal, Space } from "antd";
import React, { useState } from "react";
import AddServiceForm from "./component/add-service-form";

const Service: React.FC = () => {
    const serviceTableRef = React.useRef(null);

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
            title: 'Tên Dịch Vụ',
            dataIndex: 'name',
            copyable: true,
            sorter: (a: any, b:any) => a.name.localCompare(b.name),
            filters: true,
            onFilter: true,
            align: 'center',
            formItemProps: {
                rules: [
                    {
                        require: true,
                        message: 'Nhập tên Dịch Vụ để tìm kiếm',
                    }
                ]
            },
            width: '35%',
        },
        {
            title: 'Banner',
            dataIndex: 'banner',
            copyable: false,
            search: false,
            align: 'center',
            render: (_:any, record:any) => {
                return (
                    <Space>
                        <Image width={50} src={record.banner}  />
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
                                onClick={() => handleEditService(record)}
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
                                onClick={() => handleDeleteService(record)}
                            >
                                Xóa 
                            </Button>
                        </div>
                    </div>
                )
            }
        }
    ]

    const [flagEditAddForm, setFlagEditAddForm] = useState('edit');
    const [showModelForm, setShowModalForm] = useState(false);

    React.useEffect(() => {
        console.log(showModelForm);   
    })

    const handleModel = () => {
        setShowModalForm(!showModelForm);
    };

    const handleEditService = (record: any) => {

    };

    const handleDeleteService = (record: any) => {

    };

    const handleCancelModal = () => {
        setShowModalForm(false);
    };

    const handleSubmitAddService = (values: any) => {
        console.log('Test add service: ', values);
    };

    return (
        <React.Fragment>
            <ProTable 
                columns={column}
                actionRef={serviceTableRef}
                search={{
                    labelWidth: 'auto',
                    searchText: 'Tìm Kiếm',
                    resetText: 'Reset',
                }}
                toolBarRender={(action) => [
                    <Button 
                        size="middle"
                        key="buttonAddService"
                        icon={<PlusOutlined />}
                        onClick={() => handleModel()}
                    >
                        Thêm
                    </Button>
                ]}
            />
            {
                flagEditAddForm === 'edit' ? (
                    <Modal
                        open={showModelForm}
                        title='Tạo Dịch Vụ'
                        centered={true}
                        width={900}
                        onCancel={() => handleCancelModal()}
                        footer={[
                            <Button 
                                key='cancelModel' 
                                type='ghost'
                                onClick={() => handleCancelModal()}
                            >
                                Đóng
                            </Button>
                        ]}
                    >
                        <AddServiceForm
                            handleSubmitAddService={handleSubmitAddService}
                        />
                    </Modal>
                ) : (
                    <Modal>

                    </Modal>
                )
            }
        </React.Fragment>
    );
};

export default Service;