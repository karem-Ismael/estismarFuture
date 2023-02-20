/* eslint-disable prettier/prettier */
import * as yup from "yup";
import { validation, validationMessagesIds } from "constants/validation";

const {
  REQUIRED,
  TOO_SHORT_NAME,
  TOO_LONG_NAME,
} = validationMessagesIds;

export const AddEditRate = yup.object({
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
  displayOrder: yup
    .number(REQUIRED)
    .required(REQUIRED)
    .nullable(),
});
