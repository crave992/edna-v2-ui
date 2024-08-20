import * as Yup from 'yup';

export const AttendanceValidationSchema = Yup.object().shape({
  attendanceDate: Yup.date().required('Attendance date is required.'),
  studentId: Yup.string().required('Student ID is required.'),
  classId: Yup.string().required('Class ID data is required.'),
  presenceType: Yup.string().required('Status is required.'),
  action: Yup.string(),
  isTardy: Yup.string(),
  note: Yup.string(),
  time: Yup.string()
    .required('Time is required')
    .matches(/^(0?[1-9]|1[012]):[0-5][0-9](am|pm)$/, 'Time must be in the format HH:MMam/pm (8:00am)'),
});
