/**
 * @typedef branchWorkingDayAttribute
 * @property {string} branchId
 * @property {string} endTime
 * @property {boolean} isOn
 * @property {string} startTime
 * @property {number} weekDay Int!
 */

/**
 * @typedef addEditCompanyInitSchema
 * @property {Array<branchWorkingDayAttribute>} branchWorkingDayAttributes
 * @property {string}   areaId
 * @property {string}   enName
 * @property {string}   arName
 * @property {string}   address
 * @property {string}   allyCompanyId
 * @property {string}   managerName
 * @property {string}   phoneNumber
 * @property {string}   email
 * @property {string}   officeNumber
 * @property {number}   lng
 * @property {number}   lat
 * @property {boolean}  isActive
 * @property {number}   fixedDeliveryFees
 * @property {boolean}  deliverToAirport
 * @property {boolean}  canDelivery
 */

/**
 * @type {addEditCompanyInitSchema}
 */
import { workingDaysIndeeces } from "constants/constants";
export const addEditBranchInitValues = {
  branchWorkingDayAttributes: workingDaysIndeeces.map((day) => ({
    endTime: "21:00",
    isOn: false,
    startTime: "09:00",
    weekDay: day,
  })),
  areaId: "",
  enName: "",
  arName: "",
  addressAr: "",
  addressEn: "",
  referenceCode: "",
  allyCompanyId: "",
  phoneNumber: "",
  email: "",
  officeNumber: "",
  mobileNumber: "",
  lat: 24.7136,
  lng: 46.6753,
  isActive: false,
  fixedDeliveryFees: 0.0,
  deliverToAirport: false,
  canDelivery: false,
  isOnlinePayEnable: false,
  description: "",
  districtNameAr: "",
  districtNameEn: "",
  paymentMethod: "",
  handover: false,
  regionId: undefined,
};
