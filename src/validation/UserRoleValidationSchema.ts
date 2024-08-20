import * as Yup from "yup";

const UserRoleValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
});

export default UserRoleValidationSchema;
