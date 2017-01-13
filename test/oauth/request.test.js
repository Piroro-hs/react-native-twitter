import {readFile} from 'fs';

import test from 'ava';

import fetch from 'node-fetch';
import URLSearchParams from 'url-search-params';

import request from '~/oauth/request';

let tokens;

test.before.cb((t) => {
  global.fetch = fetch;
  readFile('test/tokens.json', 'utf8', (_, json) => {
    const {consumerKey, consumerSecret, accessToken, accessTokenSecret} = JSON.parse(json);
    tokens = {
      consumerKey,
      consumerSecret,
      oauthToken: accessToken,
      oauthTokenSecret: accessTokenSecret,
    };
    t.end();
  });
});

test('make GET request', (t) => {
  const method = 'GET';
  const url = 'https://api.twitter.com/1.1/search/tweets.json';
  const params = {q: ' !"#$%&\'()*+,-./:;<=>?@\\[]^_'};
  return request(url, {method, params}, tokens)
    .then(response => response.json())
    .then(({statuses}) => {
      t.truthy(statuses);
    });
});

test('make POST request / handle missing tokens / handle extra oauth params', (t) => {
  const method = 'POST';
  const url = 'https://api.twitter.com/oauth/request_token';
  const body = {x_auth_access_type: 'write'};
  return request(
    url,
    {method, body},
    {consumerKey: tokens.consumerKey, consumerSecret: tokens.consumerSecret},
    {oauth_callback: 'oob'},
  )
    .then(response => response.text())
    .then((text) => {
      const params = new URLSearchParams(text);
      t.true(params.has('oauth_token') && params.has('oauth_token_secret'));
    });
});

test('parse Twitter API error messages', (t) => {
  const method = 'GET';
  const url = 'https://api.twitter.com/1.1/not/exist.json';
  return t.throws(request(url, {method}, tokens), '34 Sorry, that page does not exist');
});
