import URLSearchParams from 'url-search-params';

export function query(params, sort = false) {
  return (sort ? Object.entries(params).sort() : Object.entries(params))
    .reduce((acc, [k, v]) => {
      acc.set(k, v);
      return acc;
    }, new URLSearchParams())
    .toString();
}

export function rfc3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`);
}
