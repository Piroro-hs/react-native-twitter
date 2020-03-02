export default function parser(emitter, {name, data}) {
  switch (name) {
  case 'networkError':
    emitter.emit('error', new Error(data));
    break;
  case 'twitterError': {
    try {
      const {errors: [{code, message}]} = JSON.parse(data);
      emitter.emit('error', new Error(`${code} ${message}`));
    } catch (e) {
      emitter.emit('error', new Error(data));
    }
    break;
  }
  default:
    emitter.emit('data', JSON.parse(data));
  }
}
