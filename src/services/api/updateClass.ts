import { postApiRequestOptionsFormData } from '@/utils/apiUtils';

export const updateClassShowBanner = async (showBannerGallery: boolean, id: number) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Class/UpdateShowBanner/${id}?showBanner=${showBannerGallery}`;

  try {
    await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addClassImage = async (formData: FormData, id: number) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Class/AddImageGallery/${id}`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
      body: formData,
    });

    return response.json();
  } catch (error) {
    console.log(error);
  }
};
