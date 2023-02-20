/**
 * @typedef branchWorkingDayAttribute
 * @property {string} featureId
 */

/**
 * @typedef addEditCompanyInitSchema
 * @property {Array<branchWorkingDayAttribute>} branchWorkingDayAttributes
 * @property {string}   icon
 * @property {string}   nameEN
 * @property {string}   nameAr

 * @property {boolean}  isActive

 */

/**
 * @type {addEditCompanyInitSchema}
 */
export const addEditFeatureInitValues = {
  icon: "",
  nameAr: "",
  nameEn: "",
  isActive: false,
  isParent: false,
  displayOrder: "",
  category: "",
  parentId: "",
};
