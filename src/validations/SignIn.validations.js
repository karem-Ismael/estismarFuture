import * as yup from "yup";
import { validation, validationMessagesIds } from "constants/validation";

const { REQUIRED, EMAIL_FORMAT_VALIDATION, PASSWORD_LENGTH_ERROR } = validationMessagesIds;

export const lognValidationSchema = yup.object({
  email: yup.string(REQUIRED).email(EMAIL_FORMAT_VALIDATION).required(REQUIRED),
  password: yup
    .string(REQUIRED)
    .min(validation.password_min, PASSWORD_LENGTH_ERROR)
    .required(REQUIRED),
});
