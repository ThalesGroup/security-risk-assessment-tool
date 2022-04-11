// pattern reference for validation.js and ajv-instance.js
const validationPattern = Object.freeze({
  URLpattern: new RegExp(
    '^(?:https?):\\/\\/' // protocol (http:// or https:// or ftp:)
          + '(?:\\S+(?::\\S*)?@)?(?:'
          + '(?!(?:10|127)(?:\\.\\d{1,3}){3})'
          + '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})'
          + '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])'
          + '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}'
          + '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\\d{2,5})?(?:\\/[^\\s]*)?$'
          + '|(^mailto:\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$)'
          + '|(^ftp://([a-z0-9]+:[a-z0-9]+@)?([\\.a-z0-9]+)/([\\./a-z0-9]+)$)'
          + '|(^$)',
    'iu',
  ),

  vectorPattern: new RegExp('CVSS:2.0/AV:(L|A|N)/AC:(H|M|L)/Au:(M|S|N)/C:(N|P|C)/I:(N|P|C)/A:(N|P|C)(/E:(U|POC|F|ND))?(/RL:(OF|TF|W|ND))?(/RC:(UC|UR|ND))?|'
  + '|CVSS:(3.0|3.1)/AV:(L|A|N|P)/AC:(H|L)/PR:(N|L|H)/UI:(N|R)/S:(U|C)/C:(H|L|N)/I:(H|L|N)/A:(H|L|N)(/E:(X|H|F|P|U))?(/RL:(X|U|W|T|O))?(/RC:(X|C|R|U))?'
  + '|(^$)'),

  datePattern: new RegExp('(^\\d\\d\\d\\d-[0-1]\\d-[0-3]\\d$)'
  + '|(^$)'),

  htmlPattern: new RegExp('</?[a-z][\\s\\S]*>'
  + '|(^$)'),

  attachmentPattern: new RegExp('^([0-9a-zA-Z+/]{4})*'
  + '(([0-9a-zA-Z+/]{2}==)'
  + '|([0-9a-zA-Z+/]{3}=))?$'),
});

module.exports = validationPattern;
