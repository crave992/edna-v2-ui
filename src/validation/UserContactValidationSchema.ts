import * as Yup from 'yup';

const phoneRegex = /^[0-9-]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const UserContactValidation = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  relationship: Yup.string().required('Relationship is required'),
  email: Yup.string()
    .required('Email is required')
    .matches(
      emailRegex,
      'Invalid email format.'
    ),
  phone: Yup.string()
    .nullable() // Allow null
    .test('is-valid-phone', 'Invalid phone number. Only numbers and dashes are allowed', (value) => {
      if (value == 'null') {
        return true;
      }

      if (!value || value.trim() === '' || value.toUpperCase() === 'N/A') {
        return true;
      }

      return phoneRegex.test(value);
    }),
  role: Yup.string().required('Role is required'),
  isEmergencyContact: Yup.boolean().required('Emergency contact is required'),
  hasAccount: Yup.boolean(),
  childAccountAccess: Yup.boolean(),
  pickupAuthorization: Yup.boolean(),
  profileImage: Yup.mixed()
    .nullable()
    .test('sholdNotMoreThan1Mb', 'Maximum 1mb file allowed', (value, context) => {
      const files = value as unknown as FileList;

      if (files && files?.length > 0) {
        const MAX_ALLOWED_FILE_SIZE = 1024 * 1024; // 1 MB
        const fileSizeInByte = files[0]?.size;

        return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
      }
      return true;
    })
    .test('onlyImageFileAllowed', 'Only image file format allowed', (value, context) => {
      const files = value as unknown as FileList;
      if (files && files.length > 0) {
        const fileType = files[0]?.type;
        if (fileType?.startsWith('image/')) return true;
        return false;
      }

      return true;
    }),
  licenseNumber: Yup.string().when('pickupAuthorization', (pickupAuthorization, schema) =>
    pickupAuthorization
      ? schema
          .required('License Number is required')
          .matches(/^[0-9]+$/, 'Invalid License Number. Only numbers are allowed')
      : schema
  ),
  licenseImage: Yup.mixed()
    .nullable()
    .test('sholdNotMoreThan1Mb', 'Maximum 1mb file allowed', (value, context) => {
      const files = value as unknown as FileList;

      if (files && files?.length > 0) {
        const MAX_ALLOWED_FILE_SIZE = 1024 * 1024; // 1 MB
        const fileSizeInByte = files[0]?.size;

        return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
      }
      return true;
    })
    .test('onlyImageFileAllowed', 'Only image file format allowed', (value, context) => {
      const files = value as unknown as FileList;
      if (files && files.length > 0) {
        const fileType = files[0]?.type;
        if (fileType?.startsWith('image/')) return true;
        return false;
      }

      return true;
    }),
});

export const UpdateUserContactValidation = (isEditing?: boolean) => Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  relationship: Yup.string().required('Relationship is required'),
  email: Yup.string().required('Email is required'),
  phone: Yup.string()
    .nullable()
    .test('is-valid-phone', 'Invalid phone number. Only numbers and dashes are allowed', (value) => {
      if (value == 'null') {
        return true;
      }

      if (!value || value.trim() === '' || value.toUpperCase() === 'N/A') {
        return true;
      }

      return phoneRegex.test(value);
    }),
  role: Yup.string().required('Role is required'),
  isEmergencyContact: Yup.boolean().required('Emergency contact is required'),
  hasAccount: Yup.boolean(),
  childAccountAccess: Yup.number(),
  pickupAuthorization: Yup.boolean(),
  profileImage: Yup.mixed()
    .nullable()
    .test('sholdNotMoreThan1Mb', 'Maximum 25mb file allowed', (value, context) => {
      const files = value as unknown as FileList;

      if (files && files.length > 0) {
        const MAX_ALLOWED_FILE_SIZE = 1024 * 1024 * 25; // 1 MB
        const fileSizeInByte = files[0]?.size;

        return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
      }
      return true;
    })
    .test('onlyImageFileAllowed', 'Only image file format allowed', (value, context) => {
      const files = value as unknown as FileList;
      if (files && files.length > 0) {
        const fileType = files[0]?.type;
        if (fileType?.startsWith('image/')) return true;
        return false;
      }

      return true;
    }),
  licenseNumber: Yup.string().when('pickupAuthorization', {
    is: true,
    then: (schema) => schema.required(`Driver's License Number is required`),
    otherwise: (schema) => schema,
  }),
  licenseImage: Yup.mixed()
    .nullable()
    .when('pickupAuthorization', {
      is: true,
      then: (schema) => schema.required(`Driver's License photo is required`),
      otherwise: (schema) => schema,
    })
    .test('sholdNotMoreThan1Mb', 'Maximum 25mb file allowed', (value, context) => {
      const files = value as unknown as FileList;

      if (files && files?.length > 0) {
        const MAX_ALLOWED_FILE_SIZE = 1024 * 1024 * 25; // 1 MB
        const fileSizeInByte = files[0]?.size;

        return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
      }
      return true;
    }),
  addressLine1: Yup.string().when(['isEmergencyContact', 'isEditing'], {
    is: (isEmergencyContact: boolean) => isEmergencyContact && isEditing,
    then: (schema) => schema.required(`Address is required`),
    otherwise: (schema) => schema,
  }),
  countryId: Yup.string().when(['isEmergencyContact', 'isEditing'], {
    is: (isEmergencyContact: boolean) => isEmergencyContact && isEditing,
    then: (schema) => schema.required(`Country is required`),
    otherwise: (schema) => schema,
  }),
  stateId: Yup.string().when(['isEmergencyContact', 'isEditing'], {
    is: (isEmergencyContact: boolean) => isEmergencyContact && isEditing,
    then: (schema) => schema.required(`State is required`),
    otherwise: (schema) => schema,
  }),
  city: Yup.string().when(['isEmergencyContact', 'isEditing'], {
    is: (isEmergencyContact: boolean) => isEmergencyContact && isEditing,
    then: (schema) => schema.required(`City is required`),
    otherwise: (schema) => schema,
  }),
  zipcode: Yup.string().when(['isEmergencyContact', 'isEditing'], {
    is: (isEmergencyContact: boolean) => isEmergencyContact && isEditing,
    then: (schema) => schema.required(`Zipcode is required`),
    otherwise: (schema) => schema,
  }),
});

export default UserContactValidation;
