import buildHeaderString from './buildHeaderString';
import {query} from '../util';

const contentType = {
  FORMDATA: 'multipart/form-data',
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
};

function encodeBody(body, type) {
  switch (type) {
  case contentType.FORMDATA:
    return Object.entries(body)
      .reduce((acc, [k, v]) => {
        acc.append(k, v.uri ? {uri: v.uri, name: v.name || 'file', type: v.type || '*/*'} : v);
        return acc;
      }, new FormData());
  case contentType.JSON:
    return JSON.stringify(body);
  // case contentType.FORM:
  //   return query(body);
  default:
    return query(body);
  }
}

export default function request(
  tokens,
  url,
  {
    method,
    headers: {'Content-Type': type = contentType.FORM, ...headers} = {},
    body = {},
    params = {},
    ...init
  },
  extraParams = {},
) {
  const requestParams = {...method === 'POST' && type === contentType.FORM ? body : {}, ...params};
  const queryString = query(params);
  return fetch(queryString ? `${url}?${queryString}` : url, {
    method,
    headers: {
      Authorization: buildHeaderString(tokens, url, method, requestParams, extraParams),
      ...method === 'POST' && type !== contentType.FORMDATA ? {'Content-Type': type} : {},
      ...headers,
    },
    ...method === 'POST' ? {body: encodeBody(body, type)} : {},
    ...init,
  })
    .then(response =>
      response.ok ?
        response :
        response.text()
          .then((text) => {
            try {
              const {errors: [{code, message}]} = JSON.parse(text);
              return Promise.reject(new Error(`${code} ${message}`));
            } catch (e) {
              return Promise.reject(new Error(text));
            }
          }),
    );
}
