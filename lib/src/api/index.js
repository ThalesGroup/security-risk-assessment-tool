const DataStore = require('./data-store/index');
const DataEncrypt = require('./data-encrypt/index');
const XML2JSON = require('./xml-json/index');
const IsEncrypted = require('./check-encryption/index');
const DataLoad = require('./data-load/index');
const DataNew = require('./data-new');

module.exports = {
  DataStore,
  DataEncrypt,
  XML2JSON,
  IsEncrypted,
  DataLoad,
  DataNew,
};
