import * as Yup from 'yup';

const StudentValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  middleName: Yup.string(),
  lastName: Yup.string().required('Last name is required'),
  dob: Yup.string().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  levelId: Yup.number().test('shouldBeGreaterThanZero', 'Level is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  programOptionId: Yup.number().test('shouldBeGreaterThanZero', 'Program option is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
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
  hobbies: Yup.string(),
  achievements: Yup.string(),
  likes: Yup.string(),
  dislikes: Yup.string(),
  strengths: Yup.string(),
  areasOfNeededGrowth: Yup.string(),
  siblingAtSchool: Yup.boolean(),
  includeInformationInDirectory: Yup.boolean(),
  isBeforeAndAfterSchoolCareRequire: Yup.string().test('shouldBeRequired', 'Please check this box', (value) => {
    const output = value as unknown as string;
    return output ? true : false;
  }),
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

  beforeAndAfterSchoolCare: Yup.object()
    .shape({
      monday: Yup.boolean(),
      tuesday: Yup.boolean(),
      wednesday: Yup.boolean(),
      thursday: Yup.boolean(),
      friday: Yup.boolean(),
      saturday: Yup.boolean(),
      sunday: Yup.boolean(),
      fromTime: Yup.string().when('isBeforeAndAfterSchoolCareRequire', (isRequire, schema) => {
        return isRequire && isRequire?.[0] === 'true' ? schema.required('From time is required') : schema;
      }),
      toTime: Yup.string().when('isBeforeAndAfterSchoolCareRequire', (isRequire, schema) => {
        return isRequire && isRequire?.[0] === 'true' ? schema.required('To time is required') : schema;
      }),
    })
    .test('atLeastOneDay', 'Select at least one day', function (value) {
      const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = value;
      const isRequire = this.parent.isBeforeAndAfterSchoolCareRequire || '';

      if (isRequire === 'true' && !(monday || tuesday || wednesday || thursday || friday || saturday || sunday)) {
        return this.createError({
          path: 'beforeAndAfterSchoolCare',
          message: 'Select at least one day',
        });
      }

      return true;
    }),
});

export default StudentValidationSchema;

export const StudentUpdateValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  middleName: Yup.string().nullable(),
  lastName: Yup.string().required('Last name is required'),
  dob: Yup.string().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  countryId: Yup.number().test('shouldBeGreaterThanZero', 'Country is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  stateId: Yup.number().test('shouldBeGreaterThanZero', 'State is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  addressLine1: Yup.string().required('Address line 1 is required'),
  addressLine2: Yup.string().nullable(),
  city: Yup.string().required('City is required'),
  zipcode: Yup.string().required('Zipcode is required'),
  hobbies: Yup.string().nullable(),
  achievements: Yup.string().nullable(),
  likes: Yup.string().nullable(),
  dislikes: Yup.string().nullable(),
  strengths: Yup.string().nullable(),
  areasOfNeededGrowth: Yup.string().nullable(),
  siblingAtSchool: Yup.boolean().nullable(),
  includeInformationInDirectory: Yup.boolean().nullable(),
  isBeforeAndAfterSchoolCareRequire: Yup.string()
    .nullable()
    .test('shouldBeRequired', 'Please check this box', (value) => {
      const output = value as unknown as string;
      return output ? true : false;
    }),
  profileImage: Yup.mixed()
    .nullable()
    .test('sholdNotMoreThan1Mb', 'Maximum 25mb file allowed', (value, context) => {
      const files = value as unknown as FileList;

      if (files && files.length > 0) {
        const MAX_ALLOWED_FILE_SIZE = 25 * 1024 * 1024; // 1 MB
        const fileSizeInByte = files[0].size;

        return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
      }
      return true;
    })
    .test('onlyImageFileAllowed', 'Only image file format allowed', (value, context) => {
      const files = value as unknown as FileList;

      if (files && files.length > 0) {
        const fileType = files[0].type;
        if (fileType && typeof fileType === 'string' && fileType.startsWith('image/')) {
          return true;
        } else {
          return false;
        }
      }

      return true;
    }),
  croppedImage: Yup.string().nullable(),
  beforeAndAfterSchoolCare: Yup.object()
    .shape({
      monday: Yup.boolean(),
      tuesday: Yup.boolean(),
      wednesday: Yup.boolean(),
      thursday: Yup.boolean(),
      friday: Yup.boolean(),
      saturday: Yup.boolean(),
      sunday: Yup.boolean(),
      fromTime: Yup.string().when('isBeforeAndAfterSchoolCareRequire', (isRequire, schema) => {
        return isRequire && isRequire?.[0] === 'true' ? schema.required('From time is required') : schema;
      }),
      toTime: Yup.string().when('isBeforeAndAfterSchoolCareRequire', (isRequire, schema) => {
        return isRequire && isRequire?.[0] === 'true' ? schema.required('To time is required') : schema;
      }),
    })
    .test('atLeastOneDay', 'Select at least one day', function (value) {
      const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = value;
      const isRequire = this.parent.isBeforeAndAfterSchoolCareRequire || '';

      if (isRequire === 'true' && !(monday || tuesday || wednesday || thursday || friday || saturday || sunday)) {
        return this.createError({
          path: 'beforeAndAfterSchoolCare',
          message: 'Select at least one day',
        });
      }

      return true;
    }),
});

export const StudentSimpleValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  parentEmail: Yup.string().test('isValidEmail', 'Invalid email', (value) => {
    if (value) {
      var pattern = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      return pattern.test(value);
    }

    return true;
  }),
  dob: Yup.string().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
});

export const StudentNewUpdateValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  parentEmail: Yup.string().test('isValidEmail', 'Invalid email', (value) => {
    if (value) {
      var pattern = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      return pattern.test(value);
    }

    return true;
  }),
  dob: Yup.string().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  isBeforeAndAfterSchoolCareRequire: Yup.boolean(),
  beforeAndAfterSchoolCare: Yup.object({
    monday: Yup.boolean(),
    tuesday: Yup.boolean(),
    wednesday: Yup.boolean(),
    thursday: Yup.boolean(),
    friday: Yup.boolean(),
  }).test('atLeastOneDay', 'At least one day should be selected', (value, context) => {
    if (context.parent.isBeforeAndAfterSchoolCareRequire) {
      return value.monday || value.tuesday || value.wednesday || value.thursday || value.friday;
    }
    return true;
  }),
  fromTime: Yup.string().when('isBeforeAndAfterSchoolCareRequire', {
    is: true,
    then: (schema) => schema.required('From Time is required'),
    otherwise: (schema) => schema,
  }),
  toTime: Yup.string().when('isBeforeAndAfterSchoolCareRequire', {
    is: true,
    then: (schema) => schema.required('To Time is required').nullable(),
    otherwise: (schema) => schema,
  }),
});
