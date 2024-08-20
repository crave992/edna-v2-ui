import * as Yup from "yup";

const SepLevelValidationSchema = Yup.object().shape({
    levelId: Yup.string().required("Class Level is required"),
    sepAreaId: Yup.string().required("SEP area is required"),
    name: Yup.string().required("Name is required")
});

export default SepLevelValidationSchema;

export const SepLevelBulkValidationSchema = Yup.object().shape({
    levelId: Yup.number().test("shouldBeGreaterThanZero", "Level is required", (value) => {
        if (value && value > 0) return true;
        return false;
    }),
    sepAreaId: Yup.number().test("shouldBeGreaterThanZero", "SEP area is required", (value) => {
        if (value && value > 0) return true;
        return false;
    }),
    document: Yup.mixed()
        .test(
            "sholdNotMoreThan1Mb",
            "Maximum 5mb file allowed",
            (value, context) => {
                const files = value as unknown as FileList;

                if (files && files.length > 0) {
                    const MAX_ALLOWED_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
                    const fileSizeInByte = files[0].size;
                    return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
                }
                return true;
            }
        )
        .test(
            "onlyImageFileAllowed",
            "Only excel file format allowed",
            (value, context) => {
                const files = value as unknown as FileList;

                if (files && files.length > 0) {
                    const fileType = files[0].type;
                    if (fileType.startsWith("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") || fileType.startsWith("application/vnd.ms-excel")) return true;
                    return false;
                }

                return true;
            }
        )
        .test(
            "requiredField",
            "Please upload excel file",
            (value, context) => {
                const files = value as unknown as FileList;
                if (files && files.length > 0) {
                    return true;
                }

                return false;
            }
        ),
});