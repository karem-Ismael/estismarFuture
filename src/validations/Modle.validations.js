import { validation, validationMessagesIds } from "constants/validation";
import * as yup from "yup";

const { TOO_SHORT_NAME, TOO_LONG_NAME, REQUIRED } = validationMessagesIds;

export const CreateMakeValidationSchema = yup.object({
  modelArName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .required(REQUIRED),
  modelEnName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .required(REQUIRED),
  make: yup.string(REQUIRED).min(1, REQUIRED).required(REQUIRED),
});
