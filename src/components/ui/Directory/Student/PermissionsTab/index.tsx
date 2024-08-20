import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { StudentInputFormDto } from '@/dtos/StudentInpurFormDto';
import { useQueryClient } from '@tanstack/react-query';
import { StudentDto } from '@/dtos/StudentDto';
import { QuestionResponse } from '../AboutTab';
import { updateStudentPermissions } from '@/services/api/updateStudent';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import { useContext, useEffect } from 'react';
import { useStudentInputForm } from '@/hooks/queries/useStudentsQuery';
import { UserContext } from '@/context/UserContext';
import { formatDate } from '@/utils/dateFormatter';

interface StudentPermissionTabProps {
  data: StudentDto;
  isEditing: boolean;
  setIsEditing: Function;
  setIsLoading: Function;
  isLoadingData: boolean;
  formId: string;
}

export interface StudentInputFormModel {
  [key: string]: any;
}

export const createValidationSchema = (data: StudentInputFormDto[]) => {
  const schemaFields: { [key: string]: any } = {};

  if (Array.isArray(data)) {
    data.map((item) => {
      schemaFields[`question_${item.questionId}`] = Yup.string();
    });
  }

  return Yup.object().shape(schemaFields);
};

const StudentPermissionsTab = ({ data, isEditing, setIsEditing, setIsLoading, formId }: StudentPermissionTabProps) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);

  const { data: questionsData } = useStudentInputForm({ studentId: data.id, type: 'GeneralPermissions' });

  const validationSchema = createValidationSchema(questionsData);
  const methods = useForm<StudentInputFormModel>({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (Array.isArray(questionsData) && questionsData.length > 0) {
      questionsData.forEach((question) => {
        const fieldName = `question_${question.questionId}`;
        if (question.answer !== '') {
          methods.setValue(fieldName, question.answer);
          methods.setValue(`note_${question.questionId}`, question.notes || '');
        }
      });
    }
  }, [questionsData, methods]);

  const onSubmit = async (formData: any) => {
    setIsLoading(true);
    const formattedData: QuestionResponse[] | null = Object.keys(formData)
      .map((key): QuestionResponse | null => {
        if (key.startsWith('question_')) {
          const questionId = parseInt(key.split('_')[1]);
          return {
            questionId: questionId,
            answer: formData[key],
            notes: formData[`note_${questionId}`] || '',
            acceptTerms: false,
            username: user?.fullName || '',
          };
        }
        return null;
      })
      .filter((item): item is QuestionResponse => item !== null);

    await updateStudentPermissions(formattedData, data?.id).then(() => {
      queryClient.invalidateQueries(['students-directory', data?.id, 'input-form', { type: 'GeneralPermissions' }]);
      setIsEditing(false);
      setIsLoading(false);
    });

    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="tw-min-w-[1016px] tw-mx-4xl " id={formId}>
        {Array.isArray(questionsData) &&
          questionsData.map((question: StudentInputFormModel) => (
            <div
              key={question.question}
              className="tw-flex tw-space-x-4xl tw-pb-2xl last:tw-border-0 tw-border tw-border-solid tw-border-x-0 tw-border-t-0 tw-border-secondary tw-py-3xl"
            >
              <div className="md:tw-w-1/4 sm:tw-w-1/2 ">
                <div className="tw-text-sm-semibold tw-text-secondary">{question.question}</div>
              </div>
              <div className="tw-space-y-sm md:tw-w-2/4 sm:tw-w-1/2">
                <div className="tw-flex tw-space-x-3xl">
                  {isEditing ? (
                    <div className="tw-w-full tw-space-y-xl">
                      <div className="tw-flex tw-w-full tw-space-x-2xl">
                        <CustomInput
                          control={methods.control}
                          type="radio"
                          name={`question_${question.questionId}`}
                          label="Yes"
                          containerClassName="tw-flex-1"
                          value="true"
                        />
                        <CustomInput
                          control={methods.control}
                          type="radio"
                          name={`question_${question.questionId}`}
                          label="No"
                          containerClassName="tw-flex-1"
                          value="false"
                        />
                      </div>
                      <div>
                        <CustomInput
                          control={methods.control}
                          type="textarea"
                          name={`note_${question.questionId}`}
                          placeholder="Note"
                          containerClassName="tw-flex-1"
                          resize='none'
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      {question.answer !== '' ? (
                        <div className="tw-flex-row tw-w-full tw-space-y-lg">
                          <div className="tw-text-sm-medium tw-text-tertiary">
                            {(question.answer === 'true' ? 'Yes' : 'No')}
                          </div>
                          {question.notes ? (
                            <div className="tw-flex-row tw-w-full">
                              <div className="tw-text-sm-medium tw-text-tertiary tw-mb-xs">Note</div>
                               <div className="tw-text-xs-regular tw-text-tertiary tw-mb-md">
                                {`${question.notes}`}
                              </div>
                            </div>
                            ) 
                          : ''}
                        </div>
                      ) : 'Not answered yet'}
                    </div>
                  )}
                </div>
              </div>
              {question.username ? (
                <div className="tw-flex-row">
                  <div className="tw-text-sm-medium tw-text-tertiary tw-mb-xs">Answered by</div>
                  <div className="tw-text-xs-regular tw-text-tertiary tw-mb-md">
                  {`${question.username}`}
                  </div>
                  
                </div>
              ) : ''}
              {question.answerUpdatedDate ? (
                <div className="tw-flex-row">
                  <div className="tw-text-sm-medium tw-text-tertiary tw-mb-xs">Date Updated</div>
                  <div className="tw-text-xs-regular tw-text-tertiary tw-mb-md">
                    {formatDate(question.answerUpdatedDate|| '', 'MM-DD-YYYY')}
                  </div>
                </div>
              ) : ''}
            </div>
          ))}
      </form>
    </FormProvider>
  );
};

export default StudentPermissionsTab;
