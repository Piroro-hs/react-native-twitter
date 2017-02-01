const baseUpload = Set.prototype.has.bind(new Set(['media/upload', 'media/metadata/create']));

const typeFormData = Set.prototype.has.bind(
  new Set(['media/upload', 'account/update_profile_image', 'account/update_profile_banner']),
);

const typeJson = Set.prototype.has.bind(new Set(['media/metadata/create']));

export default function pathInfo(path) {
  return {
    base: /^http(s|):\/\//.test(path) ?
      '' :
      `https://${baseUpload(path) ? 'upload' : 'api'}.twitter.com/1.1/`,
    type: typeFormData(path) ?
      'multipart/form-data' :
      typeJson(path) ?
        'application/json' :
        'application/x-www-form-urlencoded',
  };
}
