import { NextPage } from 'next';
import { CustomModal } from '@/components/ui/CustomModal';
import ImageBrand from '@/components/common/ImageBrand';
import OnboardingProgress, { ProgressProps } from '../components/Progress';
import { useEffect, useState } from 'react';
import ArrowCircleRightIcon from '@/components/svg/ArrowCircleRight';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { StudentInputFormModel } from '../../Directory/Student/AboutTab';
import * as Yup from 'yup';
import { StudentInputFormDto } from '@/dtos/StudentInpurFormDto';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import { updateOnboardingStep, updateStudentInputForm } from '@/services/api/updateOnboarding';
import { useOnboardingStudentInputFormQuery } from '@/hooks/queries/useOnboardingQuery';
import { LoadingSpinner } from '@/components/svg/LoadingSpinner';

export interface QuestionResponse {
  questionId: number;
  answer: string;
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

const ChildAbout: NextPage<ProgressProps> = ({
  currentStep,
  setCurrentStep,
  stepText,
  selectedStudent,
  code,
  setSelectedStudentId,
  setVerified,
}) => {
  const queryClient = useQueryClient();
  const [showLoader, setShowLoader] = useState(false);
  const [showPermissions, setShowPermissions] = useState<boolean>(false);

  const { data: studentInputFormData } = useOnboardingStudentInputFormQuery({
    code: code!,
    studentId: selectedStudent?.id,
    inputFormType: 'StudentInputForm',
  });
  const { data: questionsData } = useOnboardingStudentInputFormQuery({
    code: code!,
    studentId: selectedStudent?.id,
    inputFormType: 'GeneralPermissions',
  });

  const validationSchema = createValidationSchema(studentInputFormData);
  const methods = useForm<StudentInputFormModel>({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
  });

  const validationSchemaPermissions = createValidationSchema(questionsData);
  const methodsPermissions = useForm<StudentInputFormModel>({
    resolver: yupResolver(validationSchemaPermissions),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (Array.isArray(studentInputFormData) && studentInputFormData.length > 0) {
      studentInputFormData.forEach((question) => {
        const fieldName = `about-question_${question.questionId}`;
        if (question.answer !== '') {
          methods.setValue(fieldName, question.answer);
        }
      });
    }
  }, [studentInputFormData, methods]);

  useEffect(() => {
    if (Array.isArray(questionsData) && questionsData.length > 0) {
      questionsData.forEach((question) => {
        const fieldName = `permission-question_${question.questionId}`;
        if (question.answer !== '') {
          methodsPermissions.setValue(fieldName, question.answer);
        }
      });
    }
  }, [questionsData, methodsPermissions]);

  const saveInputFormOnBlur = async (formData: any) => {
    let formattedData: QuestionResponse = {
      questionId: 0,
      answer: '',
      acceptTerms: false,
    };

    for (const key of Object.keys(formData)) {
      if (key.startsWith('about-question_')) {
        const questionId = parseInt(key.split('_')[1]);
        formattedData = {
          questionId: questionId,
          answer: formData[key],
          acceptTerms: false,
        };
        break;
      }
    }

    updateStudentInputForm(formattedData, code!, selectedStudent?.id!, 'StudentInputForm');
  };

  const savePermissionOnClick = async (formData: any) => {
    let formattedData: QuestionResponse = {
      questionId: 0,
      answer: '',
      acceptTerms: false,
    };

    for (const key of Object.keys(formData)) {
      if (key.startsWith('permission-question_')) {
        const questionId = parseInt(key.split('_')[1]);
        formattedData = {
          questionId: questionId,
          answer: formData[key],
          acceptTerms: false,
        };
        break;
      }
    }

    updateStudentInputForm(formattedData, code!, selectedStudent?.id!, 'GeneralPermissions');
  };

  const handleGoToPermisions = () => {
    setShowPermissions(true);
  };

  const handleGoBack = () => {
    setShowLoader(true);
    const requestData = {
      step: 0,
      studentId: selectedStudent?.id,
    };

    updateOnboardingStep(requestData, code!).then(() => {
      queryClient.invalidateQueries(['onboarding-student-questions-inputform', selectedStudent?.id]);
      queryClient.invalidateQueries(['onboarding-student', code, selectedStudent?.id]);
      queryClient.invalidateQueries(['onboarding-parent', code]);
      setShowLoader(false);
      setShowPermissions(false);
    });
  };

  const handleOncancel = () => {
    setShowLoader(true);
    const requestData = {
      step: 1,
      studentId: selectedStudent?.id,
    };

    updateOnboardingStep(requestData, code!).then(() => {
      queryClient.invalidateQueries(['onboarding-student-questions-inputform', selectedStudent?.id]);
      queryClient.invalidateQueries(['onboarding-student', code, selectedStudent?.id]);
      queryClient.invalidateQueries(['onboarding-parent', code]);
      setShowPermissions(false);
      setShowLoader(false);
    });
  };

  const handleSave = async () => {
    setShowLoader(true);
    const requestData = {
      step: 2,
      studentId: selectedStudent?.id,
    };

    await updateOnboardingStep(requestData, code!).then(() => {
      queryClient.invalidateQueries(['onboarding-student-questions-inputform', selectedStudent?.id]);
      queryClient.invalidateQueries(['onboarding-student', code, selectedStudent?.id]);
      queryClient.invalidateQueries(['onboarding-parent', code]);
      setShowLoader(false);
    });
  };

  const categoriesWithQuestions =
    studentInputFormData &&
    studentInputFormData.length > 0 &&
    studentInputFormData?.reduce((acc: { [x: string]: any[] }, question: StudentInputFormModel) => {
      if (question.category?.name) {
        const category = question.category.name;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(question);
      }
      return acc;
    }, {});

  for (const category in categoriesWithQuestions) {
    categoriesWithQuestions[category].sort(
      (a: { sequence: any }, b: { sequence: any }) => (a.sequence || 0) - (b.sequence || 0)
    );
  }

  const renderQuestionsForCategory = (category: string, questions: StudentInputFormModel[]) => {
    const { control } = methods;
    return questions.map((question) => (
      <div key={`about-${question.questionId}`} className="tw-flex tw-flex-col tw-space-y-sm">
        <div className="first:tw-pt-lg tw-text-sm-semibold tw-text-secondary">{question.question}</div>
        <div className="tw-flex">
          <Controller
            name={`about-question_${question.questionId}`}
            control={control}
            defaultValue={question.answer}
            render={({ field }) => (
              <textarea
                {...field}
                className="tw-w-full tw-rounded-md tw-border-secondary tw-py-lg tw-px-14px tw-resize-none"
                rows={5}
                onBlur={(e) => saveInputFormOnBlur({ [`about-question_${question.questionId}`]: e.target.value })}
              />
            )}
          />
        </div>
      </div>
    ));
  };

  return (
    <>
      <CustomModal.Header>
        <div className="tw-space-y-xl">
          <div className="tw-flex tw-items-center tw-justify-center">
            <ImageBrand size={48} />
          </div>
          {!showPermissions ? (
            <div className="tw-space-y-xs tw-text-center">
              <div className="tw-text-lg-semibold tw-text-primary">About Your Child</div>
            </div>
          ) : (
            <div className="tw-space-y-xs tw-text-center">
              <div className="tw-text-lg-semibold tw-text-primary">Set Permissions</div>
            </div>
          )}
        </div>
      </CustomModal.Header>
      <CustomModal.Content>
        <div className="tw-mb-3xl">
          <OnboardingProgress
            stepText={stepText}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            setSelectedStudentId={setSelectedStudentId}
            setVerified={setVerified}
          />
        </div>
        <div className="tw-flex tw-items-center tw-border tw-border-solid tw-border-secondary tw-rounded-full tw-py-xl tw-px-2xl tw-justify-center">
          <div className="tw-text-lg-regular tw-text-black">{`${selectedStudent?.firstName} ${selectedStudent?.lastName}`}</div>
        </div>
        {!showPermissions ? (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleGoToPermisions)}
              className="tw-w-full tw-py-xl"
              id="onboarding-child-about"
            >
              {categoriesWithQuestions &&
                Object.entries(categoriesWithQuestions).map(([category, questions]) => (
                  <div key={category} className="tw-pb-2xl">
                    <div className="tw-text-lg-semibold tw-text-primary">{category}</div>
                    {renderQuestionsForCategory(category, questions as StudentInputFormModel[])}
                  </div>
                ))}
            </form>
          </FormProvider>
        ) : (
          <FormProvider {...methodsPermissions}>
            <form
              onSubmit={methodsPermissions.handleSubmit(handleSave)}
              className="tw-w-full tw-space-y-2xl tw-pb-4xl"
              id="onboarding-child-permissions"
            >
              {Array.isArray(questionsData) &&
                questionsData.map((question: StudentInputFormModel) => (
                  <div
                    key={`permission-${question.question}`}
                    className="tw-flex tw-flex-col tw-space-y-sm first:tw-pt-xl"
                  >
                    <div className="tw-text-sm-semibold tw-text-secondary">{question.question}</div>
                    <div className="tw-space-y-sm tw-w-full">
                      <div className="tw-flex tw-w-full tw-space-x-2xl">
                        <CustomInput
                          control={methodsPermissions.control}
                          type="radio"
                          name={`permission-question_${question.questionId}`}
                          label="Yes"
                          containerClassName="tw-flex-1"
                          value="true"
                          onChange={() =>
                            savePermissionOnClick({
                              [`permission-question_${question.questionId}`]: 'true',
                            })
                          }
                        />
                        <CustomInput
                          control={methodsPermissions.control}
                          type="radio"
                          name={`permission-question_${question.questionId}`}
                          label="No"
                          containerClassName="tw-flex-1"
                          value="false"
                          onChange={() =>
                            savePermissionOnClick({
                              [`permission-question_${question.questionId}`]: 'false',
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </form>
          </FormProvider>
        )}
      </CustomModal.Content>
      {!showPermissions ? (
        <CustomModal.Footer
          showLoader={showLoader}
          hasCancel={true}
          cancelText="Back"
          submitText="Next"
          submitIcon={showLoader ? <LoadingSpinner /> : <ArrowCircleRightIcon />}
          formId="onboarding-child-about"
          onClick={() => handleGoToPermisions}
          onCancel={() => handleGoBack()}
          flex="row"
          className="!tw-flex-row-reverse !tw-space-x-lg !tw-pt-0"
          submitClass="!tw-h-[44px] !tw-w-[98px]"
          cancelClass="!tw-w-[74px] tw-text-button-secondary-fg tw-border-primary hover:tw-bg-secondary"
        />
      ) : (
        <CustomModal.Footer
          showLoader={showLoader}
          hasCancel={true}
          cancelText="Back"
          submitText="Next"
          submitIcon={showLoader ? <LoadingSpinner /> : <ArrowCircleRightIcon />}
          formId="onboarding-child-permissions"
          onClick={() => handleSave}
          onCancel={() => handleOncancel()}
          flex="row"
          className="!tw-flex-row-reverse !tw-space-x-lg !tw-pt-0"
          submitClass="!tw-h-[44px] !tw-w-[98px]"
          cancelClass="!tw-w-[74px] tw-text-button-secondary-fg tw-border-primary hover:tw-bg-secondary"
        />
      )}
    </>
  );
};

export default ChildAbout;
