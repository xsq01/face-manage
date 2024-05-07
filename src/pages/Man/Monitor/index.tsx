import {ProCard, Statistic, StatisticProps} from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import React, {useEffect, useState} from 'react';
import {DatePicker, Result, Select, Space, Table, TimePicker, message} from 'antd';
import {createFromIconfontCN} from '@ant-design/icons';
import {useModel} from '@umijs/max';
import {ColumnsType} from "antd/es/table";
import type {DatePickerProps, TimePickerProps} from 'antd';
import {Dayjs} from "dayjs";
import {SheetComponent} from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import {RangePickerProps} from "antd/es/date-picker";
import {dataFaceTypeUsingPost} from '@/services/xuptbi/dataFaceController';
import {Column} from '@ant-design/plots';

const {RangePicker} = DatePicker;
const items = [
  {key: '1', title: '全部', value: 0, total: true},
  {key: '2', status: 'error', title: '陌生人出现次数', value: 0},
  {key: '3', status: 'success', title: '熟人出现次数', value: 0},
];
const items1 = [
  {key: '1', title: '当天', total: true},
  {key: '2', status: 'error', title: '每周'},
  {key: '3', status: 'success', title: '每月'}
];


export default () => {
  const [responsive, setResponsive] = useState(false);
  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4483095_f36qhla1qv7.js',
  })
  const [ws, setWs] = useState(null);
  const {initialState, setInitialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  const [pi, setPi] = useState<string>('');
  const [messages, setMessages] = useState([]);
  const [messages2, setMessages2] = useState([]);
  const [messages3, setMessages3] = useState([]);
  const [keys, setKeys] = useState<string>('1');
  const [keys1, setKeys1] = useState<string>('1');
  const [currentDate, setCurrentDate] = useState('');
  const [type, setType] = useState<PickerType>('time');
  const [selectedRange, setSelectedRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [dataStr, setDataStr] = useState<string[]>([]);
  const [dataRes, setDataRes] =  React.useState([]);
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8101/api/pushMessage1/' + '用户' + initialState?.currentUser?.plantCode); // WebSocket 服务器地址
    setPi(initialState?.currentUser?.plantCode);
    socket.onopen = () => {
      console.log('WebSocket1 连接成功');
    };
    socket.onmessage = (event) => {
      const message = event.data;
      console.log('收到消息:', message);
    };
    setWs(socket);
    return () => {
      // localStorage.setItem(receive, '');
      // localStorage.setItem(receive1, '');
      socket.close();
    };
  }, []);
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        // console.log('Received message:', event.data);
        const messageData = event.data;
        if (event.data.includes('messageCode')) {
          const res = JSON.parse(event.data);
          setMessages(prevMessages => {
              // 可以选择在这里添加一些逻辑，比如更新特定消息的状态或属性
              // ...
              return [...prevMessages, res];
            }
          );
          if (res.messageCode === '1') {
            setMessages2(prevMessages => {
                return [...prevMessages, res];
              }
            );
          } else if (res.messageCode === '2') {
            console.log(res.FaceData);
            res.FaceData = "data:image/jpg;base64," + res.FaceData;
            setMessages3(prevMessages => {
                return [...prevMessages, res];
              }
            );
          }
        }
        // 处理收到的消息
      };
    }
  }, [ws]);
  useEffect(() => {
    // 更新当前日期
    const updateCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // getMonth() 返回的月份是从0开始的
      const date = today.getDate();
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
      setCurrentDate(formattedDate);
    };
    updateCurrentDate();
    // 如果需要，可以每天更新日期，例如每天午夜更新
    // const intervalId = setInterval(updateCurrentDate, 86400000); // 86400000 毫秒 = 24小时
    // 组件卸载时清除定时器
    // return () => clearInterval(intervalId);
  }, []);
  // useEffect(() => {
  //   // console.log('userDate1'+currentUser?.planCode);
  //   console.log('WebSocket1 关闭'+initialState?.currentUser?.plantCode);
  //   localStorage.setItem('userDate1', '11');
  // }, []);
  useEffect(() => {
    // 获取localStorage中的数据并解析
    const storedData = localStorage.getItem('userDate' + currentUser?.plantCode)
    const storedData1 = localStorage.getItem('userDate1' + currentUser?.plantCode);
    console.log("asdasd"+storedData)
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          // 只有当解析成功且结果为数组时，才更新state
          setDataRes(parsedData);
        } else {
          console.error('数据不是数组类型');
        }
      } catch (e) {
        console.error('解析JSON失败:', e);
      }
    }
    if (storedData1) {
      try {
        const parsedData1 = JSON.parse(storedData1);
        if (Array.isArray(parsedData1)) {
          // 只有当解析成功且结果为数组时，才更新state
          setDataStr(parsedData1);
        } else {
          console.error('数据不是数组类型');
        }
      } catch (e) {
        console.error('解析JSON失败:', e);
      }
    }
  }, []);
  const columns: ColumnsType<API.SocketMessage> = [
    {
      title: '姓名',
      width: 400,
      dataIndex: 'userName',
      key: 'name',
      fixed: 'left',
    },
    {
      title: '电话',
      width: 400,
      dataIndex: 'userNum',
      key: 'age',
      fixed: 'left',
    },
    {
      title: '照片',
      width: 400,
      dataIndex: 'FaceData',
      key: 'age',
      fixed: 'left',
      render: (text, record, index) => {
        // 假设FaceData字段包含了图片的URL
        return <img src={text} alt="照片" width="100" height="100"/>;
      },
    },
  ];
  const {Option} = Select;
  type PickerType = 'time' | 'date';
  const [inputValue, setInputValue] = useState(null);

  const PickerWithType = ({
                            type,
                            onChange,
                          }: {
    type: PickerType;
    onChange: TimePickerProps['onChange'] | DatePickerProps['onChange'] | RangePickerProps['onChange'];
  }) => {
    return <RangePicker picker={type} onChange={onChange}/>;
  };
    console.log('dataRes', dataRes)
  const modifiedData = dataRes.map(item => ({
    ...item, // 复制当前对象的所有属性
    identify: item.identify === '1' ? '熟人' : '陌生人', // 根据条件修改label
  }));
  // const data11 = dataRes.forEach((item) => {
  //   if (item.identify === '1'){
  //     item.identify = '熟人'
  //   }else{
  //     item.identify = '陌生人'
  //   }
  // })
  const s2DataConfig = {
    fields: {
      columns: ['identify', 'userFaceID', 'pid', 'date'],
    },
    meta: [
      {
        field: 'identify',
        name: '类别',
      },
      {
        field: 'userFaceID',
        name: '用户电话',
      },
      {
        field: 'pid',
        name: '树莓派编号',
      },
      {
        field: 'date',
        name: '时间',
      },

    ],
    data: modifiedData,
  }
  const s2Options = {
    width: 600,
    height: 480,
    seriesNumber: {
      enable: true,
      text: '序号',
    },
    // 自定义空数据单元格占位符
    // placeholder: '-',
    placeholder(meta) {
      return '-';
    },
  }

  const preprocessedData = dataRes.reduce((acc, curr) => {
    const {identify, date, people} = curr;
    const key = `${identify}-${date}`;
    if (!acc[key]) {
      let label;
      switch (identify) {
        case '1':
          label = '熟人';
          break;
        case '2':
          label = '陌生人';
          break;
        case '3':
          label = '总人数';
          break;
        default:
          label = '未知类型'; // 若有其他值，可在此添加处理或抛出异常
      }
      acc[key] = {label, date, people: 0};
    }
    acc[key].people += people;
    return acc;
  }, {});
  // 额外步骤：为每个唯一date创建一个identify为'3'（总人数）的记录
  const dates = Object.values(preprocessedData).map(item => item.date);
  const uniqueDates = [...new Set(dates)]; // 获取所有不重复的date
  uniqueDates.forEach(date => {
    const totalKey = `3-${date}`;
    if (!preprocessedData[totalKey]) {
      preprocessedData[totalKey] = {label: '总人数', date, people: 0};
      // 累加该日期下的所有people数以计算总人数
      let totalPeople = Object.keys(preprocessedData)
        .filter(key => key.endsWith(`-${date}`))
        .reduce((sum, key) => sum + preprocessedData[key].people, 0);
      preprocessedData[totalKey].people = totalPeople;
    }
  });
  let data = Object.values(preprocessedData);
  data.sort((a, b) => {
    // 如果是"总人数"，将其视为最大日期处理，确保在最后
    const dateA = a.label === '总人数' ? Infinity : new Date(a.date);
    const dateB = b.label === '总人数' ? Infinity : new Date(b.date);
    return dateA - dateB;
  });
  console.log('data', data)
  // const config = {
  //   data,
  //   xField: 'data',
  //   yField: 'people',
  //   colorField: 'label',
  //   point: {
  //     shapeField: 'square',
  //     sizeField: 4,
  //   },
  //   axis: {
  //     x: {title: '日期', line: true, arrow: true},
  //     y: {
  //       title: '人数', line: true, arrow: true,
  //     },
  //   },
  //   tooltip: {
  //     showTitle: false,
  //     title: 'label',
  //     items: [{channel: 'y'}],
  //   },
  //   style: {
  //     lineWidth: 2,
  //   },
  // };
