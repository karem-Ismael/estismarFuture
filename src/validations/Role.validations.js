import * as yup from "yup";
import { validation, validationMessagesIds } from "constants/validation";
import { emailPattern, strongPasswordRegex } from "constants/regex";

const {
  REQUIRED,
  EMAIL_FORMAT_VALIDATION,
  TOO_SHORT_NAME,
  TOO_LONG_NAME,
  TOO_SHORT_NAME_YOUR,
  TOO_LONG_NAME_YOUR,
  THIS_IAMGE_IS_REQUIRED,
  EMAIL_FORMAT_PLEASE_VALIDATION,
} = validationMessagesIds;

export const CreateRoleValidation = yup.object({
  arName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  enName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
});
