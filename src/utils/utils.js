// 获取url带参
export const getUrlParams = (_url) => {
  let url = _url || location.href;
  if (url.indexOf('?') === -1) {
    return {};
  }
  let paramsString = url.match(/\?(\S*)/)[1];
  let paramsPairs = paramsString.split('&');
  let result = {};
  paramsPairs.map(str => {
    let [key, value] = str.split('=');
    result[key] = value;
  });
  return result;
};
// 返回首页
export const goHome = () => {
  location.href = '/app.html#/list';
};
// 去登录页
export const goLogin = () => {
  location.href = '/app.html#/login';
};
