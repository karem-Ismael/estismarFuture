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

export const CreateManagerValidation = yup.object({
  firstName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  mobile: yup.string(REQUIRED).required(REQUIRED).nullable(),
  email: yup
    .string(REQUIRED)
    .email(EMAIL_FORMAT_VALIDATION)
    .matches(emailPattern, EMAIL_FORMAT_VALIDATION)
    .required(REQUIRED)
    .nullable(),
  allyId: yup.string(REQUIRED).required(REQUIRED).nullable(),
  password: yup
    .string()
    .when("status", {
      is: "add",
      then: yup.string().matches(strongPasswordRegex, EMAIL_FORMAT_VALIDATION),
    })
    .required(REQUIRED),
  branches: yup.array().when("isAllyManager", {
    is: false,
    then: yup.array().of(yup.string()).min(1, REQUIRED).required(REQUIRED),
  }),
});
