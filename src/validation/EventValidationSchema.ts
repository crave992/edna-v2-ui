import * as Yup from "yup";

const EventValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    eventTypeId: Yup.string().required("Event type is required"),
    date: Yup.string().required("Date is required"),
});

export default EventValidationSchema;