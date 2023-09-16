import { useEffect, useState } from "react";
import moment from "moment";
import { Button, Dialog, Message } from '@alifd/next';
import { getVersionList, doPageUpdate } from "../../services";
import { getUrlParams } from "../../utils/utils";

export default (props) => {
  const [list, setlist] = useState([]);
  const [currentVersion, setcurrentVersion] = useState('');
  const { page_id } = getUrlParams();
  const init = async () => {
    const response = await getVersionList(page_id);
    setlist(response);
  }
  const clickVersion = async (version) => {
    setcurrentVersion(version.version_id);
    const res = await (await fetch(`/api/version/schema?version_id=${version.version_id}`)).json();
    props.toggleVersion(res.data.schema.componentsTree[0], version.version_id);
  }
  // 点击发布生产按钮
  const clickPublish = () => {
    if (!currentVersion) {
      Message.notice('请先选择版本');
      return;
    }
    Dialog.confirm({
      title: '确认',
      content: '请确认是否将当前选择版本作为生产版本？',
      onOk: async () => {
        await doPageUpdate(page_id, { prod_version_id: currentVersion });
        Message.success('发布成功');
      }
    });
  }
  useEffect(() => {
    init();
  }, []);
  return (
    <div className="pd10">
      <Button type="primary" onClick={clickPublish}>将选中版本发布生产</Button>
      {
        list.length ? <div>
          {list.map(li =>
            <p key={li.version_id} className="version-list_item">
              <Button
                type={currentVersion === li.version_id ? 'primary' : 'secondary'}
                text
                onClick={() => clickVersion(li)}
              >{moment(li.created_at).format('YYYY-MM-DD HH:mm:ss')}</Button>
            </p>
          )}
        </div> : <div style={{ textAlign: 'center', padding: 15 }}>暂无数据<br />（点击右上角保存生成版本）</div>
      }
    </div>
  );
}