const SupportingAsset = require('../../src/model/classes/SupportingAsset/supporting-asset');
// Renderer process

// None suitable for UTS



// Main process
const israProject = new ISRAProject();
DataNew(israProject);
  
const addSupportingAsset = (israProject) => {
  try {
    const supportingAsset = new SupportingAsset();
    supportingAsset.addBusinessAssetRef(null);
    israProject.addSupportingAsset(supportingAsset);
    return [supportingAsset.properties];
  } catch (err) {
    console.log(err);
    return 'Failed to add supporting asset';
  }
};

describe('Add Supporting Asset Function', () => {
  it('UTS1: Add a new Supporting Asset', () => {
      

      expect(addSupportingAsset(israProject)).toBeUndefined();
      expect(israProject.properties.SupportingAsset.size()).toBe(2);
  });

  it('UTB2: Null project', () => {

      expect(addSupportingAsset(null)).toBe('Failed to add supporting asset');
      
  });

  it('UTS3: Add 10 Supporting Assets', () => {
      
    for (const i = 0; i < 10; i++) {
      addSupportingAsset(israProject)
    }
    expect(israProject.properties.SupportingAsset.size()).toBe(12);
});
});


const deleteSupportingAsset = (israProject, ids, win) => {
  try {
    const risks = israProject.properties.Risk;

    ids.forEach((id) => {
      israProject.deleteSupportingAsset(Number(id));

      // update vulnerability
      const vulnerabilities = israProject.properties.Vulnerability;
      vulnerabilities.forEach((v) => {
        const { vulnerabilityId, supportingAssetRef } = v;
        /* if (supportingAssetRef.includes(Number(id))) {
          updateVulnerability(israProject, vulnerabilityId, 'deleteSupportingAssetRef', Number(id));
        } */
      });
    });

    // update riskName
    const deletedIds = new Set(ids);
    risks.forEach((risk)=>{
      const { riskId, riskName } = risk;
      if(deletedIds.has(String(riskName.supportingAssetRef))){
        const affectedRisk = israProject.getRisk(riskId);
        affectedRisk.riskName.supportingAssetRef = null;
        //updateRiskName(israProject, win, riskId);
      }
    });

    // win.webContents.send('risks:load', israProject.toJSON());
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(getMainWindow(), { message: 'Failed to delete supporting asset(s)' });
  }
};


describe('Delete Supporting Asset Function', () => {
  it('UTB3: Delete a new Supporting Asset', () => {
      expect(deleteSupportingAsset(israProject, ['2'])).toBeUndefined();
      expect(israProject.properties.SupportingAsset.size()).toBe(1);
  });

  it('UTB2: Null project', () => {

      expect(deleteSupportingAsset(null, ['1'])).toBe('Failed to add business asset');
      
  });
});

const updateSupportingAsset = (israProject, win, id, field, value) => {
  try {
    const supportingAsset = israProject.getSupportingAsset(id);
    // if (field === 'businessAssetRef') {
      // // value is array
      // const { businessAssetRef } = supportingAsset.properties;
      // businessAssetRef.forEach((ref) => {
      //   supportingAsset.deleteBusinessAssetRef(Number(ref));
      // });
      // value.forEach((ref) => {
      //   if(ref) supportingAsset.addBusinessAssetRef(Number(ref));
      //   else supportingAsset.addBusinessAssetRef(null);
      // });
    // } else {
      // value is string
      supportingAsset[field] = value;

      // update riskName
    if (field === 'supportingAssetName'){
        const risks = israProject.properties.Risk;
        risks.forEach((risk)=>{
          const { riskId, riskName } = risk;
          if(riskName.supportingAssetRef === id){
            updateRiskName(israProject, win, riskId);
          }
        })
      }
    // }
    // win.webContents.send('risks:load', israProject.toJSON());
  } catch (err) {
    console.log(err)
    dialog.showMessageBoxSync(getMainWindow(), { message: `Failed to update supporting asset ${id}` });
  }
};

describe('Update Supporting Asset Function', () => {
  it('UTB1: Add a new Business Asset', () => {
      const israProject = new ISRAProject();
      DataNew(israProject);

      expect(addBusinessAsset(israProject)).toBeUndefined();
      expect(israProject.properties.BusinessAsset.size()).toBe(2);
  });

  it('UTB2: Null project', () => {

      expect(addBusinessAsset(null)).toBe('Failed to add business asset');
      
  });
});


const addBusinessAssetRef = (israProject, id, value) => {
  if(value === 'null') israProject.getSupportingAsset(id).addBusinessAssetRef(null);
  else israProject.getSupportingAsset(id).addBusinessAssetRef(Number(value));
}

