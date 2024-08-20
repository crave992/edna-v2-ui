import { QuestionResponse } from '@/components/ui/Directory/Student/AboutTab';
import {
  postApiRequestOptions,
  postApiRequestOptionsFormData,
  postApiRequestOptionsFormDataJSON,
} from '@/utils/apiUtils';

export const updateStudent = async (formData: FormData, id: number) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Student/${id}`;
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

export const updateStudentAbout = async (formData: QuestionResponse[], id: number) => {
  const options = postApiRequestOptionsFormDataJSON(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/StudentConsentAndQuestionForm/SaveStudentInputFormByStudentIdAndFormType/${id}/StudentInputForm`;
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

export const updateStudentPermissions = async (formData: QuestionResponse[], id: number) => {
  const options = postApiRequestOptionsFormDataJSON(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/StudentConsentAndQuestionForm/SaveStudentInputFormByStudentIdAndFormType/${id}/GeneralPermissions`;
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

export const updateStudentPicture = async (formData: FormData) => {
  const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Student/UpdatePicture`;
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

export const updateStudentStatus = async (data: any, studentId: number) => {
  const options = postApiRequestOptions(localStorage.getItem('at'));
  var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Student/UpdateStudentState/${studentId}?active=${data.active}`;
  try {
    await fetch(rqstUrl, {
      method: 'PUT',
      headers: options.headers,
    });
  } catch (error) {
    console.log(error);
  }
};
