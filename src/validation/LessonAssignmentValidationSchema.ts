import * as Yup from "yup";

const LessonAssignmentValidationSchema = Yup.object().shape({
    classId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Class is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    lessonId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Lesson is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    studentIds: Yup.array().of(Yup.number()),
});

export default LessonAssignmentValidationSchema;

