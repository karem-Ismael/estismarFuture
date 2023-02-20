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

export const AddEditFeature = yup.object({
  nameAr: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.company_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  nameEn: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.company_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  icon: yup.string(REQUIRED).nullable().required(REQUIRED),
  category: yup.string(REQUIRED).nullable().required(REQUIRED),
});
