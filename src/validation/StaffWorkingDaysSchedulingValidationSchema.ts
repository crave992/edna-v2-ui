import * as Yup from "yup";

const StaffWorkingDaysSchedulingValidationSchema = Yup.object().shape({
    staffId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Staff is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    dayIds: Yup.array().of(Yup.number()).min(1, "Please select at least one day"),
});

export default StaffWorkingDaysSchedulingValidationSchema;

