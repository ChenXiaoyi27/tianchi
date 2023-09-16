import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import { Nav, Shell } from '@alifd/next';
import { getPageList, getPageContent, getSiteInfo } from './services';
import { getUrlParams } from './utils/utils';
import { PreviewSiteUrlParams } from './types';

import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler';

// const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const { site_id } = getUrlParams() as PreviewSiteUrlParams;
  // 页面列表
  const [pageList, setpageList] = useState([]);
  // 显示的页面内容
  const [data, setData] = useState({});
  // 网站信息
  const [siteInfo, setsiteInfo] = useState({});

  useEffect(() => {
    init();
    initSiteName();
  }, []);

  const initSiteName = async () => {
    const info = await getSiteInfo(site_id);
    setsiteInfo(info);
  }

  const init = async () => {
    const list = await getPageList(site_id);
    setpageList(list);
  }
  // 切换页面
  const togglePage = async (selectedKeys: Array<string>) => {
    const page_id = selectedKeys[0];
    const page = pageList.find(li => li.page_id === page_id);
    const version_id = page.prod_version_id;// 生产版本
    const projectResponse = await getPageContent(page_id, version_id);
    if (!projectResponse || !projectResponse.schema || !projectResponse.packages) {
      setData({});
      return;
    }

    const { packages } = projectResponse;
    const { componentsMap: componentsMapArray, componentsTree } = projectResponse.schema;
    const componentsMap = {};
    componentsMapArray.forEach((component) => {
      componentsMap[component.componentName] = component;
    });
    const schema = componentsTree[0];

    const libraryMap = {};
    const libraryAsset = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];

    // TODO asset may cause pollution
    const assetLoader = new AssetLoader();
    await assetLoader.load(libraryAsset);
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));

    setData({
      schema,
      components,
    });
  }

  return (
    <Shell
      className={"iframe-hack"}
      device="desktop"
      style={{ border: "1px solid #eee", height: '100vh' }}
    >
      <Shell.Branding>
        <div className="rectangular"></div>
        <span style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>{siteInfo.site_name}</span>
      </Shell.Branding>
      <Shell.Action>
        {/* <img
          src="https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png"
          className="avatar"
          alt="用户头像"
        /> */}
        {/* <span style={{ marginLeft: 10 }}>MyName</span> */}
      </Shell.Action>

      <Shell.Navigation>
        <Nav embeddable aria-label="global navigation" onSelect={togglePage}>
          {pageList.map(li => <Nav.Item key={li.page_id}>{li.page_name}</Nav.Item>)}
        </Nav>
      </Shell.Navigation>

      <Shell.Content>
        {data.schema && <div className="lowcode-plugin-sample-preview">
          <ReactRenderer
            className="lowcode-plugin-sample-preview-content"
            schema={data.schema}
            components={data.components}
            appHelper={{
              requestHandlersMap: {
                fetch: createFetchHandler()
              }
            }}
          />
        </div>}
      </Shell.Content>
    </Shell>
  )
};
export default App;

ReactDOM.render(<App />, document.getElementById('ice-container'));
