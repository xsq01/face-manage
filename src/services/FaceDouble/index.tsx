import React, {useState, useEffect} from 'react';
import {Button, Upload} from 'antd';
import {UploadOutlined} from "@ant-design/icons";
import {getListImageUrlUsingPost} from "@/services/xuptbi/faceFileController";
import {useModel} from "@@/exports";

const WebSocketComponent: React.FC = () => {
  const [ws, setWs] = useState(null);
  const [Message, setMessage] = useState([]);
  const {initialState, setInitialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};

  useEffect(() => {
    const newWs = new WebSocket('ws://localhost:8101/api/pushMessage/' + currentUser.id); // 替换成后端WebSocket服务器地址
    setWs(newWs);
    return () => {
      newWs.close();
    }
  }, []);

  // const handleSendMessage = () => {
  //   ws.send(message);
  // };
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        if (event.data.includes("messageCode")) {
          const messageData = JSON.parse(event.data);
          setMessage(prevMessages => {
            const updatedMessages = prevMessages.filter(msg => msg.messageCode !== messageData.messageCode);
            updatedMessages.push(messageData);
            return updatedMessages;
          });
        }
        // 处理收到的消息
      };
    }
  }, [ws]);
  const initSearchParams = {
    "sessionId": currentUser.id
  }
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  // @ts-ignore
  return (
    <>
      <Upload name="file" accept={'.zip,.rar'}
              onChange={async (info) => {
                if (info.file.status !== 'uploading') {
                  console.log(info.file);
                }
                if (info.file.status === 'done') {
                  try {
                    const res = await getListImageUrlUsingPost(searchParams,
                      {}, info.file.originFileObj);
                    if (res.code === 0) {
                      console.log('上传成功');
                    }
                  } catch (e) {
                    console.log('上传失败');
                  }
                } else if (info.file.status === 'error') {
                  console.log('上传失败');
                }
              }}
      >
        <Button icon={<UploadOutlined/>}>上传压缩文件</Button>
      </Upload>
      {Message.map((message, index) => (
        <div key={index}>
          {message.messageInfo}
        </div>
      ))}
    </>
  );
};

export default WebSocketComponent;
