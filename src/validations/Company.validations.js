/* eslint-disable prettier/prettier */
import * as yup from "yup";
import { validation, validationMessagesIds } from "constants/validation";
import { emailPattern } from "constants/regex";

const {
  REQUIRED,
  EMAIL_FORMAT_VALIDATION,
  TOO_SHORT_NAME,
  TOO_LONG_NAME,
  COMMERCIALREGESTRATIONMAX15CHAR,
} = validationMessagesIds;

export const EditCompanyValidation = yup.object({
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
  managerName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.manager_name_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  phoneNumber: yup.string(REQUIRED).required(REQUIRED).nullable(),
  email: yup
    .string(REQUIRED)
    .email(EMAIL_FORMAT_VALIDATION)
    .matches(emailPattern, EMAIL_FORMAT_VALIDATION)
    .required(REQUIRED)
    .nullable(),
  allyClass: yup.string(REQUIRED).nullable().required(REQUIRED),
  commercialRegestration: yup
    .string(REQUIRED)
    .required(REQUIRED)
    .max(15, COMMERCIALREGESTRATIONMAX15CHAR)
    .nullable(),
  commercialRegistrationImage: yup.string(REQUIRED).required(REQUIRED).nullable(),
  logo: yup.string(REQUIRED).required(REQUIRED).nullable(),
  licenceImage: yup.string(REQUIRED).required(REQUIRED).nullable(),
  bankCardImage: yup.string(REQUIRED).required(REQUIRED).nullable(),
  allyRateId: yup.string(REQUIRED).nullable().required(REQUIRED),
  rate: yup.string(REQUIRED).nullable().required(REQUIRED),
});
