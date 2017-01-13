import JsSha from 'jssha';

import {query, rfc3986} from '../util';

function createSignature(
  method,
  url,
  params,
  consumerSecret,
  oauthTokenSecret = '',
) {
  const shaObj = new JsSha('SHA-1', 'TEXT');
  shaObj.setHMACKey(`${rfc3986(consumerSecret)}&${rfc3986(oauthTokenSecret)}`, 'TEXT');
  shaObj.update(`${rfc3986(method)}&${rfc3986(url)}&${rfc3986(query(params, true))}`);
  return shaObj.getHMAC('B64');
}

export default function request(
  url,
  {method, headers = {}, body = {}, params = {}, ...opts},
  {consumerKey, consumerSecret, oauthToken = '', oauthTokenSecret = ''},
  extraOAuthParams = {},
) {
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: Math.random(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000),
    ...oauthToken ? {oauth_token: oauthToken} : {},
    oauth_version: '1.0',
    ...extraOAuthParams,
  };
  const signature = createSignature(
    method,
    url,
    {...body, ...params, ...oauthParams},
    consumerSecret,
    oauthTokenSecret,
  );
  return fetch(`${url}?${query(params)}`, {
    method,
    headers: {
      Authorization: `OAuth ${
        Object.entries({
          ...oauthParams,
          oauth_signature: signature,
        })
          .map(([k, v]) => `${rfc3986(k)}="${rfc3986(v)}"`)
          .join(', ')
      }`,
      ...method !== 'GET' && method !== 'HEAD' ?
        {'Content-Type': 'application/x-www-form-urlencoded'} :
        {},
      ...headers,
    },
    body: query(body),
    ...opts,
  })
    .then(response =>
      response.status === 200 ?
        response :
        response.json().then(({errors: [{code, message}]}) =>
          Promise.reject(new Error(`${code} ${message}`)),
        ),
    );
}
