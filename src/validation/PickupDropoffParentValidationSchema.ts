import * as Yup from "yup";

export const PickupDropoffParentValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  relation: Yup.string().required("Relation is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  identityProofUrl: Yup.string(),
  identityProof: Yup.mixed()
    .when(
      ['identityProofUrl'],
      (values, schema) => {
        const [identityProofUrl] = values;
        return (
          identityProofUrl === ''
        )
          ? schema.test(
            "fileIsRequired",
            "Please upload drivers Licence/ID",
            (value) => {
              const files = value as unknown as FileList;

              if (files && files.length > 0) {
                return true;
              }
              return false;
            }
          ) : schema;
      }
    ).test(
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
  isEmergencyContact: Yup.string(),
});
