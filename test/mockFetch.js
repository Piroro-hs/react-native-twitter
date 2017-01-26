import fetch, {Response} from 'node-fetch';

const mockedUrls = new Map();

global.fetch = function fetchMock(...args) { // eslint-disable-line fp/no-mutation
  const url = args[0];
  if (mockedUrls.has(url)) {
    const mockedFetch = mockedUrls.get(url);
    mockedUrls.delete(url);
    return mockedFetch(...args);
  }
  return fetch(...args);
};

export default function mockFetch(mockUrl, {cb = () => {}, body = '', status = 200} = {}) {
  mockedUrls.set(mockUrl, (url, init) => {
    cb(null, init);
    return Promise.resolve(new Response(body, {status}));
  });
  setTimeout(cb, 500, new Error('not called'));
}
