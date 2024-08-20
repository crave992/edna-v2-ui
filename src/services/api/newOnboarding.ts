import { postApiRequestOptionsFormData } from '@/utils/apiUtils';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

  export const sendOnboardingEmail = async (id: number) => {
    const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
    var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Onboarding/SendOnboardingEmail/${id}`;
    try {
      const response = await fetch(rqstUrl, {
        method: 'POST',
        headers: options.headers,
      });
  
      return response;
    } catch (error) {
      console.log(error);
    }

    
};