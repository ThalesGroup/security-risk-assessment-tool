const {
  URLpattern,
  vectorPattern,
  datePattern,
  htmlPattern,
  attachmentPattern,
} = require('./validation-pattern');

const validation = (() => {
  const isValidDate = (date) => datePattern.test(date);
  const isValidHtml = (string) => htmlPattern.test(string);
  const isValidAttachment = (attachment) => attachmentPattern.test(attachment);
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
