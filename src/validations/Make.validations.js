import { validation, validationMessagesIds } from "constants/validation";
import * as yup from "yup";

const { TOO_SHORT_NAME, TOO_LONG_NAME, REQUIRED } = validationMessagesIds;

export const CreateMakeValidationSchema = yup.object({
  arName: yup
    .string(REQUIRED)
    .min(1, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .required(REQUIRED),
  enName: yup
    .string(REQUIRED)
    .min(1, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .required(REQUIRED),
});
