import * as Yup from "yup";

export const InvoiceValidationSchema = Yup.object().shape({
    year: Yup.number().test("shouldBeGreaterThanZero", "Year is required", (value) => {
        if (value && value > 0) return true;
        return false;
    }),
    month: Yup.number().test("shouldBeGreaterThanZero", "Month is required", (value) => {
        if (value && value > 0) return true;
        return false;
    })
});