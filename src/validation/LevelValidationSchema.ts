import * as Yup from "yup";

const LevelValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    fromAge: Yup.string().required("From Age is required"),
    toAge: Yup.string().required("To Age is required"),
});

export default LevelValidationSchema;

