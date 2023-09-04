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
/* global $ tinymce */

function disableAllTabs() {
    document.querySelector('button.tab-button[data-id="welcome"]').disabled = true;
    document.querySelector('button.tab-button[data-id="project-context"]').disabled = true;
    document.querySelector('button.tab-button[data-id="business-assets"]').disabled = true;
    document.querySelector('button.tab-button[data-id="supporting-assets"]').disabled = true;
    document.querySelector('button.tab-button[data-id="risks"]').disabled = true;
    document.querySelector('button.tab-button[data-id="vulnerabilities"]').disabled = true;
    document.querySelector('button.tab-button[data-id="isra-report"]').disabled = true;
  }
  
  function enableAllTabs() {
    document.querySelector('button.tab-button[data-id="welcome"]').disabled = false;
    document.querySelector('button.tab-button[data-id="project-context"]').disabled = false;
    document.querySelector('button.tab-button[data-id="business-assets"]').disabled = false;
    document.querySelector('button.tab-button[data-id="supporting-assets"]').disabled = false;
    document.querySelector('button.tab-button[data-id="risks"]').disabled = false;
    document.querySelector('button.tab-button[data-id="vulnerabilities"]').disabled = false;
    document.querySelector('button.tab-button[data-id="isra-report"]').disabled = false;
  }

  let riskChart;

  function generateGraph(lowRisk, medRisk, highRisk) {
   
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
            backgroundColor: '#FFA500', 
            barPercentage: 0.5,
            
          },
          {
            label: 'High',
            data: highRisk,
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
                if (overallLevel === 'High') color = 'red';
                else if (overallLevel === 'Medium') color = 'orange';

                $('#vulnerabilities tbody').append(`<tr>
                    <td>${vulnerabilityId}</td>
                    <td>${vulnerabilityName}</td>
                    <td style="color: ${overallScore === null ? 'red' : 'black'}">${overallScore === null ? 'NaN' : overallScore}/10</td>
                    <td style="color: ${color}; font-weight:${overallLevel === 'High' || overallLevel === 'Medium' ? 'bold' : 'normal'};">${overallLevel}</td>
                    </td>`);
            });
        };

        const renderRisk = (sortedRisk, residualRiskLevel) => {
            sortedRisk[residualRiskLevel].forEach((risk) => {
                const { riskId, residualRiskLevel, inherentRiskScore, residualRiskScore, riskManagementDecision, riskName, riskManagementDetail } = risk;
                let color = 'black';
                if (residualRiskLevel === 'High') color = 'red';
                else if (residualRiskLevel === 'Medium') color = 'orange';

                $('#risks tbody').append(`<tr>
                    <td>${riskId}</td>
                    <td style="padding:0;">
                        <div style="display:grid; grid-template-columns: 6em auto;">
                            <div class="grid-item grid-header" style="font-weight: bold;">Name</div>
                            <div class="grid-item">${riskName}</div>
                            <div class="grid-item grid-header" style="font-weight: bold;">Decision</div>
                            <div class="grid-item">${riskManagementDetail}</div>
                        </div>
                    </td>
                    <td style="color: ${inherentRiskScore === null ? 'red' : 'black'}">${inherentRiskScore === null ? 'NaN' : inherentRiskScore}/20</td>
                    <td style="color: ${residualRiskScore === null ? 'red' : 'black'}">${residualRiskScore === null ? 'NaN' : residualRiskScore}/20</td>
                    <td style="color: ${color}; font-weight: ${residualRiskLevel === 'High' || residualRiskLevel === 'Medium' ? 'bold' : 'normal'};">${residualRiskLevel}</td>
                    <td>${riskManagementDecision}</td>
                    </td>`);
            });
        };

        $(document).ready(function () {
            window.project.load(async (event, data) => {
                const { Vulnerability, Risk, ISRAmeta } = await JSON.parse(data);
                const { projectName, projectVersion, iteration } = ISRAmeta;
                const sortedVulnerability = {
                    high: [],
                    medium: [],
                    low: []
                };
                const sortedRisk = {
                    high: [],
                    medium: [],
                    low: []
                };
                $('#risks tbody').empty();
                $('#vulnerabilities tbody').empty();
                $('#riskmanagement tbody').empty();
                $('#name').text(projectName === '' ? '[Project Name]' : projectName);
                $('#version').text(projectVersion === '' ? '[Project Version]' : projectVersion);
                $('#app').text('1.1.0');
                $('#iteration').text(iteration);

                let totalCost = 0;
                const lowRisk = [0,0,0];
                const medRisk = [0,0,0];
                const highRisk = [0,0,0];
                const dataIndex = {'Accept': 0, 'Transfer': 1, 'Mitigate': 2}
                Risk.forEach((risk) => {
                    const { residualRiskLevel, riskMitigation, riskManagementDecision } = risk;
                    

                    if (residualRiskLevel === 'High') {
                        sortedRisk['high'].push(risk);
                        highRisk[dataIndex[riskManagementDecision]] += 1;

                    } else if (residualRiskLevel === 'Medium') {
                        sortedRisk['medium'].push(risk);
                        medRisk[dataIndex[riskManagementDecision]] += 1
                    } else if (residualRiskLevel === 'Low') {
                        sortedRisk['low'].push(risk);
                        lowRisk[dataIndex[riskManagementDecision]] += 1
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

                if (riskChart) {
                  riskChart.data.datasets[0].data= lowRisk
                  riskChart.data.datasets[1].data= medRisk
                  riskChart.data.datasets[2].data= highRisk
                  riskChart.update()
                  
                } else {
                  generateGraph(lowRisk, medRisk, highRisk)
                }
                
                  
                 
                

                  
            });

            window.project.iteration(async (event, iteration) => {
                $('#iteration').text(iteration);
            });
            enableAllTabs()
            window.removeEventListener('keydown', handleReload);
        });
    } catch (err) {
        alert('Failed to load report tab');
    }
})();