describe('Add Business Asset Reference Function', () => {
  it('UTB1: Add a new Business Asset', () => {
      const israProject = new ISRAProject();
      DataNew(israProject);

      expect(addBusinessAsset(israProject)).toBeUndefined();
      expect(israProject.properties.BusinessAsset.size()).toBe(2);
  });

  it('UTB2: Null project', () => {

      expect(addBusinessAsset(null)).toBe('Failed to add business asset');
      
  });
});


const deleteBusinessAssetRef = (israProject, id, indexes, win) => {
  try {
    const deletedBusinessAssetRefs = []
    let sortedIndexes = indexes.sort((a, b) => Number(b) - Number(a));

    sortedIndexes.forEach((index) => {
      const businessAssetId = israProject.getSupportingAsset(id).properties.businessAssetRef[Number(index)]
      israProject.getSupportingAsset(id).deleteBusinessAssetRef(Number(index));
      deletedBusinessAssetRefs.push(businessAssetId)
    });

    // update riskName
    const risks = israProject.properties.Risk;
    risks.forEach((risk) => {
      const { riskId, riskName } = risk;    
      if (deletedBusinessAssetRefs.includes(riskName.businessAssetRef) && id === riskName.supportingAssetRef) {
        const affectedRisk = israProject.getRisk(riskId);
        affectedRisk.riskName.businessAssetRef = null;
        affectedRisk.riskName.supportingAssetRef = null;
        updateRiskName(israProject, win, riskId);
      }
    });

  }catch(err){
    console.log(err);
    dialog.showMessageBoxSync(getMainWindow(), { message: 'Failed to delete Business Asset Ref' });
  }
}

describe('Delete Business Asset Reference Function', () => {
  it('UTB1: Add a new Business Asset', () => {
      const israProject = new ISRAProject();
      DataNew(israProject);

      expect(addBusinessAsset(israProject)).toBeUndefined();
      expect(israProject.properties.BusinessAsset.size()).toBe(2);
  });

  it('UTB2: Null project', () => {

      expect(addBusinessAsset(null)).toBe('Failed to add business asset');
      
  });
});


const updateBusinessAssetRef = (israProject, id, value, index, win) => {
  try {
    israProject.getSupportingAsset(id).updateBusinessAssetRef(index, value === null ? null : Number(value));

    // update riskName
    const risks = israProject.properties.Risk;
    const businessAssetRefs = israProject.getSupportingAsset(id).properties.businessAssetRef;
    risks.forEach((risk) => {
      const { riskId, riskName } = risk;
      if (!businessAssetRefs.includes(riskName.businessAssetRef) && id === riskName.supportingAssetRef) {
        const affectedRisk = israProject.getRisk(riskId);
        affectedRisk.riskName.businessAssetRef = null;
        affectedRisk.riskName.supportingAssetRef = null;
        updateRiskName(israProject, win, riskId);
      }
    });
  } catch (err) {
    console.log(err)
    dialog.showMessageBoxSync(getMainWindow(), { message: 'Failed to update Business Asset Ref' });
  }
};

describe('Update Business Asset Reference Function', () => {
  it('UTB1: Add a new Business Asset', () => {
      const israProject = new ISRAProject();
      DataNew(israProject);

      expect(addBusinessAsset(israProject)).toBeUndefined();
      expect(israProject.properties.BusinessAsset.size()).toBe(2);
  });

  it('UTB2: Null project', () => {

      expect(addBusinessAsset(null)).toBe('Failed to add business asset');
      
  });
});

const validateSupportingAssets = (ISRAproject, supportingAssets, desc) => {
  try {
    const israProject = ISRAproject;
    israProject.supportingAssetsDesc = desc;
    supportingAssets.forEach((asset) => {
      const supportingAsset = israProject.getSupportingAsset(asset.supportingAssetId);
      const {
        supportingAssetHLDId,
        supportingAssetType,
        supportingAssetSecurityLevel,
      } = asset;
      Object.assign(supportingAsset, {
        supportingAssetHLDId,
        supportingAssetType,
        supportingAssetSecurityLevel,
      });
    });
  } catch (err) {
    dialog.showMessageBoxSync(getMainWindow(), { message: 'Failed to validate Supporting Assets tab' });
  }
};

describe('Update Business Asset Reference Function', () => {
  it('UTB1: Add a new Business Asset', () => {
      const israProject = new ISRAProject();
      DataNew(israProject);

      expect(addBusinessAsset(israProject)).toBeUndefined();
      expect(israProject.properties.BusinessAsset.size()).toBe(2);
  });

  it('UTB2: Null project', () => {

      expect(addBusinessAsset(null)).toBe('Failed to add business asset');
      
  });
});

// New ISRA test case

// Old ISRA test case


