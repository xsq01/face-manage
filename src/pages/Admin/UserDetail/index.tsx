import { ProCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {Button, Divider, Space } from 'antd';

const userInfo  : React.FC =  () => {
  const {initialState, setInitialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  return (

    <><ProCard
      style={{marginBlockStart: 8}}
      gutter={[16, 16]}
      wrap
      title="个人信息"
    >
      <Space>
        <Space>
          <img width="100"
               src={initialState?.currentUser?.userAvatar ?? "https://img.freepik.com/premium-vector/person-taking-note-outline-vector_878233-709.jpg?w=740"}/>
        </Space>
        <Space direction="vertical">
          <Space >用户名： <strong>{initialState?.currentUser?.userName ?? ''}</strong></Space>
          <Space >管理职位: <strong>{initialState?.currentUser?.userRole === 'user' ? '普通管理员' : '超级管理员'}</strong></Space>
        </Space>
        <div style={{marginLeft: 1100,marginTop: -50}}>
          <Space >
            <Button type="primary" ghost> 修改个人信息</Button>
          </Space>
        </div>
      </Space>
      <Divider />
      <Space size={200}>
        <Space>用户数:{initialState?.currentUser?.userCount}</Space>
        <Space>创建时间:{initialState?.currentUser?.createTime}</Space>
        <Space>更新时间:{initialState?.currentUser?.updateTime}</Space>
      </Space>
    </ProCard>
    <ProCard
      style={{marginBlockStart: 20}}
      gutter={[16, 16]}
      wrap
      title="统计">
    </ProCard>
    </>

  );
};
export default userInfo;
