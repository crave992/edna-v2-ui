import { postApiRequestOptions } from '@/utils/apiUtils';

export const deleteContact = async (id: number | undefined) => {
  const options = postApiRequestOptions(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/UserContact/RemoveContactMap/${id}`;
  try {
    await fetch(rqstUrl, {
      method: 'DELETE',
      headers: options.headers,
    });
  } catch (error) {
    console.log(error);
  }
};
