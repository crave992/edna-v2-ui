import * as Yup from "yup";

const JobTitleValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

export default JobTitleValidationSchema;
