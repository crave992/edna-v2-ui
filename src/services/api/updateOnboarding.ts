import { QuestionResponse } from '@/components/ui/OnBoarding/ChildAbout';
import {
  getApiRequestNoAuthOptions,
  postApiRequestNoAuthOptionsFormData,
  postApiRequestNoAuthOptionsFormDataJSON,
  delApiRequestNoAuthOptions,
} from '@/utils/apiUtils';

export const updateParentOnboarding = async (formData: FormData, code: string) => {
  const options = getApiRequestNoAuthOptions();
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Onboarding/UpdateParentProfile?code=${encodeURIComponent(
    String(code)
  )}`;
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

export const updateOnboardingStep = async (data: any, code: string) => {
  const options = getApiRequestNoAuthOptions();
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Onboarding/UpdateOnboardingStep?code=${encodeURIComponent(
    String(code)
  )}`;
  try {
    await fetch(rqstUrl, {
      method: 'PUT',
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json-patch+json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStudentOnboarding = async (formData: FormData, code: string, studentId: number) => {
  const options = getApiRequestNoAuthOptions();
  var rqstUrl = `${
    process.env.NEXT_PUBLIC_API_BASE_URL
  }/Onboarding/UpdateStudentProfile/${studentId}?code=${encodeURIComponent(String(code))}`;
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

export const updateStudentInputForm = async (
  formData: QuestionResponse,
  code: string,
  studentId: number,
  formType: string
) => {
  const options = postApiRequestNoAuthOptionsFormDataJSON();
  var rqstUrl = `${
    process.env.NEXT_PUBLIC_API_BASE_URL
  }/Onboarding/SaveStudentInputForm/${studentId}/${formType}?code=${encodeURIComponent(String(code))}`;
  try {
    const response = await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
      body: JSON.stringify(formData),
    });
  } catch (error) {
    console.log(error);
  }
};

export const postStudentMedical = async (formData: FormData, code: string) => {
  const options = postApiRequestNoAuthOptionsFormData();
  var rqstUrl = `${
    process.env.NEXT_PUBLIC_API_BASE_URL
  }/Onboarding/SaveStudentMedicalInformation?code=${encodeURIComponent(String(code))}`;
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

export const updateStudentMedical = async (formData: FormData, code: string, id: number) => {
  const options = postApiRequestNoAuthOptionsFormData();
  var rqstUrl = `${
    process.env.NEXT_PUBLIC_API_BASE_URL
  }/Onboarding/UpdateStudentMedicalInformation/${id}?code=${encodeURIComponent(String(code))}`;
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

export const postAddContactToStudent = async (formData: FormData, code: string) => {
  const options = postApiRequestNoAuthOptionsFormData();
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Onboarding/AddUserContactToStudents?code=${encodeURIComponent(
    String(code)
  )}`;
  
  try {
    await fetch(rqstUrl, {
      method: 'POST',
      headers: options.headers,
      body: formData,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateOnboardingParentPicture = async (formData: FormData, code: string) => {
  const options = postApiRequestNoAuthOptionsFormData();
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Onboarding/UpdateParentPicture?code=${encodeURIComponent(
    String(code)
  )}`;
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

export const updateOnboardingStudentPicture = async (formData: FormData, code: string, id: number) => {
  const options = postApiRequestNoAuthOptionsFormData();
  var rqstUrl = `${
    process.env.NEXT_PUBLIC_API_BASE_URL
  }/Onboarding/UpdateStudentPicture/${id}?code=${encodeURIComponent(String(code))}`;
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

export const deleteOnboardingStudentContact = async (code: string, userContactMapId: number) => {
  const options = delApiRequestNoAuthOptions();
  var rqstUrl = `${
    process.env.NEXT_PUBLIC_API_BASE_URL
  }/Onboarding/RemoveStudentUserContact/${userContactMapId}?code=${encodeURIComponent(String(code))}`;
  try {
    await fetch(rqstUrl, {
      method: 'DELETE',
      headers: options.headers,
    });
  } catch (error) {
    console.log(error);
  }
};
