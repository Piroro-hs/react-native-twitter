import {Linking} from 'react-native';

import URLSearchParams from 'url-search-params';

import request from './request';
import {query} from '../util';

function getRequestToken(tokens, callbackUrl, accessType) {
  const method = 'POST';
  const url = 'https://api.twitter.com/oauth/request_token';
  const body = accessType ? {x_auth_access_type: accessType} : {};
  return request(tokens, url, {method, body}, {oauth_callback: callbackUrl})
    .then(response => response.text())
    .then((text) => {
      const params = new URLSearchParams(text);
      return {
        requestToken: params.get('oauth_token'),
        requestTokenSecret: params.get('oauth_token_secret'),
      };
    });
}

function getAccessToken(
  {consumerKey, consumerSecret, requestToken, requestTokenSecret},
  oauthVerifier,
) {
  const method = 'POST';
  const url = 'https://api.twitter.com/oauth/access_token';
  return request(
    {consumerKey, consumerSecret, oauthToken: requestToken, oauthTokenSecret: requestTokenSecret},
    url,
    {method},
    {oauth_verifier: oauthVerifier},
  )
    .then(response => response.text())
    .then((text) => {
      const params = new URLSearchParams(text);
      return {
        accessToken: params.get('oauth_token'),
        accessTokenSecret: params.get('oauth_token_secret'),
        id: params.get('user_id'),
        name: params.get('screen_name'),
      };
    });
}

const verifierDeferreds = new Map();

Linking.addEventListener('url', ({url}) => {
  const params = new URLSearchParams(url.split('?')[1]);
  if (params.has('oauth_token') && verifierDeferreds.has(params.get('oauth_token'))) {
    const verifierDeferred = verifierDeferreds.get(params.get('oauth_token'));
    verifierDeferreds.delete(params.get('oauth_token'));
    if (params.has('oauth_verifier')) {
      verifierDeferred.resolve(params.get('oauth_verifier'));
    } else {
      verifierDeferred.reject(new Error('denied'));
    }
  }
});

export default async function auth(
  tokens,
  callbackUrl,
  {accessType, forSignIn = false, forceLogin = false, screenName = ''} = {},
) {
  const usePin = typeof callbackUrl.then === 'function';
  const {requestToken, requestTokenSecret} = await getRequestToken(
    tokens,
    usePin ? 'oob' : callbackUrl,
    accessType,
  );
  Linking.openURL(`https://api.twitter.com/oauth/${forSignIn ? 'authenticate' : 'authorize'}?${
    query({oauth_token: requestToken, force_login: forceLogin, screen_name: screenName})
  }`);
  return getAccessToken(
    {...tokens, requestToken, requestTokenSecret},
    await (
      usePin ?
        callbackUrl :
        new Promise((resolve, reject) => {verifierDeferreds.set(requestToken, {resolve, reject});})
    ),
  );
}
