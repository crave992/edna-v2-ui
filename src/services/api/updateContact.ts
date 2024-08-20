import { postApiRequestOptionsFormData } from '@/utils/apiUtils';

export const updateContact = async (formData: FormData, id: number) => {
  //Bypass nextjs to be able to save profilepic
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/UserContact/${id}`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'PUT',
      headers: options.headers,
      body: formData,
    });
  } catch (error) {
    console.log(error);
  }
};
