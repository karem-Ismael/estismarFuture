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

export const CrreatCoupon = yup.object({
  //   firstName: yup
  //     .string(REQUIRED)
  //     .min(validation.name_min, TOO_SHORT_NAME)
  //     .max(validation.name_max, TOO_LONG_NAME)
  //     .required(REQUIRED)
  //     .nullable(),
  numOfUsagesPerUser: yup.string().required(REQUIRED).nullable(),
  startAt: yup.string().required(REQUIRED).nullable(),
  numOfUsages: yup.string().required(REQUIRED).nullable(),
  discountType: yup.string().required(REQUIRED).nullable(),
  code: yup.string().required(REQUIRED).nullable(),
  discountValue: yup
    .number()
    .when("discountType", {
      is: "percentage",
      then: yup.number().max(100, "100.max").required(REQUIRED),
    })
    .when("discountType", {
      is: "fixed",
      then: yup.number().max(999999.99, "maxout.99").required(REQUIRED),
    })

    .required(REQUIRED)
    .nullable(),
  numOfDays: yup
    .number()
    .nullable()
    .when("discountType", {
      is: "free_days",
      then: yup.number().required(REQUIRED),
    }),
  minRentDays: yup
    .number()
    .nullable()
    .when("discountType", {
      is: "free_days",
      then: yup.number().required(REQUIRED),
    }),

  //   email: yup
  //     .string(REQUIRED)
  //     .email(EMAIL_FORMAT_VALIDATION)
  //     .matches(emailPattern, EMAIL_FORMAT_VALIDATION)
  //     .required(REQUIRED)
  //     .nullable(),

  //   branches: yup.array().when("isAllyManager", {
  //     is: false,
  //     then: yup.array().of(yup.string()).min(1, REQUIRED).required(REQUIRED),
  //   }),
});
