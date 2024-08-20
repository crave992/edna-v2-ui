import { NextPage } from 'next';
import { CustomModal } from '@/components/ui/CustomModal';
import ImageBrand from '@/components/common/ImageBrand';
import OnboardingProgress, { ProgressProps } from '../components/Progress';
import { StudentDto } from '@/dtos/StudentDto';
import ArrowCircleRightBorderIcon from '@/components/svg/ArrowCircleRightBorder';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ArrowCircleRightIcon from '@/components/svg/ArrowCircleRight';
import Alert from '@/components/ui/Alert';
import AlertCircleIcon from '@/components/svg/AlertCircle';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { StudentBeforeAndAfterSchoolCareModel, StudentModel } from '@/models/StudentModel';
import { StudentUpdateValidationSchema } from '@/validation/StudentValidationSchema';
import { RowType } from '../ParentProfile';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CustomRadioButton from '@/components/common/NewCustomFormControls/CustomRadioButton';
import ProgramOptionDto from '@/dtos/ProgramOptionDto';
import LevelDto from '@/dtos/LevelDto';
import CustomBooleanRadioButton from '@/components/common/NewCustomFormControls/CustomBooleanRadioButton';
import CustomCheckboxButton from '@/components/common/NewCustomFormControls/CustomCheckboxButton';
import CheckCircleIcon from '@/components/svg/CheckCircle';
import { updateOnboardingStep, updateStudentOnboarding } from '@/services/api/updateOnboarding';
import CustomButton from '@/components/ui/CustomButton';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import { useCountriesQuery } from '@/hooks/queries/useCountriesQuery';
import { useStatesQuery } from '@/hooks/queries/useStatesQuery';
import { useOnboardingLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import { useOnboardingStudentQuery } from '@/hooks/queries/useOnboardingQuery';
import { fetchOnboardingProgramOptionsByLevel } from '@/services/api/fetchOnboarding';
import { useRaceQuery } from '@/hooks/queries/useRaceQuery';
import { useEthnicityQuery } from '@/hooks/queries/useEthnicityQuery';
import LoadingSpinner from '@/components/svg/LoadingSpinner';

const ChildSelection: NextPage<ProgressProps> = ({
  currentStep,
  setCurrentStep,
  stepText,
  students,
  selectedStudent,
  setSelectedStudentId,
  code,
  verified,
  setVerified,
  parent,
}) => {
  const queryClient = useQueryClient();
  const [showLoader, setShowLoader] = useState(false);
  const [verificationError, setVerificationError] = useState<boolean>(false);
  const [showVerify, setShowVerify] = useState<boolean>(false);
  const [day1, setDay1] = useState<string>('');
  const [day2, setDay2] = useState<string>('');
  const [month1, setMonth1] = useState<string>('');
  const [month2, setMonth2] = useState<string>('');
  const day1Ref = useRef<HTMLInputElement>(null);
  const day2Ref = useRef<HTMLInputElement>(null);
  const month1Ref = useRef<HTMLInputElement>(null);
  const month2Ref = useRef<HTMLInputElement>(null);
  const verifyButtonRef = useRef<HTMLDivElement>(null);
  const [selectedGender, setSelectedGender] = useState<{ name: string } | null>(null);
  const [selectedState, setSelectedState] = useState<{ id: number; name: string } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ id: number; name: string } | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<{ id: number; name: string } | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<{ id: number; name: string } | null>(null);
  const [isCareRequired, setIsCareRequired] = useState<boolean>();
  const [selectedEthnicity, setSelectedEthnicity] = useState<{ id: number; name: string } | null>(null);
  const [selectedEthnicityCategory, setSelectedEthnicityCategory] = useState<{ id: number; name: string } | null>(null);
  const [dob, setDob] = useState<Date | null>(null);
  const [enrolledDate, setEnrolledDate] = useState<Date | null>(null);
  const [startedSchoolDate, setStartedSchoolDate] = useState<Date | null>(null);

  const { data: ethnicityCategory } = useRaceQuery();
  const { data: ethnicity } = useEthnicityQuery(selectedEthnicityCategory?.id!);
  const { data: countries } = useCountriesQuery();
  const { data: states } = useStatesQuery(selectedCountry?.id!);
  const { data: levels } = useOnboardingLevelsQuery(String(code));
  const { data: studentProfile } = useOnboardingStudentQuery({ code: code!, studentId: selectedStudent?.id! });
  const { data: programOptions } = useQuery({
    queryKey: ['onboarding-program-options', code!, selectedLevel?.id],
    queryFn: () => fetchOnboardingProgramOptionsByLevel(code!, selectedLevel?.id),
    enabled: !!selectedLevel && !!code,
    staleTime: Infinity,
  });

  const methods = useForm<StudentModel>({
    resolver: yupResolver(StudentUpdateValidationSchema),
  });

  const handleBirthdayVerificationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === '') {
      if (name === 'birthday0') {
        setDay1('');
      } else if (name === 'birthday1') {
        setDay2('');
      } else if (name === 'birthmonth0') {
        setMonth1('');
      } else if (name === 'birthmonth1') {
        setMonth2('');
      }
      return;
    }

    if (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 9) {
      if (name === 'birthmonth0') {
        setMonth1(value);
        if (value !== '' && month2 === '') {
          month2Ref.current?.focus();
        }
      } else if (name === 'birthmonth1') {
        setMonth2(value);
        if (value !== '' && day1 === '') {
          day1Ref.current?.focus();
        }
      } else if (name === 'birthday0') {
        setDay1(value);
        if (value !== '' && day2 === '') {
          day2Ref.current?.focus();
        }
      } else if (name === 'birthday1') {
        setDay2(value);
      }
    }
  };

  const handleDay2KeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      verifyButtonRef.current?.click();
    }
  };

  const verifyBirthday = () => {
    if (!selectedStudent) return;
    const inputDay = day1 + day2;
    const inputMonth = month1 + month2;
    const studentDob = new Date(selectedStudent.dateOfBirth);
    studentDob.setDate(studentDob.getDate());
    const studentDay = ('0' + studentDob.getDate()).slice(-2);
    const studentMonth = ('0' + (studentDob.getMonth() + 1)).slice(-2);

    if (inputDay === studentDay && inputMonth === studentMonth) {
      setVerified(true);
      setVerificationError(false);
    } else {
      setVerificationError(true);
    }
  };

  const handleSelectionChange = (id: number) => {
    const selectedOption = programOptions?.find((option: ProgramOptionDto) => option.id === id);
    if (selectedOption) {
      setSelectedProgram(selectedOption);
      methods.setValue('programOptionId', selectedOption.id);
    }
  };

  useEffect(() => {
    methods.reset();
    setIsCareRequired(false);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedLevel(null);
    setSelectedProgram(null);
    setSelectedEthnicity(null);
    setSelectedEthnicityCategory(null);
    setEnrolledDate(null);
    setStartedSchoolDate(null);
    setDob(null);

    if (studentProfile) {
      methods.setValue('firstName', studentProfile.firstName);
      methods.setValue('lastName', studentProfile.lastName);
      methods.setValue('nickName', studentProfile.nickName == 'null' ? '' : studentProfile.nickName);

      if (studentProfile.gender) {
        methods.setValue('gender', studentProfile.gender || selectedGender?.name!);
        setSelectedGender({ name: studentProfile.gender });
      }

      if (studentProfile.ethnicityCategoryId) {
        methods.setValue('ethnicityCategoryId', studentProfile.ethnicityCategoryId || selectedEthnicityCategory?.id!);
        setSelectedEthnicityCategory(
          studentProfile.ethnicityCategory
            ? { id: studentProfile.ethnicityCategoryId, name: studentProfile.ethnicityCategory.name }
            : null
        );
      }

      if (studentProfile.ethnicityId) {
        methods.setValue('ethnicityId', studentProfile.ethnicityId || selectedEthnicity?.id!);
        setSelectedEthnicity(
          studentProfile.ethnicity
            ? { id: studentProfile.ethnicityCategoryId, name: studentProfile.ethnicity.name }
            : null
        );
      }

      if (studentProfile.levelId) {
        methods.setValue('levelId', studentProfile.levelId || selectedLevel?.id!);
        setSelectedLevel(studentProfile.level ? { id: studentProfile.levelId, name: studentProfile.level.name } : null);
      }
      if (studentProfile.levelId !== 0 && studentProfile.programOptionId) {
        methods.setValue('programOptionId', studentProfile.programOptionId);
        setSelectedProgram(
          studentProfile.programOptionId
            ? { id: studentProfile.programOptionId, name: studentProfile.programOption.name }
            : null
        );
      }
      if (studentProfile.countryId) {
        methods.setValue('countryId', studentProfile.countryId || selectedCountry?.id!);
        setSelectedCountry(
          studentProfile.country ? { id: studentProfile.countryId, name: studentProfile.country.name } : null
        );
      }
      if (studentProfile.stateId) {
        methods.setValue('stateId', studentProfile.stateId || selectedState?.id!);
        setSelectedState(studentProfile.state ? { id: studentProfile.stateId, name: studentProfile.state.name } : null);
      }

      if (typeof studentProfile.isBeforeAndAfterSchoolCareRequire == 'boolean') {
        methods.setValue(
          'isBeforeAndAfterSchoolCareRequire',
          studentProfile.isBeforeAndAfterSchoolCareRequire || isCareRequired!
        );
        setIsCareRequired(studentProfile.isBeforeAndAfterSchoolCareRequire);
      }

      if (studentProfile.beforeAndAfterSchoolCare?.monday) {
        methods.setValue('beforeAndAfterSchoolCare.monday', studentProfile.beforeAndAfterSchoolCare?.monday);
      }
      if (studentProfile.beforeAndAfterSchoolCare?.tuesday) {
        methods.setValue('beforeAndAfterSchoolCare.tuesday', studentProfile.beforeAndAfterSchoolCare?.tuesday);
      }
      if (studentProfile.beforeAndAfterSchoolCare?.wednesday) {
        methods.setValue('beforeAndAfterSchoolCare.wednesday', studentProfile.beforeAndAfterSchoolCare?.wednesday);
      }
      if (studentProfile.beforeAndAfterSchoolCare?.thursday) {
        methods.setValue('beforeAndAfterSchoolCare.thursday', studentProfile.beforeAndAfterSchoolCare?.thursday);
      }
      if (studentProfile.beforeAndAfterSchoolCare?.friday) {
        methods.setValue('beforeAndAfterSchoolCare.friday', studentProfile.beforeAndAfterSchoolCare?.friday);
      }

      if (studentProfile.beforeAndAfterSchoolCare?.fromTime) {
        methods.setValue('fromTime', studentProfile.beforeAndAfterSchoolCare?.fromTime);
      }
      if (studentProfile.beforeAndAfterSchoolCare?.toTime) {
        methods.setValue('toTime', studentProfile.beforeAndAfterSchoolCare?.toTime);
      }
      if (studentProfile.dateOfBirth) {
        const studentDob = new Date(studentProfile.dateOfBirth);
        studentDob.setDate(studentDob.getDate());
        setDob(studentDob);
        methods.setValue('dob', studentProfile.dateOfBirth);
      }
      if (studentProfile.enrolledDate) {
        const enrolledDate = new Date(studentProfile.enrolledDate);
        setEnrolledDate(enrolledDate);
        methods.setValue('enrolledDate', studentProfile.enrolledDate);
      }
      if (studentProfile.startedSchoolDate) {
        const schoolStartedDate = new Date(studentProfile.startedSchoolDate);
        setStartedSchoolDate(schoolStartedDate);
        methods.setValue('startedSchoolDate', studentProfile.startedSchoolDate);
      }
    }
  }, [studentProfile, selectedStudent]);

  const copyAddressFromParent = () => {
    if (parent) {
      if (parent.countryId) {
        methods.setValue('countryId', parent.countryId);
        setSelectedCountry(parent.country ? { id: parent.countryId, name: parent.country.name } : null);
      }
      if (parent.stateId) {
        methods.setValue('stateId', parent.stateId);
        setSelectedState(parent.state ? { id: parent.stateId, name: parent.state.name } : null);
      }
      if (parent.addressLine1) {
        methods.setValue('addressLine1', parent.addressLine1);
      }
      if (parent.addressLine2) {
        methods.setValue('addressLine2', parent.addressLine2);
      }
      if (parent.city) {
        methods.setValue('city', parent.city);
      }
      if (parent.zipcode) {
        methods.setValue('zipcode', parent.zipcode);
      }
    }
  };

  const Row = ({ label, rightElement, children }: RowType) => {
    return (
      <div className="tw-space-y-sm">
        <div className="tw-flex tw-justify-between">
          <div className="tw-text-sm-semibold tw-text-secondary">{label}</div>
          {rightElement && <div>{rightElement}</div>}
        </div>
        {children}
      </div>
    );
  };

  const handleSave = async (values: StudentModel) => {
    setShowLoader(true);

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof StudentModel];
      if (key === 'profileImage') {
        let field = values?.[key] && values?.[key]![0] ? values?.[key]![0] : null;
        formData.append(key, field as File);
      } else if (key === 'dob') {
        formData.append(key, value as string);
      } else if (key === 'gender') {
        formData.append(key, selectedGender?.name as string);
      } else if (key === 'isBeforeAndAfterSchoolCareRequire') {
        formData.append(key, isCareRequired!.toString());
      } else if (key === 'levelId') {
        if (selectedLevel !== null) {
          formData.append(key, value as string);
        }
      } else if (key === 'programOptionId') {
        if (selectedLevel !== null) {
          formData.append(key, value as string);
        }
      } else if (key === 'beforeAndAfterSchoolCare' || key === 'fromTime' || key === 'toTime') {
        const beforeAndAfterSchoolCare = (values?.beforeAndAfterSchoolCare ??
          {}) as Partial<StudentBeforeAndAfterSchoolCareModel>;

        if (key === 'fromTime') {
          beforeAndAfterSchoolCare.fromTime = values.fromTime;
        } else if (key === 'toTime') {
          beforeAndAfterSchoolCare.toTime = values.toTime;
        }

        Object.keys(beforeAndAfterSchoolCare).forEach((key) => {
          const value = beforeAndAfterSchoolCare[key as keyof StudentBeforeAndAfterSchoolCareModel];

          let stringValue;
          if (typeof value === 'boolean') {
            stringValue = value ? 'true' : 'false';
          } else if (value !== null && value !== undefined) {
            stringValue = value.toString();
          } else {
            stringValue = '';
          }

          formData.append(`beforeAndAfterSchoolCare.${key}`, stringValue);
        });
      } else if (key === 'enrolledDate') {
        formData.append(key, value as string);
      } else if (key === 'schoolStartedDate') {
        formData.append(key, value as string);
      } else {
        if (value != null) {
          formData.append(key, value as string);
        }
      }
    });
    new Response(formData).text().then(console.log);

    await updateStudentOnboarding(formData, code!, selectedStudent?.id!);

    const requestData = {
      step: 1,
      studentId: selectedStudent?.id,
    };

    await updateOnboardingStep(requestData, code!).then(() => {
      queryClient.invalidateQueries(['onboarding-student', code, selectedStudent?.id]);
      queryClient.invalidateQueries(['onboarding-parent', code]);
      setShowLoader(false);
      // setCurrentStep(currentStep! + 1);
    });
  };

  const handleCancel = () => {
    setDay1('');
    setDay2('');
    setMonth1('');
    setMonth2('');
    setVerificationError(false);
    setVerified(false);
    setShowVerify(false);
  };

  useEffect(() => {
    if (selectedStudent && !showVerify) {
      handleCancel();
    }
  }, [selectedStudent, showVerify]);

  const handlePickDate = (date: Date | null) => {
    setDob(date);
    methods.setValue('dob', date);
  };

  const handlePickEnrolledDate = (date: Date | null) => {
    setEnrolledDate(date);
    methods.setValue('enrolledDate', date);
  };
  const handlePickStartedSchoolDate = (date: Date | null) => {
    setStartedSchoolDate(date);
    methods.setValue('startedSchoolDate', date);
  };

  return (
    <>
      <CustomModal.Header>
        <div className="tw-space-y-xl">
          <div className="tw-flex tw-items-center tw-justify-center">
            <ImageBrand size={48} />
          </div>
          <div className="tw-space-y-xs tw-text-center">
            {currentStep && currentStep >= 5 ? (
              <>
                <div className="tw-text-lg-semibold tw-text-primary">Account Setup Complete</div>
                <div className="tw-text-sm-regular tw-text-tertiary">You may now close this window.</div>
              </>
            ) : verified ? (
              <div className="tw-text-lg-semibold tw-text-primary">Create Child Profile</div>
            ) : (
              <>
                <div className="tw-text-lg-semibold tw-text-primary">Select Child</div>
                {students && students.length > 1 && (
                  <div className="tw-text-sm-regular tw-text-tertiary">
                    We have detected multiple children have been assigned to your account. Select the child profile you
                    would like to setup.
                  </div>
                )}
              </>
            )}
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
        {!showVerify ? (
          <div className="tw-py-3xl tw-space-y-xl">
            {students?.map((student: StudentDto) => {
              return (
                <div
                  key={student.id}
                  className="tw-flex tw-items-center tw-border tw-border-solid tw-border-secondary tw-rounded-full tw-py-xl tw-px-2xl tw-justify-between"
                >
                  <div className="tw-text-lg-regular tw-text-black">{`${student.firstName} ${student.lastName}`}</div>
                  {student?.currentOnboardingStep == null || student?.currentOnboardingStep < 3 ? (
                    <div
                      className="tw-cursor-pointer tw-flex tw-items-center tw-space-x-md"
                      onClick={() => {
                        setSelectedStudentId(student?.id);
                        setShowVerify(true);
                      }}
                    >
                      <div className="tw-text-sm-regular tw-text-tertiary">Start Setup</div>
                      <ArrowCircleRightBorderIcon />
                    </div>
                  ) : (
                    <div className="tw-flex tw-space-x-md">
                      <div className="tw-text-sm-regular tw-text-tertiary">Setup Complete</div>
                      <CheckCircleIcon />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          !verified && (
            <>
              <div className="tw-py-3xl">
                {verificationError && (
                  <Alert
                    type="error"
                    icon={<AlertCircleIcon color="error" />}
                    errorText="Birthday Verification Error"
                    supportingErrorText="Please input the correct birthday by starting with the month followed by the day."
                    onClose={() => setVerificationError(false)}
                    className="!-tw-mt-4xl"
                  />
                )}
                <div className="tw-flex tw-flex-col tw-items-center tw-h-[166px] tw-border tw-border-solid tw-border-secondary tw-rounded-xl tw-py-xl tw-px-2xl tw-justify-between tw-space-y-xl">
                  <div className="tw-text-lg-regular tw-text-black">{`Enter ${selectedStudent?.firstName}'s Birthday`}</div>
                  <div className="tw-flex tw-flex-col tw-space-y-md">
                    <div className="tw-flex tw-flex-row tw-justify-center tw-space-x-md">
                      <input
                        autoFocus
                        ref={month1Ref}
                        placeholder="0"
                        name="birthmonth0"
                        value={month1}
                        maxLength={1}
                        onChange={handleBirthdayVerificationInputChange}
                        className="tw-w-[64px] tw-h-[64px] tw-border tw-border-solid tw-border-secondary tw-rounded-xl tw-pl-xl tw-py-xxs tw-items-center tw-justify-center tw-text-display-lg-medium tw-text-black placeholder:tw-text-supporting-text"
                      />
                      <input
                        ref={month2Ref}
                        placeholder="0"
                        name="birthmonth1"
                        value={month2}
                        maxLength={1}
                        onChange={handleBirthdayVerificationInputChange}
                        className="tw-w-[64px] tw-h-[64px] tw-border tw-border-solid tw-border-secondary tw-rounded-xl tw-pl-xl tw-py-xxs tw-items-center tw-justify-center tw-text-display-lg-medium tw-text-black placeholder:tw-text-supporting-text"
                      />
                      <div className="tw-text-display-lg-medium tw-text-supporting-text">-</div>
                      <input
                        ref={day1Ref}
                        placeholder="0"
                        name="birthday0"
                        value={day1}
                        maxLength={1}
                        onChange={handleBirthdayVerificationInputChange}
                        className="tw-w-[64px] tw-h-[64px] tw-border tw-border-solid tw-border-secondary tw-rounded-xl tw-pl-xl tw-py-xxs tw-items-center tw-justify-center tw-text-display-lg-medium tw-text-black placeholder:tw-text-supporting-text"
                      />
                      <input
                        ref={day2Ref}
                        placeholder="0"
                        name="birthday1"
                        value={day2}
                        maxLength={1}
                        onChange={handleBirthdayVerificationInputChange}
                        onKeyDown={handleDay2KeyPress}
                        className="tw-w-[64px] tw-h-[64px] tw-border tw-border-solid tw-border-secondary tw-rounded-xl tw-pl-xl tw-py-xxs tw-items-center tw-justify-center tw-text-display-lg-medium tw-text-black placeholder:tw-text-supporting-text"
                      />
                    </div>
                    <div className="tw-flex tw-justify-between">
                      <div className="tw-w-[136px] tw-text-center tw-text-xs-regular tw-text-tertiary">Month</div>
                      <div className="tw-w-[136px] tw-text-center tw-text-xs-regular tw-text-tertiary">Day</div>
                    </div>
                  </div>
                </div>
              </div>
              <div ref={verifyButtonRef} onClick={verifyBirthday}>
                <CustomModal.Footer
                  hasCancel={true}
                  cancelText="Back"
                  submitText="Verify"
                  submitIcon={<ArrowCircleRightIcon />}
                  formId="login"
                  onClick={verifyBirthday}
                  onCancel={() => setShowVerify(false)}
                  flex="row"
                  className="!tw-flex-row-reverse !tw-space-x-lg !tw-pt-0 !tw-pr-0"
                  submitClass="!tw-h-[44px] !tw-w-[98px]"
                  cancelClass="!tw-w-[74px] tw-text-button-secondary-fg tw-border-primary hover:tw-bg-secondary"
                />
              </div>
            </>
          )
        )}
        {verified && (
          <div className="tw-space-y-3xl">
            <div className="tw-flex tw-items-center tw-border tw-border-solid tw-border-secondary tw-rounded-full tw-py-xl tw-px-2xl tw-justify-center">
              <div className="tw-text-lg-regular tw-text-black">{`${studentProfile?.firstName} ${studentProfile?.lastName}`}</div>
            </div>
            <FormProvider {...methods}>
              <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)} id="update-student">
                <CustomInput
                  control={methods.control}
                  type="text"
                  name="firstName"
                  defaultValue={studentProfile?.firstName}
                  containerClassName="tw-hidden"
                />
                <CustomInput
                  control={methods.control}
                  type="text"
                  name="lastName"
                  defaultValue={studentProfile?.lastName}
                  containerClassName="tw-hidden"
                />
                <div className="tw-space-y-xl">
                  <div className="tw-w-full">
                    <CustomInput
                      control={methods.control}
                      id={studentProfile?.id}
                      component="OnboardingStudent"
                      label="profile image"
                      type="file"
                      name="profileImage"
                      isProfile={true}
                      icon={'cloud'}
                      code={code}
                      thumbnail={studentProfile?.profilePicture}
                      onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files;

                        if (file) {
                          methods.setValue('profileImage', file);
                        } else {
                          // Handle the case when files are null (optional)
                          console.error('No files selected');
                        }
                      }}
                    />
                  </div>
                  <div className="tw-mb-4">
                    <CustomDatePicker
                      name="dob"
                      placeholder="Birthday"
                      selected={dob}
                      onChange={(date: Date | null) => handlePickDate(date)}
                    />
                  </div>
                  <Row label="Nickname">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      placeholder="Nickname"
                      name="nickName"
                      defaultValue={studentProfile?.nickName}
                    />
                  </Row>
                  <Row label="Gender">
                    <div className="tw-w-full">
                      <CustomDropdown
                        selectedItems={selectedGender}
                        setSelectedItems={setSelectedGender}
                        data={[
                          { id: 0, name: 'Male' },
                          { id: 1, name: 'Female' },
                          { id: 2, name: 'Other' },
                        ]}
                        component={[{ name: 'Male' }, { name: 'Female' }, { name: 'Other' }]
                          .map((gender) => gender.name)
                          .join(', ')}
                        control={methods.control}
                        name="gender"
                      />
                    </div>
                  </Row>
                  <Row label="Demographics">
                    <div className="tw-flex tw-w-full tw-gap-x-3">
                      <CustomDropdown
                        selectedItems={selectedEthnicityCategory}
                        setSelectedItems={setSelectedEthnicityCategory}
                        data={ethnicityCategory}
                        component="Race"
                        control={methods.control}
                        name="ethnicityCategoryId"
                      />
                      <CustomDropdown
                        selectedItems={selectedEthnicity}
                        setSelectedItems={setSelectedEthnicity}
                        data={ethnicity}
                        component="Ethnicity"
                        control={methods.control}
                        name="ethnicityId"
                      />
                    </div>
                  </Row>

                  <div className="tw-space-y-sm">
                    <div className="tw-flex tw-justify-between">
                      <div className="tw-text-sm-semibold tw-text-secondary">Address</div>
                      <div>
                        <CustomButton
                          text="Copy From Parent Profile"
                          btnSize="sm"
                          heirarchy="link-color"
                          className="!tw-pr-0 !tw-py-0 !tw-h-[20px]"
                          onClick={copyAddressFromParent}
                        />
                      </div>
                    </div>
                    <div className="tw-flex tw-p-0 tw-space-x-3xl">
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="addressLine1"
                        placeholder="Address Line 1"
                        containerClassName={'tw-w-1/2'}
                        defaultValue={studentProfile?.addressLine1 ?? ''}
                      />
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="addressLine2"
                        placeholder="Address Line 2"
                        containerClassName={'tw-w-1/2'}
                        defaultValue={studentProfile?.addressLine2 ?? ''}
                      />
                    </div>
                    <div className="tw-flex tw-p-0 tw-space-x-3xl">
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="city"
                        placeholder="City"
                        containerClassName={'tw-w-1/2'}
                        defaultValue={studentProfile?.city ?? ''}
                      />
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="zipcode"
                        placeholder="Zipcode"
                        containerClassName={'tw-w-1/2'}
                        defaultValue={studentProfile?.zipcode ?? ''}
                      />
                    </div>
                    <div className="tw-flex tw-p-0 tw-space-x-3xl">
                      <CustomDropdown
                        selectedItems={selectedCountry}
                        setSelectedItems={setSelectedCountry}
                        data={countries}
                        component={'Country'}
                        control={methods.control}
                        containerClassName={'tw-w-1/2'}
                        name={'countryId'}
                        withIcon={true}
                      />
                      <CustomDropdown
                        selectedItems={selectedState}
                        setSelectedItems={setSelectedState}
                        data={states}
                        component={'State'}
                        control={methods.control}
                        containerClassName={'tw-w-1/2'}
                        name={'stateId'}
                      />
                    </div>
                  </div>
                  <Row label="Level">
                    <CustomDropdown
                      selectedItems={selectedLevel}
                      setSelectedItems={setSelectedLevel}
                      data={levels}
                      component={levels && levels.length > 0 && levels?.map((level: LevelDto) => level.name).join(', ')}
                      control={methods.control}
                      name="levelId"
                    />
                  </Row>
                  <Row label="Program">
                    <div className="tw-w-full tw-space-y-lg">
                      {programOptions &&
                        programOptions.length > 0 &&
                        programOptions.map((option: ProgramOptionDto, index: number) => (
                          <CustomRadioButton
                            key={`radio-${option.id}-${index}`}
                            control={methods.control}
                            name="programOptionId"
                            option={option}
                            onSelectionChange={handleSelectionChange}
                          />
                        ))}
                    </div>
                  </Row>
                  <Row label="Additional Care">
                    <div className="tw-w-full">
                      <div className="tw-flex tw-w-full tw-space-x-2xl">
                        <div className="tw-w-full">
                          <CustomBooleanRadioButton
                            name="isBeforeAndAfterSchoolCareRequire"
                            control={methods.control}
                            defaultValue={false}
                            onChange={(value: boolean) => {
                              if (value) setIsCareRequired(true);
                              else setIsCareRequired(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Row>
                  {isCareRequired && (
                    <>
                      <Row label="Additional Days">
                        <div className="tw-w-full tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="beforeAndAfterSchoolCare.monday"
                            label="Monday"
                            defaultValue={false}
                          />
                          <CustomCheckboxButton
                            control={methods.control}
                            name="beforeAndAfterSchoolCare.tuesday"
                            label="Tuesday"
                            defaultValue={false}
                          />
                          <CustomCheckboxButton
                            control={methods.control}
                            name="beforeAndAfterSchoolCare.wednesday"
                            label="Wednesday"
                            defaultValue={false}
                          />
                          <CustomCheckboxButton
                            control={methods.control}
                            name="beforeAndAfterSchoolCare.thursday"
                            label="Thursday"
                            defaultValue={false}
                          />
                          <CustomCheckboxButton
                            control={methods.control}
                            name="beforeAndAfterSchoolCare.friday"
                            label="Friday"
                            defaultValue={false}
                            // error={getErrorMessage(methods.formState.errors, 'beforeAndAfterSchoolCare')}
                          />
                        </div>
                      </Row>
                      <Row label="Time Care is Needed">
                        <div className="tw-flex tw-space-x-lg">
                          <div className="tw-w-full">
                            <CustomInput
                              control={methods.control}
                              type="text"
                              defaultValue={studentProfile?.beforeAndAfterSchoolCare?.fromTime}
                              name="fromTime"
                              placeholder="Start Time"
                              containerClassName={'tw-flex-1'}
                            />
                          </div>
                          <div className="tw-flex tw-items-center tw-justify-center">-</div>
                          <div className="tw-w-full">
                            <CustomInput
                              control={methods.control}
                              type="text"
                              defaultValue={studentProfile?.beforeAndAfterSchoolCare?.toTime}
                              name="toTime"
                              placeholder="End Time"
                              containerClassName={'tw-flex-1'}
                            />
                          </div>
                        </div>
                      </Row>
                    </>
                  )}
                  <div className="tw-space-y-sm">
                    <Row label="Enrolled">
                      <div className="tw-flex tw-space-y-lg">
                        <div className="tw-w-full">
                          <CustomDatePicker
                            name={'enrolledDate'}
                            selected={enrolledDate}
                            onChange={(date: Date | null) => handlePickEnrolledDate(date)}
                          />
                        </div>
                      </div>
                    </Row>
                  </div>
                  <div className="tw-space-y-sm">
                    <Row label="Started School">
                      <div className="tw-flex tw-space-y-lg">
                        <div className="tw-w-full">
                          <CustomDatePicker
                            name={'startedSchoolDate'}
                            selected={startedSchoolDate}
                            onChange={(date: Date | null) => handlePickStartedSchoolDate(date)}
                          />
                        </div>
                      </div>
                    </Row>
                  </div>
                </div>
              </form>
            </FormProvider>
            <div className="tw-pt-xl">
              <CustomModal.Footer
                showLoader={showLoader}
                hasCancel={true}
                cancelText="Back"
                submitText="Next"
                submitIcon={showLoader ? <LoadingSpinner /> : <ArrowCircleRightIcon />}
                formId="update-student"
                onClick={() => handleSave}
                onCancel={handleCancel}
                flex="row"
                className="!tw-flex-row-reverse !tw-space-x-lg !tw-pt-0 !tw-pr-0"
                submitClass="!tw-h-[44px] !tw-w-[98px]"
                cancelClass="!tw-w-[74px] tw-text-button-secondary-fg tw-border-primary hover:tw-bg-secondary"
              />
            </div>
          </div>
        )}
      </CustomModal.Content>
    </>
  );
};

export default ChildSelection;
