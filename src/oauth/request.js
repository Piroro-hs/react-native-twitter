import JsSha from 'jssha';

import query from '../util/query';

function rfc3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`);
}

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
  {method, headers = {}, ...opts},
  {consumerKey, consumerSecret, oauthToken = '', oauthTokenSecret = ''},
  extraParams = {},
) {
  const authParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: Math.random(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000),
    ...oauthToken ? {oauth_token: oauthToken} : {},
    oauth_version: '1.0',
    ...extraParams,
  };
  return fetch(url, {
    method,
    headers: {
      ...headers,
      Authorization: `OAuth ${
        Object.entries({
          ...authParams,
          oauth_signature: createSignature(
            method,
            url,
            authParams,
            consumerSecret,
            oauthTokenSecret,
          ),
        })
          .map(([k, v]) => `${rfc3986(k)}="${rfc3986(v)}"`)
          .join(', ')
      }`,
    },
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
