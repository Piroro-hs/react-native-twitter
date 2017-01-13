import URLSearchParams from 'url-search-params';

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

export function rfc3986(str) {
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`.toUpperCase());
}
