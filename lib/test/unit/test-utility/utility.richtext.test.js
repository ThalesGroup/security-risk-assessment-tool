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

// Purpose: unit tests for getHTMLString handling of empty and self-closing tags
// Focus: ensures no cascading misalignment when consecutive empty elements appear

const path = require('path');

const { getHTMLString } = require('../../../src/api/xml-json/utility');

describe('getHTMLString rich-text extraction is robust for empty and self-closing elements', () => {
  // Minimal XML that reproduces the bug without any file I/O
  // Namespaces are simplified and consistent with "my:" usage
  const xml = `
    <my:Root xmlns:my="http://example.com/my">
      <my:Mitigations>
        <!-- Case set A: non-empty, self-closing, non-empty -->
        <my:Mitigation>
          <my:description>
            <div xmlns="http://www.w3.org/1999/xhtml">Desc A1</div>
          </my:description>
          <my:decisionDetail>
            <div xmlns="http://www.w3.org/1999/xhtml">Detail A1</div>
          </my:decisionDetail>
        </my:Mitigation>

        <my:Mitigation>
          <my:description/>
          <my:decisionDetail/>
        </my:Mitigation>

        <my:Mitigation>
          <my:description>
            <div xmlns="http://www.w3.org/1999/xhtml">Desc A3</div>
          </my:description>
          <my:decisionDetail>
            <div xmlns="http://www.w3.org/1999/xhtml">Detail A3</div>
          </my:decisionDetail>
        </my:Mitigation>

        <!-- Case set B: two consecutive empty pairs, then a non-empty -->
        <my:Mitigation>
          <my:description></my:description>
          <my:decisionDetail></my:decisionDetail>
        </my:Mitigation>

        <my:Mitigation>
          <my:description></my:description>
          <my:decisionDetail></my:decisionDetail>
        </my:Mitigation>

        <my:Mitigation>
          <my:description>
            <div xmlns="http://www.w3.org/1999/xhtml">Desc B3</div>
          </my:description>
          <my:decisionDetail data-id="x">
            <div xmlns="http://www.w3.org/1999/xhtml">Detail B3</div>
          </my:decisionDetail>
        </my:Mitigation>

        <!-- Extra noise to ensure the nth-match is scoped to the element name, not Mitigation boundaries -->
        <my:Mitigation>
          <my:description>
            <div xmlns="http://www.w3.org/1999/xhtml">Desc C1</div>
          </my:description>
          <my:decisionDetail/>
        </my:Mitigation>
      </my:Mitigations>
    </my:Root>
  `;

  describe('decisionDetail extraction by ordinal occurrence', () => {
    test('first occurrence non-empty is preserved with its XHTML wrapper', () => {
      const first = getHTMLString(xml, 'decisionDetail', 1);
      expect(first).toBe('<div xmlns="http://www.w3.org/1999/xhtml">Detail A1</div>');
    });

    test('second occurrence self-closing yields empty string', () => {
      const second = getHTMLString(xml, 'decisionDetail', 2);
      expect(second).toBe('');
    });

    test('third occurrence non-empty does not leak into the second', () => {
      const third = getHTMLString(xml, 'decisionDetail', 3);
      expect(third).toBe('<div xmlns="http://www.w3.org/1999/xhtml">Detail A3</div>');
    });

    test('fourth occurrence empty pair yields empty string', () => {
      const fourth = getHTMLString(xml, 'decisionDetail', 4);
      expect(fourth).toBe('');
    });

    test('fifth occurrence empty pair yields empty string and does not pick up the sixth', () => {
      const fifth = getHTMLString(xml, 'decisionDetail', 5);
      expect(fifth).toBe('');
    });

    test('sixth occurrence non-empty is correctly returned', () => {
      const sixth = getHTMLString(xml, 'decisionDetail', 6);
      expect(sixth).toBe('<div xmlns="http://www.w3.org/1999/xhtml">Detail B3</div>');
    });

    test('seventh occurrence self-closing is empty', () => {
      const seventh = getHTMLString(xml, 'decisionDetail', 7);
      expect(seventh).toBe('');
    });
  });

  describe('description extraction uses the same logic and stays independent', () => {
    test('description 1 non-empty', () => {
      const v = getHTMLString(xml, 'description', 1);
      expect(v).toBe('<div xmlns="http://www.w3.org/1999/xhtml">Desc A1</div>');
    });

    test('description 2 self-closing is empty', () => {
      const v = getHTMLString(xml, 'description', 2);
      expect(v).toBe('');
    });

    test('description 3 non-empty unaffected by the empty second', () => {
      const v = getHTMLString(xml, 'description', 3);
      expect(v).toBe('<div xmlns="http://www.w3.org/1999/xhtml">Desc A3</div>');
    });

    test('description 4 empty pair is empty', () => {
      const v = getHTMLString(xml, 'description', 4);
      expect(v).toBe('');
    });

    test('description 5 empty pair is empty and does not leak the sixth', () => {
      const v = getHTMLString(xml, 'description', 5);
      expect(v).toBe('');
    });

    test('description 6 non-empty', () => {
      const v = getHTMLString(xml, 'description', 6);
      expect(v).toBe('<div xmlns="http://www.w3.org/1999/xhtml">Desc B3</div>');
    });

    test('description 7 non-empty', () => {
      const v = getHTMLString(xml, 'description', 7);
      expect(v).toBe('<div xmlns="http://www.w3.org/1999/xhtml">Desc C1</div>');
    });
  });

  describe('whitespace and attributes do not break parsing', () => {
    test('self-closing with attributes remains empty', () => {
      // Our sixth decisionDetail had an attribute on the enclosing tag, but content was non-empty there.
      // Here we check a purely self-closing with attributes scenario.
      const xmlWithAttr = `
        <my:Root xmlns:my="http://example.com/my">
          <my:Mitigation>
            <my:decisionDetail data-id="abc" />
          </my:Mitigation>
        </my:Root>
      `;
      const v = getHTMLString(xmlWithAttr, 'decisionDetail', 1);
      expect(v).toBe('');
    });

    test('empty pair with whitespace yields empty', () => {
      const xmlData = `
        <my:Root xmlns:my="http://example.com/my">
          <my:Mitigation>
            <my:decisionDetail>
              
            </my:decisionDetail>
          </my:Mitigation>
        </my:Root>
      `;
      const v = getHTMLString(xmlData, 'decisionDetail', 1);
      expect(v).toBe('');
    });

    test('div test', () => {
      const xmlData = `
        <my:Root xmlns:my="http://example.com/my">
          <my:Mitigation>
            <my:decisionDetail>Hi</my:decisionDetail>
          </my:Mitigation>
        </my:Root>
      `;
      const v = getHTMLString(xmlData, 'decisionDetail', 1);
      expect(v).toBe('<div>Hi</div>');
    });

    test('whitespace test', () => {
      const xmlData = `
        <my:Root xmlns:my="http://example.com/my">
          <my:Mitigation>
            <my:decisionDetail>        </my:decisionDetail>
          </my:Mitigation>
        </my:Root>
      `;
      const v = getHTMLString(xmlData, 'decisionDetail', 1);
      expect(v).toBe('');
    });

    test('Case Sensitivity test', () => {
      const xmlData = `
        <my:Root xmlns:my="http://example.com/my">
          <my:Mitigation>
            <my:decisionDetail>
              <div xmlns="http://www.w3.org/1999/xhtml">Desc C1</div>
            </my:decisionDetail>
          </my:Mitigation>
        </my:Root>
      `;
      const v = getHTMLString(xmlData, 'DecisionDetail', 1);
      expect(v).toBe('');
    });

    test('Invalid xmlElement test', () => {
      const xmlData = `
        <my:Root xmlns:my="http://example.com/my">
          <my:Mitigation>
            <my:decisionDetail>
              <div xmlns="http://www.w3.org/1999/xhtml">Desc C1</div>
            </my:decisionDetail>
          </my:Mitigation>
        </my:Root>
      `;
      const v = getHTMLString(xmlData, 'invalidElement', 1);
      expect(v).toBe('');
    });
  });
});
