// pattern reference from ajv-formats: dddd-dd-dd
const isValidDate = (date) => /^\d\d\d\d-[0-1]\d-[0-3]\d$/.test(date);

// checks presence of html tags
const isValidHtml = (string) => /<\/?[a-z][\s\S]*>|(^$)/.test(string);

// validates if attachment is a base64 string
const isValidAttachment = (attachment) => /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(attachment);

// validates if  URL inserted is valid
const isValidURL = (url) => {
  // pattern reference from ajv-formats
  const pattern = new RegExp(
    '^(?:https?|ftp):\\/\\/' // protocol (http:// or https:// or ftp:)
    + '(?:\\S+(?::\\S*)?@)?(?:'
    + '(?!(?:10|127)(?:\\.\\d{1,3}){3})'
    + '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})'
    + '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])'
    + '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}'
    + '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\\d{2,5})?(?:\\/[^\\s]*)?$'
    + '|(^$)',
    'iu',
  );
  return pattern.test(url);
};

module.exports = {
  isValidDate,
  isValidHtml,
  isValidAttachment,
  isValidURL,
};
