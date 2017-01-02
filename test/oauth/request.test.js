import test from 'ava';

import fetch from 'node-fetch';

import request from '~/oauth/request';

test.before((t) => {global.fetch = fetch;});

test('OAuth request', (t) => {
  const method = 'POST';
  const url = 'http://term.ie/oauth/example/request_token.php';
  return request(url, {method}, {consumerKey: 'key', consumerSecret: 'secret'})
    .then(response => response.text())
    .then((text) => {
      t.regex(text, /^oauth_token=/);
    });
});
