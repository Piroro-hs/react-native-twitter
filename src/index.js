import auth from './oauth/auth';
import stream from './stream';

export {auth};

export default function twitter(tokens) {
  return {
    stream: stream.bind(undefined, tokens),
  };
}
