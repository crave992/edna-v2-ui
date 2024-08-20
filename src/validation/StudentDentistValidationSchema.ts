import * as Yup from "yup";

export const StudentDentistValidationSchema = Yup.object().shape({
  studentId: Yup.number().test(
    "shouldBeGreaterThanZero",
    "Student is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
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
  primaryInsuranceCenter: Yup.string(),
  policyNumber: Yup.string(),
});
