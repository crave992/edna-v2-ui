import * as Yup from "yup";

const LoginValidationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
});

export default LoginValidationSchema;
