import { useEffect, useState } from 'react';
import { TagOutlined } from '@ant-design/icons';
import { Space, Table, Tag, Button, Modal, Form, Input, message, Select } from 'antd';
import { getPageLock, doPageLock, getSiteList, logout, getUserInfo, getPageList } from '../../services';
import { goLogin } from '../../utils/utils';

export default function ListView() {
  /** 静态常量声明--start */
  const layout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 18,
    },
  };
  /** 静态常量声明--end */
  /** 状态变量声明--start */
  const [form] = Form.useForm();
  const [site_form] = Form.useForm();
  // 新建页面弹框显隐
  const [visible, setvisible] = useState(false);
  // 新建网站弹框显隐
  const [siteVisible, setsiteVisible] = useState(false);
  // 表格数据
  const [dataSource, setdataSource] = useState({});
  // 网站列表
  const [siteList, setsiteList] = useState([]);
  // 用户信息
  const [user, setuser] = useState({});
  /** 状态变量声明--end */
  /** 事件方法定义--start */
  // 点击“新建页面”按钮，打开弹框
  const addPage = () => {
    setvisible(true);
  }
  // 新建页面弹框点确定，请求新增页面并跳转编辑页面
  const requestAddPage = async () => {
    const formData = form.getFieldsValue();
    const res = await (await fetch('/api/page/add', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_name: formData.page_name,
        site_id: formData.site_id
      })
    })).json();
    message.success('操作成功，正在跳转编辑页面...');
    setTimeout(() => {
      const { page_id } = res.data.page;
      toModifyPage(page_id);
    }, 500);
  }
  // 删除页面
  const deletePage = (page_id) => {
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const res = await (await fetch(`/api/page/delete?page_id=${page_id}`)).json();
        message.success('操作成功');
        // 刷新页面
        init();
      },
    });
  }
  // 进入编辑页面
  const toModifyPage = async (page_id) => {
    // 先检查锁
    const lockUser = await getPageLock(page_id);
    if (lockUser) {
      message.error(`当前页面同时有【${lockUser}】用户在编辑中，请稍后重试`);
    } else {
      await doPageLock(page_id, true);
      location.href = `/index.html?page_id=${page_id}`;
    }
  }
  // 关闭新建页面弹框
  const closeAddModal = () => {
    setvisible(false);
  }
  // 关闭新建网站弹框
  const closeAddSiteModal = () => {
    setsiteVisible(false);
  }
  // 预览页面
  const toPreviewPage = (page_id) => {
    window.open(`/preview.html?page_id=${page_id}`, '_blank');
  }
  // 解锁
  const unLock = async (page_id) => {
    await doPageLock(page_id, false);
    message.success('操作成功');
    init();
  }
  // 新建网站
  const addSite = () => {
    setsiteVisible(true);
  }
  // 请求新建网站
  const requestAddSite = async () => {
    const formData = site_form.getFieldsValue();
    const res = await (await fetch('/api/site/add', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        site_name: formData.site_name
      })
    })).json();
    message.success('操作成功');
    // 刷新列表
    init();
    // 关闭弹框
    setsiteVisible(false);
  }
  // 退出登录
  const doLogout = async () => {
    await logout();
    message.success('操作成功');
    setTimeout(() => {
      goLogin();
    }, 500);
  }
  // 网站预览
  const previewSite = (site_id) => {
    window.open(`/previewSite.html?site_id=${site_id}`, '_blank');
  }
  /** 事件方法定义--end */
  /** 生命周期方法声明--start */
  useEffect(() => {
    init();
    initUser();
  }, []);
  const init = async () => {
    const sites = await getSiteList();
    setsiteList(sites);
    let newDataSource = {};
    for (let site of sites) {
      const { site_id } = site;
      newDataSource[site_id] = await getPageList(site_id);
    }
    setdataSource(newDataSource);
  }
  const initUser = async () => {
    const info = await getUserInfo();
    setuser(info);
  }
  /** 生命周期方法声明--end */
  /** 渲染--start */
  const columns = [
    {
      title: '页面名称',
      dataIndex: 'page_name',
      key: 'page_name',
    },
    {
      title: '修改时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (t) => moment(t).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '创建时间',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (t) => moment(t).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a key="preview" onClick={() => toPreviewPage(record.page_id)}>预览</a>
          <a key="modify" onClick={() => toModifyPage(record.page_id)}>编辑</a>
          {/* <a key="publish">发布</a> */}
          <a key="delete" onClick={() => deletePage(record.page_id)}>删除</a>
          {record.lock && <a key="unlock" onClick={() => unLock(record.page_id)}>解锁</a>}
        </Space>
      ),
    },
  ];
  return (
    <div style={{ padding: 20 }}>
      <Button onClick={doLogout} type="link" style={{ float: 'right' }}>退出登录</Button>
      <h1 style={{ marginBottom: 50, fontSize: 24, fontWeight: 'bold' }}>你好，{user.user_name || ''}</h1>
      <Button type="primary" onClick={addSite} style={{ marginBottom: 15, marginRight: 20 }}>新建网站</Button>
      <Button type="primary" onClick={addPage} style={{ marginBottom: 15 }}>新建页面</Button>
      {siteList.map(li => (
        <div key={li.site_id} style={{ marginBottom: 50 }}>
          {/* <TagOutlined style={{ fontSize: 20, color: '#1890ff', margin: 'auto 5px' }} /> */}
          <img src="./site.png" width="20px" style={{ margin: 5, float: 'left' }} />
          <h2 style={{ display: 'inline-block', fontSize: 18 }}>{li.site_name}</h2>
          <Button onClick={() => previewSite(li.site_id)} style={{ display: 'inline-block' }} size="small" type="link">网站预览</Button>
          <Table columns={columns} dataSource={dataSource[li.site_id]} rowKey="page_id" pagination={false} />
        </div>
      ))}
      <img src="./mascot.png" width="100px" style={{ display: 'block', position: 'fixed', bottom: 5, right: 20 }} />
      <Modal
        title="新建网站"
        visible={siteVisible}
        okText="确定"
        cancelText="取消"
        onOk={requestAddSite}
        onCancel={closeAddSiteModal}
      >
        <Form {...layout} form={site_form} name="control-hooks">
          <Form.Item
            name="site_name"
            label="网站名称"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="新建页面"
        visible={visible}
        okText="确定"
        cancelText="取消"
        onOk={requestAddPage}
        onCancel={closeAddModal}
      >
        <Form {...layout} form={form} name="control-hooks">
          <Form.Item
            name="page_name"
            label="页面名称"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="site_id"
            label="所属网站"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select>
              {siteList.map(v => <Select.Option value={v.site_id} key={v.site_id}>{v.site_name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};