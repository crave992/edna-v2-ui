import * as Yup from "yup";

const AssignStudentInClassValidationSchema = Yup.object().shape({
    studentId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Student is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    classIds: Yup.array().of(Yup.number()).min(1, "Please select at least one class"),
});

export default AssignStudentInClassValidationSchema;

