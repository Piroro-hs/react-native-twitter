# react-native-twitter

A Twitter API client library for React Native

<!-- toc orderedList:0 depthFrom:1 depthTo:6 -->

* [react-native-twitter](#react-native-twitter)
  * [Installation](#installation)
  * [Usage](#usage)
    * [`auth(tokens, callbackUrl[, options])`](#authtokens-callbackurl-options)
    * [`auth(tokens, pinPromise[, options])`](#authtokens-pinpromise-options)
    * [`const client = twitter(tokens)`](#const-client-twittertokens)
    * [`rest.get(path[, params])`](#restgetpath-params)
    * [`rest.post(path[, params])`](#restpostpath-params)
    * [`stream(path, params)` (Android only)](#streampath-params-android-only)

<!-- tocstop -->

## Installation

```
npm i react-native-twitter -S
react-native link
```

If you use [3-legged authorization](https://dev.twitter.com/oauth/3-legged), you need to add the deep link scheme for your callback URL. See [React Native docs](https://facebook.github.io/react-native/docs/linking.html) and [example](https://github.com/Piroro-hs/react-native-twitter/blob/04377af08f2f4fbdc039dc52daafb8d6fb28171e/example/android/app/src/main/AndroidManifest.xml#L19-L34) for more info.

## Usage

```js
import twitter, {auth} from 'react-native-twitter';
```

### `auth(tokens, callbackUrl[, options])`

Get the client's authentication tokens via [3-legged authorization](https://dev.twitter.com/oauth/3-legged).

* tokens
  * `consumerKey` Your consumer key
  * `consumerSecret` Your consumer secret
* `callbackUrl` The URL a user is redirected to, you need to add the deep link scheme for this URL
* `options`
  * `accessType` Specify `x_auth_access_type`, supported values are `'read'` or `'write'` (See [Twitter docs](https://dev.twitter.com/oauth/reference/post/oauth/request_token#parameters).)
  * `forSignIn` If `true`, [oauth/authenticate](https://dev.twitter.com/oauth/reference/get/oauth/authenticate) endpoint is used instead of [oauth/authorize](https://dev.twitter.com/oauth/reference/get/oauth/authorize) (Default: `false`)
  *  `forceLogin` Specify `force_login` (See [Twitter docs](https://dev.twitter.com/oauth/reference/get/oauth/authorize#parameters).) (Default: `false`)
  *  `screenName` Specify `screen_name` (See [Twitter docs](https://dev.twitter.com/oauth/reference/get/oauth/authorize#parameters).)

* Returns: `Promise` of `{accessToken, accessTokenSecret, id, name}`
  * `accessToken` Access token
  * `accessTokenSecret` Access token secret
  * `id` User id
  * `name` Screen name

### `auth(tokens, pinPromise[, options])`

Get the client's authentication tokens via [PIN-based authorization](https://dev.twitter.com/oauth/pin-based).

* `pinPromise` `Promise` which resolves to PIN

* Returns: `Promise` of `{accessToken, accessTokenSecret, id, name}`

### `const client = twitter(tokens)`

Create a Twitter API client.

* tokens
  * `consumerKey` Your consumer key
  * `consumerSecret` Your consumer secret
  * `accessToken` Access token
  * `accessTokenSecret` Access token secret

```js
const {rest, stream} = twitter(tokens);
```

### `rest.get(path[, params])`

Make GET requests.

* `path` The endpoint path
* `params` Parameters for the request

* Returns: `Promise`

### `rest.post(path[, params])`

Make POST requests.

* `path` The endpoint path
* `params` Parameters for the request

* Returns: `Promise`

There is no `File` or `Blob` in React Native, but you can use `Object` with `uri` property as media files for media uploading endpoints such as [account/update_profile_image](https://dev.twitter.com/rest/reference/post/account/update_profile_image). Below is an example of changing profile image to the latest photo from `CameraRoll`.

```js
CameraRoll.getPhotos({first: 1})
  .then(({edges: [{node: {image}}]}) => rest.post('account/update_profile_image', {image}))
  .then(() => {console.log('done');})
  .catch(console.error);
```

### `stream(path, params)` (Android only)

Connect to Streaming APIs.

* `path` The endpoint path
* `params` Parameters for the request

* Returns: `EventEmitter`
  * `'data'`
  * `'error'`
  * `close()` Close the connection
