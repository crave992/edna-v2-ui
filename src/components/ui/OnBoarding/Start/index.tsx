import { NextPage } from 'next';
import siteMetadata from '@/constants/siteMetadata';
import { useEffect, useMemo, useState } from 'react';
import { CustomModal } from '@/components/ui/CustomModal';
import ImageBrand from '@/components/common/ImageBrand';
import ArrowCircleRightIcon from '@/components/svg/ArrowCircleRight';
import OnboardingProgress from '../components/Progress';
import { useRouter } from 'next/router';
import { StudentBasicDto, StudentDto } from '@/dtos/StudentDto';
import { useQueryClient } from '@tanstack/react-query';
import ParentProfile from '@/components/ui/OnBoarding/ParentProfile';
import ChildSelection from '@/components/ui/OnBoarding/ChildSelection';
import ChildAbout from '@/components/ui/OnBoarding/ChildAbout';
import ChildMedical from '@/components/ui/OnBoarding/ChildMedical';
import ChildContacts from '@/components/ui/OnBoarding/ChildContacts';
import { ParentUpdateModel } from '@/models/ParentModel';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ParentUpdateStartValidationSchema } from '@/validation/ParentValidationSchema';
import { updateOnboardingStep } from '@/services/api/updateOnboarding';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import AlertCircleIcon from '@/components/svg/AlertCircle';
import {
  useOnboardingOrgQuery,
  useOnboardingParentQuery,
  useOnboardingStudentQuery,
} from '@/hooks/queries/useOnboardingQuery';

