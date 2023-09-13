import { useEffect, useState } from "react";
import moment from "moment";
import { Button } from '@alifd/next';
import { getVersionList } from "../../services";
import { getUrlParams } from "../../utils/utils";

export default (props) => {
  const [list, setlist] = useState([]);
  const [currentVersion, setcurrentVersion] = useState('');
  const init = async () => {
    const { page_id } = getUrlParams();
    const response = await getVersionList(page_id);
    setlist(response);
  }
  const clickVersion = async (version) => {
    setcurrentVersion(version.version_id);
    const res = await (await fetch(`/api/version/schema?version_id=${version.version_id}`)).json();
    props.toggleVersion(res.data.schema.componentsTree[0], version.version_id);
  }
  useEffect(() => {
    init();
  }, []);
  return (
    <div>
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