/** 解析url参数
 * @example ?id=12345&a=aiqe
 * @return Object {id:12345, a:aqie}
*/
export function urlParse() {
  // window.location.search
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345','&a=aqie']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};
