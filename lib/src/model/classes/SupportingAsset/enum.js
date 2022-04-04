const supportingAssetTypeEnum = Object.freeze({
  '': '',
  Database: 'Database',
  'Operating System': 'Operating System',
  'Application Server': 'Application Server',
  'Application module': 'Application module',
  File: 'File',
  Log: 'Log',
  'Web Service': 'Web Service',
  'Web User Interface': 'Web User Interface',
  'Remote API': 'Remote API',
  'Local API': 'Local API',
  'Crypto-Key': 'Crypto-Key',
  'Software application': 'Software application',
  'Service Provider': 'Service Provider',
  'Hardware device': 'Hardware device',
  Computer: 'Computer',
  Human: 'Human',
  Network: 'Network',
  Server: 'Server',
  'Source code': 'Source code',
  Organization: 'Organization',
  Location: 'Location',
  Process: 'Process',
  Interface: 'Interface',
});

const supportingAssetSecurityLevelEnum = Object.freeze({
  '-2': '-2',
  '-1': '-1',
  0: '0',
  1: '1',
  2: 2,
});

module.exports = { supportingAssetTypeEnum, supportingAssetSecurityLevelEnum };
