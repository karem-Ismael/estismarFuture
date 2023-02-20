import * as yup from "yup";
import { validation, validationMessagesIds } from "constants/validation";

const {
  REQUIRED,
  TOO_SHORT_NAME,
  TOO_LONG_NAME,
  EMAIL_FORMAT_VALIDATION,
  COMMERCIALREGESTRATIONMAX15CHAR,
  NUBMERS_ONLY_ALLOWED,
} = validationMessagesIds;

export const AddEditExtraService = yup.object({
  enDescription: yup.string(REQUIRED).required(REQUIRED).nullable(),
  arDescription: yup.string(REQUIRED).required(REQUIRED).nullable(),
  arTitle: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.company_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  enTitle: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.company_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  payType: yup.string(REQUIRED).nullable().required(REQUIRED),
  homepageIconUrl:yup.string().when("isSpecial",{
    is:true,
      then: yup.string(REQUIRED).nullable().required(REQUIRED),
  })
});
