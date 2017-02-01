import URLSearchParams from 'url-search-params';

export function omit(keys, obj) {
  return keys.reduce((acc, key) => {
    delete acc[key]; // eslint-disable-line no-param-reassign, fp/no-delete
    return acc;
  }, {...obj});
}

export function query(params, sort = false, w3c = false) {
  const entries = sort ? Object.entries(params).sort() : Object.entries(params);
  return w3c ?
    entries
      .reduce((acc, [k, v]) => {
        acc.set(k, v);
        return acc;
      }, new URLSearchParams())
      .toString() :
    entries
      .map(([k, v]) => `${rfc3986(k)}=${rfc3986(v)}`)
      .join('&');
}

export function replacePathParams(path, params) {
  const replacedParamKeys = [];
  const replacedPath = path.replace(/:(.+?)(?=\/|$)/g, (_, p1) => {
    if (!params[p1]) {
      return `:${p1}`;
    }
    replacedParamKeys.push(p1);
    return rfc3986(params[p1] || `:${p1}`);
  });
  return {replacedPath, replacedParamKeys};
}

export function rfc3986(str) {
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`.toUpperCase());
}
