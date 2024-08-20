import { postApiRequestOptionsFormData } from '@/utils/apiUtils';

export const addStudent = async (formData: FormData) => {
  //Bypass nextjs to be able to save profilepic
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Student`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
      body: formData,
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};