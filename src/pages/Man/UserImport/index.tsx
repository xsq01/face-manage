import React, {useEffect, useState} from 'react';
import {Button, Card, message, Space, Switch, Table, Tag, Transfer, Upload} from 'antd';
import type {GetProp, TableColumnsType, TableProps, TransferProps} from 'antd';
import difference from 'lodash/difference';
import {UploadOutlined} from "@ant-design/icons";
import {genUserBasicUsingPost, listBasicAddUsingPost} from "@/services/xuptbi/userFaceController";
import {useModel} from "@@/exports";
import {setValue} from "rc-field-form/es/utils/valueUtil";
import TextArea from "antd/lib/input/TextArea";

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

// interface RecordType {
//   key: string;
//   title: string;
//   description: string;
//   disabled: boolean;
//   tag: string;
// }
// key: item.userNum,
//   userName: item.userName,
//   userNum: item.userNum,
//   disabled: false,
//   pid: item.pid,
interface DataType {
  key: string;
  userName: string;
  userNum: string;
  disabled: boolean;
  pid: string;
}


interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
}

// Customize Table Transfer
const TableTransfer = ({leftColumns, rightColumns, ...restProps}: TableTransferProps) => (
  <Transfer {...restProps}>
    {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection: TableRowSelection<TransferItem> = {
        getCheckboxProps: (item) => ({disabled: listDisabled || item.disabled}),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({key}) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys as string[], selected);
        },
        onSelect({key}, selected) {
          onItemSelect(key as string, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{pointerEvents: listDisabled ? 'none' : undefined}}
          onRow={({key, disabled: itemDisabled}) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key as string, !listSelectedKeys.includes(key as string));
            },
          })}
        />
      );
    }}
  </Transfer>
);
const transformData = (data: API.BaseResponseListUserFaceVo_.data) => {
  return data.map((item) => ({
    key: item.userNum,
    userName: item.userName,
    userNum: item.userNum,
    disabled: false,
    pid: item.pid,
  }));
};
const mockTags = ['cat', 'dog', 'bird'];
//xls文件解压
// const mockData: RecordType[] = Array.from({length: 20}).map((_, i) => ({
//   key: i.toString(),
//   title: `content${i + 1}`,
//   description: `description of content${i + 1}`,
//   // disabled: i % 4 === 0, //控制数据时候允许点击
//   tag: mockTags[i % 3],
// }));

//模拟数据
// const originTargetKeys = mockData
//   .filter((item) => Number(item.key) % 3 > 1)
//   .map((item) => item.key);

//左边的数据
const leftTableColumns: TableColumnsType<DataType> = [
  {
    dataIndex: 'userName',
    title: '姓名',
  },
  {
    dataIndex: 'userNum',
    title: '用户电话',
  },
  {
    dataIndex: 'pid',
    title: '树莓派编号',
  },
];
//右边数据
const rightTableColumns: TableColumnsType<DataType> = [
  {
    dataIndex: 'userName',
    title: '姓名',
  },
  {
    dataIndex: 'userNum',
    title: '用户电话',
  },
  {
    dataIndex: 'pid',
    title: '树莓派编号',
  },
];
const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>();
  const [disabled, setDisabled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sourceData, setSourceData] = useState(null);
  const [targetData, setTargetData] = useState<string>();
  const [loding, setLoding] = useState<boolean>();
  // const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const {initialState, setInitialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8101/api//'+currentUser.id); // WebSocket 服务器地址

    socket.onopen = () => {
      console.log('WebSocket1 连接成功');
    };
    socket.onmessage = (event) => {
      const message = event.data;
      console.log('收到消息:', message);
    };
    setWs(socket);
    return () => {
      socket.close();
    };
  }, []);
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        // console.log('Received message:', event.data);
          const messageData = event.data;
          if (event.data.includes('messageCode')){
            setMessages(prevMessages => {
              // 可以选择在这里添加一些逻辑，比如更新特定消息的状态或属性
              // ...
              return [...prevMessages, messageData];}
            );
          }

        // 处理收到的消息
      };
    }
  }, [ws]);
  const onChangeFile = async (info: any) => {
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log("导入中...")
      try {
        const res = await genUserBasicUsingPost({}, info.file.originFileObj);
        if (res.code === 0) {
          message.success(`${info.file.name} `);
          const transformedData = transformData(res.data);
          setSourceData(transformedData);

        } else {
          message.error(res.message);
        }
      } catch (e: any) {
        message.error(e.message)
      }

    }
  }

  const onChange = (nextTargetKeys: API.UserFaceVo[]) => {
    const allData = nextTargetKeys.map(key => {
      const item = sourceData.find(dataItem => dataItem.key === key);
      if (item) {
        return {
          userName: item.userName,
          userNum: item.userNum,
          pid: item.pid,
        };
      }
      return null;
    }).filter(Boolean);
    console.log(allData);
    setTargetKeys(nextTargetKeys);
    setTargetData(JSON.stringify(allData));
  };
  // console.log(targetData);
  const triggerDisable = (checked: boolean) => {
    setDisabled(checked);
  };

  const triggerShowSearch = (checked: boolean) => {
    setShowSearch(checked);
  };
  const onChangeData = async () =>{
    if (targetData === undefined || targetData === ''){
      message.error("请选择数据");
      return;
    }else {
      try {
        setLoding(true);
        const res = await listBasicAddUsingPost(targetData);
        if (res.code === 0){
          message.success("导入成功");
          setLoding(false);
          setTargetKeys([]);
          setTargetData(undefined);
        }else{
          message.error(res.message);
          setLoding(false);
        }
      } catch (e:any) {
        message.error(e.message)
      }
    }
  }
  return (
    <>
      <Card title={"人脸信息导入"}>
        <Space style={{marginBottom: 16}}>
          <Upload name="file" maxCount={1} onChange={onChangeFile}>
            <Button icon={<UploadOutlined/>}>导入 xlsx 文件</Button>
          </Upload>
        </Space>
        <TableTransfer
          titles={['原数据', '导入数据']}
          dataSource={sourceData}
          targetKeys={targetKeys}
          // disabled={disabled}
          showSearch={showSearch}
          onChange={onChange}
          filterOption={(inputValue, item) =>
            item.userName!.indexOf(inputValue) !== -1 || item.userNum.indexOf(inputValue) !== -1
          }
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
        />
        <Space style={{marginTop: 16}}>
          {/*<Switch*/}
          {/*  unCheckedChildren="disabled"*/}
          {/*  checkedChildren="disabled"*/}
          {/*  checked={disabled}*/}
          {/*  onChange={triggerDisable}*/}
          {/*/>*/}
          <Switch
            unCheckedChildren="显示搜索框"
            checkedChildren="关闭搜索框"
            checked={showSearch}
            onChange={triggerShowSearch}
          />
        </Space>
        <Space style={{float:'right',marginTop:16}}>
          <Button type="primary" onClick={onChangeData} loading={loding}>提交数据</Button>
        </Space>

          {/*<div style={{marginTop:16}}>*/}
          {/*  <TextArea*/}
          {/*    value={messages}*/}
          {/*    onChange={(e) => setValue(e.target.value)}*/}
          {/*    placeholder="Controlled autosize"*/}
          {/*    autoSize={{ minRows: 3, maxRows: 5 }}*/}
          {/*  />*/}
          {/*</div>*/}



      </Card>

    </>
  );
};

export default App;
