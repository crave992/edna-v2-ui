import * as Yup from "yup";

const StaffSchedulingValidationSchema = Yup.object().shape({
    staffId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Staff is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    staffWorkingDayId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Day is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    fromTime: Yup.string().required("From time is required"),
    toTime: Yup.string().required("To time is required"),
    notes: Yup.string(),
});

export default StaffSchedulingValidationSchema;


export const StaffSchedulingSaveValidationSchema = Yup.object().shape({
    staffId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Staff is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    staffWorkingDayIds: Yup.array().of(Yup.number()).min(1, "Please select at least one day"),
    fromTime: Yup.string().required("From time is required"),
    toTime: Yup.string().required("To time is required"),
    notes: Yup.string(),
});

