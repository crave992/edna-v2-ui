import * as Yup from "yup";

const PickUpDropOffStudentWiseValidationSchema = Yup.object().shape({
    studentId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Student is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    action: Yup.string().required("Action is required"),
    contactPersonId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Person is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    date: Yup.string().required("Date is required"),
    time: Yup.string().required("Time is required")
});

export default PickUpDropOffStudentWiseValidationSchema;

