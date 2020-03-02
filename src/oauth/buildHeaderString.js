import JsSha from 'jssha';

import {query, rfc3986} from '../util';

export default function buildHeaderString(
  {consumerKey, consumerSecret, oauthToken = '', oauthTokenSecret = ''},
  url,
  method,
  params = {},
  extraParams = {},
  {nonce = String(Math.random()).slice(2), timestamp = Math.floor(Date.now() / 1000)} = {},
) {
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    // ...oauthToken && {oauth_token: oauthToken},
    ...oauthToken ? {oauth_token: oauthToken} : {},
    oauth_version: '1.0',
    ...extraParams,
  };
  const shaObj = new JsSha('SHA-1', 'TEXT');
  shaObj.setHMACKey(`${rfc3986(consumerSecret)}&${rfc3986(oauthTokenSecret)}`, 'TEXT');
  shaObj.update(
    `${rfc3986(method)}&${rfc3986(url)}&${rfc3986(query({...params, ...oauthParams}, true))}`,
  );
  return `OAuth ${
    Object.entries({
      ...oauthParams,
      oauth_signature: shaObj.getHMAC('B64'),
    })
      .map(([k, v]) => `${rfc3986(k)}="${rfc3986(v)}"`)
      .join(', ')
  }`;
}
