import * as Yup from "yup";

const RecurringInvoiceItemValidationSchema = Yup.object().shape({    
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
});

export default RecurringInvoiceItemValidationSchema;