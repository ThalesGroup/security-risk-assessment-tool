/*----------------------------------------------------------------------------
*
*     Copyright © 2022 THALES. All Rights Reserved.
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

// Unit tests for renderWelcome() — Issue #81 column width fix

const { renderWelcome } = require('../../../src/api/ISRAProject/render-welcome');

describe('renderWelcome() — Iterations History table column widths (Issue #81)', () => {
  let html;
  let tableOptions;

  beforeAll(() => {
    const result = renderWelcome();
    [html, tableOptions] = result;
  });

  test('renderWelcome returns an array of length 2', () => {
    const result = renderWelcome();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  test('renderWelcome returns an html string as first element', () => {
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  test('renderWelcome returns a tableOptions object as second element', () => {
    expect(typeof tableOptions).toBe('object');
    expect(tableOptions).not.toBeNull();
  });

  test('table layout is fitColumns', () => {
    expect(tableOptions.layout).toBe('fitColumns');
  });

  test('tableOptions has a columns array', () => {
    expect(Array.isArray(tableOptions.columns)).toBe(true);
    expect(tableOptions.columns.length).toBeGreaterThan(0);
  });

  test('trackingDate column has explicit width of 120', () => {
    const trackingDateCol = tableOptions.columns.find(
      (col) => col.field === 'trackingDate'
    );
    expect(trackingDateCol).toBeDefined();
    expect(trackingDateCol.width).toBe(120);
  });

  test('trackingComment column has no explicit width property', () => {
    const trackingCommentCol = tableOptions.columns.find(
      (col) => col.field === 'trackingComment'
    );
    expect(trackingCommentCol).toBeDefined();
    expect(trackingCommentCol.width).toBeUndefined();
  });

  test('trackingDate column width (120) is greater than trackingIteration width (100)', () => {
    const trackingDateCol = tableOptions.columns.find(
      (col) => col.field === 'trackingDate'
    );
    const trackingIterationCol = tableOptions.columns.find(
      (col) => col.field === 'trackingIteration'
    );
    expect(trackingDateCol).toBeDefined();
    expect(trackingIterationCol).toBeDefined();
    expect(trackingDateCol.width).toBeGreaterThanOrEqual(trackingIterationCol.width);
  });

  test('trackingDate column is narrower than or equal to a reasonable max for YYYY-MM-DD format', () => {
    const trackingDateCol = tableOptions.columns.find(
      (col) => col.field === 'trackingDate'
    );
    // YYYY-MM-DD is 10 chars; 120px is proportional with padding
    expect(trackingDateCol.width).toBeLessThanOrEqual(150);
    expect(trackingDateCol.width).toBeGreaterThanOrEqual(100);
  });
});
