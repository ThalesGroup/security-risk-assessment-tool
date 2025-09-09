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

const metricsCVSSV2 = require('./const/cvssv2-const');
const { encodeFile } = require('../encode-file');

// used by xml-json api
const utility = (() => {
  // convert rich text (eg. div, strong, li, etc.) to HTML string
  const richText2HTMLString = (xmlData, xmlElement, occurrence) => {
    // checks for presence of HTML elements
    const isValidHtml = (string) => /<\/?[a-z][\s\S]*>|(^$)/.test(string);

    // match either a paired tag <my:tag>...</my:tag> or a self-closing tag <my:tag .../>
    // capture group 1 is the whole paired match, group 2 is the inner HTML for the paired form
    const pattern = new RegExp(
      `<my:${xmlElement}>([\\s\\S]*?)</my:${xmlElement}>|<my:${xmlElement}(?:\\s[^>]*)?\\/>`,
      'g'
    );

    let i = 0;
    let match;

    while ((match = pattern.exec(xmlData))) {
      i += 1;
      if (i !== occurrence) continue;

      const inner = match[1] || ''; // paired gives inner HTML in group 1, self-closing gives undefined

      // handling images
      if (inner.includes('xd:inline="')) {
        // helper for substring boundaries
        const getPosition = (str, sub, idx) => str.split(sub, idx).join(sub).length;

        const imgCount = (inner.match(/xd:inline="/g) || []).length;
        let regexPieces = [];

        for (let k = 1; k <= imgCount; k += 1) {
          const start = getPosition(inner, 'msoinline/', k);
          const end = getPosition(inner, 'xd:inline="', k) + 11; 
          regexPieces.push(inner.substring(start, end));
        }

        if (regexPieces.length > 0) {
          const needle = new RegExp(regexPieces.join('|'), 'g');
          return inner.replace(needle, 'data:image/png;base64,');
        }
      }

      // handling rich text with no HTML tags
      if (!isValidHtml(inner)) {
        return `<div>${inner}</div>`;
      }

      // remove line breaks
      return inner.replace(/(\r\n|\n|\r|\t)/gm, '');
    }

    // if the requested occurrence does not exist
    return '';
  };

  // get cvssv2 vector string
  const scores2vectorCVSSV2 = (baseMetrics) => {
    const metrics = ['/AV:', '/AC:', '/Au:', '/C:', '/I:', '/A:', '/E:', '/RL:', '/RC:'];
    const metricsNames = [];

    Object.keys(baseMetrics).forEach((baseMetricKey) => {
      const metricValue = Number(baseMetrics[baseMetricKey][0]);
      const metricName = metricsCVSSV2[baseMetricKey]
        .filter((metric) => metric.value === metricValue)[0].name;
      metricsNames.push(metricName);
    });
    const vectorArr = metricsNames.map((name, index) => metrics[index] + name);
    const vector = vectorArr.reduce((previous, curent) => previous + curent);
    return `CVSS:2.0${vector}`;
  };

  const getDecodedXMLFileAttachment = (xmlEncodedData) => {
    // file is from xml and uses old decoding method
    const buffer = Buffer.from(xmlEncodedData, 'base64');
    const fileNameLength = buffer.readUInt32LE(20);
    const binary = buffer.slice(24 + fileNameLength * 2);
    const fileName = buffer.toString('utf16le', 24, 24 + fileNameLength * 2).slice(0, -1);

    // encode file with new method
    const base64data = encodeFile(fileName, binary);
    return base64data;
  };

  return {
    getHTMLString: (xmlData, xmlElement, occurrence = 1) => richText2HTMLString(
      xmlData,
      xmlElement,
      occurrence,
    ),
    getVectorCVSSV2: (baseMetrics) => scores2vectorCVSSV2(baseMetrics),
    getDecodedXMLFileAttachment: (xmlEncodedData) => getDecodedXMLFileAttachment(xmlEncodedData)
  };
})();

module.exports = utility;
