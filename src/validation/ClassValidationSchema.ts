import * as Yup from 'yup';

const ClassValidationSchema = Yup.object().shape({
  levelId: Yup.string().required('Level is required'),
  // semesterId: Yup.string().required("Semester is required"),
  name: Yup.string().required('Name is required'),
  capacity: Yup.string()
    .required('Capacity is required')
    .matches(/^[0-9.]+$/, 'Only numeric value allowed'),
  leadGuideClassAssignment: Yup.array().of(Yup.object()),
  //   associateGuideId: Yup.string()
  //     .test('is-array', 'Associate guide must be a string', (value) => {
  //       // Test if associateGuideId is an array and convert it to a string
  //       if (Array.isArray(value)) {
  //         return false;
  //       }
  //       return true;
  //     }),
});

export default ClassValidationSchema;
