import * as Yup from "yup";

const HolidayValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    holidayTypeId: Yup.string().required("Holiday type is required"),
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),


});

export default HolidayValidationSchema;