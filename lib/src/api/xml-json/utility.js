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

const utility = () => {
  const array2Object = (property = {}) => {
    if (Array.isArray(property)) {
      return property.reduce((object, value) => {
        const obj = object;
        obj[value] = value;
        return obj;
      });
    }
    return property;
  };

  const getPosition = (string, subString, index) => string
    .split(subString, index).join(subString).length;

  // convert rich text (eg. div, strong, li, etc.) to HTML string
  const richText2HTMLString = (xmlData, xmlElement, occurrence) => {
    const htmlString = xmlData.substring(
      getPosition(xmlData, `<my:${xmlElement}>`, occurrence) + 5 + xmlElement.length,
      getPosition(xmlData, `</my:${xmlElement}>`, occurrence),
    );

    // handling images
    if (htmlString.includes('xd:inline="')) {
      const imgCount = (htmlString.match(/xd:inline="/g || [])).length;
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

    // remove line breaks
    return htmlString.replace(/(\r\n|\n|\r|\t)/gm, '');
  };

  const metrics = ['/AV:', '/AC:', '/Au:', '/C:', '/I:', '/A:', '/E:', '/RL:', '/RC:'];
  const metricsNames = [];

  // get cvssv2 vector string
  const scores2vectorCVSSV2 = (baseMetrics) => {
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

  return {
    arr2Obj: (property) => array2Object(property),
    getHTMLString: (xmlData, xmlElement, occurrence = 1) => richText2HTMLString(
      xmlData,
      xmlElement,
      occurrence,
    ),
    getVectorCVSSV2: (baseMetrics) => scores2vectorCVSSV2(baseMetrics),
  };
};

module.exports = utility;
