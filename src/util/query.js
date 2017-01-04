import URLSearchParams from 'url-search-params';

export default function query(params, sort = false) {
  return (sort ? Object.entries(params).sort() : Object.entries(params))
    .reduce((acc, [k, v]) => {
      acc.set(k, v);
      return acc;
    }, new URLSearchParams())
    .toString();
}
