import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { Button, Message, Dialog } from '@alifd/next';
import { getUrlParams, goHome } from '../../utils/utils';
import { type PreviewUrlParams } from 'src/types';
import { saveSchema, doPageLock } from '../../services';

// 保存功能示例
const PreviewSamplePlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton } = ctx;
      const { page_id } = getUrlParams() as PreviewUrlParams;
      const doPreview = async () => {
        const old_version_id = ctx.plugins.VersionPlugin.data.currentVersion;
        await saveSchema(page_id, old_version_id);
        // 保存后解锁
        await doPageLock(page_id, false);
        Message.success('操作成功');
        setTimeout(() => {
          window.open(`./preview.html?page_id=${page_id}`, '_blank');
          goHome();
        }, 500);
      };
      // 返回首页
      const doGoHome = async () => {
        // 先解锁
        await doPageLock(page_id, false);
        goHome();
      }
      skeleton.add({
        name: 'previewSample',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button type="primary" onClick={() => doPreview()}>
            保存并预览
          </Button>
        ),
      });
      skeleton.add({
        name: 'goHome',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button onClick={() => doGoHome()}>
            返回首页
          </Button>
        ),
      });
    },
  };
}
PreviewSamplePlugin.pluginName = 'PreviewSamplePlugin';
PreviewSamplePlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default PreviewSamplePlugin;