import * as Yup from "yup";

const EmailSettingValidatiinSchema = Yup.object().shape({
    provider: Yup.string().required("Provider name is required"),
    userName: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    host: Yup.string().required("Host is required"),
    port: Yup.string().required("Port number is required").matches(/^\d+\.?\d{0,2}$/, "Invalid port"),
    enableSsl: Yup.boolean().required("Select ssl type"),
});

export default EmailSettingValidatiinSchema;