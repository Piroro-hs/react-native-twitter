import test from 'ava';

import {query, rfc3986} from '~/util';

test('query: encode Objects to query string', (t) => {
  t.is(
    query({' !"#$%&\'()*+,-./': ':;<=>?@\\[]^_'}),
    '%20%21%22%23%24%25%26%27%28%29%2A%2B%2C-.%2F=%3A%3B%3C%3D%3E%3F%40%5C%5B%5D%5E_',
  );
  t.is(query({'ぽやしみ～': '😇'}), '%E3%81%BD%E3%82%84%E3%81%97%E3%81%BF%EF%BD%9E=%F0%9F%98%87');
});

test('query: sort parameters alphabetically by key when second argument is true', (t) => {
  t.is(query({b: 42, a: 'a'}, true), 'a=a&b=42');
});

test('query: encode strings according to W3C Recommendation when third argument is true', (t) => {
  t.is(
    query({' !"#$%&\'()*+,-./': ':;<=>?@\\[]^_'}, true, true),
    '+%21%22%23%24%25%26%27%28%29*%2B%2C-.%2F=%3A%3B%3C%3D%3E%3F%40%5C%5B%5D%5E_',
  );
});

test('rfc3986: encode string', (t) => {
  t.is(
    rfc3986(' !"#$%&\'()*+,-./:;<=>?@\\[]^_'),
    '%20%21%22%23%24%25%26%27%28%29%2A%2B%2C-.%2F%3A%3B%3C%3D%3E%3F%40%5C%5B%5D%5E_',
  );
});
