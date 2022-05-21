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

const projCxtJsonSchema = require('../../../../lib/src/model/schema/json-schema').properties.ProjectContext.properties;

const renderProjectContext = () => {
  const html = `<p class="heading">Project Context</p>
  <div class="section" id="project-description">
    <p class="subheading">${projCxtJsonSchema.projectDescription.title}</p>
    <p class="summary">${projCxtJsonSchema.projectDescription.description}</p>
    <div class="btn btn-primary tooltip">
      <textarea class="rich-text" id="project-description__text" name="project-description__text"></textarea>
      <div class="top">
          <p>Add your formatted rich text and your pictures.</p>
          <i></i>
      </div>
    </div>
    <div id="project-description__upload">
      <div id="project-description__url">
        <p>${projCxtJsonSchema.projectURL.title}</p>
        <div class = 'hyperlink-attachment-align'>
          <img class='hyperlink-attachment-image' id= "project-description__url__image" src="./asset/link.png" alt="Hyperlink:" >
          <p id="project-description__url__insert" style="margin-top: 0px;" >${projCxtJsonSchema.projectURL.description}</p>
          <a id="project-description__url__hyperlink" href=" " hidden></a>
        </div>
      </div>
      <div id="project-description__attachment">
        <p>${projCxtJsonSchema.projectDescriptionAttachment.title}</p>
        <div class = 'hyperlink-attachment-align'>
          <img class= 'hyperlink-attachment-image' id= "project-description__file__image" src="./asset/link.png" alt="File:">
          <p id="project-description__file__insert" style="margin-top: 0px;">${projCxtJsonSchema.projectDescriptionAttachment.description}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="section" id="project-objectives">
    <p class="subheading">${projCxtJsonSchema.securityProjectObjectives.title}</p>
    <p class="summary">${projCxtJsonSchema.securityProjectObjectives.description}</p>
    <div class="btn btn-primary tooltip">
      <textarea class="rich-text" id="project-objectives__text" name="project-objectives__text"></textarea>
      <div class="top">
          <p>Add your formatted rich text and your pictures.</p>
          <i></i>
      </div> 
    </div>
  </div>

  <div class="section" id="officer-objectives">
    <p class="subheading">${projCxtJsonSchema.securityOfficerObjectives.title}</p>
    <p class="summary">${projCxtJsonSchema.securityOfficerObjectives.description}</p>
    <div class="btn btn-primary tooltip">
      <textarea class="rich-text" id="officer-objectives__text" name="officer-objectives__text"></textarea>
      <div class="top">
          <p>Add your formatted rich text and your pictures.</p>
          <i></i>
      </div>
    </div>
  </div>

  <div class="section" id="assumptions">
    <p class="subheading">${projCxtJsonSchema.securityAssumptions.title}</p>
    <p class="summary">${projCxtJsonSchema.securityAssumptions.description}</p>
    <div class="btn btn-primary tooltip">
      <textarea class="rich-text" id="assumptions__text" name="assumptions__text"></textarea>
      <div class="top">
          <p>Add your formatted rich text and your pictures.</p>
          <i></i>
      </div>
    </div>
  </div>`;

  return [html];
};

module.exports = {
  renderProjectContext,
};
