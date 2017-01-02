import {Linking} from 'react-native';

import URLSearchParams from 'url-search-params';

import request from './request';

function getRequestToken(consumerKey, consumerSecret, callbackUrl = 'oob') {
  const method = 'POST';
  const url = 'https://api.twitter.com/oauth/request_token';
  return request(url, {method}, {consumerKey, consumerSecret}, {oauth_callback: callbackUrl})
    .then(response => response.text())
    .then((query) => {
      const params = new URLSearchParams(query);
      return {
        requestToken: params.get('oauth_token'),
        requestTokenSecret: params.get('oauth_token_secret'),
      };
    });
}

function getAccessToken(
  consumerKey,
  consumerSecret,
  requestToken,
  requestTokenSecret,
  oauthVerifier,
) {
  const method = 'POST';
  const url = 'https://api.twitter.com/oauth/access_token';
  return request(
    url,
    {method},
    {consumerKey, consumerSecret, oauthToken: requestToken, oauthTokenSecret: requestTokenSecret},
    {oauth_verifier: oauthVerifier},
  )
    .then(response => response.text())
    .then((query) => {
      const params = new URLSearchParams(query);
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

export default async function auth(consumerKey, consumerSecret, callbackUrl) {
  const usePin = typeof callbackUrl.then === 'function';
  const {requestToken, requestTokenSecret} = await getRequestToken(
    consumerKey,
    consumerSecret,
    usePin ? 'oob' : callbackUrl,
  );
  Linking.openURL(`https://api.twitter.com/oauth/authorize?oauth_token=${requestToken}`);
  return getAccessToken(
    consumerKey,
    consumerSecret,
    requestToken,
    requestTokenSecret,
    await (
      usePin ?
        callbackUrl :
        new Promise((resolve, reject) => {verifierDeferreds.set(requestToken, {resolve, reject});})
    ),
  );
}
