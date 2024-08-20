import * as Yup from "yup";

const BabyLogDiaperingValidationSchema = Yup.object().shape({
    diaperChangedTime: Yup.string().required("Time is required"),
});

export default BabyLogDiaperingValidationSchema;


export const BabyLogFeedingValidationSchema = Yup.object().shape({
    feedingTime: Yup.string().required("Feeding time is required"),
});


export const BabyLogNappingValidationSchema = Yup.object().shape({
    fromTime: Yup.string().required("From time is required"),
    toTime: Yup.string().required("To time is required"),
});

export const BabyLogOtherValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
});

