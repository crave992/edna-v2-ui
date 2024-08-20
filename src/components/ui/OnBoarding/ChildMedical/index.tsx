import { NextPage } from 'next';
import { CustomModal } from '@/components/ui/CustomModal';
import ImageBrand from '@/components/common/ImageBrand';
import OnboardingProgress, { ProgressProps } from '../components/Progress';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import { useQueryClient } from '@tanstack/react-query';
import { UserEmergencyInfoDto } from '@/dtos/UserEmergencyInfoDto';
import * as Yup from 'yup';
import { TagsInput } from 'react-tag-input-component';
import { postStudentMedical, updateOnboardingStep, updateStudentMedical } from '@/services/api/updateOnboarding';
import CustomMultiSelect from '@/components/common/NewCustomFormControls/CustomMultiSelect';
import { StudentDto } from '@/dtos/StudentDto';
import OnboardingCheckCircleIcon from '@/components/svg/OnboardingCheckCircleIcon';
import { LoadingSpinner } from '@/components/svg/LoadingSpinner';

const schema = Yup.object().shape({
  severeAllergies: Yup.string(),
  nonSevereAllergies: Yup.string(),
  medications: Yup.string(),
  conditionAndImpairments: Yup.string(),
  immunizations: Yup.string(),
  preferredHospital: Yup.string(),
  inCaseOfEmergency: Yup.string(),
});

