import * as Yup from "yup";

const StaffTimeTrackingValidationSchema = Yup.object().shape({
  trackingDate: Yup.string().required("Date is required"),
  action: Yup.string().required("Action is required"),
  time: Yup.string().required("Time is required"),
});

export default StaffTimeTrackingValidationSchema;
