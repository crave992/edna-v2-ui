import {
  getApiRequestNoAuthOptions,
  postApiRequestOptions,
  postApiRequestOptionsFormData,
  postApiRequestOptionsFormDataJSON,
} from '@/utils/apiUtils';

export const updateParent = async (formData: FormData) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Parent`;
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

export const updateParentPicture = async (formData: FormData) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Parent/UpdatePicture`;
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

export const updateParentOnboarding = async (formData: FormData) => {
  const options = getApiRequestNoAuthOptions();
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Onboarding/UpdateParentProfile`;
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

export const updateParentStatus = async (data: any, parentId: number) => {
  const options = postApiRequestOptions(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Parent/${data.status ? "Activate": "Deactivate"}/${parentId}`;
  try {
    await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
    });
  } catch (error) {
    console.log(error);
  }
};