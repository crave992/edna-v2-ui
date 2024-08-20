import * as Yup from "yup";

const RecordKeepingNotesValidationSchema = Yup.object().shape({
    notes: Yup.string().required("Notes is required")
});

export default RecordKeepingNotesValidationSchema;