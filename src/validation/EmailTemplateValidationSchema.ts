import * as Yup from "yup";

const EmailTemplateValidationSchema = Yup.object().shape({
  emailTemplateTypeId: Yup.string().required("Email template type is required"),
  fromEmail: Yup.string()
    .required("From email is required")
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, "Invalid email"),

  subject: Yup.string().required("Subject is required"),
  body: Yup.string().required("Body is required"),
});

export default EmailTemplateValidationSchema;
