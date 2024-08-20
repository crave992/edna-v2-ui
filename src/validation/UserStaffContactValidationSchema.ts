import * as Yup from 'yup';

const phoneRegex = /^[0-9-]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const UserStaffContactValidation = (isEditing?: boolean) => Yup.object().shape({
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
    .nullable()
    .test(
      'is-valid-phone',
      'Invalid phone number. Only numbers and dashes are allowed',
      value => {
        // If the value is empty, null, or "N/A", return true (bypass the regex check)
        if (!value || value.trim() === '' || value.toUpperCase() === 'N/A') {
          return true;
        }
        // Otherwise, test the value against the regex
        return phoneRegex.test(value);
      }
    ),
  role: Yup.string().required('Role is required'),
  isEmergencyContact: Yup.boolean().required('Emergency contact is required'),
  profileImage: Yup.mixed()
    .nullable()
    .test('shouldNotExceed25Mb', 'Maximum 25MB file allowed', (value) => {
      const files = value as unknown as FileList;

      if (files && files.length > 0) {
        const MAX_ALLOWED_FILE_SIZE = 1024 * 1024 * 25; // 25 MB
        const fileSizeInBytes = files[0].size;

        return fileSizeInBytes <= MAX_ALLOWED_FILE_SIZE;
      }
      return true;
    })
    .test('onlyImageFileAllowed', 'Only image file formats are allowed', (value) => {
      const files = value as unknown as FileList;

      if (files && files.length > 0) {
        const fileType = files[0].type;
        return fileType.startsWith('image/');
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

export default UserStaffContactValidation;