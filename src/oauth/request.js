import buildHeaderString from './buildHeaderString';
import {query} from '../util';

export default function request(
  tokens,
  url,
  {method, headers = {}, body = {}, params = {}, ...init},
  extraParams = {},
) {
  const queryString = query(params);
  const bodyString = query(body);
  return fetch(queryString ? `${url}?${queryString}` : url, {
    method,
    headers: {
      Authorization: buildHeaderString(tokens, url, method, {...body, ...params}, extraParams),
      ...method !== 'GET' && method !== 'HEAD' ?
        {'Content-Type': 'application/x-www-form-urlencoded'} :
        {},
      ...headers,
    },
    ...bodyString ? {body: bodyString} : {},
    ...init,
  })
    .then(response =>
      response.status === 200 ?
        response :
        response.text().then((text) => {
          try {
            const {errors: [{code, message}]} = JSON.parse(text);
            return Promise.reject(new Error(`${code} ${message}`));
          } catch (e) {
            return Promise.reject(new Error(text));
          }
        }),
    );
}
