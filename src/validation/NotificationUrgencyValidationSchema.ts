import * as Yup from "yup";

const NotificationUrgencyValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
});

export default NotificationUrgencyValidationSchema;

