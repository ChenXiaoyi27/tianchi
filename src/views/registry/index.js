import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, message, Select } from 'antd';
import { goLogin } from '../../utils/utils';
import { register, getGroupList } from '../../services';
import LoginPage from '../components/LoginPage';

const Registry = () => {
  const [groupList, setgroupList] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const list = await getGroupList();
    setgroupList(list);
  }

  const onFinish = async (values) => {
    console.log('Success:', values);
    const { user_name, password, password_again } = values;
    if (password !== password_again) {
      message.error('两次密码不一致，请修改');
      return;
    }
    const success = await register(user_name, password, group_id);
    message.success('操作成功，正在跳转登录页...');
    setTimeout(() => {
      goLogin();
    }, 500);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('操作失败');
  };
  const FormView = (
    <Form
      name="basic"
      labelCol={{
        span: 0,
      }}
      wrapperCol={{
        offset: 2,
        span: 20,
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
        <Input placeholder='用户名' size='large' />
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
        <Input.Password placeholder='密码' size='large' />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="password_again"
        rules={[
          {
            required: true,
            message: '请再次输入密码',
          },
        ]}
      >
        <Input.Password placeholder='确认密码' size='large' />
      </Form.Item>
      <Form.Item
        label="小组"
        name="group_id"
        rules={[
          {
            required: true,
            message: '请选择小组',
          },
        ]}
      >
        <Select placeholder="小组" size='large'>
          {groupList.map(li => <Select.Option value={li.group_id} key={li.group_id}>{li.group_name}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 2,
          span: 20,
        }}
      >
        <Button type="primary" htmlType="submit" size='large' style={{ width: '100%' }}>
          注册
        </Button>
      </Form.Item>
    </Form>
  );
  const BackImage = <img src="./registry.png" width="700px" />
  return (
    <LoginPage
      title="用户注册"
      backImage={BackImage}
      form={FormView}
    />
  );
}

export default Registry;