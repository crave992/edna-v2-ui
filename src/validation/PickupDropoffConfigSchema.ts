import * as Yup from "yup";

const PickupDropoffConfigSchema = Yup.object().shape({
  minCount: Yup.number().required("Min count is required"),
  maxCount: Yup.number().required("Max count is required"),
});

export default PickupDropoffConfigSchema;
