import { postApiRequestOptionsFormData } from '@/utils/apiUtils';

const getApiRoute = (type: string) => {
  switch (type) {
    case 'Medical':
      return 'GetMedicalReport';
    case 'Attendance':
      return 'GetAttendanceReport';
    case 'Students':
      return 'GetStudentDirectoryReport';
    case 'Parents':
      return 'GetParentDirectoryReport';
  }
};

export const generateReport = async (type: string, data: any) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  let url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Report/${getApiRoute(type)}`);

  Object.keys(data).map((item: any) => {
    if (Array.isArray(data[item])) {
      data[item].forEach((id: string) => url.searchParams.append(item, id));
    } else {
      url.searchParams.append(item, data[item]);
    }
  });

  var rqstUrl = url;
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
      link.setAttribute('download', data.reportTitle);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('Failed to download file:', response.statusText);
    }
    return true;
    // return await response.json();
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default generateReport;
