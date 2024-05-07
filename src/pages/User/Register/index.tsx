import {Footer} from '@/components';
import {
  AlipayCircleOutlined,
  LockOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {LoginForm, ProFormText,} from '@ant-design/pro-components';
import {Helmet, history, useModel} from '@umijs/max';
import {Alert, message, Tabs} from 'antd';
import {createStyles} from 'antd-style';
import React, {useEffect, useState} from 'react';
import {flushSync} from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import {Link} from "umi";
import {getLoginUserUsingGet, userLoginUsingPost, userRegisterUsingPost} from "@/services/xuptbi/userController";

const useStyles = createStyles(({token}) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const Lang = () => {
  const {styles} = useStyles();
  return;
};
const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { setInitialState} = useModel('@@initialState');
  const {styles} = useStyles();
  // useEffect(() => {
  //   listChartByPageUsingPost({}).then(res => {
  //     console.log(res)
  //   })
  // })
  /**
   * 登陆成功后的信息，获取用户的信息
   */
  const fetchUserInfo = async () => {
    const userInfo = await getLoginUserUsingGet();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: API.UserRegisterRequest) => {
    const {userPassword,checkPassword} = values;
    if (userPassword !== checkPassword){
      message.error("两次密码不一致");
      return;
    }
    try {
      // 注册
      const res = await userRegisterUsingPost(values);
      if (res.code === 0) {
        const defaultRegisterSuccessMessage = '注册成功！';
        message.success(defaultRegisterSuccessMessage);
       if (!history) return;
       const {search } = history.location;
        history.push(
          {
            pathname:"/user/login",
            search
          }
        );
        return;
      }else{
        message.error(res.message);
      }
    } catch (error) {
      message.error("error");
    }
  };
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'注册'}- {Settings.title}
        </title>
      </Helmet>
      <Lang/>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          submitter={{
            searchConfig: {
              submitText: '注册'
            }
          }}
          logo={<img alt="logo" src="/logo.svg"/>}
          title="树莓派管理系统"
          // subTitle={
          //   <a href="dizhi">
          //     树莓派管理系统是一款管理用户人脸信息
          //   </a>
          // }
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户注册',
              }
            ]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min:8,
                    type:"string",
                    message:'密码不小于8位'
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请确认密码'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
                  },
                  {
                    min:8,
                    type:"string",
                    message:'密码不小于8位'
                  },
                ]}
              />
              <ProFormText
                name="plantCode"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入树莓派序列号'}
                rules={[
                  {
                    required: true,
                    message: '序列号是必填项！',
                  },
                ]}
              />

            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            {/*<Link*/}
            {/*  to="/user/register"*/}
            {/*>*/}
            {/*  注册*/}
            {/*</Link>*/}
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Register;
