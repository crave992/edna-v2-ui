import * as Yup from 'yup';

const StaffValidationSchema = Yup.object().shape({
  title: Yup.string(),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  nickName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .required('Email is required')
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  systemRole: Yup.string().required('Role is required'),
  jobTitleId: Yup.number()
    .required('Job title is required')
    .test('shouldBeGreaterThanZero', 'Job title is required', (value) => {
      if (value <= 0) return false;
      return true;
    }),
  empStartDate: Yup.string().required('Employment start date is required'),
  salaryTypeId: Yup.number()
    .required('Salary type is required')
    .test('shouldBeGreaterThanZero', 'Salary type is required', (value) => {
      if (value <= 0) return false;
      return true;
    }),
  salaryAmount: Yup.string()
    .required('Salary is required')
    .matches(/^\d+\.?\d{0,2}$/, 'Invalid amount'),
  description: Yup.string(),
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

export default StaffValidationSchema;

export const StaffUpdateValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  nickName: Yup.string().required('Nickname is required'),
  email: Yup.string()
    .required('Email is required')
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
    systemRole: Yup.string().required('Role is required'),
  jobTitleId: Yup.number()
    .required('Job title is required')
    .test('shouldBeGreaterThanZero', 'Job title is required', (value) => {
      if (value <= 0) return false;
      return true;
    }),
  empStartDate: Yup.string().required('Employment start date is required'),
  salaryTypeId: Yup.number()
    .required('Salary type is required')
    .test('shouldBeGreaterThanZero', 'Salary type is required', (value) => {
      if (value <= 0) return false;
      return true;
    }),
  salaryAmount: Yup.string()
    .required('Salary is required')
    .matches(/^\d+\.?\d{0,2}$/, 'Invalid amount'),
  description: Yup.string(),
  deleteReason: Yup.string(),
  employmentEndDate: Yup.string().required('Employment end date is required'),
  profileImage: Yup.mixed()
    .nullable()
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

export const StaffDeactivateValidationSchema = Yup.object().shape({
  employmentEndDate: Yup.string().required('Employment end date is required'),
  deleteReason: Yup.string().required('Reason is required'),
});

export const StaffActivateValidationSchema = Yup.object().shape({
  employmentStartDate: Yup.string().required('Employment start date is required'),
  reason: Yup.string().required('Reason is required'),
});

export const StaffUpdateBySelfValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  nickName: Yup.string(),
  description: Yup.string(),
  systemRole: Yup.string().required('Role is required'),
  jobTitleId: Yup.number()
    .required('Job title is required')
    .test('shouldBeGreaterThanZero', 'Job title is required', (value) => {
      if (value <= 0) return false;
      return true;
    }),
  empStartDate: Yup.string().required('Employment start date is required'),
  employmentEndDate: Yup.string(),
  deleteReason: Yup.string().test(
    'deleteReasonRequired',
    'Please provide reason for termination.',
    function (value) {
      const { employmentEndDate } = this.parent;
      if (employmentEndDate) {
        return Boolean(value);
      }
      return true;
    }
  ),
  countryId: Yup.number().test('shouldBeGreaterThanZero', 'Country is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  salaryTypeId: Yup.number()
    .required('Salary type is required')
    .test('shouldBeGreaterThanZero', 'Salary type is required', (value) => {
      if (value <= 0) return false;
      return true;
    }),
  salaryAmount: Yup.string()
    .required('Salary is required')
    .matches(/^\d+\.?\d{0,2}$/, 'Invalid amount'),
  stateId: Yup.number().test('shouldBeGreaterThanZero', 'State is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  email: Yup.string()
    .required('Email is required')
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  addressLine1: Yup.string().required('Address line 1 is required'),
  addressLine2: Yup.string(),
  city: Yup.string().required('City is required'),
  zipcode: Yup.string().required('Zipcode is required'),
  personalEmail: Yup.string()
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  phoneNumber: Yup.string().matches(/^[0-9-]+$/, 'Invalid phone number. Only numbers and dashes are allowed'),
  homePhoneNumber: Yup.string()
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .matches(/^[0-9-]+$/, 'Invalid phone number. Only numbers and dashes are allowed'),
  ethnicityCategoryId: Yup.number(),
  ethnicityId: Yup.number(),
  certifiedForLevels: Yup.array().of(Yup.number()),
  timezoneId: Yup.string(),
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
});

export const StaffUpdateBySelfValidationSchemaUserStaff = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  nickName: Yup.string(),
  description: Yup.string(),
  systemRole: Yup.string().required('Role is required'),
  jobTitleId: Yup.number()
    .required('Job title is required')
    .test('shouldBeGreaterThanZero', 'Job title is required', (value) => {
      if (value <= 0) return false;
      return true;
    }),
  empStartDate: Yup.string().required('Employment start date is required'),
  employmentEndDate: Yup.string(),
  deleteReason: Yup.string().test(
    'deleteReasonRequired',
    'Please provide reason for termination.',
    function (value) {
      const { employmentEndDate } = this.parent;
      if (employmentEndDate) {
        return Boolean(value);
      }
      return true;
    }
  ),
  countryId: Yup.number().test('shouldBeGreaterThanZero', 'Country is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  salaryTypeId: Yup.number()
    .required('Salary type is required')
    .test('shouldBeGreaterThanZero', 'Salary type is required', (value) => {
      if (value <= 0) return false;
      return true;
    }),
  stateId: Yup.number().test('shouldBeGreaterThanZero', 'State is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  email: Yup.string()
    .required('Email is required')
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  addressLine1: Yup.string().required('Address line 1 is required'),
  addressLine2: Yup.string(),
  city: Yup.string().required('City is required'),
  zipcode: Yup.string().required('Zipcode is required'),
  personalEmail: Yup.string()
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  phoneNumber: Yup.string().matches(/^[0-9-]+$/, 'Invalid phone number. Only numbers and dashes are allowed'),
  homePhoneNumber: Yup.string()
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .matches(/^[0-9-]+$/, 'Invalid phone number. Only numbers and dashes are allowed'),
  ethnicityCategoryId: Yup.number(),
  ethnicityId: Yup.number(),
  certifiedForLevels: Yup.array().of(Yup.number()),
  timezoneId: Yup.string(),
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
});

export const StaffEmergencyInfoValidationSchema = Yup.object().shape({
  whatToDoInCaseOfEmergency: Yup.string(),
  preferredHospital: Yup.string(),
  doctorInformation: Yup.string(),
  phoneNumber: Yup.string(),
});

export const StaffMedicalConditionValidationSchema = Yup.object().shape({
  conditionOne: Yup.string(),
  conditionTwo: Yup.string(),
  medicineNames: Yup.string(),
  allergies: Yup.string(),
  physicalImpairmentsNotes: Yup.string(),
  additionalComments: Yup.string(),
  acceptHippaTerms: Yup.boolean().test('shouldBeRequired', 'Please check this box', (value) => {
    const output = value as unknown as boolean;
    return output;
  }),
});

export const StaffBankAccountInfoValidationSchema = Yup.object().shape({
  bankAccountTypeId: Yup.number().test('shouldBeGreaterThanZero', 'Account type is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  bankName: Yup.string().required('Bank name is required'),
  routingNumber: Yup.string(),
  confirmRoutingNumber: Yup.string().oneOf([Yup.ref('routingNumber')], "Routing number didn't match"),
  accountNumber: Yup.string(),
  confirmAccountNumber: Yup.string().oneOf([Yup.ref('accountNumber')], "Account number didn't match"),
  acceptTerms: Yup.boolean().test('shouldBeRequired', 'Please check this box', (value) => {
    const output = value as unknown as boolean;
    return output;
  }),
});

export const StaffEmploymentFormValidationSchema = Yup.object().shape({
  employmentFormId: Yup.number().test('shouldBeGreaterThanZero', 'Employment form is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  document: Yup.mixed()
    .when('docUrl', (docUrl) => {
      if (docUrl && !docUrl[0]) {
        return Yup.mixed().test('shouldBeRequired', 'Document is required', (value, context) => {
          const files = value as unknown as FileList;
          if (!files || files.length <= 0) return false;
          return true;
        });
      } else {
        return Yup.mixed();
      }
    })
    .test('shouldNotMoreThan5Mb', 'Maximum 5mb file allowed', (value, context) => {
      const files = value as unknown as FileList;

      if (files && files.length > 0) {
        const MAX_ALLOWED_FILE_SIZE = 1024 * 5120; // 5 MB
        const fileSizeInByte = files[0].size;

        return fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
      }
      return true;
    }),
  // .test("onlyPdfFileAllowed", "Only pdf file format allowed", (value, context) => {

  //     const files = (value as unknown) as FileList;

  //     if (files && files.length > 0) {
  //         const fileType = files[0].type;
  //         if (fileType.startsWith('application/pdf')) return true;
  //         return false;
  //     };

  //     return true;
  // }),
});

export const StaffDegreeValidationSchema = Yup.object().shape({
  degreeId: Yup.number().test('shouldBeGreaterThanZero', 'Degree is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  name: Yup.string().required('Name is required'),
});

export const StaffCertificationValidationSchema = Yup.object().shape({
  certificateId: Yup.number().test('shouldBeGreaterThanZero', 'Certificate is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  expiryDate: Yup.string(),
});

export const StaffEmergencyContactValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string(),
  preferredName: Yup.string(),
  relationship: Yup.string(),
  homeAddress: Yup.string().required('Home address is required'),
  workAddress: Yup.string(),
  countryId: Yup.number().test('shouldBeGreaterThanZero', 'Country is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  stateId: Yup.number().test('shouldBeGreaterThanZero', 'State is required', (value) => {
    if (!value || value <= 0) return false;
    return true;
  }),
  city: Yup.string().required('City is required'),
  zipcode: Yup.string().required('Zipcode is required'),
  email: Yup.string().matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  phone: Yup.string().required('Phone is required'),
});

export const StaffReferenceValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.string(),
  phone: Yup.string(),
  relationship: Yup.string(),
  yearsKnown: Yup.string(),
});

export const StaffProfessionalDevelopmentValidationSchema = Yup.object().shape({
  trainingOrganization: Yup.string().required('Training Organization is required'),
  topic: Yup.string().required('Topic is required'),
  remainingHours: Yup.string()
    .required('Remaining hours is required')
    .matches(/^\d+\.?\d{0,2}$/, 'Invalid hour')
    .test('sholdBeGreaterThanOrEqualZero', "Can't be less than zero", (value) => {
      if (!value || +value < 0) return false;
      return true;
    }),
  entryDate: Yup.string().required('Date Of Entry is required'),
  note: Yup.string(),
});

export const StaffEmploymentHistoryValidationSchema = Yup.object().shape({
  dateFrom: Yup.string().required('From Date is required'),
  dateTo: Yup.string(),
  organisationName: Yup.string().required('Place of Employment is required'),
  address: Yup.string(),
  phone: Yup.string(),
  nameOfSupervisor: Yup.string(),
});
