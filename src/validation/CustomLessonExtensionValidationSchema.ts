import * as Yup from "yup";

const CustomLessonExtensionValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  areaId: Yup.string().required("Area and Topic is required"),
  topicId: Yup.string(),
  materials: Yup.string().required("Materials are required"),
});

export default CustomLessonExtensionValidationSchema;
