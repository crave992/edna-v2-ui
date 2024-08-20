import { postApiRequestOptionsFormData } from '@/utils/apiUtils';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

export const uploadFile = async (formData: FormData, id: number, type: string) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/File/UploadFile/${capitalizeFirstLetter(type)}/${id}`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const cloneFile = async (id: number, type: string) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/File/CloneFile/${type}/${id}`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const deleteFile = async (id: number, type: string) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/File/DeleteFile/${type}/${id}`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'DELETE',
      headers: options.headers,
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const downloadFile = async (id: number, type: string, fileName: string) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/File/DownloadFile/${type}/${id}`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'GET',
      headers: options.headers,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('Failed to download file:', response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const renameFile = async (id: number, type: string, fileName: string) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/File/RenameFile/${type}/${id}?filename=${encodeURIComponent(
    fileName
  )}`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'PUT',
      headers: options.headers,
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const uploadOnboardingFile = async (formData: FormData) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Onboarding/UploadOnboardingfile`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};