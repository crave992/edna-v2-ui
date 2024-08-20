import * as Yup from "yup";

const EmploymentFormValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    docUrl: Yup.string(),
    document: Yup.mixed()
        .when("docUrl", (docUrl) => {
            if (docUrl && !docUrl[0]) {
                return Yup.mixed().test("shouldBeRequired", "Document is required", (value, context) => {
                    const files = (value as unknown) as FileList;
                    if (!files || files.length <= 0) return false;
                    return true;
                });
            } else {
                return Yup.mixed();
            }
        })
        .test("shouldNotMoreThan5Mb", "Maximum 5mb file allowed", (value, context) => {
            const files = (value as unknown) as FileList;

            if (files && files.length > 0) {
                const MAX_ALLOWED_FILE_SIZE = 1024 * 5120; // 5 MB
                const fileSizeInByte = files[0].size;

                return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
            }
            return true;
        }),
        // .test("onlyPdfFileAllowed", "Only pdf file format allowed", (value, context) => {

        //     const files = (value as unknown) as FileList;

        //     if (files && files.length > 0) {
        //         const fileType = files[0].type;
        //         if (fileType.startsWith('application/pdf')) return true;
        //         return false;
        //     };

        //     return true;
        // }),
});

export default EmploymentFormValidationSchema;


