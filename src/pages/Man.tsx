import { PageContainer } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
import { Outlet } from 'umi'
const Man: React.FC = () => {
  return (
    <div style={{padding: 20}}>
      <PageContainer/>
      <Outlet/>
    </div>
  );
};
export default Man;
