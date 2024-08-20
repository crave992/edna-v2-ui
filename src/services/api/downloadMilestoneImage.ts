import { postApiRequestOptionsFormData } from '@/utils/apiUtils';


export const downloadFile = async (id: number, fileName: string) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/StudentLessonNotes/Download/${id}`;
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
