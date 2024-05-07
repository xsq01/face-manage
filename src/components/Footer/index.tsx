import {GithubOutlined, UserOutlined} from '@ant-design/icons';
import {DefaultFooter, PageContainer} from '@ant-design/pro-components';
import React from 'react';
import {Button, Space} from "antd";

const Footer: React.FC = () => {
  // const defaultMessage = 'face';
  const currentYear = new Date().getFullYear();
  return (
        <DefaultFooter
          copyright={`${currentYear}`}
          links={[
            {
              key: 'Ant Design',
              title: 'Face',
              blankTarget: true,
            },
            {
              key: 'github',
              title: <UserOutlined />,
              blankTarget: true,
            },
          ]}>
        </DefaultFooter>

  );
};

export default Footer;
