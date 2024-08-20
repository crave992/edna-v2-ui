import * as Yup from "yup";

const OrganizationValidationSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Username is required")
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, "Invalid email"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Confirm password didn't match"),
  schoolName: Yup.string().required("School name is required"),
  schoolEmail: Yup.string()
    .required("School email is required")
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, "Invalid email"),
  phoneNumber: Yup.string().required("Phone number is required"),
  organizationTypeId: Yup.number().test(
    "shouldBeGreaterThanZero",
    "Organization type is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  subDomain: Yup.string()
    .required("Subdomain is required")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Invalid Subdomain. Only alphanumeric characters allowed"
    ),
  websiteUrl: Yup.string(),
  about: Yup.string(),
  addressLine1: Yup.string().required("Address line 1 is required"),
  addressLine2: Yup.string(),
  countryId: Yup.number().test(
    "shouldBeGreaterThanZero",
    "Country is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  stateId: Yup.number().test(
    "shouldBeGreaterThanZero",
    "State is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  city: Yup.string().required("City is required"),
  zipcode: Yup.string().required("Zipcode is required"),
  primaryContact: Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, "Invalid email"),
    phone: Yup.string().required("Phone number is required"),
    addressLine1: Yup.string().required("Address line 1 is required"),
    addressLine2: Yup.string(),
    countryId: Yup.number().test(
      "shouldBeGreaterThanZero",
      "Country is required",
      (value) => {
        if (!value || value <= 0) return false;
        return true;
      }
    ),
    stateId: Yup.number().test(
      "shouldBeGreaterThanZero",
      "State is required",
      (value) => {
        if (!value || value <= 0) return false;
        return true;
      }
    ),
    city: Yup.string().required("City is required"),
    zipcode: Yup.string().required("Zipcode is required"),
  }),
});

export default OrganizationValidationSchema;

export const OrganizationUpdateValidationSchema = Yup.object().shape({
  schoolName: Yup.string().required("School name is required"),
  organizationTypeId: Yup.number().test(
    "shouldBeGreaterThanZero",
    "Organization type is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  schoolEmail: Yup.string()
    .required("School email is required")
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, "Invalid email"),
  phoneNumber: Yup.string().required("Phone number is required"),
  croppedImage: Yup.string(),
  websiteUrl: Yup.string(),
  about: Yup.string(),
  addressLine1: Yup.string().required("Address line 1 is required"),
  addressLine2: Yup.string(),
  countryId: Yup.number().test(
    "shouldBeGreaterThanZero",
    "Country is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  stateId: Yup.number().test(
    "shouldBeGreaterThanZero",
    "State is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  city: Yup.string().required("City is required"),
  zipcode: Yup.string().required("Zipcode is required"),
  timezoneId: Yup.string(),
  currencyCode: Yup.string(),
  schoolLogo: Yup.mixed()
    .test(
      "sholdNotMoreThan1Mb",
      "Maximum 1mb file allowed",
      (value, context) => {
        const files = value as unknown as FileList;

        if (files && files.length > 0) {
          const MAX_ALLOWED_FILE_SIZE = 1024 * 1024; // 1 MB
          const fileSizeInByte = files[0].size;

          return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
        }
        return true;
      }
    )
    .test(
      "onlyImageFileAllowed",
      "Only image file format allowed",
      (value, context) => {
        const files = value as unknown as FileList;

        if (files && files.length > 0) {
          const fileType = files[0].type;
          if (fileType.startsWith("image/")) return true;
          return false;
        }

        return true;
      }
    ),
  primaryContact: Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, "Invalid email"),
    phone: Yup.string().required("Phone number is required"),
    addressLine1: Yup.string().required("Address line 1 is required"),
    addressLine2: Yup.string(),
    countryId: Yup.number().test(
      "shouldBeGreaterThanZero",
      "Country is required",
      (value) => {
        if (!value || value <= 0) return false;
        return true;
      }
    ),
    stateId: Yup.number().test(
      "shouldBeGreaterThanZero",
      "State is required",
      (value) => {
        if (!value || value <= 0) return false;
        return true;
      }
    ),
    city: Yup.string().required("City is required"),
    zipcode: Yup.string().required("Zipcode is required"),
  }),
});
