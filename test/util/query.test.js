import test from 'ava';

import query from '~/util/query';

test('encodes Objects to query string', (t) => {
  t.is(query({a: 'A, b & cCc'}), 'a=A%2C+b+%26+cCc');
  t.is(query({'ぽやしみ～': '😇'}), '%E3%81%BD%E3%82%84%E3%81%97%E3%81%BF%EF%BD%9E=%F0%9F%98%87');
});

test('sorts parameters alphabetically by key when second argument is true', (t) => {
  t.is(query({b: 42, a: 'A, b & cCc'}, true), 'a=A%2C+b+%26+cCc&b=42');
});
