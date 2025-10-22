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
/* global $ tinymce */

  let riskChart;

  function generateGraph(lowRisk, medRisk, highRisk, criticalRisk) {
   
    const chartElement = document.getElementById('riskChart');
    const chartData = {
        labels: ['Accept', 'Transfer', 'Mitigate'],
        datasets: [
          {
            label: 'Low',
            data: lowRisk,
            stack: 'stack',
            backgroundColor: '#7db700', 
            
            barPercentage: 0.5,
          },
          {
            label: 'Medium',
            data: medRisk,
            stack: 'stack',
            backgroundColor: '#FAAB24', 
            barPercentage: 0.5,
            
          },
          {
            label: 'High',
            data: highRisk,
            stack: 'stack',
            backgroundColor: '#E35623', 
            barPercentage: 0.5,
          },
          {
            label: 'Critical',
            data: criticalRisk,
            stack: 'stack',
            backgroundColor: '#FF0000',
            barPercentage: 0.5,
          },
        ]
      };
  
      const options = {

        scales: {

          y: {
            beginAtZero: true
          },
          x : {
            ticks: {
                font: {
                    size: 14
                }
            }
          }
          
        },
        animation: {
          duration: 0
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0,
        plugins: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 14
                    }
                }
            },
        }
      };
  
      // Create the bar chart
      riskChart = new Chart(chartElement, {
        type: 'bar',
        data: chartData,
        options: options
      });

      const canvas = document.getElementById('riskChart')

      canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const imageGraph = riskChart.toBase64Image()
        window.israreport.saveGraph(imageGraph)
       
        
    });          
                        
  }


