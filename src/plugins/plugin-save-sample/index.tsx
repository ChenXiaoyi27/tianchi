import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { Button, Message } from '@alifd/next';
// import {
//   resetSchema,
// } from '../../services/mockService';
import { saveSchema, doPageLock } from '../../services';
import { getUrlParams, goHome } from '../../utils/utils';
import { type PreviewUrlParams } from 'src/types';

// 保存功能示例
const SaveSamplePlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton, hotkey, config } = ctx;
      const { page_id } = getUrlParams() as PreviewUrlParams;
      // 请求保存接口
      const doSave = async () => {
        const old_version_id = ctx.plugins.VersionPlugin.data.currentVersion;
        await saveSchema(page_id, old_version_id);
        // 保存后解锁，并返回首页
        await doPageLock(page_id, false);
        Message.success('操作成功，返回首页');
        setTimeout(() => {
          goHome();
        }, 500);
      }
      skeleton.add({
        name: 'saveSample',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button onClick={() => doSave()}>
            保存
          </Button>
        ),
      });
      // skeleton.add({
      //   name: 'resetSchema',
      //   area: 'topArea',
      //   type: 'Widget',
      //   props: {
      //     align: 'right',
      //   },
      //   content: (
      //     <Button onClick={() => resetSchema(scenarioName)}>
      //       重置页面
      //     </Button>
      //   ),
      // });
      hotkey.bind('command+s', (e) => {
        e.preventDefault();
        doSave();
      });
    },
  };
}
SaveSamplePlugin.pluginName = 'SaveSamplePlugin';
SaveSamplePlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default SaveSamplePlugin;