import { postApiRequestOptions } from '@/utils/apiUtils';

export const addStudentAttendance = async (formData: FormData) => {
  const options = postApiRequestOptions(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ClassAttendance/StudentAttendance`;

  const jsonData: any = {};
  formData.forEach((value, key) => (jsonData[key] = value));

  try {
    const response = await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
      body: JSON.stringify(jsonData),
    });
  } catch (error) {
    console.log(error);
  }
};
