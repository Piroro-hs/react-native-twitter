import auth from './oauth/auth';
import {get, post} from './rest';
import stream from './stream';

export {auth};

export default function twitter(tokens) {
  return {
    stream: stream.bind(undefined, tokens),
    rest: {
      get: get.bind(undefined, tokens),
      post: post.bind(undefined, tokens),
    },
  };
}
