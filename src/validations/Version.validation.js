import * as yup from "yup";
import { validation, validationMessagesIds } from "constants/validation";
import { emailPattern } from "constants/regex";
import { object } from "yup/lib/locale";

const {
  REQUIRED,
  TOO_SHORT_NAME,
  TOO_LONG_NAME,
  EMAIL_FORMAT_VALIDATION,
  COMMERCIALREGESTRATIONMAX15CHAR,
  NUBMERS_ONLY_ALLOWED,
} = validationMessagesIds;

export const AddEditVersion = yup.object({
  makeId:yup.string().required(REQUIRED).nullable(),
  carModelId: yup
    .string(REQUIRED)
    .required(REQUIRED)
    .nullable(),
  year: yup
    .string()
    .required(REQUIRED)
    .nullable(),
    images: yup.array().of(yup.string().min(2).required()).required(REQUIRED),
  vehicleTypeId:yup.string(REQUIRED)
  .required(REQUIRED)
  .nullable(),
});