(async () => {
    let fetchedData;
    const updateRiskChart = ({ lowRisk, medRisk, highRisk, criticalRisk }) => {
      if (!riskChart) {
        generateGraph(lowRisk, medRisk, highRisk, criticalRisk);
        return;
      }
      const datasetByLabel = riskChart.data.datasets.reduce((m, ds) => {
        m[ds.label] = ds;
        return m;
      }, {});
      if (datasetByLabel.Critical) datasetByLabel.Critical.data = criticalRisk;
      if (datasetByLabel.High)     datasetByLabel.High.data     = highRisk;
      if (datasetByLabel.Medium)   datasetByLabel.Medium.data   = medRisk;
      if (datasetByLabel.Low)      datasetByLabel.Low.data      = lowRisk;
      riskChart.update();
    };
    try {
        function handleReload(event) {
            if (event.ctrlKey && event.key === 'r') {
              event.preventDefault();
            }
          }
          disableAllTabs()
        window.addEventListener('keydown', handleReload);
        const renderVulnerability = (sortedVulnerability, overallLevel) => {
            sortedVulnerability[overallLevel].forEach((vulnerability) => {
                const { vulnerabilityId, vulnerabilityName, overallScore, overallLevel } = vulnerability;
                let color = 'black';
                if (overallLevel === 'Critical') color = '#FF0000';
                else if (overallLevel === 'High') color = '#E35623';
                else if (overallLevel === 'Medium') color = '#FAAB24';

                $('#vulnerabilities tbody').append(`<tr>
                    <td>${vulnerabilityId}</td>
                    <td>${vulnerabilityName}</td>
                    <td style="color: ${overallScore === null ? 'red' : 'black'}">${overallScore === null ? 'NaN' : overallScore}/10</td>
                    <td style="color: ${color}; font-weight:${overallLevel === 'High' || overallLevel === 'Medium' ? 'bold' : 'normal'};">${overallLevel}</td>
                    </td>`);
            });
        };

        // Check if the businessAsset exists globally
        const existBusinessAsset = (ref) =>{
          if (ref === null) return null
          let foundBusinessAsset = fetchedData.BusinessAsset.find(obj => obj.businessAssetId === ref);
          return foundBusinessAsset || null
        };
      
        // Check if the businessAsset is valid
        const checkBusinessAssetRef = (ref) =>{
          if (ref === null) return false
          let foundBusinessAsset = existBusinessAsset(ref)
          return foundBusinessAsset && foundBusinessAsset.businessAssetName !== '' ? true : false
        };
      
        // Check if the businessAssets are valid
        const checkBusinessAssetRefArray = (refArray) =>{
          if(refArray.length){
            for (const ref of refArray){
              if (!checkBusinessAssetRef(ref)) return false
            }
          }
          return true
        };
      
        const existSupportingAsset = (ref) =>{
          if (ref === null) return null
          let foundSupportingAsset = fetchedData.SupportingAsset.find(obj => obj.supportingAssetId == ref);
          return foundSupportingAsset || null
        };
      
        // Check if the supportingAsset is valid
        const checkSupportingAssetRef = (ref) =>{
          if (ref === null) return false;
          let foundSupportingAsset = existSupportingAsset(ref)
        
          if (
            foundSupportingAsset == null ||
            foundSupportingAsset.businessAssetRef.length == 0 || 
            foundSupportingAsset.businessAssetRef.length !== new Set(foundSupportingAsset.businessAssetRef).size || 
            !checkBusinessAssetRefArray(foundSupportingAsset.businessAssetRef) || 
            foundSupportingAsset.supportingAssetName == ''
          ){
            return false
          }
          return true
        };
      
        // Check if the supportingAssets are valid
        const checkSupportingAssetRefArray = (refArray) =>{
          if(refArray.length){
            for (const ref of refArray){
              if (!checkSupportingAssetRef(ref)) return false
            }
          }
          return true
        };
      
        // Check if the supportingAsset exists globally
        const checkVulnerabilityRef = (ref,supportingAssetRef) =>{
          if (ref === null) return false
          const found = fetchedData.Vulnerability.find(obj => obj.vulnerabilityId === ref);
          if (
            !found ||
            !found.supportingAssetRef.includes(supportingAssetRef) ||
            !checkSupportingAssetRefArray(found.supportingAssetRef) || 
            found.vulnerabilityName === '' || 
            found.vulnerabilityDescription === ''
          ) return false
          return true
        };
      
        // Check if each vulnerability in attackPaths exist globally
        const checkRiskAttackPaths = (attackPaths,supportingAssetRef) =>{      
          if(attackPaths.length){
            for (const attackPath of attackPaths) {
              if(attackPath.vulnerabilityRef.length){
                for (const ref of attackPath.vulnerabilityRef) {
                  if (!checkVulnerabilityRef(ref.vulnerabilityId,supportingAssetRef)) return false
                }
              }
            }
          }
          return true
        };
      
        const validateRiskName = (risk) => {
          const { threatAgent, threatVerb, businessAssetRef, supportingAssetRef, motivation,riskAttackPaths } = risk;
          if (
            threatAgent === '' || 
            threatVerb === '' || 
            ! checkBusinessAssetRef(businessAssetRef) || 
            ! checkSupportingAssetRef(supportingAssetRef) || 
            ! checkRiskAttackPaths(riskAttackPaths,supportingAssetRef) || 
            motivation === ''
          ){
            return '#FF0000';
          } else return '#000000';
        };

        const renderRisk = (sortedRisk, riskCategory) => {
            (sortedRisk[riskCategory] || []).forEach((risk) => {
                const { riskId, residualRiskLevel, inherentRiskScore, mitigatedRiskScore, residualRiskScore,riskManagementDecision, riskName, riskManagementDetail } = risk;
                let color = 'black';
                switch (residualRiskLevel) {
                  case 'Critical':
                      color = '#FF0000';
                      break;
                  case 'High':
                      color = '#E35623';
                      break;
                  case 'Medium':
                      color = '#FAAB24';
                      break;
                }
                const isElevatedRisk = residualRiskLevel === 'Critical' || residualRiskLevel === 'High' || residualRiskLevel === 'Medium';

                $('#risks tbody').append(`<tr>
                    <td>${riskId}</td>
                    <td style="padding:0;">
                        <div style="display:grid; grid-template-columns: 6em auto;">
                            <div class="grid-item grid-header" style="font-weight: bold;">Name</div>
                            <div class="grid-item grid-item--wrap" style ="color:${validateRiskName(risk)}">${riskName}</div>
                            <div class="grid-item grid-header" style="font-weight: bold;">Decision</div>
                            <div class="grid-item grid-item--wrap">${riskManagementDetail}</div>
                        </div>
                    </td>
                    <td style="color: ${inherentRiskScore === null ? 'red' : 'black'}">${inherentRiskScore === null ? 'NaN' : inherentRiskScore}/20</td>
                    <td style="color: ${mitigatedRiskScore === null ? 'red' : 'black'}">${mitigatedRiskScore === null ? 'NaN' : mitigatedRiskScore}/20</td>
                    <td style="color: ${residualRiskScore === null ? 'red' : 'black'}">${residualRiskScore === null ? 'NaN' : residualRiskScore}/20</td>
                    <td style="color: ${color}; font-weight: ${isElevatedRisk ? 'bold' : 'normal'};">${residualRiskLevel}</td>
                    <td>${riskManagementDecision}</td>
                    </td>`);
            });
        };

        $(document).ready(function () {
            window.project.load(async (event, data) => {
                fetchedData = await JSON.parse(data);
                const { Vulnerability, Risk, ISRAmeta } = fetchedData
                const { projectName, projectVersion, iteration, ISRAtracking} = ISRAmeta;
                const sortedVulnerability = {
                    high: [],
                    medium: [],
                    low: []
                };
                const sortedRisk = {
                    critical: [],
                    high: [],
                    medium: [],
                    low: []
                };
                $('#risks tbody').empty();
                $('#vulnerabilities tbody').empty();
                $('#riskmanagement tbody').empty();
                $('#name').text(projectName === '' ? '[Project Name]' : projectName);
                $('#version').text(projectVersion === '' ? '[Project Version]' : projectVersion);
                $('#app').text((await window.welcome.getConfig()).appVersion);
                $('#iteration').text(ISRAtracking.length);
                $('#revision').text(iteration);


                let totalCost = 0;
                const lowRisk = [0,0,0];
                const medRisk = [0,0,0];
                const highRisk = [0,0,0];
                const criticalRisk = [0,0,0];
                const dataIndex = {'Accept': 0, 'Transfer': 1, 'Mitigate': 2}
                Risk.forEach((risk) => {
                    const { residualRiskLevel, riskMitigation, riskManagementDecision } = risk;
                    const idx = dataIndex[riskManagementDecision];
                    // if (idx == null || idx == undefined) return; 
                    switch (residualRiskLevel){
                      case 'Critical':
                        sortedRisk['critical'].push(risk);
                        criticalRisk[idx] += 1;
                        break;
                      case 'High':
                        sortedRisk['high'].push(risk);
                        highRisk[idx] += 1;
                        break;
                      case 'Medium':
                        sortedRisk['medium'].push(risk);
                        medRisk[idx] += 1;
                        break;
                      case 'Low':
                        sortedRisk['low'].push(risk);
                        lowRisk[idx] += 1;
                        break;
                    }

                    riskMitigation.forEach((mitigation) => {
                        const { description, decisionDetail, cost, decision } = mitigation;
                        if(decision === 'Accepted'){
                            $('#riskmanagement tbody').append(`<tr>
                            <td>${description}</td>
                            <td>${decisionDetail}</td>
                            <td>${!cost ? '' : cost}</td>
                            </td>`);

                            if(cost !== null) totalCost += cost;
                        }
                    });
                });
                $('#riskmanagement tbody')
                .append(`
                <tr style="border: 0">
                    <td></td>
                    <td><strong>Total accepted security control cost:</strong></td>
                    <td>${totalCost}</td>
                </tr>`);
                renderRisk(sortedRisk, 'critical');
                renderRisk(sortedRisk, 'high');
                renderRisk(sortedRisk, 'medium');
                renderRisk(sortedRisk, 'low');

                Vulnerability.forEach((vulnerability) => {
                    const { overallLevel } = vulnerability;
                    if (overallLevel === 'High') sortedVulnerability['high'].push(vulnerability);
                    else if (overallLevel === 'Medium') sortedVulnerability['medium'].push(vulnerability);
                    else if (overallLevel === 'Low') sortedVulnerability['low'].push(vulnerability);
                });
                renderVulnerability(sortedVulnerability, 'high');
                renderVulnerability(sortedVulnerability, 'medium');
                renderVulnerability(sortedVulnerability, 'low'); 

                updateRiskChart({ lowRisk, medRisk, highRisk, criticalRisk });
                
              // Inform the main process that the data is fetched
              window.israreport.fetchedContent(true);
            });

            window.project.iteration(async (event, iteration) => {
                $('#revision').text(iteration);
            });
            enableAllTabs()
            window.removeEventListener('keydown', handleReload);
        });

    } catch (err) {
      window.israreport.fetchedContent(false);
      alert('Failed to load report tab');    }
})();