//实现动态图标
  const config = {
    // padding: 'auto',
    // forceFit: true,
    title: `${dataStr[0]}` + '--' + `${dataStr[1]}`,
    data,
    xField: 'date',
    yField: 'people',
    tooltip: {
      marker: false,
      title: 'date',
    },
    axis: {
      y: {
        line: true,// 设置Y轴刻度间隔为1，即显示整数刻度
        lineLineWidth: 1,
        min: 0,
        tickFilter: (datum) => Number.isInteger(datum), // 仅保留整数刻度值
      },
      x: {
        line: true,
        lineStroke: '#161d23',
        lineLineWidth: 1
      }
    },
    // 设置Y轴刻度间隔为1，即显示整数刻度
    seriesField: 'label',
    colorField: 'label',
    responsive: true,
  };
  // Ecahrts
  return (
    <>
      <div>
        <RcResizeObserver
          key="resize-observer"
          onResize={(offset) => {
            setResponsive(offset.width < 596);
          }}
        >
          <ProCard
            title="实时监控"
            extra={currentDate}
            bordered
            headerBordered
            split={responsive ? 'horizontal' : 'vertical'}
          >
            <ProCard split="horizontal">
              <ProCard split="horizontal">
                <ProCard split={responsive ? 'horizontal' : 'vertical'}>
                  <ProCard>
                    <Space.Compact direction="vertical">
                      <span style={{color: '#778899'}}><IconFont type="icon-raspi"></IconFont> 设备</span>
                      <span style={{
                        color: '#F67280',
                        fontWeight: 600,
                        fontSize: '25px',
                        marginTop: 0,
                        paddingTop: 0
                      }}>
                        <>
                          {
                            pi && <>
                              <>树莓派{pi}号</>
                            </>
                          }
                        </>
                      </span>
                    </Space.Compact>
                  </ProCard>
                  <ProCard>
                    <Space.Compact direction="vertical">
                  <span style={{color: '#778899'}}>
                    <span style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#52c41a',
                      marginRight: '5px'
                    }}></span>
                    运行状态</span>
                      <span style={{
                        color: '#F67280',
                        fontWeight: 600,
                        fontSize: '25px',
                        marginTop: 0,
                        paddingTop: 0
                      }}>正常</span>
                    </Space.Compact>
                  </ProCard>
                </ProCard>
                <ProCard split="vertical">
                  <ProCard>
                    <Space.Compact direction="vertical">
                      <span style={{color: '#778899'}}>录入照片</span>
                      <span style={{
                        color: '#F67280',
                        fontWeight: 600,
                        fontSize: '25px',
                        marginTop: 0,
                        paddingTop: 0
                      }}>24</span>
                    </Space.Compact>
                  </ProCard>
                  <ProCard>
                    <Space.Compact direction="vertical">
                      <span style={{color: '#778899'}}>本地照片</span>
                      <span style={{
                        color: '#F67280',
                        fontWeight: 600,
                        fontSize: '25px',
                        marginTop: 0,
                        paddingTop: 0
                      }}>24</span>
                    </Space.Compact>
                  </ProCard>
                </ProCard>
              </ProCard>
              <ProCard>
                <Space direction="vertical">
                  <Space direction="vertical">
                    <Space>
                      <Select value={type} onChange={setType}>
                        <Option value="time">时间区间</Option>
                        <Option value="date">天跨度</Option>
                        <Option value="month">月期间</Option>
                        <Option value="year">年跨度</Option>
                      </Select>
                      <PickerWithType type={type} onChange={async (datas, dataString) => {
                        const DataP = {
                          data: dataString,
                          type: type
                        }
                        localStorage.setItem('userDate1' + currentUser?.plantCode, JSON.stringify(dataString));
                        setDataStr(dataString);
                        setDataRes([]);
                        try {
                          const res = await dataFaceTypeUsingPost(DataP);
                          if (res.code === 0) {
                            message.success('查询成功');
                            localStorage.setItem('userDate' + currentUser?.plantCode, JSON.stringify(res.data));
                            setDataRes(res.data);
                          } else {
                            setDataRes([]);
                            localStorage.setItem('userDate' + currentUser?.plantCode,'');
                            message.error(res.message);
                          }
                        } catch (e) {
                          message.error('查询失败');
                        }
                      }}/>
                    </Space>
                    <Space>
                      {
                        dataRes.length !== 0 && <>
                          <Column {...config}></Column>
                        </>
                      } {
                      dataRes.length === 0 && dataStr.length !== 0 && <>
                        <Result
                          title={dataStr[0] + '-' + dataStr[1] + ' 暂无数据'}
                        >
                        </Result>
                      </>
                    }
                    </Space>
                  </Space>
                  <Space>
                    <>
                      {
                        dataRes.length !== 0 &&
                        <>
                          <SheetComponent
                            sheetType="table"
                            dataCfg={s2DataConfig}
                            options={s2Options}/>
                        </>
                      }
                    </>

                  </Space>
                </Space>
              </ProCard>

            </ProCard>
            <ProCard
              tabs={{
                onChange: (key) => {
                  setKeys(key);
                  console.log('key', key);
                },
                items: items.map((item) => {
                  return {
                    key: item.key,
                    style: {width: '100%'},
                    label: (
                      <Statistic
                        layout="vertical"
                        title={<span style={{color: '#778899'}}> {item.title}</span>}
                        value={item.value}
                        status={item.status as StatisticProps['status']}
                        style={{
                          width: 120,
                          borderInlineEnd: item.total ? '1px solid #f0f0f0' : undefined,
                        }}
                      />
                    ),
                    children: (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#fafafa',
                          width: '100%', height: '100%'
                        }}
                      >
                        {
                          keys === '1' && <>
                            <Table columns={columns} dataSource={messages}/>
                          </>
                        }
                        {
                          keys === '2' && <>
                            <Table columns={columns} dataSource={messages3}/>
                          </>
                        }
                        {
                          keys === '3' && <>
                            <Table columns={columns} dataSource={messages2}/>
                          </>
                        }
                      </div>
                    ),
                  };
                }),
              }}
            />
          </ProCard>
        </RcResizeObserver>
      </div>
    </>
  );
};
