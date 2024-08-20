import * as Yup from "yup";

const ResetPasswordValidationSchema = Yup.object().shape({
  userId: Yup.string(),
  token: Yup.string(),
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

export default ResetPasswordValidationSchema;