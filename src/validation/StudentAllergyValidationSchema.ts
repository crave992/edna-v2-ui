import * as Yup from "yup";

export const StudentAllergyValidationSchema = Yup.object().shape({
  studentId: Yup.number().test(
    "shouldBeGreaterThanZero",
    "Student is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  allergyName: Yup.string(),
  allergyIndication: Yup.string(),
  actionTakenAgainstReaction: Yup.string(),
  actionTakenAgainstSeriousReaction: Yup.string(),
  contactPersonName1: Yup.string(),
  contactPersonPhoneNumber1: Yup.string(),
  contactPersonName2: Yup.string(),
  contactPersonPhoneNumber2: Yup.string(),
  callAnAmbulance: Yup.string(),
  medicalForm: Yup.mixed().test(
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
  ),
});
