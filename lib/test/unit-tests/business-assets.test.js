const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');


// Main process

const addBusinessAsset = (israProject) => {
    try {
      const businessAsset = new BusinessAsset();
      israProject.addBusinessAsset(businessAsset);
      return [businessAsset.properties];
    } catch (err) {
        console.log(err)
        return 'Failed to add business asset';
    }
};



describe('Add Business Asset Function', () => {
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

const deleteBusinessAsset = (israProject, ids) => {
    try {
      const risks = israProject.properties.Risk;
      const affectedRisks = {};
  
      ids.forEach((id) => {
        israProject.deleteBusinessAsset(Number(id));
      });
      const deletedIds = new Set(ids);
      risks.forEach((risk)=>{
        const { riskId, riskName } = risk;
        if(deletedIds.has(String(riskName.businessAssetRef))){
          const affectedRisk = israProject.getRisk(riskId);
          affectedRisk.riskName.businessAssetRef = null;
          affectedRisk.riskName.supportingAssetRef = null;
          // updateRiskName(israProject, riskId);
        }
      });
  
      const currentSupportingAssets = israProject.properties.SupportingAsset;
      currentSupportingAssets.forEach((sa)=>{
        const { supportingAssetId, businessAssetRef } = sa;
        const businessAssetRefLength = businessAssetRef.length;
        for (let i = businessAssetRefLength -1; i>-1; i--){
          //if (deletedIds.has(String(businessAssetRef[i]))) updateBusinessAssetRef(israProject, supportingAssetId, null, i);
        }
      });
  
    } catch (err) {
      console.log(err)
      return 'Failed to delete business asset(s)';
    }
  };

  describe('Delete Business Asset Function', () => {
    it('Proper business asset data', () => {
        const israProject = new ISRAProject();
        DataNew(israProject);
        expect(deleteBusinessAsset(israProject, ['1'])).toBeUndefined();
        expect(israProject.properties.BusinessAsset.size()).toBe(0);
        
    });
});



// businessAssets.updateBusinessAsset

const updateBusinessAsset = (ISRAproject, id, field, value) => {
    try {
      const israProject = ISRAproject;
  
      if (field === 'businessAssetName' || field === 'businessAssetType') {
        israProject.getBusinessAsset(id)[field] = value;
  
        // update riskName
        //if (field === 'businessAssetName') {
          const risks = israProject.properties.Risk;
          // win.webContents.send('supportingAssets:getBusinessAssets', value, id);
          //risks.forEach((risk)=>{
           // const { riskId, riskName } = risk;
            /* if(riskName.businessAssetRef === id){
              updateRiskName(israProject, win, riskId);
            } */
          //})
        //};
      } else {
        israProject.getBusinessAsset(id).businessAssetProperties[field] = Number(value);
        const risks = israProject.properties.Risk;
          /* risks.forEach((risk) => {
            if(risk.riskName.businessAssetRef === id) updateRiskImpact(israProject, risk.riskId);
        }); */
      }

    } catch (err) {
        console.log(err)
        return `Failed to update business asset ${id}`;
    }
  };

  describe('Validate Business Asset Function', () => {
    it('Proper business asset data', () => {
        const israProject = new ISRAProject();
        DataNew(israProject);
        expect(updateBusinessAsset (israProject,1,'businessAssetName','BA1')).toBeUndefined();
        expect(israProject.getBusinessAsset(1).businessAssetName).toBe('BA1');
    });

});

// Validation of Business Asset

const validateBusinessAsset = (israProject, data) => {
    try {
      const { businessAssetId, businessAssetDescription } = data;
      const businessAsset = israProject.getBusinessAsset(businessAssetId);
      businessAsset.businessAssetDescription = businessAssetDescription;
    } catch (err) {
        console.log(err)
        return 'Failed to validate Business Assets tab';
    }
};


  describe('Validate Business Asset Function', () => {
    it('Proper business asset data', () => {
        const israProject = new ISRAProject();
        DataNew(israProject);
        const data = {
            'businessAssetId': 1,
            'businessAssetDescription' : '<p>A business asset description</p>'
        }
        expect(validateBusinessAsset(israProject, data)).toBeUndefined();
        expect(israProject.getBusinessAsset(1).businessAssetDescription).toBe('<p>A business asset description</p>');
    });

});


describe('Test full Business Asset Operations', () => {
    it('New ISRA Project', () => {
        const israProject = new ISRAProject();
        DataNew(israProject);
        const data = {
            'businessAssetId': 1,
            'businessAssetDescription' : '<p>A business asset description</p>'
        }
        // Update first business asset
            // Add name
            // Change type
            // Change properties

        // Add 20 business assets
        // Delete Ids 3,7,9.11.17
        // Delete Id 30

        // Add another BA and check the Id
        // Delete the BA
        // Add another BA and check the Id

        //expect(validateBusinessAsset(israProject, data)).toBeUndefined();
        //expect(israProject.getBusinessAsset(1).businessAssetDescription).toBe('<p>A business asset description</p>');
    });

    it('Existing ISRA Project', () => {
        const israProject = new ISRAProject();
        DataNew(israProject);
        const data = {
            'businessAssetId': 1,
            'businessAssetDescription' : '<p>A business asset description</p>'
        }
        expect(validateBusinessAsset(israProject, data)).toBeUndefined();
        expect(israProject.getBusinessAsset(1).businessAssetDescription).toBe('<p>A business asset description</p>');
    });

});


