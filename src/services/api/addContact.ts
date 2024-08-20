import { postApiRequestOptionsFormData } from '@/utils/apiUtils';

export const addContact = async (formData: FormData) => {
  //Bypass nextjs to be able to save profilepic
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/UserContact`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
      body: formData,
    });
  } catch (error) {
    console.log(error);
  }
};
