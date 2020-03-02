import inAppBrowser from "react-native-inappbrowser-reborn";

import {URLSearchParams } from 'whatwg-url';

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
  if(await inAppBrowser.isAvailable()){
 const result=   await inAppBrowser.openAuth(`https://api.twitter.com/oauth/${forSignIn ? 'authenticate' : 'authorize'}?${
    query({oauth_token: requestToken, force_login: forceLogin, screen_name: screenName})
  }`);

  const params = new URLSearchParams(result.url.split('?')[1]);
    if (result.type === 'success' && params.has('oauth_verifier')) {
    //console.log('oauth_verifier: ', params.get('oauth_verifier')); 
      return getAccessToken(
    {...tokens, requestToken, requestTokenSecret},
     (
      usePin ?
        callbackUrl :
        params.get('oauth_verifier')
    )
  );
}
    }
}