const Start: NextPage = () => {
  const { asPath } = useRouter();
  const queryString = asPath.split('?')[1];
  const code = queryString?.split('code=')[1];
  const [showLoader, setShowLoader] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [verified, setVerified] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const stepText = [
    { id: 1, text: 'Parent', step: 1 },
    { id: 2, text: 'Child', step: 2 },
    { id: 3, text: 'About', step: 3 },
    { id: 4, text: 'Medical', step: 4 },
    { id: 5, text: 'Contacts', step: 5 },
  ];

  const { data: parentProfile, isLoading } = useOnboardingParentQuery({ code });
  const { data: orgDetails } = useOnboardingOrgQuery({ code });
  const { data: selectedStudent } = useOnboardingStudentQuery({ code, studentId: selectedStudentId! });

  const methods = useForm<ParentUpdateModel>({
    resolver: yupResolver(ParentUpdateStartValidationSchema),
  });

  const handleSave = async () => {
    setShowLoader(true);
    const requestData = {
      step: 1,
      parentId: parentProfile?.id,
    };

    await updateOnboardingStep(requestData, code!).then(() => {
      queryClient.invalidateQueries(['onboarding-parent', code]);
      setShowLoader(false);
    });
  };

  const currentStepInfo = stepText.find((step) => step.step === currentStep);

  const allStudentsComplete = useMemo(() => {
    return (
      parentProfile &&
      parentProfile.students &&
      parentProfile.students.length > 0 &&
      parentProfile.students.every((student: StudentDto) => student.currentOnboardingStep === 3)
    );
  }, [parentProfile, verified]);

  useEffect(() => {
    if (parentProfile) {
      console.log(parentProfile);
      methods.setValue('parentId', parentProfile.id);
      if (parentProfile.currentOnboardingStep && parentProfile.currentOnboardingStep === 6 && !allStudentsComplete) {
        setCurrentStep(2);
      } else if (parentProfile.currentOnboardingStep) {
        setCurrentStep(parentProfile.currentOnboardingStep);
      } else {
        setCurrentStep(null);
      }

      if (selectedStudentId && verified) {
        const updatedSelectedStudent = parentProfile.students.find(
          (student: StudentBasicDto) => student.id === selectedStudentId
        );
        setSelectedStudentId(updatedSelectedStudent.id);
        setCurrentStep(updatedSelectedStudent.currentOnboardingStep + 2);
      }

      if (
        allStudentsComplete &&
        parentProfile.isFullOnboarding &&
        parentProfile.currentOnboardingStep < 3 &&
        parentProfile.currentOnboardingStep != 0
      ) {
        setCurrentStep(5);
      }
    } else {
      setSelectedStudentId(null);
    }
  }, [parentProfile, selectedStudentId, allStudentsComplete]);

  const componentMap: { [key: string]: React.ReactNode } = {
    Parent: (
      <ParentProfile
        stepText={stepText}
        setCurrentStep={setCurrentStep}
        data={parentProfile || []}
        currentStep={parentProfile && parentProfile.currentOnboardingStep}
        code={code}
        setSelectedStudentId={setSelectedStudentId}
        setVerified={() => {}}
      />
    ),
    Child: (
      <ChildSelection
        stepText={stepText}
        setCurrentStep={setCurrentStep}
        currentStep={
          allStudentsComplete
            ? 5
            : !verified && parentProfile?.currentOnboardingStep === 6
            ? 2
            : !verified
            ? parentProfile && parentProfile?.currentOnboardingStep
            : selectedStudent &&
              verified &&
              // selectedStudent.currentOnboardingStep !== null &&
              selectedStudent?.currentOnboardingStep! + 2
        }
        students={parentProfile?.students}
        selectedStudent={selectedStudent}
        setSelectedStudentId={setSelectedStudentId}
        code={code}
        verified={verified}
        setVerified={setVerified}
        parent={parentProfile}
      />
    ),
    About: (
      <ChildAbout
        stepText={stepText}
        setCurrentStep={setCurrentStep}
        currentStep={
          !verified
            ? 2
            : selectedStudent &&
              selectedStudent.currentOnboardingStep !== null &&
              selectedStudent?.currentOnboardingStep! + 2
        }
        students={parentProfile?.students}
        selectedStudent={selectedStudent}
        setSelectedStudentId={setSelectedStudentId}
        code={code}
        verified={verified}
        setVerified={setVerified}
      />
    ),
    Medical: (
      <ChildMedical
        stepText={stepText}
        setCurrentStep={setCurrentStep}
        currentStep={
          selectedStudent &&
          verified &&
          selectedStudent.currentOnboardingStep !== null &&
          selectedStudent?.currentOnboardingStep! + 2
        }
        students={parentProfile?.students}
        selectedStudent={selectedStudent}
        setSelectedStudentId={setSelectedStudentId}
        code={code}
        verified={verified}
        setVerified={setVerified}
        parent={parentProfile}
      />
    ),
    Contacts: (
      <ChildContacts
        stepText={stepText}
        setCurrentStep={setCurrentStep}
        currentStep={
          // allStudentsComplete &&
          (parentProfile?.currentOnboardingStep != 6 || (parentProfile?.currentOnboardingStep === 6 && allStudentsComplete)) &&
          parentProfile?.currentOnboardingStep != 0 &&
          parentProfile?.currentOnboardingStep! + 3
        }
        students={parentProfile?.students}
        selectedStudent={selectedStudent}
        setSelectedStudentId={setSelectedStudentId}
        code={code}
        parent={parentProfile}
        setVerified={() => {}}
      />
    ),
    Completed: (
      <ChildSelection
        stepText={stepText}
        setCurrentStep={setCurrentStep}
        currentStep={allStudentsComplete && parentProfile && parentProfile.currentOnboardingStep == 6 && 6}
        students={parentProfile?.students}
        selectedStudent={selectedStudent}
        setSelectedStudentId={setSelectedStudentId}
        code={code}
        verified={verified}
        setVerified={setVerified}
      />
    ),
  };

  return (
    <>
      <CustomModal width={480}>
        {!currentStep || currentStep == 0 ? (
          <>
            <CustomModal.Header>
              <div className="tw-space-y-xl">
                <div className="tw-flex tw-items-center tw-justify-center">
                  <ImageBrand size={48} />
                </div>
                <div className="tw-space-y-xs tw-text-center">
                  <div className="tw-text-lg-semibold tw-text-primary">Create {siteMetadata.title} Account</div>
                  <div className="tw-text-sm-regular tw-text-tertiary">Welcome to {siteMetadata.title}.</div>
                </div>
              </div>
            </CustomModal.Header>
            <CustomModal.Content>
              {isLoading ? (
                <div className="tw-flex tw-justify-center tw-text-center tw-mb-5xl">
                  <LoadingSpinner width={30} />
                </div>
              ) : !parentProfile ? (
                <div className="tw-mb-5xl">
                  <Alert
                    type="error"
                    errorText="Your token may have expired or is invalid. Please contact school admin to regenerate your onboarding link. Thank you."
                    icon={<AlertCircleIcon color="error" />}
                    showCloseIcon={false}
                    onClose={function (): void {
                      throw new Error('Function not implemented.');
                    }}
                  />
                </div>
              ) : (
                <div className="tw-space-y-xl">
                  {parentProfile && parentProfile.isFullOnboarding ? (
                    <>
                      <div className="tw-text-sm-regular tw-text-tertiary tw-text-center">
                        {`We will setup your account, your children's profile, and answer some questions/permissions provided by `}
                        <span className="tw-text-tertiary tw-text-sm-semibold">{orgDetails?.schoolName}</span>
                        {`.`}
                      </div>
                      <div className="tw-text-sm-regular tw-text-tertiary tw-text-center">
                        {`You will need access to your child's medical records, emergency contact information, and your driver's license.`}
                      </div>
                      <div className="tw-text-sm-semibold tw-text-tertiary tw-text-center">
                        This process should take 15-25 minutes and should be completed in one sitting.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="tw-text-sm-regular tw-text-tertiary tw-text-center">
                        {`We will setup your account, you will need access to your driver's license.`}
                      </div>
                      <div className="tw-text-sm-semibold tw-text-tertiary tw-text-center">
                        This process should take 2-5 minutes and should be completed in one sitting.
                      </div>
                    </>
                  )}

                  {parentProfile && parentProfile.isFullOnboarding && (
                    <OnboardingProgress
                      stepText={stepText}
                      currentStep={parentProfile && parentProfile.currentOnboardingStep}
                      setCurrentStep={setCurrentStep}
                      setSelectedStudentId={setSelectedStudentId}
                      setVerified={setVerified}
                    />
                  )}
                </div>
              )}
            </CustomModal.Content>
            <FormProvider {...methods}>
              <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)} id="update-parent">
                <input hidden name="parentId" defaultValue={parentProfile?.id} />
              </form>
            </FormProvider>
            {parentProfile && (
              <CustomModal.Footer
                showLoader={showLoader}
                submitIcon={!showLoader && <ArrowCircleRightIcon />}
                submitText="Start"
                formId="update-parent"
                onClick={() => handleSave}
              />
            )}
          </>
        ) : currentStep > 0 && currentStep == 6 ? (
          componentMap['Completed']
        ) : currentStep == 2 && !parentProfile.isFullOnboarding ? (
          componentMap['Parent']
        ) :(
          currentStep && currentStep > 0 && currentStep === currentStepInfo?.step && componentMap[currentStepInfo?.text]
        )}
      </CustomModal>
    </>
  );
};

export default Start;
