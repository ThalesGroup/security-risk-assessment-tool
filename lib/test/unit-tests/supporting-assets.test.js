// Renderer process

// None suitable for UTS


// updateSupportingAsset(id, cell.getField(), cell.getValue());
/* const updateSupportingAsset = (id, field, value) => {
    if (field === 'businessAssetRef') {
      validate(id, value);
    }
    else {
      if (field === 'supportingAssetName' && value) {
        if (!document.getElementById(`supporting-asset-business-assets__table-${id}`)) {
          addMatrixRow(id, value);
          addBusinessAsset(id, null, 0);
          validate(id, $(`${matrixTable}-${id} option:selected`).map((i, e) => e.value).get());
        } 
      }

      window.supportingAssets.updateSupportingAsset(id, field, value);
    } 
  }; */


/*   selectOptions = {};
      selectOptions[null] = 'Select...';
      businessAssets.filter(uncheckedAsset => uncheckedAsset.businessAssetName).forEach((asset) => {
        selectOptions[asset.businessAssetId] = asset.businessAssetName;
      }); */

// Main process

// window.supportingAssets.updateSupportingAsset

// indow.supportingAssets.updateBusinessAssetRef(id, e.target.value === 'null' ? null : e.target.value, $(e.target).attr('data-index'));

//  window.supportingAssets.addBusinessAssetRef(id, value);

//  window.supportingAssets.deleteSupportingAsset(checkedAssets);


