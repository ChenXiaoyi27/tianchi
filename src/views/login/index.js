import React from 'react';
import { Button, Checkbox, Form, Input, message, Row, Col, Divider } from 'antd';
import { goHome } from '../../utils/utils';
import { login } from '../../services';

import LoginPage from '../components/LoginPage';

const LoginView = () => {
  const onFinish = async (values) => {
    console.log('Success:', values);
    const { user_name, password } = values;
    const success = await login(user_name, password);
    console.log('success: ', success);
    if (success) {
      message.success('登录成功，正在跳转首页...');
      setTimeout(() => {
        goHome();
      }, 500);
    } else {
      message.error('登录失败');
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('登录失败');
  };
  // 去注册
  const goRegistry = () => {
    location.href = '/app.html#/registry';
  }
  const FormView = (
    <div style={{ width: '100%' }}>
      <Form
        name="basic"
        labelCol={{
          span: 0,
        }}
        wrapperCol={{
          offset: 2,
          span: 20,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ display: 'block', width: '100%' }}
      >
        <Form.Item
          label="用户名"
          name="user_name"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input size='large' placeholder="用户名" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password size='large' placeholder="密码" />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 2,
            span: 20,
          }}
        >
          <Button type="primary" htmlType="submit" size='large' style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 18,
            span: 4
          }}>
          <Button type='link' onClick={goRegistry}>去注册</Button>
        </Form.Item>
      </Form>
    </div>
  );
  const BackImage = <img src="https://chenxiaoyi27.oss-cn-guangzhou.aliyuncs.com/picture/login.png" width="700px" />
  return (
    <div>
      <LoginPage
        title="账号登录"
        backImage={BackImage}
        form={FormView}
      />
      <p style={{ position: 'fixed', bottom: '50px', right: '50px' }}>
        已有用户/密码：<br />
        【默认组】admin/admin<br />
        【默认组】陈晓怡/123456<br />
        【小组一】admin2/admin2<br />
      </p>
    </div>
  );
};
export default LoginView;