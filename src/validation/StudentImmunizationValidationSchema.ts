import * as Yup from "yup";

export const StudentImmunizationValidationSchema = Yup.object().shape({
  studentId: Yup.number().test(
    "shouldBeGreaterThanZero",
    "Student is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  isChildImmunized: Yup.boolean(),
  immunizationCertificateUrl: Yup.string(),
  immunizationCertificate: Yup.mixed()
    .when(
      ["isChildImmunized", "immunizationCertificateUrl"],
      (values, schema) => {
        const [isChildImmunized, immunizationCertificateUrl] = values;

        return (isChildImmunized === true &&
          immunizationCertificateUrl === "") ? schema.test(
            "fileIsRequired",
            "Please upload the latest Immunization chart/certificate",
            function (value, context) {
              const files = value as unknown as FileList;
              if (files && files.length > 0) {
                return true;
              }
              return false;
            }
          ) : schema;
      }
    )
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
    ),
  immunizationExemption: Yup.boolean(),
  immunizationExemptionApprovalCertificateUrl: Yup.string(),
  immunizationExemptionApprovalCertificate: Yup.mixed()
  .when(
    ['immunizationExemption', 'immunizationExemptionApprovalCertificateUrl'],
    (values, schema) => {
      const [immunizationExemption, immunizationExemptionApprovalCertificateUrl] = values;
      return (
        immunizationExemption === true &&
        immunizationExemptionApprovalCertificateUrl === ''
      )
        ? schema.test(
          "fileIsRequired",
          "Please upload exemption approval certificate",
          (value) => {
            const files = value as unknown as FileList;

            if (files && files.length > 0) {
              return true;
            }
            return false;
          }
        ) : schema;
    }
  )
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
});
