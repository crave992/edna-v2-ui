import * as Yup from 'yup';

const ReportingValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
});

export const ReportingValidationNoDateSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  date: Yup.string().required('Date is required'),
});

export default ReportingValidationSchema;
