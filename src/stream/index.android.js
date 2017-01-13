import {NativeModules, NativeEventEmitter} from 'react-native';

import EventEmitter from 'eventemitter3';

import parser from './parser';
import {query} from '../util';

const nativeEmitter = new NativeEventEmitter(NativeModules.RNTwitter);

export default function stream(tokens, path, params = {}) {
  const emitter = new EventEmitter();
  const id = String(Math.random());
  NativeModules.RNTwitter.open(
    id,
    tokens,
    `https://${path === 'user' || path === 'site' ? path : ''}stream.twitter.com/1.1/${path}.json?${
      query({stringify_friend_ids: true, ...params})
    }`,
  );
  const subscription = nativeEmitter.addListener(id, parser.bind(undefined, emitter));
  return Object.create(emitter, {
    close: {
      value: function close() {
        NativeModules.RNTwitter.close(id);
        subscription.remove();
        emitter.removeAllListeners();
      },
      configurable: true,
      enumerable: true,
      writable: true,
    },
  });
}
