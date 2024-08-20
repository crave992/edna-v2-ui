import * as Yup from "yup";

const ChangePasswordValidationSchema = Yup.object().shape({
    userId: Yup.string(),
    currentPassword: Yup.string().required("Current Password is required"),
    newPassword: Yup.string()
        .required("Password is required")
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        ),
    confirmNewPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("newPassword")], "Confirm password didn't match"),
});

export default ChangePasswordValidationSchema;


export const NewAccountChangePasswordValidationSchema = Yup.object().shape({
    userId: Yup.string(),
    roleName: Yup.string(),
    password: Yup.string()
        .required("Password is required")
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        ),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Confirm password didn't match"),

    // acceptTerms: Yup.boolean()
    //     .when("roleName", (roleName) => {
    //         if (roleName && roleName[0].toString().toLowerCase() === Role.Parent.toString().toLowerCase()) {
    //             return Yup.boolean().test(
    //                 "shouldBeRequired",
    //                 "Please check this box",
    //                 (value) => {
    //                     const output = value as unknown as boolean;
    //                     return output;
    //                 }
    //             );
    //         } else {
    //             return Yup.boolean();
    //         }
    //     })
});