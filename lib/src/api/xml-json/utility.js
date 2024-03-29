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

    const getPosition = (string, subString, index) => string
      .split(subString, index).join(subString).length;

    const htmlString = xmlData.substring(
      getPosition(xmlData, `<my:${xmlElement}>`, occurrence) + 5 + xmlElement.length,
      getPosition(xmlData, `</my:${xmlElement}>`, occurrence),
    );

    // handling images
    if (htmlString.includes('xd:inline="')) {
      const imgCount = htmlString.match(/xd:inline="/g).length;
      let regex = [];

      for (let i = 1; i <= imgCount; i += 1) {
        const replaceString = htmlString.substring(
          getPosition(htmlString, 'msoinline/', i),
          getPosition(htmlString, 'xd:inline="', i) + 11,
        );
        regex.push(replaceString);
      }
      regex = regex.join('|');
      return htmlString.replace(new RegExp(regex, 'g'), 'data:image/png;base64,');
    }

    // handling rich text with no HTML tags
    if (!isValidHtml(htmlString)) {
      return `<div>${htmlString}</div>`;
    }

    // remove line breaks
    return htmlString.replace(/(\r\n|\n|\r|\t)/gm, '');
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
