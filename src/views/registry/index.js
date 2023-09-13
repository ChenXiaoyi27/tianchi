import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, message, Select } from 'antd';
import { goLogin } from '../../utils/utils';
import { register, getGroupList } from '../../services';

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>注册</h1>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 8,
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
          label="确认密码"
          name="password_again"
          rules={[
            {
              required: true,
              message: '请再次输入密码',
            },
          ]}
        >
          <Input.Password />
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
          <Select>
            {groupList.map(li => <Select.Option value={li.group_id} key={li.group_id}>{li.group_name}</Select.Option>)}
          </Select>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 8,
          }}
        >
          <Button type="primary" htmlType="submit" size='large' style={{ width: '100%' }}>
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Registry;