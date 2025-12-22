/*----------------------------------------------------------------------------
*
*     Copyright © 2025 THALES. All Rights Reserved.
*
* -----------------------------------------------------------------------------
* THALES MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF
* THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
* TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
* PARTICULAR PURPOSE, OR NON-INFRINGEMENT. THALES SHALL NOT BE
* LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING,
* MODIFYING OR DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
*
* THIS SOFTWARE IS NOT DESIGNED OR INTENDED FOR USE OR RESALE AS ON-LINE
* CONTROL EQUIPMENT IN HAZARDOUS ENVIRONMENTS REQUIRING FAIL-SAFE
* PERFORMANCE, SUCH AS IN THE OPERATION OF NUCLEAR FACILITIES, AIRCRAFT
* NAVIGATION OR COMMUNICATION SYSTEMS, AIR TRAFFIC CONTROL, DIRECT LIFE
* SUPPORT MACHINES, OR WEAPONS SYSTEMS, IN WHICH THE FAILURE OF THE
* SOFTWARE COULD LEAD DIRECTLY TO DEATH, PERSONAL INJURY, OR SEVERE
* PHYSICAL OR ENVIRONMENTAL DAMAGE ("HIGH RISK ACTIVITIES"). THALES
* SPECIFICALLY DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTY OF FITNESS FOR
* HIGH RISK ACTIVITIES.
* -----------------------------------------------------------------------------
*/

const { URLpattern } = require('../../../src/model/schema/validation-pattern/validation-pattern');

describe('URLpattern validation', () => {
  const validSamples = [
    '',
    'https://google.com',
    'http://sub.domain.co.uk/path?x=1#hash',
    'https://mañana.es',
    'https://api.example.com:8443/resource/id',
    'http://demo-site.com/some%20encoded%20path',
    'ftp://server.example.org/files/data.txt',
    'mailto:user@example.com',
    'mailto:firstname.lastname+tag@sub.domain.net',
    'tel:+1234567890',
    'tel:+1-800-555-1234',
    'tel:(123) 456-7890',
    'tel:+-()',
    'urn:oid:1.2.3.4.5',
    'urn:example:foo-bar/baz',
    'urn:uuid:123e4567-e89b-12d3-a456-426614174000',
  ];

  test.each(validSamples)('accepts valid value "%s"', (value) => {
    expect(URLpattern.test(value)).toBe(true);
  });

  const invalidSamples = [
    ['http://localhost', 'missing top-level domain'],
    ['http://intranet', 'single label host'],
    ['http:///only/path', 'missing host'],
    ['htt://google.com', 'typo in scheme'],
    ['https://exa mple.com', 'space in hostname'],
    ['https://example.com:1', 'port too short'],
    ['https://example.com:abc', 'non numeric port'],
    ['ftp://', 'ftp missing host'],
    ['ftp://host', 'ftp missing TLD'],
    ['mailto:userexample.com', 'mailto missing at sign'],
    ['mailto:user@', 'mailto missing domain'],
    ['tel:+12345abc', 'telephone includes letters'],
    ['tel:', 'telephone missing number'],
    ['urn:-bad:abc', 'URN namespace cannot start with dash'],
    ['urn:example:', 'URN NSS empty'],
    ['urn:example:foo bar', 'URN contains whitespace'],
    ['data:text/plain,hello', 'unsupported scheme'],
    ['just some text', 'not a URL'],
    ['   ', 'whitespace only'],
  ];

  test.each(invalidSamples)('rejects invalid value "%s" (%s)', (value) => {
    expect(URLpattern.test(value)).toBe(false);
  });
});
