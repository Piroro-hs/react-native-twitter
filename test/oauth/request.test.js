import test from 'ava';

import fetch from 'node-fetch';

import request from '~/oauth/request';

test.before((t) => {global.fetch = fetch;});

test('obtains request token', (t) => {
  const method = 'POST';
  const url = 'http://term.ie/oauth/example/request_token.php';
  const tokens = {consumerKey: 'key', consumerSecret: 'secret'};
  return request(url, {method}, tokens)
    .then(response => response.text())
    .then((text) => {
      t.is(text, 'oauth_token=requestkey&oauth_token_secret=requestsecret');
    });
});

test.todo('makes POST request', /*(t) => {
  const method = 'POST';
  const url = 'http://term.ie/oauth/example/echo_api.php';
  const body = {a: 'b'};
  const tokens = {
    consumerKey: 'key',
    consumerSecret: 'secret',
    oauthToken: 'accesskey',
    oauthTokenSecret: 'accesssecret',
  };
  return request(url, {method, body}, tokens)
    .then(response => response.text())
    .then((text) => {
      t.is(text, 'a=b');
    });
}*/);

test('makes GET request', (t) => {
  const method = 'GET';
  const url = 'http://term.ie/oauth/example/echo_api.php';
  const params = {a: 'b'};
  const tokens = {
    consumerKey: 'key',
    consumerSecret: 'secret',
    oauthToken: 'accesskey',
    oauthTokenSecret: 'accesssecret',
  };
  return request(url, {method, params}, tokens)
    .then(response => response.text())
    .then((text) => {
      t.is(text, 'a=b');
    });
});
