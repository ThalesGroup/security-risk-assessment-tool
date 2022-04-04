const threatAgentEnum = Object.freeze({
  '': '',
  Criminal: 'Criminal',
  Competitor: 'Competitor',
  'Criminal organization': 'Criminal organization',
  'Government agency': 'Government agency',
  Researcher: 'Researcher',
  Activist: 'Activist',
  'Script Kiddy': 'Script Kiddy',
  User: 'User',
  'R&D Employee': 'R&D Employee',
  'Operationnal Employee': 'Operationnal Employee',
  'Maintenance Employee': 'Maintenance Employee',
  'IT Employee': 'IT Employee',
});

const threatVerbEnum = Object.freeze({
  '': '',
  lose: 'lose',
  spoof: 'spoof',
  'tamper with': 'tamper with',
  repudiate: 'repudiate',
  disclose: 'disclose',
  steal: 'steal',
  'deny access to': 'deny access to',
  'gain an unauthorized access to': 'gain an unauthorized access to',
  flood: 'flood',
});

const riskLikelihoodEnum = Object.freeze({
  1: '1',
  2: '2',
  3: '3',
  4: '4',
});

const skillLevelEnum = Object.freeze({
  1: '1',
  3: '3',
  5: '5',
  6: '6',
  9: '9',
});

const rewardEnum = Object.freeze({
  1: '1',
  4: '4',
  9: '9',
});

const accessResourcesEnum = Object.freeze({
  0: '0',
  4: '4',
  7: '7',
  9: '9',
});

const sizeEnum = Object.freeze({
  2: '2',
  4: '4',
  5: '5',
  6: '6',
  9: '9',
});

const intrusionDetectionEnum = Object.freeze({
  1: '1',
  3: '3',
  8: '8',
  9: '9',
});

const threatFactorLevelEnum = Object.freeze({
  '': '',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  'Very High': 'Very High',
});

const occurrenceEnum = Object.freeze({
  1: '1',
  3: '3',
  5: '5',
  7: '7',
  9: '9',
});

const occurrenceLevelEnum = Object.freeze({
  '': '',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  'Very High': 'Very High',
});

const businessAssetFlagEnum = Object.freeze({
  0: '0',
  1: '1',
});

const benefitsEnum = Object.freeze({
  0: '0',
  0.1: '0.1',
  0.25: '0.25',
  0.5: '0.5',
  0.75: '0.75',
  0.9: '0.9',
  1: '1',
});

const decisionEnum = Object.freeze({
  '': '',
  Rejected: 'Rejected',
  Accepted: 'Accepted',
  Postphoned: 'Postphoned',
  Done: 'Done',
});

const riskManagementDecisionEnum = Object.freeze({
  '': '',
  Discarded: 'Discarded',
  Avoid: 'Avoid',
  Transfer: 'Transfer',
  Mitigate: 'Mitigate',
  Accept: 'Accept',
});

const residualRiskLevelEnum = Object.freeze({
  '': '',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Critical: 'Critical',
});

module.exports = {
  threatAgentEnum,
  threatVerbEnum,
  riskLikelihoodEnum,
  skillLevelEnum,
  rewardEnum,
  accessResourcesEnum,
  sizeEnum,
  intrusionDetectionEnum,
  threatFactorLevelEnum,
  occurrenceEnum,
  occurrenceLevelEnum,
  businessAssetFlagEnum,
  benefitsEnum,
  decisionEnum,
  riskManagementDecisionEnum,
  residualRiskLevelEnum,
};
