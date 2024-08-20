import * as Yup from "yup";

const InvoiceItemValidationSchema = Yup.object().shape({
    invoiceId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Invoice id is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    studentId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Please select student",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    feeType: Yup.string(),
    feeTypeId: Yup.number(),
    feeName: Yup.string(),    
    quantity: Yup.string().required("Quantity is required").matches(/^\d+\.?\d{0,2}$/, "Invalid quantity"),
    amount: Yup.string().required("Amount is required").matches(/^\d+\.?\d{0,2}$/, "Invalid amount"),
    occurrence: Yup.string().required("Select occurrence")
});

export default InvoiceItemValidationSchema;