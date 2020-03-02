import pathInfo from './pathInfo';
import request from '../oauth/request';
import {omit, replacePathParams} from '../util';

function renameTokens({consumerKey, consumerSecret, accessToken, accessTokenSecret}) {
  return {
    consumerKey,
    consumerSecret,
    oauthToken: accessToken,
    oauthTokenSecret: accessTokenSecret,
  };
}

export function get(tokens, path, params = {}, init = {}) {
  const {base} = pathInfo(path);
  const {replacedPath, replacedParamKeys} = replacePathParams(path, params);
  const omittedParams = omit(replacedParamKeys, params);
  const method = 'GET';
  const url = `${base}${replacedPath}.json`;
  return request(renameTokens(tokens), url, {method, params: omittedParams, ...init})
    .then(response =>
      response.headers.get('Content-Type').startsWith('application/json') ?
       response.json() :
       response.text(),
    );
}

export function post(tokens, path, body = {}, params = {}, init = {}) {
  const {base, type} = pathInfo(path);
  const {replacedPath, replacedParamKeys} = replacePathParams(path, {...body, ...params});
  const omittedBody = omit(replacedParamKeys, body);
  const omittedParams = omit(replacedParamKeys, params);
  const method = 'POST';
  const url = `${base}${replacedPath}.json`;
  const headers = {'Content-Type': type};
  return request(
    renameTokens(tokens),
    url,
    {method, headers, body: omittedBody, params: omittedParams, ...init},
  )
    .then(response =>
      response.headers.get('Content-Type').startsWith('application/json') ?
       response.json() :
       response.text(),
    );
}
