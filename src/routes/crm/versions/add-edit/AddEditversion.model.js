/**
 * @typedef branchWorkingDayAttribute
 * @property {string} featureId
 */

/**
 * @typedef addEditCompanyInitSchema
 * @property {Array<branchWorkingDayAttribute>} branchWorkingDayAttributes
 * @property {string}   Carinsuranceimage
 * @property {string}   year
 * @property {string}   features

 * @property {string}  images

 */

/**
 * @type {addEditCompanyInitSchema}
 */
export const addEditVersionInitValues = {
  makeId:"",
  image: "",
  carModelId: "",
  vehicleTypeId: "",
  year: "",
  features: "",
  images: null,
  isActive: false,
};
