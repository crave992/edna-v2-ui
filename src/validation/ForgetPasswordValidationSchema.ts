import * as Yup from "yup";

const ForgetPasswordValidationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
});

export default ForgetPasswordValidationSchema;
