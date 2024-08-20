import * as Yup from 'yup';

const ParentValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .required('Email is required')
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  cellPhone: Yup.string().required('Cell phone is required'),
  homePhone: Yup.string(),
  chargeApplicationFee: Yup.string().required('Please select one'),
  chargeRegistrationFee: Yup.string().required('Please select one'),
});

export default ParentValidationSchema;

export const ParentUpdateValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .required('Email is required')
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  cellPhone: Yup.string().required('Cell phone is required'),
  homePhone: Yup.string(),
  workEmail: Yup.string().test('isValidEmail', 'Invalid work email', (value) => {
    if (value) {
      var pattern = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      return pattern.test(value);
    }

    return true;
  }),
  employer: Yup.string(),
  profession: Yup.string(),
  jobTitle: Yup.string(),
  ssn: Yup.string(),
  countryId: Yup.number().test('shouldBeGreaterThanZero', 'Country is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  stateId: Yup.number().test('shouldBeGreaterThanZero', 'State is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  addressLine1: Yup.string().required('Address line 1 is required'),
  addressLine2: Yup.string(),
  city: Yup.string().required('City is required'),
  zipcode: Yup.string().required('Zipcode is required'),
  timezoneId: Yup.string(),
  // profileImage: Yup.mixed()
  //   .nullable()
  //   .test('sholdNotMoreThan1Mb', 'Maximum 25mb file allowed', (value, context) => {
  //     const files = value as unknown as FileList;

  //     if (files && files.length > 0) {
  //       const MAX_ALLOWED_FILE_SIZE = 25 * 1024 * 1024;
  //       const fileSizeInByte = files[0].size;

  //       return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
  //     }
  //     return true;
  //   })
  //   .test('onlyImageFileAllowed', 'Only image file format allowed', (value, context) => {
  //     const files = value as unknown as FileList;

  //     if (files && files.length > 0) {
  //       const fileType = files[0].type;
  //       if (fileType && typeof fileType === 'string' && fileType.startsWith('image/')) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }

  //     return true;
  //   }),
});

export const SecondParentValidationSchema = Yup.object().shape({
  userName: Yup.string()
    .required('Username is required')
    .matches(/^[a-zA-Z0-9]+$/, 'Invalid username. Only alphanumeric characters allowed'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Password must contain at least 8 characters, one uppercase, one number and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], "Confirm password didn't match"),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .required('Email is required')
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  cellPhone: Yup.string().required('Cell phone is required'),
  homePhone: Yup.string(),
  workEmail: Yup.string().test('isValidEmail', 'Invalid work email', (value) => {
    if (value) {
      var pattern = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      return pattern.test(value);
    }

    return true;
  }),
  employer: Yup.string(),
  position: Yup.string(),
  ssn: Yup.string(),
  countryId: Yup.number().test('shouldBeGreaterThanZero', 'Country is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  stateId: Yup.number().test('shouldBeGreaterThanZero', 'State is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  addressLine1: Yup.string().required('Address line 1 is required'),
  addressLine2: Yup.string(),
  city: Yup.string().required('City is required'),
  zipcode: Yup.string().required('Zipcode is required'),
  timezoneId: Yup.string(),
  profileImage: Yup.mixed()
    .test('sholdNotMoreThan1Mb', 'Maximum 1mb file allowed', (value, context) => {
      const files = value as unknown as FileList;

      if (files && files.length > 0) {
        const MAX_ALLOWED_FILE_SIZE = 1024 * 1024; // 1 MB
        const fileSizeInByte = files[0].size;

        return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
      }
      return true;
    })
    .test('onlyImageFileAllowed', 'Only image file format allowed', (value, context) => {
      const files = value as unknown as FileList;

      if (files && files.length > 0) {
        const fileType = files[0].type;
        if (fileType.startsWith('image/')) return true;
        return false;
      }

      return true;
    }),
});

export const ParentUpdateOnboardingValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required.')
    .min(8, 'Password must be at least 8 characters long.')
    .test('passwordRequirements', 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.', (value) =>
      [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) => pattern.test(value))
    ),
  email: Yup.string()
    .required('Email is required')
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  cellPhone: Yup.string().required('Cell phone is required'),
  homePhone: Yup.string(),
  workEmail: Yup.string().test('isValidEmail', 'Invalid work email', (value) => {
    if (value) {
      var pattern = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      return pattern.test(value);
    }

    return true;
  }),
  employer: Yup.string(),
  profession: Yup.string(),
  jobTitle: Yup.string(),
  ssn: Yup.string(),
  countryId: Yup.number().test('shouldBeGreaterThanZero', 'Country is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  stateId: Yup.number().test('shouldBeGreaterThanZero', 'State is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  addressLine1: Yup.string().required('Address line 1 is required'),
  addressLine2: Yup.string(),
  city: Yup.string().required('City is required'),
  zipcode: Yup.string().required('Zipcode is required'),
  timezoneId: Yup.string(),
});

export const ParentUpdateStartValidationSchema = Yup.object().shape({
  currentOnboardingStep: Yup.number().integer(),
});
