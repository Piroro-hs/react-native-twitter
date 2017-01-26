import test from 'ava';

import buildHeaderString from '~/oauth/buildHeaderString';

test('build OAuth header string', (t) => {
  const tokens = {
    consumerKey: 'xvz1evFS4wEEPTGEFPHBog',
    consumerSecret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw',
    oauthToken: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
    oauthTokenSecret: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE',
  };
  const method = 'POST';
  const url = 'https://api.twitter.com/1/statuses/update.json';
  const params = {
    status: 'Hello Ladies + Gentlemen, a signed OAuth request!',
    include_entities: true,
  };
  const nonce = 'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg';
  const timestamp = 1318622958;
  const headerString = buildHeaderString(tokens, url, method, params, {}, {nonce, timestamp});
  t.true(headerString.startsWith('OAuth '));
  t.is(
    `OAuth ${headerString.slice(6).split(', ').sort().join(', ')}`,
    'OAuth oauth_consumer_key="xvz1evFS4wEEPTGEFPHBog", oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg", oauth_signature="tnnArxj06cWHq44gCs1OSKk%2FjLY%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318622958", oauth_token="370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", oauth_version="1.0"',
  );
});

test('use empty string for oauthToken and oauthTokenSecret if not provided', (t) => {
  const tokens = {
    consumerKey: 'key',
    consumerSecret: 'secret',
  };
  const method = 'GET';
  const url = 'http://term.ie/oauth/example/request_token.php';
  const nonce = '03d961f50b51baaae40e720c8e50083f';
  const timestamp = 1485393687;
  const headerString = buildHeaderString(tokens, url, method, {}, {}, {nonce, timestamp});
  t.true(headerString.startsWith('OAuth '));
  t.is(
    `OAuth ${headerString.slice(6).split(', ').sort().join(', ')}`,
    'OAuth oauth_consumer_key="key", oauth_nonce="03d961f50b51baaae40e720c8e50083f", oauth_signature="cqj9Y8KyxmQTa6gDmabOqLRZzsw%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1485393687", oauth_version="1.0"',
  );
});

test('include extra params', (t) => {
  const tokens = {
    consumerKey: 'cChZNFj6T5R0TigYB9yd1w',
    consumerSecret: 'L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg',
    oauthToken: 'NPcudxy0yU5T3tBzho7iCotZ3cnetKwcTIRlX0iwRl0',
    oauthTokenSecret: 'veNRnAWe6inFuo8o2u8SLLZLjolYDmDP7SzL0YfYI',
  };
  const method = 'POST';
  const url = 'https://api.twitter.com/oauth/access_token';
  const nonce = 'a9900fe68e2573b27a37f10fbad6a755';
  const timestamp = 1318467427;
  const extraParams = {oauth_verifier: 'uw7NjWHT6OJ1MpJOXsHfNxoAhPKpgI8BlYDhxEjIBY'};
  const headerString = buildHeaderString(
    tokens,
    url,
    method,
    {},
    extraParams,
    {nonce, timestamp},
  );
  t.true(headerString.startsWith('OAuth '));
  t.is(
    `OAuth ${headerString.slice(6).split(', ').sort().join(', ')}`,
    'OAuth oauth_consumer_key="cChZNFj6T5R0TigYB9yd1w", oauth_nonce="a9900fe68e2573b27a37f10fbad6a755", oauth_signature="39cipBtIOHEEnybAR4sATQTpl2I%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318467427", oauth_token="NPcudxy0yU5T3tBzho7iCotZ3cnetKwcTIRlX0iwRl0", oauth_verifier="uw7NjWHT6OJ1MpJOXsHfNxoAhPKpgI8BlYDhxEjIBY", oauth_version="1.0"',
  );
});

test('generate nonce randomly', (t) => {
  const tokens = {
    consumerKey: 'consumerKey',
    consumerSecret: 'consumerSecret',
    oauthToken: 'oauthToken',
    oauthTokenSecret: 'oauthTokenSecret',
  };
  t.not(
    buildHeaderString(tokens, 'url', 'GET').match(/oauth_nonce="(.+)"/)[1],
    buildHeaderString(tokens, 'url', 'GET').match(/oauth_nonce="(.+)"/)[1],
  );
});
