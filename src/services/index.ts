import { project, material } from '@alilc/lowcode-engine';
import { IPublicEnumTransformStage } from '@alilc/lowcode-types';
import { filterPackages } from '@alilc/lowcode-plugin-inject';
import md5 from 'js-md5';
import schema from './schema.json';

// 保存页面
export const saveSchema = async (page_id: string, old_version_id: string) => {
  const packages = await filterPackages(material.getAssets().packages);
  const schema = project.exportSchema(IPublicEnumTransformStage.Save);
  console.log('schema: ', schema);
  const res = await (await fetch('/api/version/add', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      old_version_id,
      version_schema: JSON.stringify({ schema, packages }),
      page_id,
    }),
  })).json();
  return res.success;
};
// 获取保存页面的schema和packages
export const getPageContent = async (page_id: string, version_id: string) => {
  const res = await (await fetch(`/api/version/schema?page_id=${page_id}&version_id=${version_id}`)).json();
  const pageSchema = res.data;

  if (pageSchema) {
    return pageSchema;
  }

  // 默认的空schema
  return null;
};
// 获取页面之前保存的schema.json
export const getPageSchema = async (page_id: string, version_id: string) => {
  const result = await getPageContent(page_id, version_id);
  const pageSchema = result ? result.schema.componentsTree[0] : null;

  if (pageSchema) {
    return pageSchema;
  }

  // 默认的空schema
  return schema;
};
// 获取页面版本列表
export const getVersionList = async (page_id: string) => {
  const res = await (await fetch(`/api/version/list?page_id=${page_id}`)).json();
  return res.data;
}
// 查询锁状态，返回当前加锁用户id或空，为空时表示未锁状态
export const getPageLock = async (page_id: string) => {
  const res = await (await fetch(`/api/page/lock/get?page_id=${page_id}`)).json();
  return res.data.lock;
}
// 加锁/解锁，返回操作是否成功
export const doPageLock = async (page_id: string, lock: boolean) => {
  const res = await (await fetch(`/api/page/lock?page_id=${page_id}&lock=${lock ? 'Y' : 'N'}`)).json();
  return res.success;
}
// 获取网站列表
export const getSiteList = async () => {
  const res = await (await fetch('/api/site/list', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  })).json();
  return res.data;
}

// 登录
export const login = async (user_name: string, password: string) => {
  const res = await (await fetch('/api/user/login', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_name,
      password: md5(password)
    })
  })).json();
  console.log('res: ', res);
  return res.success;
}
// 退出登录
export const logout = async () => {
  const res = await (await fetch('/api/user/logout')).json();
  return res.success;
}
// 注册
export const register = async (user_name: string, password: string, group_id: string) => {
  const res = await (await fetch('/api/user/register', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_name,
      password: md5(password),
      group_id
    })
  })).json();
  return res.success;
}
// 获取登录用户信息
export const getUserInfo = async () => {
  const res = await (await fetch('/api/user/info')).json();
  return res.data;
}
// 获取小组列表
export const getGroupList = async () => {
  const res = await (await fetch('/api/group/list')).json();
  return res.data;
}
// 获取页面列表
export const getPageList = async (site_id: string) => {
  const res = await (await fetch('/api/page/list', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      site_id
    })
  })).json();
  return res.data;
}
// 获取网站信息
export const getSiteInfo = async (site_id: string) => {
  const res = await (await fetch(`/api/site/info?site_id=${site_id}`)).json();
  return res.data;
}
