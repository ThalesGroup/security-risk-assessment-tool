const { URLpattern } = require('../../../model/schema/validation-pattern/validation-pattern');

const sanitizeTrackingURI = (uri) => {
  if (typeof uri !== 'string') return '';
  const trimmed = uri.trim();
  if (trimmed === '') return '';
  return URLpattern.test(trimmed) ? trimmed : '';
};

module.exports = {
  sanitizeTrackingURI,
};

