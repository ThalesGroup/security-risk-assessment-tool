const validation = (() => {
  const mailPattern = '(^mailto:\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$)';
  // pattern reference from ajv-formats
  const URLpattern = new RegExp(
    '^(?:https?|ftp):\\/\\/' // protocol (http:// or https:// or ftp:)
    + '(?:\\S+(?::\\S*)?@)?(?:'
    + '(?!(?:10|127)(?:\\.\\d{1,3}){3})'
    + '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})'
    + '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])'
    + '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}'
    + '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\\d{2,5})?(?:\\/[^\\s]*)?$'
    + `|${mailPattern}`
    + '|(^$)',
    'iu',
  );
  // types of vector string formats (temporal metrics are optional)
  const cvssv2Pattern = 'CVSS:2.0/AV:(L|A|N)/AC:(H|M|L)/Au:(M|S|N)/C:(N|P|C)/I:(N|P|C)/A:(N|P|C)(/E:(U|POC|F|ND))?(/RL:(OF|TF|W|ND))?(/RC:(UC|UR|ND))?';
  const cvssv3Pattern = 'CVSS:(3.0|3.1)/AV:(L|A|N|P)/AC:(H|L)/PR:(N|L|H)/UI:(N|R)/S:(U|C)/C:(H|L|N)/I:(H|L|N)/A:(H|L|N)(/E:(X|H|F|P|U))?(/RL:(X|U|W|T|O))?(/RC:(X|C|R|U))?';
  const vectorPattern = new RegExp(`${cvssv2Pattern}|${cvssv3Pattern}|(^$)`);

  const isValidDate = (date) => /(^\d\d\d\d-[0-1]\d-[0-3]\d$)|(^$)/.test(date);
  const isValidHtml = (string) => /<\/?[a-z][\s\S]*>|(^$)/.test(string);
  const isValidAttachment = (attachment) => /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(attachment);
  const isValidURL = (url) => URLpattern.test(url);
  const isVector = (string) => vectorPattern.test(string);

  return {
    isValidDate: (string) => isValidDate(string),
    isValidHtml: (string) => isValidHtml(string),
    isValidAttachment: (string) => isValidAttachment(string),
    isValidURL: (string) => isValidURL(string),
    isVector: (string) => isVector(string),
  };
})();

module.exports = validation;
