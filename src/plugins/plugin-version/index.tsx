import * as React from 'react';
import { IPublicModelPluginContext, IPublicTypeRootSchema } from '@alilc/lowcode-types';
import { injectAssets } from '@alilc/lowcode-plugin-inject';
import { Icon } from '@alifd/next'
import VersionPanel from './VersionPanel';
import './index.less';
import { getUrlParams } from '../../utils/utils';
import { getVersionList } from '../../services';
import { PreviewUrlParams } from 'src/types';

const VersionPlugin = (ctx: IPublicModelPluginContext) => {
  // 当前选中版本，可以为空，为空时取最新版本或没有版本
  let currentVersion = '';
  return {
    // 插件对外暴露的数据和方法
    exports() {
      return {
        data: {
          currentVersion
        },
        // 切换版本，将版本对应schema渲染到设计器中
        async toggleVersion(schema: IPublicTypeRootSchema, old_version_id: string) {
          console.log('toggleVersion', schema);
          const { project, material } = ctx;
          // 设置物料描述
          project.removeDocument(project.currentDocument as any);
          project.openDocument(schema);
          // 设置当前选中版本
          currentVersion = old_version_id;
        },
      };
    },
    // 插件的初始化函数，在引擎初始化之后会立刻调用
    async init() {
      // 获取最新版本号，可以为空，新建的页面的最新版本为空
      const { page_id } = getUrlParams() as PreviewUrlParams;
      const versions = await getVersionList(page_id);
      if (versions.length) {
        currentVersion = versions[0].version_id;
      }
      // 往引擎增加面板
      ctx.skeleton.add({
        area: 'leftArea',
        name: 'VersionPlugin',
        type: 'PanelDock',
        props: {
          description: <div>版本管理</div>,
          icon: <Icon type="list" />,
        },
        content: <VersionPanel toggleVersion={(s, i) => ctx.plugins.VersionPlugin.toggleVersion(s, i)} />,
      });

      ctx.logger.log('打个日志');
    },
  };
};

// 插件名，注册环境下唯一
VersionPlugin.pluginName = 'VersionPlugin';
VersionPlugin.meta = {
  // 依赖的插件（插件名数组）
  dependencies: [],
  engines: {
    lowcodeEngine: '^1.0.0', // 插件需要配合 ^1.0.0 的引擎才可运行
  },
};

export default VersionPlugin;