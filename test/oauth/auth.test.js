import {readFile} from 'fs';

import test from 'ava';

import mock from 'mock-require';
import fetch from 'node-fetch';

const rejects = [];

mock('react-native', {
  Linking: {
    addEventListener() {},
    openURL(url) {rejects.pop()(url);},
  },
});

const auth = require('~/oauth/auth').default;

let consumerKey;
let consumerSecret;

test.before.cb((t) => {
  global.fetch = fetch;
  readFile('test/tokens.json', 'utf8', (_, json) => {
    ({consumerKey, consumerSecret} = JSON.parse(json));
    t.end();
  });
});

test.beforeEach((t) => {
  t.context.promise = new Promise((_, reject) => {
    rejects.push(reject);
  });
});

test(t => auth({consumerKey, consumerSecret}, t.context.promise, {accessType: 'read'})
  .catch((url) => {
    // console.log(url);
    t.regex(url, /^https:\/\/api.twitter.com\/oauth\/authorize/);
  }),
);
