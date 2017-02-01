import test from 'ava';

import request from '~/oauth/request';
import mockFetch from '../mockFetch';

global.FormData = class FormData {}; // eslint-disable-line fp/no-mutation

const tokens = {
  consumerKey: 'consumerKey',
  consumerSecret: 'consumerSecret',
  oauthToken: 'oauthToken',
  oauthTokenSecret: 'oauthTokenSecret',
};

test('encode params according to RFC 3986', (t) => {
  const method = 'GET';
  const url = 'encode params';
  const params = {q: ' !"#$%&\'()*+,-./:;<=>?@\\[]^_'};
  mockFetch(
    `${url}?q=%20%21%22%23%24%25%26%27%28%29%2A%2B%2C-.%2F%3A%3B%3C%3D%3E%3F%40%5C%5B%5D%5E_`,
    {cb: (err) => {t.falsy(err);}},
  );
  return request(tokens, url, {method, params});
});

test('encode body according to RFC 3986', (t) => {
  const method = 'POST';
  const url = 'encode body';
  const reqBody = {q: ' !"#$%&\'()*+,-./:;<=>?@\\[]^_'};
  mockFetch(url, {cb: (err, {body}) => {
    t.falsy(err);
    t.is(body, 'q=%20%21%22%23%24%25%26%27%28%29%2A%2B%2C-.%2F%3A%3B%3C%3D%3E%3F%40%5C%5B%5D%5E_');
  }});
  return request(tokens, url, {method, body: reqBody});
});

test('encode body to FormData', (t) => {
  const method = 'POST';
  const url = 'encode body to FormData';
  const reqBody = {};
  const headers = {'Content-Type': 'multipart/form-data'};
  mockFetch(url, {cb: (err, {body}) => {
    t.falsy(err);
    t.true(body instanceof FormData);
  }});
  return request(tokens, url, {method, body: reqBody, headers});
});

test('encode body to JSON string', (t) => {
  const method = 'POST';
  const url = 'encode body to JSON string';
  const reqBody = {a: 'a'};
  const headers = {'Content-Type': 'application/json'};
  mockFetch(url, {cb: (err, {body}) => {
    t.falsy(err);
    t.deepEqual(JSON.parse(body), {a: 'a'});
  }});
  return request(tokens, url, {method, body: reqBody, headers});
});

test('throw when HTTP status is not 2xx', (t) => {
  const method = 'GET';
  const url = 'throw when HTTP status is not 2xx';
  mockFetch(url, {body: 'error', status: 300});
  return t.throws(request(tokens, url, {method}), 'error');
});

test('parse Twitter API error messages if possible', (t) => {
  const method = 'GET';
  const url = 'parse Twitter API error messages';
  mockFetch(
    url,
    {body: '{"errors":[{"message":"Sorry, that page does not exist","code":34}]}', status: 404},
  );
  return t.throws(request(tokens, url, {method}), '34 Sorry, that page does not exist');
});
