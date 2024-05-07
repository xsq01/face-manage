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
// import useModel from "@/hooks/useModel";
import {Alert, message, Tabs} from 'antd';
import {createStyles} from 'antd-style';
import React, {useEffect, useState} from 'react';
import {flushSync} from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import {Link} from "umi";
import {getLoginUserUsingGet, userLoginUsingPost} from "@/services/xuptbi/userController";
import {createFromIconfontCN} from '@ant-design/icons';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4483095_u000dw2kdt.js',
})
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
      height: '100vh',
      // backgroundImage:
      //   "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      // backgroundSize: '100% 100%',
      alignItems: 'flex-start', // 使内容在交叉轴的顶部对齐
      paddingTop: '8%', // 举例，将内容向上推，根据需要调整百分比
      // 如果内容是内联元素或文本，可能还需要设置justifyContent
      justifyContent: 'center',
      background: 'linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%)'
    },
  };
});
const Lang = () => {
  const {styles} = useStyles();
  return;
};
// const LoginMessage: React.FC<{
//   content: string;
// }> = ({content}) => {
//   return (
//     <Alert
//       style={{
//         marginBottom: 24,
//       }}
//       message={content}
//       type="error"
//       showIcon
//     />
//   );
// };
const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { setInitialState ,refresh} = useModel('@@initialState');
  const {styles} = useStyles();
  // useEffect(() => {
  //   listChartByPageUsingPost({}).then(res => {
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
  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      // 登录
      const res = await userLoginUsingPost(values);
      if (res.code === 0) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        if (!history) return;
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        refresh();
        return;
      }else{
          message.error(res.message)
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <div className={styles.container} >
      <Helmet>
        <title>
          {'登录'}-{Settings.title}
        </title>
      </Helmet>
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
          logo={<IconFont style={{fontSize:50}} type='icon-renlian'/>}
          title="人脸识别管理系统"
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
                label: '账户密码登录',
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
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Link
              to="/user/register"
            >
              注册
            </Link>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};
export default Login;
