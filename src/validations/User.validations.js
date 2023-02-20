import * as yup from "yup";
import { validation, validationMessagesIds } from "constants/validation";
import { emailPattern, strongPasswordRegex, iqamaPattren,borderNumber, numberLetters } from "constants/regex";

const {
  REQUIRED,
  EMAIL_FORMAT_VALIDATION,
  TOO_SHORT_NAME,
  TOO_LONG_NAME,
  TOO_SHORT_NAME_YOUR,
  TOO_LONG_NAME_YOUR,
  THIS_IAMGE_IS_REQUIRED,
  EMAIL_FORMAT_PLEASE_VALIDATION,
  IqamaFormat,
 
} = validationMessagesIds;

export const CreateCustomerValidation = yup.object({
  firstName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  lastName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .required(REQUIRED)
    .nullable(),
  middleName: yup
    .string()
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .nullable(),
  mobile: yup.string(REQUIRED).required(REQUIRED).nullable(),
  email: yup.string(REQUIRED).email(EMAIL_FORMAT_VALIDATION).required(REQUIRED).nullable(),
  companyName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME)
    .max(validation.name_max, TOO_LONG_NAME)
    .nullable(),
  gender: yup.string(REQUIRED).oneOf(["male", "female"]).required(REQUIRED).nullable(),
  status: yup.string(REQUIRED).required(REQUIRED).nullable(),
  isActive: yup.string(REQUIRED).required(REQUIRED).nullable(),
  driverLicense: yup.string().nullable().when("status",{
    is:"",
    then:yup.string().matches()
  }),
  dob: yup.string().required(REQUIRED).nullable(),
  nationalIdExpireAt: yup.string().nullable()
  .when(
    "status",{
      is:"citizen",
      then:yup.string().required(REQUIRED).nullable()
    }
  ).when(
    "status",{
      is:"gulf_citizen",
      then:yup.string().required(REQUIRED).nullable()
    }
  ).when(
    "status",{
      is:"resident",
      then:yup.string().required(REQUIRED).nullable()
    }
  )
  ,
  // driverLicenseExpireAt: yup.string().required(REQUIRED).nullable(),
  driverLicenseExpireAt: yup.string().required(REQUIRED).nullable(),
  nid: yup
    .string()
    .when("status", { is: "citizen", then: yup.string().min(10,"it must be 10 digits not less or more than 10").max(10,"it must be 10 digits not less or more than 10").required(REQUIRED) })

    .when("status", {
      is: "resident" || "citizen",
      then: yup
        .string(REQUIRED)
        .min(10, IqamaFormat)
        .max(10, IqamaFormat)
        .matches(iqamaPattren, IqamaFormat)
        .required(REQUIRED),
    })
    .when("status", {
      is: "gulf_citizen",
      then: yup.string(REQUIRED).max(15, "accept max 15 digits").required(REQUIRED),
    })
    .nullable(),

  driverLicense: yup.string().when("status", {
    is: "gulf_citizen",
    then: yup.string()
    .matches(numberLetters,"accepting only numbers & letters")
    .max(15, "accept max 15 digits").required(REQUIRED),
  }).when(
    "status", {
      is: "visitor",
      then: yup.string().matches(numberLetters,"accepting only numbers & letters").max(15, "accept max 15 digits").required(REQUIRED),
    }
  )
  ,
  passportExpireAt: yup.string().when("status",{
    is: "visitor",
    then: yup.string().required(REQUIRED)
  }),
  nationalIdVersion: yup
    .number()
    .when("status", { is: "resident", then: yup.number().required(REQUIRED) }),
 
  licenseFrontImage: yup.string().required(THIS_IAMGE_IS_REQUIRED).nullable(),
 
  passportNumber: yup
    .string()
    .when("status", { is: "visitor", then: yup.string().max(15,"accept max 15 character") })
    .nullable(),
  borderNumber:yup.string().nullable().when("status",{is:"visitor",
    then:yup.string().max(10,"accept 10 digits").matches(borderNumber, "accepting only numbers")
}),
  passportFrontImage: yup
    .string()
    .when("status", { is: "visitor", then: yup.string().required(THIS_IAMGE_IS_REQUIRED) })
    .nullable(),
  blockingAllies: yup.array().nullable(),
  blockingReason: yup.string().nullable(),
});

export const CreateUserValidation = yup.object({
  firstName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME_YOUR)
    .max(validation.name_max, TOO_LONG_NAME_YOUR)
    .required(REQUIRED),
  lastName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME_YOUR)
    .max(validation.name_max, TOO_LONG_NAME_YOUR)
    .required(REQUIRED),
  email: yup
    .string(REQUIRED)
    .email(EMAIL_FORMAT_PLEASE_VALIDATION)
    .matches(emailPattern, EMAIL_FORMAT_PLEASE_VALIDATION)
    .required(REQUIRED),
  mobile: yup.string(REQUIRED).required(REQUIRED),
  isActive: yup.string(REQUIRED).required(REQUIRED),
  password: yup
    .string(REQUIRED)
    .matches(strongPasswordRegex, EMAIL_FORMAT_VALIDATION)
    .required(REQUIRED),
  roles: yup.array().of(yup.string()).min(1, REQUIRED).required(REQUIRED),
});

export const EditUserValidation = yup.object({
  isActive: yup.string(REQUIRED).required(REQUIRED),
  roles: yup.array().of(yup.string()).min(1, REQUIRED).required(REQUIRED),
  password: yup.string(REQUIRED).matches(strongPasswordRegex, EMAIL_FORMAT_VALIDATION),
  email: yup
    .string(REQUIRED)
    .email(EMAIL_FORMAT_PLEASE_VALIDATION)
    .matches(emailPattern, EMAIL_FORMAT_PLEASE_VALIDATION),
  lastName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME_YOUR)
    .max(validation.name_max, TOO_LONG_NAME_YOUR),
  firstName: yup
    .string(REQUIRED)
    .min(validation.name_min, TOO_SHORT_NAME_YOUR)
    .max(validation.name_max, TOO_LONG_NAME_YOUR),
});
