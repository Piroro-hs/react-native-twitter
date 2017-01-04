export default function parser(emitter, {name, data}) {
  switch (name) {
  case 'networkError':
    emitter.emit('error', new Error(data));
    break;
  case 'twitterError': {
    const {errors: [{code, message}]} = data;
    emitter.emit('error', new Error(`${code} ${message}`));
    break;
  }
  default:
    emitter.emit('data', JSON.parse(data));
  }
}
