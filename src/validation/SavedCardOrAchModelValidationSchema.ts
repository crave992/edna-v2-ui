import * as Yup from "yup";

export const SavedCardValidationSchema = Yup.object().shape({
    paymentMethodId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Type is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    cardHolderName: Yup.string().required("Name is required"),
    aliasCardName: Yup.string().required("Alias Card Name is required"),
    cardNumber: Yup.string().required("Card Number is required"),
    expYear: Yup.string().required("Year is required").matches(/^[0-9]+$/, "Invalid year").min(2, "Minimum 2 digits required").max(2, "Maximum 2 digits allowed"),
    expMonth: Yup.string().required("Month is required").matches(/^[0-9]+$/, "Invalid month").min(2, "Minimum 2 digits required").max(2, "Maximum 2 digits allowed"),
    billingAddress: Yup.string(),
    billingZipcode: Yup.string(),
    isPrimaryCard: Yup.boolean(),
    acceptTerms: Yup.boolean().test("shouldBeRequired", "Please check this box", (value) => {
        const output = value as unknown as boolean;
        return output;
    })
});

export const SavedAchValidationSchema = Yup.object().shape({
    paymentMethodId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Type is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    achHolderName: Yup.string().required("Name is required"),
    aliasAchName: Yup.string().required("Alias Ach Name is required"),
    routingNumber: Yup.string().required("Routing Number is required"),
    accountNumber: Yup.string().required("Account Number is required"),
    billingAddress: Yup.string(),
    billingZipcode: Yup.string(),
    isPrimaryCard: Yup.boolean(),
    acceptTerms: Yup.boolean().test("shouldBeRequired", "Please check this box", (value) => {
            const output = value as unknown as boolean;
            return output;
    })
});