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

export const AddEditExtendRentalModalValidation = yup.object({});
