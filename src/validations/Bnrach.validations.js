import * as yup from "yup";
import { validation, validationMessagesIds } from "constants/validation";
import { emailPattern } from "constants/regex";

const {
  REQUIRED,
  TOO_SHORT_NAME,
  TOO_LONG_NAME,
  EMAIL_FORMAT_VALIDATION,
  COMMERCIALREGESTRATIONMAX15CHAR,
  NUBMERS_ONLY_ALLOWED,
} = validationMessagesIds;

export const AddEditBranch = yup.object({
  arName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.company_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  enName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.company_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  allyCompanyId: yup.mixed(REQUIRED).required(REQUIRED),
  areaId: yup.mixed(REQUIRED).required(REQUIRED),
  districtNameEn: yup.string().required(REQUIRED),
  districtNameAr: yup.string().required(REQUIRED),
});
