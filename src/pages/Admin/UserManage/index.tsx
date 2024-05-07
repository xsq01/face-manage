import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {
  ActionType, ModalForm, ProColumns,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {Button, Form, GetProp, Image, Input, message, Modal, Space, Upload, UploadProps} from 'antd';
import React, {useRef, useState} from 'react';
import {
  addUserUsingPost,
  deleteUserUsingPost,
  listUserVoByPageUsingPost, updateUserUsingPost,
  userRegisterUsingPost
} from "@/services/xuptbi/userController";
import {history} from "@@/core/history";
import {ProCoreActionType} from "@ant-design/pro-utils/lib";
import {createFromIconfontCN} from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4483095_rhktj4g52bo.js',
})
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};


export default () => {
  const initSearchParams = {
    current: 1,
    pageSize: 12,
    sortSize: 'creatTime',
    sortOrder: 'desc',
    userName: '',
    plantCode: '',
    userRole: ''
  }


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const initSearchParams = {
      id: userData?.id
    }
    const res = await deleteUserUsingPost(initSearchParams);
    if (res.code === 0) {
      message.success("删除成功");
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
// @ts-ignore
  const columns: ProColumns<API.LoginUserVO>[] = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 48,
      search: false
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      render: (_, record) => (
        <div contentEditable={false}>
          <Image
            src={record.userAvatar ?? "https://img.freepik.com/premium-vector/person-taking-note-outline-vector_878233-709.jpg?w=740"}
            style={{width: 32}}></Image>
        </div>
      ),
      copyable: true,
      editable: false,
      search: false
    },
    {
      title: '树莓派编号',
      dataIndex: 'plantCode',
      copyable: true,
    }, {
      title: '角色',
      dataIndex: 'userRole',
      valueType: 'select',
      search: false
      // valueEnum: {
      //   "user": {text: "普通用户", status: 'Default'},
      //   // all: {text: '超长'.repeat(50)},
      //   "admin": {
      //     text: '管理员',
      //     status: 'Success',
      //   },
      // }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      editable: false,
      search: false
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <>
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            <IconFont type='icon-bianji' style={{fontSize: 30}}></IconFont>
          </a>,
          <a
            onClick={() => {
              setUserData(record);
              showModal();
            }}
          >
            <IconFont type='icon-shanchu' style={{fontSize: 30}}></IconFont>
          </a>
          <Modal open={isModalOpen} onCancel={handleCancel} mask={false} onOk={handleOk}>
            <Space>确定要删除普通管员<span style={{fontWeight:600}}>{userData?.userName}</span>用户吗?</Space>
          </Modal>
        </>
      ],
    },
  ];
  const [userData, setUserData] = useState<API.UserFaceVoL>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<API.UserQueryRequest>({...initSearchParams});
  const actionRef = useRef();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<{ name: string; company: string }>();
  const handleTableChange = (params) => {
    // 更新当前页码状态
    // 您可以在这里使用 params 或者根据需要更新其他状态
    setSearchParams(prevState => ({
      ...prevState,
      current: params.current, // 更新为新的页码
      // 其他需要更新的状态
    }));
    // 更新搜索参数
  };


  const handleSubmit = async (values: API.BaseResponseLong_) => {
    try {
      // 注册
      const res = await addUserUsingPost(values);
      if (res.code === 0) {
        const defaultRegisterSuccessMessage = '添加成功';
        message.success(defaultRegisterSuccessMessage);
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error("error");
    }
  }
  return (
    <ProTable<API.LoginUserVO>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      onChange={handleTableChange}
      request={async (params, sort, filter) => {
        const re = {...params};
        const userList = await listUserVoByPageUsingPost({
          ...searchParams,
          ...params,
        });
        return {
          data: userList.code === 0 ? userList.data.records : null,
          total: userList.code === 0 ? userList.data.total : 0,
        }
      }}
      editable={{
        actionRender: (row, config, defaultDom) => [
          defaultDom.save,
          defaultDom.cancel,
          // config.editableKeys
          //   .filter((id) => id !== row.id)
        ],

        onSave: async (key, record, originRow, newLineConfig) => {
          if (JSON.stringify(record) !== JSON.stringify(originRow)) {
            const filteredRecord
              = {
              "id": record.id,
              "userName": record.userName,
              "userRole": record.userRole,
              "userAvatar": record.userAvatar,
              "plantCode": record.plantCode,
            };
            // const filteredRecordString = JSON.stringify(filteredRecord);
            const res = await updateUserUsingPost(filteredRecord);
            if (res.code === 0) {
              message.success("success");
            }
          }
        }
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: {fixed: 'right', disable: true},
        },
        // onChange(value) {
        //   console.log('value: ', value);
        // },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <ModalForm<{
          name: string;
          company: string;
        }>
          title="添加用户"
          trigger={
            <Button type="primary">
              <PlusOutlined/>
              添加
            </Button>
          }
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => console.log('run'),
          }}
          submitTimeout={2000}
          onFinish={async (values) => {
            if (await handleSubmit(values as API.UserAddRequest)) {
              return true;
            }
          }
          }>
          <ProForm.Group>
            <ProFormText
              width="md"
              name="userAccount"
              label="用户账户"
              tooltip="最长为 24 位"
              placeholder="请输入名称"
              rules={[
                {
                  required: true,
                  message: '用户账户是必填项!',
                },
                {
                  min: 4,
                  type: "string",
                  message: '用户账户不小于4位'
                },
              ]}
            />

            <ProFormText
              width="md"
              name="userName"
              label="用户名称"
              placeholder="请输入名称"
              rules={[
                {
                  required: true,
                  message: '用户名称是必填项!',
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              width="sm"
              name="plantCode"
              label="树莓派序列号"
              placeholder="请输入序列号"
              rules={[
                {
                  required: true,
                  message: '序列号是必填项!',
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              request={async () => [
                {
                  value: 'user',
                  label: 'user',
                },
                {
                  value: 'admin',
                  label: 'admin',
                },
              ]}
              width="xs"
              name="userRole"
              label="用户角色"
              rules={[
                {
                  required: true,
                  message: '用户角色是必填项!',
                },
              ]}
            />
          </ProForm.Group>
        </ModalForm>
      ]}
    />
  );
};
