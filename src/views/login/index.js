import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { goHome } from '../../utils/utils';
import { login } from '../../services';

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>登录</h1>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 8,
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
          <Input />
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
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 8,
          }}
        >
          <Button type="primary" htmlType="submit" size='large' style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
      </Form>
      <div style={{ display: 'flex', justifyContent: 'end', width: '33%' }}>
        <Button type='link' onClick={goRegistry}>去注册</Button>
      </div>
      <p>已有用户/密码：<br />
        【默认组】admin/admin<br />
        【默认组】陈晓怡/123456<br/>
        【小组一】admin2/admin2<br />
      </p>
    </div>
  );
};
export default LoginView;