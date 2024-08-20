import { postApiRequestOptions, postApiRequestOptionsFormData } from '@/utils/apiUtils';

export const updateStaff = async (formData: FormData, id: number) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Staff/${id}`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'PUT',
      headers: options.headers,
      body: formData,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateStaffPicture = async (formData: FormData) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Staff/UpdatePicture`;
  try {
    await fetch(rqstUrl, {
      method: 'PUT',
      headers: options.headers,
      body: formData,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStaffDeactivation = async (data: any, staffId: number) => {
  const options = postApiRequestOptions(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Staff/Deactivate/${staffId}`;
  try {
    await fetch(rqstUrl, {
      method: 'PATCH',
      headers: options.headers,
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStaffActivation = async (data: any, staffId: number) => {
  const options = postApiRequestOptions(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Staff/Activate/${staffId}`;
  try {
    await fetch(rqstUrl, {
      method: 'PATCH',
      headers: options.headers,
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
};
