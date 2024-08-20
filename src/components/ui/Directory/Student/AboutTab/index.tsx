import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { StudentInputFormDto } from '@/dtos/StudentInpurFormDto';
import { useQueryClient } from '@tanstack/react-query';
import { StudentDto } from '@/dtos/StudentDto';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { updateStudentAbout } from '@/services/api/updateStudent';
import { useStudentInputForm } from '@/hooks/queries/useStudentsQuery';

interface StudentAboutTabProps {
  studentId: number;
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

export interface QuestionResponse {
  questionId: number;
  answer: string;
  notes?: string;
  username?: string;
  acceptTerms: boolean;
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

const StudentAboutTab = ({
  data,
  studentId,
  isEditing,
  setIsEditing,
  setIsLoading,
  isLoadingData,
  formId,
}: StudentAboutTabProps) => {
  const queryClient = useQueryClient();

  const { data: studentInputFormData } = useStudentInputForm({ studentId, type: 'StudentInputForm' });

  const validationSchema = createValidationSchema(studentInputFormData);
  const methods = useForm<StudentInputFormModel>({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
  });

  const onSubmit = (formData: Record<string, any>) => {
    setIsLoading(true);
    const formattedData: QuestionResponse[] | null = Object.keys(formData)
      .map((key): QuestionResponse | null => {
        if (key.startsWith('question_')) {
          const questionId = parseInt(key.split('_')[1]);
          return {
            questionId: questionId,
            answer: formData[key],
            acceptTerms: false,
          };
        }
        return null;
      })
      .filter((item): item is QuestionResponse => item !== null);

    updateStudentAbout(formattedData, studentId).then(() => {
      queryClient.invalidateQueries(['students-directory', studentId, 'input-form', { type: 'StudentInputForm' }]);
      setIsEditing(false);
      setIsLoading(false);
    });
  };

  const categoriesWithQuestions = studentInputFormData?.reduce(
    (acc: { [x: string]: any[] }, question: StudentInputFormModel) => {
      if (question.category?.name) {
        const category = question.category.name;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(question);
      }
      return acc;
    },
    {}
  );

  for (const category in categoriesWithQuestions) {
    categoriesWithQuestions[category].sort(
      (a: { sequence: any }, b: { sequence: any }) => (a.sequence || 0) - (b.sequence || 0)
    );
  }

  const renderQuestionsForCategory = (category: string, questions: StudentInputFormModel[]) => {
    const { control } = methods;
    return questions.map((question) => (
      <div
        key={question.questionId}
        className="tw-flex tw-space-x-4xl tw-pb-2xl last:tw-border-0 tw-border tw-border-solid tw-border-x-0 tw-border-t-0 tw-border-secondary tw-py-3xl"
      >
        <div className="md:tw-w-1/4 sm:tw-w-1/2">
          <div className="tw-text-sm-semibold tw-text-secondary">{question.question}</div>
        </div>
        <div className={`tw-space-y-sm ${isEditing ? 'md:tw-w-2/4' : 'md:tw-w-3/4'} sm:tw-w-1/2`}>
          <div className="tw-flex tw-space-x-3xl">
            {isEditing ? (
              <Controller
                name={`question_${question.questionId}`}
                control={control}
                defaultValue={question.answer}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="tw-w-full tw-rounded-md tw-border-secondary tw-py-lg tw-px-14px tw-resize-none"
                    rows={5}
                  />
                )}
              />
            ) : question.answer ? (
              <div className="tw-text-sm-regular tw-text-primary">
                {question.answer !== '' && capitalizeFirstLetter(question.answer || '')}
              </div>
            ) : (
              <div className="tw-text-sm-regular tw-text-tertiary">Not answered yet.</div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="tw-min-w-[1016px] tw-mx-4xl  tw-py-2xl" id={formId}>
        {categoriesWithQuestions &&
          Object.entries(categoriesWithQuestions).map(([category, questions]) => (
            <div key={category}>
              <div className="tw-py-2xl tw-text-lg-semibold tw-text-primary tw-border tw-border-solid tw-border-x-0 tw-border-t-0 tw-border-secondary">
                {category}
              </div>
              {renderQuestionsForCategory(category, questions as StudentInputFormModel[])}
            </div>
          ))}
      </form>
    </FormProvider>
  );
};

export default StudentAboutTab;