const ChildMedical: NextPage<ProgressProps> = ({
  currentStep,
  setCurrentStep,
  stepText,
  selectedStudent,
  code,
  setSelectedStudentId,
  setVerified,
  students,
  parent,
}) => {
  const queryClient = useQueryClient();
  const [showLoader, setShowLoader] = useState(false);

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
      setShowLoader(false);
    });
  };

  const methods = useForm<UserEmergencyInfoDto>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      severeAllergies: selectedStudent?.userMedicalInformation?.severeAllergies || '',
      nonSevereAllergies: selectedStudent?.userMedicalInformation?.nonSevereAllergies || '',
      foodRestrictions: selectedStudent?.userMedicalInformation?.foodRestrictions || '',
      medications: selectedStudent?.userMedicalInformation?.medications || '',
      conditionAndImpairments: selectedStudent?.userMedicalInformation?.conditionAndImpairments || '',
      immunizations: selectedStudent?.userMedicalInformation?.immunizations || '',
      preferredHospital: selectedStudent?.userMedicalInformation?.preferredHospital || '',
      inCaseOfEmergency: selectedStudent?.userMedicalInformation?.inCaseOfEmergency || '',
    },
  });

  useEffect(() => {
    if (selectedStudent) {
      methods.setValue('studentId', selectedStudent.id);
      if (selectedStudent.userMedicalInformation) {
        const medicalInfo = selectedStudent.userMedicalInformation;
        methods.setValue('conditionAndImpairments', medicalInfo?.conditionAndImpairments || '');
        methods.setValue('immunizations', medicalInfo?.immunizations || '');
        methods.setValue('inCaseOfEmergency', medicalInfo?.inCaseOfEmergency || '');
        methods.setValue('medications', medicalInfo?.medications || '');
        methods.setValue('nonSevereAllergies', medicalInfo?.nonSevereAllergies || '');
        methods.setValue('foodRestrictions', medicalInfo?.foodRestrictions || '');
        methods.setValue('preferredHospital', medicalInfo?.preferredHospital || '');
        methods.setValue('severeAllergies', medicalInfo?.severeAllergies || '');
        methods.setValue('id', medicalInfo?.id);
      }
    } else {
      methods.reset();
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (!selectedStudent) {
      const student = students && students.length > 0 ? students[0] : null;
      if (student) setSelectedStudentId((student as StudentDto).id);
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (parent && parent?.currentOnboardingStep && parent?.currentOnboardingStep > 2) {
      setVerified(true);
    }
  }, [parent]);

  const handleSave = async (data: UserEmergencyInfoDto) => {
    setShowLoader(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof UserEmergencyInfoDto];
      formData.append(key, value as string);
    });

    if (selectedStudent?.userMedicalInformation?.id) {
      await updateStudentMedical(formData, code!, selectedStudent?.userMedicalInformation?.id);
    } else {
      await postStudentMedical(formData, code!);
    }

    const requestData = {
      step: 3,
      studentId: selectedStudent?.id,
    };

    await updateOnboardingStep(requestData, code!).then(() => {
      queryClient.invalidateQueries(['onboarding-student', code, selectedStudent?.id]);
      queryClient.invalidateQueries(['onboarding-parent', code]);
      setShowLoader(false);
      // setVerified(false);
    });
  };

  type RowType = {
    label: string;
    name: string;
    defaultValue?: string;
    placeholder?: string;
    isTextArea?: boolean;
    isTagsInput?: boolean;
    info?: string;
  };

  const Row = ({ label, name, defaultValue, placeholder, isTextArea, isTagsInput, info }: RowType) => {
    const { control, setValue } = methods;
    const [tags, setTags] = useState<string[]>(
      typeof defaultValue === 'string' ? (defaultValue?.includes(',') ? defaultValue.split(', ') : [defaultValue]) : []
    );

    const handleTagsChange = (newtags: string[]) => {
      setTags(newtags);
      setValue(name as keyof UserEmergencyInfoDto, newtags.join(', '));
    };

    const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      event.preventDefault();
      const inputValue = event.currentTarget.value;
      if (inputValue !== '' && isTagsInput) {
        setTags((prevTags) => {
          if (!prevTags.includes(inputValue)) {
            const updatedTags = [...prevTags, inputValue];
            setValue(name as keyof UserEmergencyInfoDto, updatedTags.join(', '));
            // return updatedTags;
          }
          return prevTags;
        });
      }
    };

    return (
      <div className="tw-flex tw-flex-col tw-space-y-sm last:tw-mb-0">
        <div className="tw-text-sm-medium tw-text-secondary">{label}</div>
        <div className="tw-flex tw-flex-col">
          <div className="tw-w-full">
            {isTextArea ? (
              <CustomInput
                control={control}
                type="textarea"
                defaultValue={defaultValue}
                name={name as keyof UserEmergencyInfoDto}
                placeholder={placeholder}
                containerClassName={'tw-flex-1'}
              />
            ) : isTagsInput ? (
              <Controller
                control={control}
                name={name as keyof UserEmergencyInfoDto}
                render={({ field }) => {
                  return (
                    <CustomMultiSelect
                      field={field}
                      value={tags}
                      separators={[',', 'Enter']}
                      onChange={handleTagsChange}
                      onBlur={handleOnBlur}
                      placeHolder={methods.getValues(name as keyof UserEmergencyInfoDto) ? '' : placeholder}
                      onExisting={(tag: string) => {
                        console.log(`${tag} already exists.`);
                      }}
                      name={name as keyof UserEmergencyInfoDto}
                    />
                  );
                }}
              />
            ) : (
              <CustomInput
                control={control}
                type="text"
                defaultValue={defaultValue}
                name={name as keyof UserEmergencyInfoDto}
                placeholder={placeholder}
                containerClassName={'tw-flex-1'}
                inputClassName={
                  'disabled:tw-bg-primary disabled:tw-border-primary [-webkit-text-fill-color:tw-text-primary]'
                }
              />
            )}
          </div>
          {info && <div className="tw-text-sm-regular tw-text-tertiary tw-mt-sm">{info}</div>}
        </div>
      </div>
    );
  };

  return (
    <>
      <CustomModal.Header>
        <div className="tw-space-y-xl">
          <div className="tw-flex tw-items-center tw-justify-center">
            <ImageBrand size={48} />
          </div>
          <div className="tw-space-y-xs tw-text-center">
            <div className="tw-text-lg-semibold tw-text-primary">Medical Information</div>
            <div className="tw-text-sm-regular tw-text-tertiary">
              Fill out this information in full, you can make edits and provide proof of immunization at a later date.
              Emergency contacts will be created in a later step.
            </div>
          </div>
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
        <FormProvider {...methods}>
          <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)} id="student-medical">
            <div className="tw-flex tw-flex-col tw-w-full tw-pb-4xl">
              <div className="tw-border-solid tw-border-b tw-border-secondary tw-border-x-0 tw-border-t-0 tw-space-y-xl">
                <input type="hidden" name="studentId" value={selectedStudent?.id} />
                <input type="hidden" name="id" value={selectedStudent?.userMedicalInformation?.id} />
                <Row
                  label="Severe Allergies"
                  name="severeAllergies"
                  placeholder="Food, chemical, material, etc."
                  defaultValue={selectedStudent?.userMedicalInformation?.severeAllergies}
                  isTagsInput={true}
                  info="Press return after each allergy."
                />
                <Row
                  label="Non-Severe Allergies"
                  name="nonSevereAllergies"
                  placeholder="Food, chemical, material, etc."
                  defaultValue={selectedStudent?.userMedicalInformation?.nonSevereAllergies}
                  isTagsInput={true}
                  info="Press return after each allergy."
                />
                <Row
                  label="Food Restrictions"
                  name="foodRestrictions"
                  placeholder="Vegetarian, vegan, pork, etc."
                  defaultValue={selectedStudent?.userMedicalInformation?.foodRestrictions}
                  isTagsInput={true}
                  info="Press return after each restriction."
                />
                <Row
                  label="Medications"
                  name="medications"
                  placeholder="Inhaler, blood thinner, etc."
                  defaultValue={selectedStudent?.userMedicalInformation?.medications}
                />
                <Row
                  label="Medical Conditions & Impairments"
                  name="conditionAndImpairments"
                  isTextArea={true}
                  placeholder="Write a summary of conditions both internal and external."
                  defaultValue={selectedStudent?.userMedicalInformation?.conditionAndImpairments}
                />
                <div className="tw-mb-xl"></div>
              </div>
              <div className="tw-mt-xl tw-space-y-xl ">
                <Row
                  label="Immunizations"
                  name="immunizations"
                  placeholder="COVID-19, Flu, etc."
                  defaultValue={selectedStudent?.userMedicalInformation?.immunizations}
                  isTagsInput={true}
                />
                <Row label="Preferred Hospitals" name="preferredHospital" placeholder="Location" />
                <Row
                  label="What to do in case of an emergency?"
                  name="inCaseOfEmergency"
                  isTextArea={true}
                  placeholder="Write a summary of who to contact and what needs to be done in the event of a medical emergency."
                  defaultValue={selectedStudent?.userMedicalInformation?.inCaseOfEmergency}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </CustomModal.Content>
      <CustomModal.Footer
        showLoader={showLoader}
        hasCancel={true}
        cancelText="Back"
        submitText="Finish"
        submitIcon={showLoader ? <LoadingSpinner /> : <OnboardingCheckCircleIcon />}
        formId="student-medical"
        onClick={() => handleSave}
        onCancel={handleOncancel}
        flex="row"
        className="!tw-flex-row-reverse !tw-space-x-lg !tw-pt-0"
        submitClass="!tw-h-[44px] !tw-w-[98px]"
        cancelClass="!tw-w-[74px] tw-text-button-secondary-fg tw-border-primary hover:tw-bg-secondary"
      />
    </>
  );
};

export default ChildMedical;
