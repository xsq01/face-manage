import {ModalForm, ProColumns, ProForm, ProFormSelect, ProFormText, TableDropdown} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  InputRef,
  message,
  Modal,
  Space,
  Table,
  TableColumnType
} from 'antd';
import {
  addUserUsingPost1,
  addUserUsingPost2,
  deleteUserUsingPost1, getImageUsingPost, listBasicDeleteUsingPost,
  listUserVoByPageUsingPost1,
  updateUserUsingPost1
} from "@/services/xuptbi/userFaceController";
import React, {useEffect, useRef, useState} from "react";
import {PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {FilterDropdownProps} from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';
import {addUserUsingPost, deleteUserUsingPost, updateUserUsingPost} from "@/services/xuptbi/userController";
import {createFromIconfontCN} from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4483095_rhktj4g52bo.js',
})

export default () => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  type DataIndex = keyof API.UserFaceVoL;
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<API.UserFaceVoL> => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
      <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{marginBottom: 8, display: 'block'}}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined/>}
            size="small"
            style={{width: 90}}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{width: 90}}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({closeDropdown: false});
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          {/*<Button*/}
          {/*  type="link"*/}
          {/*  size="small"*/}
          {/*  onClick={() => {*/}
          {/*    close();*/}
          {/*  }}*/}
          {/*>*/}
          {/*  close*/}
          {/*</Button>*/}
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const [faceData, setFaceData] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<API.UserFaceVoL>();
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const userTableRef = React.createRef();
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [searchParams, setSearchParams] = useState<API.UserfaceQueryRequest>({...initSearchParams});
  const [selectedRowKeysRes, setSelectedRowKeysRes] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<API.UserFaceVoL[]>([]);
  const actionRef = useRef();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const handleOk = async () => {
    const initSearchParams = {
      id: userData?.id
    }
    const res = await deleteUserUsingPost1(initSearchParams);
    if (res.code === 0) {
      message.success("删除成功");
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
    setIsModalOpen1(false);
  };
  const handleOk2 = async () => {
    try {
      const res = await listBasicDeleteUsingPost(selectedRowKeysRes);
      if (res.code === 0) {
        message.success("删除成功");
        setSelectedRowKeysRes([]);
        // onCleanSelected();
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error("error");
    }
    setIsModalOpen2(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  const face = async (values) => {
    setFaceData('');
    if (values.userFace !== null) {
      const res = await getImageUsingPost(values.userFace);
      if (res.code === 0 && res.data !== null) {
        setFaceData(res.data);
        return true;
      }
      return false;
    }
    console.log("face" + values.userFace);
  }
  const columns: ProColumns<API.UserFaceVoL>[] = [
    {
      title: '姓名',
      width: 120,
      dataIndex: 'userName',
      ...getColumnSearchProps('userName')
    },
    {
      title: '用户电话',
      width: 120,
      dataIndex: 'userNum',
      ...getColumnSearchProps('userNum'),
      copyable: true,
    },
    {
      title: '树莓派编号',
      width: 120,
      dataIndex: 'pid',
      editable: false,
      search: false
    },
    {
      title: '图片',
      width: 120,
      dataIndex: 'userFace',
      editable: false,
      search: false,
      render: (text, record, _, action) => [
        <>
          <Button type="primary" onClick={async () => {
            setFaceData('');
            showModal();
            setUserData(record);
            console.log("record", record)
            if (record.userFace !== null) {
              const res = await face(record);
            }
          }
          }
          >
            查看详细
          </Button>
          <Modal title="用户信息" open={isModalOpen} footer={null} onCancel={handleCancel}
                 width={800}
            // 设置模态框的遮罩层颜色和透明度
                 maskStyle={{backgroundColor: 'transparent', opacity: 0.5}}
          >
            <Space>
              <Space>
                <img width="100"
                     src={faceData ? 'data:image/jpeg;base64,' + faceData : "https://img.freepik.com/premium-vector/person-taking-note-outline-vector_878233-709.jpg?w=740"}/>
              </Space>
              <Space direction="vertical">
                <Space>姓名: {userData?.userName}</Space>
                <Space>电话: {userData?.userNum}</Space>
                <Space>所属设备: 树莓派{userData?.pid}号</Space>
              </Space>
            </Space>
            <Divider/>
            <Space size={200}>
              <Space>创建时间:{userData?.createTime}</Space>
              <Space>更新时间:{userData?.updateTime}</Space>
            </Space>
          </Modal>
        </>
      ],
    },
    {
      title: '操作',
      width: 80,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (text, record, _, action) => [
        <> <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          <IconFont type='icon-bianji' style={{fontSize: 30}}></IconFont>
        </a>,
          <a
            // onClick={async () => {
            //   const initSearchParams = {
            //     id: record.id
            //   }
            //   const res = await deleteUserUsingPost1(initSearchParams);
            //   if (res.code === 0) {
            //     message.success("删除成功");
            //     action?.reload();
            //   }
            // }}
            onClick={() => {
              setUserData(record);
              showModal1();
            }}
          >
            <IconFont type='icon-shanchu' style={{fontSize: 30}}></IconFont>
          </a>
          <Modal open={isModalOpen1} onCancel={handleCancel1} mask={false} onOk={handleOk}>
            <Space>确定要删除<span style={{fontWeight:600}}>{userData?.userName}</span>用户吗?</Space>
          </Modal></>

        // <TableDropdown
        //   key="actionGroup"
        //   onSelect={async (selectedKeys) => {
        //     const initSearchParams = {
        //       id: record.id
        //     }
        //     if (selectedKeys === 'delete') {
        //       const res = await deleteUserUsingPost1(initSearchParams);
        //       if (res.code === 0) {
        //         message.success("删除成功");
        //         action?.reload();
        //       }
        //     }
        //   }
        //   }
        //   menus={[
        //     {key: 'delete', name: '删除',icon:'icon-shanchu'},
        //   ]}
        // />,
      ],

    },
  ];
  const [visible, setVisible] = useState(false);
  const [scaleStep, setScaleStep] = useState(0.1);
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
  const initSearchParams = {
    current: 1,
    pageSize: 12,
    sortSize: 'creatTime',
    sortOrder: 'desc',
    userName: '',
    userNum: ''
  }

  const handleSubmit = async (values: API.BaseResponseLong_) => {
    try {
      // 注册
      const res = await addUserUsingPost1(values);
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

  const deletePush = async () => {
    try {
      const res = await listBasicDeleteUsingPost(selectedRowKeysRes);
      if (res.code === 0) {
        message.success("删除成功");
        setSelectedRowKeysRes([]);
        // onCleanSelected();
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error("error");
    }
    // console.log("删除结果",selectedRowKeysRes);
  }
  return (
    <ProTable<API.UserFaceVoL>
      actionRef={actionRef}
      columns={columns}
      onChange={handleTableChange}
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
              "userNum": record.userNum,
              "pid": record.pid,
              // "plantCode": record.plantCode,
            };
            const res = await updateUserUsingPost1(filteredRecord);
            if (res.code === 0) {
              message.success("更新成功");
            } else {
              message.error(res.message);
            }
          }
        }
      }}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        // defaultSelectedRowKeys: [1],
      }}
      request={async (params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        //  const { current, pageSize } = params;
        console.log("params", params);
        const userList = await listUserVoByPageUsingPost1({
          ...searchParams,
          ...params,
        });
        return {
          data: userList.code === 0 ? userList.data.records : null,
          total: userList.code === 0 ? userList.data.total : 0,
        }
      }}
      tableAlertRender={({
                           selectedRowKeys,
                           selectedRows,
                           onCleanSelected,
                         }) => {
        setSelectedRows(selectedRows);
        setSelectedRowKeysRes(selectedRowKeys);
        return (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{marginInlineStart: 8}} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        );
      }}
      tableAlertOptionRender={({onCleanSelected}) => {
        return (
          <Space size={16}>
            <a onClick={async () => {
              // const res = await deletePush();
              // if (res) {
              //   onCleanSelected();
              // }
              showModal2();
            }}>批量删除</a>
            <Modal open={isModalOpen2} onCancel={handleCancel2} mask={false} onOk={handleOk2}>
              <Space>
                确定要删除这些用户:
                {selectedRows.map((user, index) => (
                  <span style={{fontWeight:600}} key={user.id || index}>
                 {index > 0 && ', '}
                    {user.userName}
                  </span>
                ))}
              </Space>
            </Modal>
          </Space>
        );
      }}
      // dataSource={tableListDataSource}
      scroll={{x: 1300}}
      options={true}
      search={true}  //b0dd3697a192885d7c055db46155b26a
      pagination={{
        pageSize: 12,
      }}
      rowKey="id"
      headerTitle="人脸信息"
      // toolBarRender={() => [<Button key="show">查看日志</Button>]}
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
            if (await handleSubmit(values as API.UserFaceVoL)) {
              return true;
            }
          }
          }>
          <ProForm.Group>
            <ProFormText
              width="md"
              name="userName"
              label="姓名"
              tooltip="最长为 24 位"
              placeholder="请输入姓名"
              rules={[
                {
                  required: true,
                  message: '姓名是必填项!',
                },
                {
                  min: 2,
                  type: "string",
                  message: '姓名不小于2位'
                },
              ]}
            />
            <ProFormText
              width="md"
              name="userNum"
              label="电话"
              placeholder="请填写电话"
              rules={[
                {
                  validator: (rule, value) => {
                    // 正则表达式用于匹配中国的手机号码，可以根据需要修改
                    const phoneRegex = /^1[3-9]\d{9}$/;
                    if (!value) {
                      return Promise.reject('请输入电话号码');
                    }
                    if (!phoneRegex.test(value)) {
                      return Promise.reject('电话号码格式不正确');
                    }
                    return Promise.resolve();
                  },
                }
              ]}
            />
          </ProForm.Group>
        </ModalForm>
      ]}

    />
  );
};
