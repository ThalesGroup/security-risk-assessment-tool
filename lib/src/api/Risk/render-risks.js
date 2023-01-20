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
const jsonSchema = require('../../model/schema/json-schema').properties.Risk;
const riskJsonSchema = jsonSchema.items.properties;
const riskNameJsonSchema = riskJsonSchema.riskName.properties;
const riskLikelihoodJsonSchema = riskJsonSchema.riskLikelihood.properties;
const riskImpactJsonSchema = riskJsonSchema.riskImpact;
const riskAttackPathsJsonSchema = riskJsonSchema.riskAttackPaths;
const riskMitigationJsonSchema = riskJsonSchema.riskMitigation;
const riskManagementDecisionJsonSchema = riskJsonSchema.riskManagementDecision;

const renderRisks = () => {
  let threatAgentOptions = '', threatVerbOptions = '', 
    riskLikelihoodOptions = '', skillLevelOptions = '', rewardOptions = '', accessResourcesOptions = '',
    sizeOptions = '', intrusionDetectionOptions = '', occurrenceOptions = '', decisonOptions = '';

  const addEnumOptions = (list) => {
    let optionsStr = '';
    list.forEach((option) => {
      if (option === '') optionsStr += `<option value="${option}">Select...</option>`;
      else optionsStr += `<option value="${option}">${option}</option>`;
    });
    return optionsStr;
  };

  const addConstOptions = (list) => {
    let optionsStr = '';
    list.forEach((option) => {
      if (option.title) optionsStr += `<option value="${option.const}">${option.title}</option>`;
      else optionsStr += `<option value="${option.const}">Select...</option>`;
    });
    return optionsStr;
  }

  threatAgentOptions = addEnumOptions(riskNameJsonSchema.threatAgent.enum);
  threatVerbOptions = addEnumOptions(riskNameJsonSchema.threatVerb.enum);

  riskLikelihoodJsonSchema.riskLikelihood.anyOf.forEach((option) => {
    if (option.title) riskLikelihoodOptions += `<option value="${option.const}">${option.title}</option>`;
  });

  skillLevelOptions = addConstOptions(riskLikelihoodJsonSchema.skillLevel.anyOf);
  rewardOptions = addConstOptions(riskLikelihoodJsonSchema.reward.anyOf);
  accessResourcesOptions = addConstOptions(riskLikelihoodJsonSchema.accessResources.anyOf);
  sizeOptions = addConstOptions(riskLikelihoodJsonSchema.size.anyOf);
  intrusionDetectionOptions = addConstOptions(riskLikelihoodJsonSchema.intrusionDetection.anyOf);
  occurrenceOptions = addConstOptions(riskLikelihoodJsonSchema.occurrence.anyOf);

  riskManagementDecisionJsonSchema.anyOf.forEach((option) => {
    decisonOptions += `<input type="radio" name="risk__management__decision" value="${option.const}">
                    <label id="Mitigate" name="${option.title}">${option.title}</label>
                    <br>`;
    if (option.const === 'Discarded') decisonOptions += '<br>';
  });

  const html = `
    <header>Risks</header>
    <p class="subheading">${jsonSchema.title}</p>
    <p class="summary">${jsonSchema.description}</p>
    
    <div class='filter' style="display: flex;">
        <input id="filter-value" type="text" placeholder="Filter..." style="width: 100%">
        <button id="filter-clear">X</button>
    </div>
    <div class="table">
        <!-- <div class="checkbox" id="risks__table__checkboxes"></div> -->
        <div id="risks__table"></div>
    </div>
    <div class="add-delete-container">
        <button class="addDelete">Add</button> | <button class="addDelete">Delete</button>
    </div>
    <section id="risks__risk__description">
        <div>
            <h1>Risk description</h1>
            <h1>Risk Id: <span class="riskId"></span></h1>
        </div>
    
        <section id="risk__automatic_riskname">
            <div>
                <p><strong style="font-family: Arial, Helvetica, sans-serif; font-size: 1.5em; font-style: normal;">${riskJsonSchema.riskName.title}:</strong> As a <strong>Threat Agent</strong>, I can <strong>Threat</strong> the <strong>Business Asset</strong> 
                compromising the <strong>Supporting Asset</strong> in order to <strong>Motivation</strong>, by exploiting the <strong>Vulnerability</strong>.
                </p>
        
                <div id="riskName">
                    <button style="display: block; margin-left: auto;">Replace with Manual Risk Name</button>
                    <p class="riskname"></p>
                </div id="riskName">
        
                <div id="risk__manual__riskName">
                    <button style="display: block; margin-left: auto;">Replace with Automatic Risk Name</button>
                    <input type="text">
                </div>
            </div>
    
            <div class="risk__flex">
                <div>
                    <label for="risk__threatAgent">As a <span>Threat Agent</span></label>
                    <select id="risk__threatAgent" name="risk__threatAgent" title="${riskNameJsonSchema.threatAgent.description}">
                        ${threatAgentOptions}
                    </select>
                    <textarea class="rich-text" id="risk__threatAgent__rich-text"></textarea>
                </div>
                <div>
                    <label for="risk__threat">I can <span>Threat</span></label>
                    <select id="risk__threat" name="risk__threat" title="${riskNameJsonSchema.threatVerb.description}">
                        ${threatVerbOptions}
                    </select>
                    <textarea class="rich-text" id="risk__threat__rich-text"></textarea>
                </div>
            </div>
    
            <div class="risk__flex">
                <div>
                    <label for="risk__businessAsset">The <span>Business Asset</span></label>
                    <select id="risk__businessAsset" name="risk__businessAsset" title="${riskNameJsonSchema.businessAssetRef.description}"></select>
                </div>
                <div>
                    <label for="risk__supportingAsset">Compromising the <span>Supporting Asset</span></label>
                    <select id="risk__supportingAsset" name="risk__supportingAsset" title="${riskNameJsonSchema.supportingAssetRef.description}"></select>
                </div>
            </div>
    
            <div>
                <div style="display: flex; flex-direction: column;">
                    <label for="risk__motivation">In order to <span>Motivation</span></label>
                    <input type="text" name="risk__motivation" id="risk__motivation" title="${riskNameJsonSchema.motivation.description}">
                    <div class="btn btn-primary tooltip">
                        <textarea class="rich-text" id="risk__motivation__rich-text"></textarea>
                        <div class="top">
                            <p>Add your formatted rich text and your pictures</p>
                            <i></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </section>
    
    <section id="risks__risk__evaluation">
        <h1>Risk evaluation</h1>
    
        <div>
            <h2>${riskJsonSchema.riskLikelihood.title}</h2>
            <p>${riskJsonSchema.riskLikelihood.description}</p>
    
            <div id="risk__simple__evaluation">
                <button style="display: block; margin-left: auto;">Replace with OWASP Likelihood Evaluation Method</button>
                <select name="risk__likelihood" id="risk__likelihood">
                    ${riskLikelihoodOptions}
                </select>
            </div>
    
            <div id="risk__likehood__table">
                <button style="display: block; margin-left: auto;">Replace with Simple Likelihood Evaluation Method</button>
                <div class="likelihood-options">
                    <div>
                        <p>${riskLikelihoodJsonSchema.skillLevel.description}</p>
                    </div>
                    <div>
                        <select name="risk__skillLevel" id="risk__skillLevel">
                            ${skillLevelOptions}
                        </select>
                    </div>
                </div>
                <div class="likelihood-options">
                    <div>
                        <p>${riskLikelihoodJsonSchema.reward.description}</p>
                    </div>
                    <div>
                        <select name="risk__reward" id="risk__reward">
                            ${rewardOptions}
                        </select>
                    </div>
                </div>
                <div class="likelihood-options">
                    <div>
                        <p>${riskLikelihoodJsonSchema.accessResources.description}</p>
                    </div>
                    <div>
                        <select name="risk__accessResources" id="risk__accessResources">
                            ${accessResourcesOptions}
                        </select>
                    </div>
                </div>
                <div class="likelihood-options">
                    <div>
                        <p>${riskLikelihoodJsonSchema.size.description}</p>
                    </div>
                    <div>
                        <select name="risk__size" id="risk__size">
                            ${sizeOptions}
                        </select>
                    </div>
                </div>
                <div class="likelihood-options">
                    <div>
                        <p>${riskLikelihoodJsonSchema.intrusionDetection.description}</p>
                    </div>
                    <div>
                        <select name="risk__intrusionDetection" id="risk__intrusionDetection">
                            ${intrusionDetectionOptions}
                        </select>
                    </div>
                </div>
                <div class="likelihood-options">
                    <div>
                        <p>${riskLikelihoodJsonSchema.occurrence.description}</p>
                    </div>
                    <div>
                        <select name="risk__occurrence" id="risk__occurrence">
                            ${occurrenceOptions}
                        </select>
                    </div>
                </div>
                <div id="risk__occurrence__threatFactor__table">
                    <table style="border: 0;">
                        <tbody>
                            <tr>
                                <td rowspan="5">Occurrence</td>
                            </tr>
                            <tr>
                                <td class='occurrence' data-occurrence="Very High" data-row="1">Very High</td>
                                <td style="background-color: orange;"><span>Medium</span></td>
                                <td style="background-color: red;"><span>High</span></td>
                                <td style="background-color: #9f204b;"><span>Very High</span></td>
                                <td style="background-color: #9f204b;"><span>Very High</span></td>
                            </tr>
                            <tr>
                                <td class='occurrence' data-occurrence="High" data-row="2">High</td>
                                <td style="background-color: orange;"><span>Medium</span></td>
                                <td style="background-color: orange;"><span>Medium</span></td>
                                <td style="background-color: red;"><span>High</span></td>
                                <td style="background-color: #9f204b;"><span>Very High</span></td>
                            </tr>
                            <tr>
                                <td class='occurrence' data-occurrence="Medium" data-row="3">Medium</td>
                                <td style="background-color: #38E54D;"><span>Low</span></td>
                                <td style="background-color: orange;"><span>Medium</span></td>
                                <td style="background-color: orange;"><span>Medium</span></td>
                                <td style="background-color: red;"><span>High</span></td>
                            </tr>
                            <tr>
                                <td class='occurrence' data-occurrence="Low" data-row="4">Low</td>
                                <td style="background-color: #38E54D;"><span>Low</span></td>
                                <td style="background-color: #38E54D;"><span>Low</span></td>
                                <td style="background-color: orange;"><span>Medium</span></td>
                                <td style="background-color: orange;"><span>Medium</span></td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colspan="2" style="border: 0;"></td>
                                <td class='threatFactor' data-factor="Low" data-col="1">Low</td>
                                <td class='threatFactor' data-factor="Medium" data-col="2">Medium</td>
                                <td class='threatFactor' data-factor="High" data-col="3">High</td>
                                <td class='threatFactor' data-factor="Very High" data-col="4">Very High</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border: 0;"></td>
                                <td colspan="4">Threat Factor</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
    
            <div>
                <p>${riskLikelihoodJsonSchema.riskLikelihoodDetail.title}:</p>
                <textarea class="rich-text" id="risk__likelihood__details" cols="30" rows="20"></textarea>
            </div>
    
        </div>
    
        <div>
            <h2>${riskImpactJsonSchema.title}</h2>
            <p>${riskImpactJsonSchema.description}</p>
            <table id="risk__evaluation__table">
                <thead>
                    <tr>
                        <th>Business Asset Security Properties</th>
                        <th>Value</th>
                        <th>Take into account</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Confidentialty</td>
                        <td></td>
                        <td><input type="checkbox" id="risk__confidentialty"></td>
                    </tr>
                    <tr>
                        <td>Integrity</td>
                        <td></td>
                        <td><input type="checkbox" id="risk__integrity"></td>
                    </tr>
                    <tr>
                        <td>Availability</td>
                        <td></td>
                        <td><input type="checkbox" id="risk__availability"></td>
                    </tr>
                    <tr>
                        <td>Authenticity</td>
                        <td></td>
                        <td><input type="checkbox" id="risk__authenticity"></td>
                    </tr>
                    <tr>
                        <td>Authorization</td>
                        <td></td>
                        <td><input type="checkbox" id="risk__authorization"></td>
                    </tr>
                    <tr>
                        <td>Non Repudiation</td>
                        <td></td>
                        <td><input type="checkbox" id="risk__nonrepudiation"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    
        <div id="risks__vulnerability__evaluation">
            <h2>${riskAttackPathsJsonSchema.title}</h2>
            <p>${riskAttackPathsJsonSchema.description}</p>
            <button name="Go to vulnerabilities view" style="width:100%; margin-bottom: 2%;">Go to vulnerabilities view</button>

            <div class="add-delete-container">
                <button class="addDelete">Add</button> | <button class="addDelete">Delete</button>
            </div>
            <section id="risks__vulnerability__attack__path" style="padding: 0;"></section>
            <p>The vulnerability scoring of the worst attack path is: <span id="all_attack_paths_score"></span>/10</p>
            <h1 style="text-align: center;">Inherent Risk Score: <span id="inherent_risk_score"></span>/20</h1>
        </div>
    </section>
    <section id="risks__risk__mitigation__evaluation">
        <h1>${riskMitigationJsonSchema.title}</h1>
        <p>${riskMitigationJsonSchema.description}</p>
        <p style="text-align:center; margin-bottom: 0;">Risk mitigation scenario</p>
        <div class="add-delete-container" style="padding: 2% 0 0 2%;">
            <button class="addDelete">Add</button> | <button class="addDelete">Delete</button>
        </div>
        <section class="mitigations" style="padding: 0;">

        </section>
        <h1 style="text-align: center;">${riskJsonSchema.mitigatedRiskScore.title}: <span id="mitigated_risk_score"></span>/20</h1>
        <p style="text-align: center; margin-top: 0; font-size: small;">(${riskJsonSchema.mitigatedRiskScore.description.toLowerCase()})</p>
    </section>
    <section id="risks__risk__management__evaluation">
        <h1>Risk management</h1>
        <div>
            <div>
                <p style="font-weight: bold; text-align: center;">${riskJsonSchema.riskManagementDecision.title}</p>
                <div id="risks__risk__management__options">
                    ${decisonOptions}
                </div>
            </div>
            <div>
                <p style="text-align: center;">${riskJsonSchema.riskManagementDetail.title}:</p>
                <textarea class="rich-text" id="risk__management__detail__rich-text"></textarea>
            </div>
        </div>
            <h1 style="text-align: center;">${riskJsonSchema.residualRiskScore.title}: <span id="residual_risk_score"></span>/20</h1>
            <h1 style="text-align: center;">${riskJsonSchema.residualRiskLevel.title}: <span id="residual_risk_level"></span></h1>
            <p style="text-align: center; margin-top: 0; font-size: small;">(${riskJsonSchema.residualRiskScore.description.toLowerCase()})</p>
    </section>
    <footer></footer>
  `;
  const tableOptions = {
    selectable: 1,
    layout: 'fitColumns',
    height: '100%',
    index: 'riskId',
    columns: [ // Define Table Columns
      {
        title: 'Delete?', field: 'Risk Checkbox', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true, width: 80
      },
      {
        title: 'Risk Id', field: 'riskId', width: 20, headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true
      },
      {
        title: 'Project Version', field: 'projectVersionRef', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true
      },
      {
        title: 'Risk Name', field: 'riskName', width: 420, headerSort: false, headerHozAlign: 'center', formatter: 'textarea', headerWordWrap: true
      },
      {
        title: 'Risk Level', field: 'residualRiskLevel', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true
      },
      {
        title: 'Mgt Decision', field: 'riskManagementDecision', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true
      },
    ],
  };
  return [html, tableOptions];
};

module.exports = {
  renderRisks,
};
