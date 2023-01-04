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

const jsonSchema = require('../../model/schema/json-schema');
const validationPattern = require('../../model/schema/validation-pattern/validation-pattern');

const ISRAmetaSchema = jsonSchema.properties.ISRAmeta.properties;

const renderWelcome = () => {
  const projectOrganization = ISRAmetaSchema.projectOrganization.anyOf;
  let projectOrganizationOptions = '';
  projectOrganization.forEach((e) => {
    projectOrganizationOptions += `<option value="${e.const}">${e.title}</option>`;
  });

  const html = `
  <div class="details">
    <header>${jsonSchema.title}</header>
    <p id="details__app-version">${ISRAmetaSchema.appVersion.title}: ${ISRAmetaSchema.appVersion.default}</p>
  </div>
  <div id="welcome__isra-meta">
    <label for="welcome__isra-meta--project-name">${ISRAmetaSchema.projectName.title}</label>
    <input type="text" id="welcome__isra-meta--project-name" name="welcome__isra-meta--project-name">
    <label for="welcome__isra-meta--project-version">${ISRAmetaSchema.projectVersion.title}</label>
    <input type="text" id="welcome__isra-meta--project-version" name="welcome__isra-meta--project-version">
    <label for="welcome__isra-meta--organization">${ISRAmetaSchema.projectOrganization.title}</label>
    <select name="welcome__isra-meta--organization" id="welcome__isra-meta--organization" required title="(Mandatory) ${ISRAmetaSchema.projectOrganization.description}">
      ${projectOrganizationOptions}
    </select>
  </div>
  <div id="welcome__isra-meta-tracking">
    <header>${ISRAmetaSchema.ISRAtracking.title}</header>
    <div class="add-delete-container">
      <button class="addDelete" id="welcome__isra-meta-tracking--add">Add</button> | <button  class="addDelete" id="welcome__isra-meta-tracking--delete">Delete</button>
    </div>
    <div class="table">
      <div id="welcome__isra-meta-tracking-table"></div>
    </div>
  </div>
  <article id="welcome__isra-meta-info">
    <header>Purpose and scope</header>
    <p style="text-align: center; font-size: 16px;">The risk is a combination of 5 dimensions.<br>
    Computing the risk level is based on the evaluation of each dimension.<br>
    The 5 dimensions are the <mark style="background-color: #92d050">Business Assets</mark>, the <mark style="background-color: #ffc000">Supporting Assets</mark>, the <mark style="background-color: #f37989">Vulnerabilities</mark>, the <mark style="background-color: #fad404">Threats</mark>, and the <mark style="background-color: #06090a; color: white">Threat Agent</mark>.
    </p>
    <img src="../../asset/welcome_diagram.png">

    <header>Terminology</header>
    <section>
        <p><span>Risk</span><br>
        The probable frequency and probable magnitude of future loss. ISO 27002 definition: Combination of the probability of an event and its consequence.
        </p>

        <p><span>Business Asset</span><br>
        Represents what makes value for the Customer or the organization . It can be information (sensitive data) or services (use case of the Solution). It is directly linked to the value chain the Solution aims to support, it is visible and makes sense to the Customer.
        </p>

        <p><span>Supporting Asset</span><br>
        Represents the means that are  needed to support and protect the value chain. It can be technical data, software, servers, network components, secure elements.
        </p>

        <p><span>Threat</span><br>
        Threats are anything that could cause harm to assets involved in the information security.
        </p>

        <p><span>Threat Agent</span><br>
        Threat Agent is the individual or the organization which is motivated to corrupt Business Assets (e.g. the government, the mafia, the insiders, the script-kiddies,…)
        </p>

        <p><span>Vulnerability</span><br>
        Vulnerability is any security breach or weakness (of a Supporting Asset), which can be exploited by a threat Agent (to compromise a Business Asset).
        </p>
    </section>

    <header>Methodology</header>
    <section>
      <p>The methodology is inspired by ISO 27005, STRIDE from Microsoft and CVSS (Common Vulnerability Scoring System).<br>
      The Security Risk Assessment is performed and owned by the Security Officer or Security Specialty Engineer with the help of Project Team and technical experts. 
      </p>

      <p>The risk assessment takes place in 3 different situations:
        <ul>
          <li>Use-case 1: Perform SRA on a new R&D Product
            <ul>
              <li>A new business opportunity is identified by Marketing. A totally new product is under study to address this opportunity. We need to know what is at risk (what must be protected).</li>
            </ul>
          </li><br>
          <li>Use-case 2: Perform SRA on a well-known Product (new version)
            <ul>
              <li>A new version of an R&D Product is under study. Based on the Risks assessed during the previous release of the Product, we need to know what risks will change (risk level, new risks, risks cancelled).</li>
            </ul>
          </li><br>
          <li>Use-case 3: Perform SRA of a Product in customer context (reassessment)
              <ul>
                <li>An R&D Product is used without any customization, inside a datacenter operated by the organization or at Customer's premises.</li>
                <li>The Risks have been previously assessed based on R&D assumptions, we need to know what risks will change (risk level, new risks, risks cancelled) in the Customer context.</li>
              </ul>
          </li><br>
        </ul>
      </p>

      <p><span>1. Use-case 1: Perform SRA on a new R&D Product</span></p>
      <p>We can consider 2 main phases:
        <ul>
          <li>the identification of the threats (aka threat modeling)</li>
          <li>the risk assessment</li>
        </ul>
      </p>
      <p>You have to keep in mind that risk assessment is usually based on an iterative approach: for instance some new threats, not identified during the threat modeling phase, could appear during the risk assessment phase.</p>

      <p><span>Threat modeling</span></p>
      <p>The threat modeling phase can take advantage of existing tools like Microsoft Threat Modeling tool. Usually the threat modeling phase starts with the description of:
        <ul>
          <li>the technical architecture of your solution</li>
          <li>the use-cases: nominals and non-nominals</li>
          <li>the inputs and outputs of each identified service</li>
        </ul>
      </p>
      <p>The threat modeling can be done with or without an external tool. The decision to use a threat modeling tool depends on 2 criteria:
        <ul>
          <li>the maturity of your organization about risk management: you are not familiar with any threat modeling tool</li>
          <li>the result of the TLOT assessment: if the TLOT is low it may not be necessary to use a threat modeling tool.</li>
        </ul>
      </p>

      <p><span>Security Risk Assessment</span></p>
      <p>Taking into account that the threat modeling phase has been done then we can consider 3 phases to perform a risk assessment:
        <ul>
          <li>Identify business assets</li>
          <li>Propose controls</li>
          <li>Manage risks</li>
          <br>
        </ul>
      </p>

      <p>
        <ol type="i">
          <li><span>Step 1: Identify business assets</span>
            <br>
            <p>During this phase we should have identified:
              <ul>
                <li>business assets</li>
                <li>supporting assets (coming from threat modeling phase)</li>
                <li>threats agents / attackers (coming from threat modeling phase)</li>
                <li>threats (coming from threat modeling phase)</li>
                <li>vulnerabilities (coming from threat modeling phase)</li>
              </ul>
            </p>
          </li>
          <p>Using the inputs above it is already possible to define a raw risk based on the impact and the likelihood.</p>
          <p>But in reality there are already some counter-measures in place in your solution e.g. an authentication method, a firewall, a WAF or inputs controls. As a consequence the measured risk is not a pure "raw risk". This is why we recommend to list the hypothesis that the assessor is taking into account to score the raw risk, including  the existing controls / counter-measures.</p>
          <p>Each organization is in charge to define the threshold of the risk value that will trigger a risk treatment.</p>
          <p>At this point we have a list of risks to treat based on the defined threshold.</p>  
        </ol>
      </p>

      <p>
        <ol type="i">
          <li><span>Step 2: Propose controls</span>
            <br>
            <p>During this phase the assessor will identify which treatment is the best suited for each risk. The assessor can choose between the following treatments:
              <ul>
                <li>avoid / eliminate the risk</li>
                <li>transfer / share  the risk</li>
                <li>accept  the risk</li>
                <li>reduce / mitigate the risk</li>
              </ul>
            </p>
          </li>
          <p>The risk reduction requires that the assessor defines a list of controls / counter-measures. Each counter-measure is identified on a supporting asset in order to mitigate a vulnerability. The cost of the implementation of the counter-measure must be identified as this criteria is key for the final decision to implement or not the counter-measure.</p>
          <p>The raw risk is reduced to a residual risk taking into account the counter-measures.</p>
          <p>At this point we have a list of treatments associated to each risk, the cost of each treatment and the residual risk.</p>
        </ol>
      </p>

      <p>
        <ol type="i">
          <span>Step 3: Manage risks</span>
          <p>The last step consists to present the result of the risk analysis to decision-makers.
          At this point we will have the counter-measures to implement.</p>
          <p>If there is no agreement or a partial agreement on the treatment then the assessor can jump to step 2 and propose new controls.</p>
        </ol>
      </p>
  
      <p><span>2. Use-case 2: Perform SRA on a well-known Product (new version)</span>
        <p>We can consider 3 phases:</p>
        <ul>
          <li>Retrieve the risks dashboard of the previous release of the Product (make sure it is accurate vs the countermeasures implementation)</li>
          <li>Update security dimensions such as Assets, Threats and Vulnerabilities (what is new, what is changing, what is no more applicable).</li>
          <li>Provides a dashboard of main risks with associated risk level computed based on security dimensions scoring</li>
        </ul>
        <p>Based on the changes of this new version, it may be necessary to complete the Threat Modeling phase, as defined in "Use-case 1". The Security Risk Assessment phase, as defined in "Use-case 1", remains the same.</p>
      </p>
  
      <p><span>3. Use-case 3: Perform SRA of a Product in customer context (reassessment)</span>
        <p>Same as "Use-case 2".</p>
      </p>
    </section>

  </article>
  <footer></footer>`;

  const ISRATrackingSchema = ISRAmetaSchema.ISRAtracking.items.properties;
  const tableOptions = {
    layout: 'fitColumns',
    height: '100%',
    index: 'trackingIteration',
    columns: [ // Define Table Columns
      {
        title: 'Delete?', field: 'Welcome Checkbox', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true, width: 80
      },
      {
        title: `${ISRATrackingSchema.trackingIteration.title}`, field: 'trackingIteration', width: 100, headerSort: false, tooltip: `${ISRATrackingSchema.trackingIteration.description}`, headerHozAlign: 'center', validator: 'integer',
      },
      {
        title: `${ISRATrackingSchema.trackingSecurityOfficer.title}`, field: 'trackingSecurityOfficer', editor: 'input', headerSort: false, tooltip: `${ISRATrackingSchema.trackingSecurityOfficer.description}`, headerHozAlign: 'center',
      },
      {
        title: `${ISRATrackingSchema.trackingDate.title}`,
        field: 'trackingDate',
        editor: 'input',
        headerSort: false,
        validator: [ISRATrackingSchema.trackingDate.type, `regex:${validationPattern.datePattern.toString().slice(1, -1)}`],
        headerHozAlign: 'center',
      },
      {
        title: `${ISRATrackingSchema.trackingComment.title}`, field: 'trackingComment', editor: 'input', headerSort: false, tooltip: `${ISRATrackingSchema.trackingComment.description}`, headerHozAlign: 'center',
      },
    ],
  };

  return [html, tableOptions];
};

module.exports = {
  renderWelcome,
};
