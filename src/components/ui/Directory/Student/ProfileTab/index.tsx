import dayjs from 'dayjs';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, FormProvider, FieldErrors, FieldValues } from 'react-hook-form';
import { useState, useEffect, ReactNode, ChangeEvent } from 'react';
import { StudentDto } from '@/dtos/StudentDto';
import { StudentNewUpdateValidationSchema } from '@/validation/StudentValidationSchema';
import { StudentBeforeAndAfterSchoolCareModel, StudentModel } from '@/models/StudentModel';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import LevelDto from '@/dtos/LevelDto';
import CustomRadioButton from '@/components/common/NewCustomFormControls/CustomRadioButton';
import ProgramOptionDto from '@/dtos/ProgramOptionDto';
import { updateStudent, updateStudentStatus } from '@/services/api/updateStudent';
import Avatar from '@/components/ui/Avatar';
import CustomCheckboxButton from '@/components/common/NewCustomFormControls/CustomCheckboxButton';
import CustomBooleanRadioButton from '@/components/common/NewCustomFormControls/CustomBooleanRadioButton';
import TextSkeleton from '@/components/ui/Directory/TextSkeleton';
import StateDto from '@/dtos/StateDto';
import { useFocusContext } from '@/context/FocusContext';
import SaveIcon from '@/components/svg/SaveIcon';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import { useLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import { useProgramOptionQuery } from '@/hooks/queries/useProgramOptionsQuery';
import { useCountriesQuery } from '@/hooks/queries/useCountriesQuery';
import { useStatesQuery } from '@/hooks/queries/useStatesQuery';
import { useStudentClassDirectoryQuery } from '@/hooks/queries/useStudentsQuery';
import { useRaceQuery } from '@/hooks/queries/useRaceQuery';
import { useEthnicityQuery } from '@/hooks/queries/useEthnicityQuery';
import { replaceLevelName } from '@/utils/replaceLevelName';
import CustomDatePicker from '@/components/common/CustomDatePicker';
dayjs.extend(advancedFormat);

interface StudentProfileTabProps {
  data: StudentDto;
  isEditing: boolean;
  setIsEditing: Function;
  isLoading: boolean;
  setIsLoading: Function;
  isLoadingData: boolean;
  formId: string;
}

type FormFields = Pick<
  StudentModel,
  | 'firstName'
  | 'lastName'
  | 'middleName'
  | 'nickName'
  | 'dob'
  | 'gender'
  | 'countryId'
  | 'stateId'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'zipcode'
  | 'isBeforeAndAfterSchoolCareRequire'
  | 'beforeAndAfterSchoolCare'
  | 'fromTime'
  | 'toTime'
  | 'active'
  | 'ethnicityCategoryId'
  | 'ethnicityId'
  | 'enrolledDate'
  | 'startedSchoolDate'
  | 'disenrolledDate'
>;

type RowType = {
  label: string;
  subLabel?: string;
  children?: ReactNode;
  isLast?: boolean;
};

interface BeforeAndAfterSchoolCare {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
}

const StudentProfileTab = ({
  data,
  isEditing,
  setIsEditing,
  isLoading,
  setIsLoading,
  isLoadingData,
  formId,
}: StudentProfileTabProps) => {
  const queryClient = useQueryClient();
  const { setStudentId, setClassId, setLevelId, organization } = useFocusContext();
  const [selectedState, setSelectedState] = useState<{ id: number; name: string } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ id: number; name: string } | null>(null);
  const [selectedGender, setSelectedGender] = useState<{ name: string } | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<{ id: number; name: string } | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<{ id: number; name: string } | null>(null);
  const [isCareRequired, setIsCareRequired] = useState<boolean>();
  const [isActive, setIsActive] = useState<boolean>();
  const [selectedEthnicity, setSelectedEthnicity] = useState<{ id: number; name: string } | null>(null);
  const [selectedEthnicityCategory, setSelectedEthnicityCategory] = useState<{ id: number; name: string } | null>(null);

  const { data: studentClass } = useStudentClassDirectoryQuery(Number(data?.id));
  const { data: levels } = useLevelsQuery();
  const { data: programOptions } = useProgramOptionQuery(selectedLevel?.id!);
  const { data: countries } = useCountriesQuery();
  const { data: states } = useStatesQuery(data?.countryId ?? selectedCountry?.id!);
  const { data: race } = useRaceQuery();
  const { data: ethnicity } = useEthnicityQuery(selectedEthnicityCategory?.id!);
  const [ enrolledDate, setEnrolledDate] = useState<Date | null>(null);
  const [ startedSchoolDate, setStartedSchoolDate] = useState<Date | null>(null);
  const [ disenrolledDate, setDisenrolledDate] = useState<Date | null>(null);

  const modifiedname = replaceLevelName(data?.level?.name, organization?.termInfo);

  const methods = useForm<StudentModel>({
    resolver: yupResolver(StudentNewUpdateValidationSchema),
  });

  const modifiedLevels = levels?.map((level: LevelDto) => ({
    ...level,
    name: replaceLevelName(level.name, organization?.termInfo),
  }));

  const updatedData = {
    ...data,
    level: {
      ...data?.level,
      name: replaceLevelName(data?.level?.name),
    },
    programOption: {
      ...data?.programOption,
      level: {
        ...data?.programOption?.level,
        name: replaceLevelName(data?.programOption?.level?.name),
      },
    },
  };

  useEffect(() => {
    methods.reset();
    setSelectedCountry(null);
    setSelectedState(null);
    if (data && isEditing) {
      const setValueIfPresent = (fieldName: keyof FormFields, value: any) => {
        if (value) methods.setValue(fieldName, value);
      };
      setValueIfPresent('firstName', data.firstName);
      setValueIfPresent('lastName', data.lastName);
      setValueIfPresent('middleName', data.middleName);
      setValueIfPresent('nickName', data.nickName);
      setValueIfPresent('dob', formatDate(data?.dateOfBirth || '', 'MM-DD-YYYY'));
      setValueIfPresent('addressLine1', data.addressLine1);
      setValueIfPresent('addressLine2', data.addressLine2);
      setValueIfPresent('city', data.city);
      setValueIfPresent('zipcode', data.zipcode);
      setValueIfPresent('fromTime', data.beforeAndAfterSchoolCare?.fromTime);
      setValueIfPresent('toTime', data.beforeAndAfterSchoolCare?.toTime);
      setValueIfPresent('ethnicityCategoryId', data.ethnicityCategoryId);
      setValueIfPresent('ethnicityId', data.ethnicityId);

      if (data.gender) {
        methods.setValue('gender', data.gender || selectedGender?.name!);
        setSelectedGender({ name: data.gender });
      }
      if (data.levelId) {
        methods.setValue('levelId', data.levelId || selectedLevel?.id!);
        setSelectedLevel(data.level ? { id: updatedData.levelId, name: updatedData.level.name } : null);
      }
      if (data.countryId) {
        methods.setValue('countryId', data.countryId || selectedCountry?.id!);
        setSelectedCountry(data.country ? { id: data.countryId, name: data.country.name } : null);
      }
      if (data.stateId) {
        methods.setValue('stateId', data.stateId || selectedState?.id!);
        setSelectedState(data.state ? { id: data.stateId, name: data.state.name } : null);
      }
      if (data.levelId !== 0 && data.programOptionId) {
        methods.setValue('programOptionId', data.programOptionId);
        setSelectedProgram(data.programOption);
      }
      if (typeof data.isBeforeAndAfterSchoolCareRequire == 'boolean') {
        methods.setValue('isBeforeAndAfterSchoolCareRequire', data.isBeforeAndAfterSchoolCareRequire);
        setIsCareRequired(data.isBeforeAndAfterSchoolCareRequire);
      }
      if (typeof data.active == 'boolean') {
        methods.setValue('active', data.active);
        setIsActive(data.active);
      }

      if (data.ethnicityCategoryId) {
        methods.setValue('ethnicityCategoryId', data.ethnicityCategoryId || selectedEthnicityCategory?.id!);
        setSelectedEthnicityCategory(
          data.ethnicityCategory ? { id: data.ethnicityCategoryId, name: data.ethnicityCategory.name } : null
        );
      }

      if (data.ethnicityId) {
        methods.setValue('ethnicityId', data.ethnicityId || selectedEthnicity?.id!);
        setSelectedEthnicity(data.ethnicity ? { id: data.ethnicityCategoryId, name: data.ethnicity.name } : null);
      }

      if (data.enrolledDate) {
        methods.setValue('enrolledDate', data.enrolledDate);
        setEnrolledDate(new Date(data.enrolledDate));
      }

      if (data.startedSchoolDate) {
        methods.setValue('startedSchoolDate', data.startedSchoolDate);
        setStartedSchoolDate(new Date(data.startedSchoolDate));
      }

      if (data.disenrolledDate) {
        methods.setValue('disenrolledDate', data.disenrolledDate);
        setDisenrolledDate(new Date(data.disenrolledDate));
      }

    }
  }, [data, isEditing]);

  useEffect(() => {
    if (data && studentClass && studentClass.length > 0) {
      setStudentId(data.id);
      setClassId(studentClass[0].classId);
      setLevelId(studentClass[0].levelId);
    }
  }, [data, studentClass]);

  const handleSave = async (values: StudentModel) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
        const value = values[key as keyof StudentModel];
        if (key === 'profileImage') {
            let field = values?.[key] && values?.[key]![0] ? values?.[key]![0] : null;
            formData.append(key, field as File);
        } else if (key === 'dob') {
            formData.append(key, parseDate(value as string, 'mm-dd-yyyy') as unknown as string);
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
        } else if (key === 'disenrolledDate') {
            formData.append(key, value as string);
        } else {
            formData.append(key, value as string);
        }
    });

    // Uncomment this line to see the formData content in the console
    // new Response(formData).text().then(console.log);

    updateStudent(formData, data?.id).then(async () => {
        const requestData = {
            studentId: data.id,
            active: isActive,
        };

        await updateStudentStatus(requestData, data.id);
        queryClient.invalidateQueries(['students-directory']);
        queryClient.invalidateQueries(['students', data?.id]);
        queryClient.invalidateQueries(['parent-current-user']);
        setIsEditing(false);
        setIsLoading(false);
    });
  };

  const getSelectedDaysString = (beforeAndAfterSchoolCare: BeforeAndAfterSchoolCare | null) => {
    if (!beforeAndAfterSchoolCare) {
      return 'No days selected';
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const selectedDays = days.filter(
      (day) => beforeAndAfterSchoolCare[day.toLowerCase() as keyof BeforeAndAfterSchoolCare]
    );

    return selectedDays.join(', ');
  };

  const getStateCode = (stateId: number, states: StateDto[]) => {
    const state = states?.find((s) => s.id === stateId);
    return state ? state.code : null;
  };

  const Row = ({ label, subLabel, children, isLast = false }: RowType) => {
    return (
      <div className={`tw-flex tw-min-h-[44px] tw-space-x-4xl ${isLast ? 'tw-pb-4xl' : 'tw-pb-2xl'}`}>
        <div className="md:tw-w-1/4 sm:tw-w-1/2">
          <div className="tw-text-sm-semibold tw-text-secondary">{label}</div>
          <div className="tw-text-sm-regular tw-text-tertiary">{subLabel}</div>
        </div>
        <div className="tw-space-y-sm md:tw-w-2/4 sm:tw-w-1/2">
          <div className="tw-flex tw-space-x-3xl">{children}</div>
        </div>
      </div>
    );
  };

  const handleSelectionChange = (id: number) => {
    const selectedOption = programOptions?.find((option: ProgramOptionDto) => option.id === id);
    if (selectedOption) {
      setSelectedProgram(selectedOption);
      methods.setValue('programOptionId', selectedOption.id);
    }
  };

  function getErrorMessage<T extends FieldValues>(errors: FieldErrors<T>, fieldName: keyof T): string | undefined {
    const fieldError = errors[fieldName];
    return fieldError ? (fieldError as any).message : undefined;
  }

  const handleCancel = () => {
    setIsEditing(false);
    methods.reset();
  };

  const handlePickEnrolledDate = (date: Date | null) => {
    setEnrolledDate(date);
    methods.setValue('enrolledDate', date);
  }
  const handlePickStartedSchoolDate = (date: Date | null) => {
    setStartedSchoolDate(date);
    methods.setValue('startedSchoolDate', date);
  }

  const handlePickDisenrolledDate = (date: Date | null) => {
    setDisenrolledDate(date);
    methods.setValue('disenrolledDate', date);
  };

  return (
    <FormProvider {...methods}>
      <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)} id={formId}>
        <div className="tw-w-full">
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
            {isEditing && (
              <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <Row label="Name">
                  <div className="tw-w-1/3">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      placeholder="First"
                      name="firstName"
                      defaultValue={data?.firstName ?? ''}
                    />
                  </div>
                  <div className="tw-w-1/3">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      placeholder="Middle"
                      name="middleName"
                      defaultValue={data?.middleName ?? ''}
                    />
                  </div>
                  <div className="tw-w-1/3">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      placeholder="Last"
                      name="lastName"
                      defaultValue={data?.lastName ?? ''}
                    />
                  </div>
                </Row>
                <Row label="Nickname" subLabel="This will be the visible name in attendance, focus modes, etc.">
                  <div className="tw-w-full">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      placeholder="Nickname"
                      name="nickName"
                      defaultValue={data?.nickName ?? ''}
                    />
                  </div>
                </Row>
              </div>
            )}
          </div>
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
            <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
              <Row label="Date of Birth">
                <div className="tw-w-full">
                  {isLoadingData ? (
                    <TextSkeleton width={100} />
                  ) : isEditing ? (
                    <CustomInput
                      control={methods.control}
                      type="text"
                      placeholder="MM-DD-YYYY"
                      name="dob"
                      defaultValue={formatDate(data?.dateOfBirth || '', 'MM-DD-YYYY')}
                    />
                  ) : (
                    <div className="tw-text-md-normal tw-text-primary">
                      {formatDate(data?.dateOfBirth || '', 'MM-DD-YYYY')}
                    </div>
                  )}
                </div>
              </Row>
            </div>
          </div>
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
            <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
              <Row label="Gender">
                <div className="tw-w-full">
                  {isLoadingData ? (
                    <TextSkeleton width={75} />
                  ) : isEditing ? (
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
                  ) : (
                    <div className="tw-text-md-normal tw-text-primary">{data?.gender || ''}</div>
                  )}
                </div>
              </Row>
            </div>
          </div>

          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
            <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
              <Row label="Demographics">
                <div className="tw-w-full">
                  {isLoadingData ? (
                    <TextSkeleton width={75} />
                  ) : isEditing ? (
                    <div className="tw-flex tw-p-0 tw-space-x-3xl">
                      <CustomDropdown
                        selectedItems={selectedEthnicityCategory}
                        setSelectedItems={setSelectedEthnicityCategory}
                        data={race}
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
                  ) : (
                    <div className="tw-text-md-normal tw-text-primary">
                      {data?.ethnicityCategory?.name} {data?.ethnicity?.name} 
                    </div>
                  )}
                </div>
              </Row>
            </div>
          </div>

          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
            <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
              <Row label="Address">
                <div className="tw-w-full tw-p-0 tw-space-y-xl">
                  {isLoadingData ? (
                    <TextSkeleton width={350} />
                  ) : isEditing ? (
                    <>
                      <div className="tw-flex tw-p-0 tw-space-x-3xl">
                        <CustomDropdown
                          selectedItems={selectedCountry}
                          setSelectedItems={setSelectedCountry}
                          data={countries}
                          component="Country"
                          control={methods.control}
                          containerClassName="tw-w-1/2"
                          name="countryId"
                          withIcon={true}
                        />
                        <CustomDropdown
                          selectedItems={selectedState}
                          setSelectedItems={setSelectedState}
                          data={states}
                          component="State"
                          control={methods.control}
                          containerClassName="tw-w-1/2"
                          name="stateId"
                        />
                      </div>
                      <div className="tw-flex tw-p-0 tw-space-x-3xl">
                        <CustomInput
                          control={methods.control}
                          type="text"
                          name="addressLine1"
                          placeholder="Address Line 1"
                          containerClassName="tw-w-1/2"
                          defaultValue={data?.addressLine1 ?? ''}
                        />
                        <CustomInput
                          control={methods.control}
                          type="text"
                          name="addressLine2"
                          placeholder="Address Line 2"
                          containerClassName="tw-w-1/2"
                          defaultValue={data?.addressLine2 ?? ''}
                        />
                      </div>
                      <div className="tw-flex tw-p-0 tw-space-x-3xl">
                        <CustomInput
                          control={methods.control}
                          type="text"
                          name="city"
                          placeholder="City"
                          containerClassName="tw-w-1/2"
                          defaultValue={data?.city ?? ''}
                        />
                        <CustomInput
                          control={methods.control}
                          type="text"
                          name="zipcode"
                          placeholder="Zipcode"
                          containerClassName="tw-w-1/2"
                          defaultValue={data?.zipcode ?? ''}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="tw-text-md-normal tw-text-primary">
                      {`
                        ${data?.addressLine1 ? data?.addressLine1 : ''}${data?.city ? ' ' + data?.city : ''}${
                        data?.stateId && data?.addressLine1 == null && data?.city == null
                          ? `${getStateCode(data.stateId, states)}`
                          : data?.stateId
                          ? `, ${getStateCode(data.stateId, states)}`
                          : ''
                      }
                        ${data?.zipcode ? ' ' + data?.zipcode : ''}
                      `}
                    </div>
                  )}
                </div>
              </Row>
            </div>
          </div>
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
            <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
              <Row label="Level">
                <div className="tw-w-full">
                  {isLoadingData ? (
                    <TextSkeleton width={100} />
                  ) : isEditing ? (
                    <CustomDropdown
                      selectedItems={selectedLevel}
                      setSelectedItems={setSelectedLevel}
                      data={modifiedLevels}
                      component={modifiedLevels?.map((level: LevelDto) => level.name).join(', ')}
                      control={methods.control}
                      name="levelId"
                    />
                  ) : (
                    <div>{modifiedname}</div>
                  )}
                </div>
              </Row>
            </div>
          </div>
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
            <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
              <Row label="Program">
                <div className="tw-w-full tw-space-y-lg">
                  {isLoadingData ? (
                    <TextSkeleton width={350} />
                  ) : isEditing ? (
                    selectedLevel && programOptions ? (
                      programOptions.map((option: ProgramOptionDto, index: number) => (
                        <CustomRadioButton
                          key={`radio-${option.id}-${index}`}
                          control={methods.control}
                          name="programOptionId"
                          option={option}
                          onSelectionChange={handleSelectionChange}
                        />
                      ))
                    ) : (
                      <div>Please select a Level</div>
                    )
                  ) : (
                    <div className="tw-flex">
                      <div className="tw-text-md-normal tw-text-primary">{`${data?.programOption?.name || ''} ${
                        data?.programOption?.timeSchedule || ''
                      }`}</div>
                    </div>
                  )}
                </div>
              </Row>
            </div>
          </div>
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
            <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
              <Row label="Additional Care">
                <div className="tw-w-full">
                  {isLoadingData ? (
                    <TextSkeleton width={30} />
                  ) : isEditing ? (
                    <div className="tw-flex tw-w-full tw-space-x-2xl">
                      <div className="tw-w-full">
                        <CustomBooleanRadioButton
                          name="isBeforeAndAfterSchoolCareRequire"
                          control={methods.control}
                          defaultValue={data.isBeforeAndAfterSchoolCareRequire}
                          onChange={(value: boolean) => {
                            if (value) setIsCareRequired(true);
                            else setIsCareRequired(false);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>{!data ? '' : data?.isBeforeAndAfterSchoolCareRequire === true ? 'Yes' : 'No'}</div>
                  )}
                </div>
              </Row>
            </div>
          </div>
          {data?.isBeforeAndAfterSchoolCareRequire === true && !isEditing && (
            <>
              <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
                <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                  <Row label="Additional Days">
                    <div>{getSelectedDaysString(data?.beforeAndAfterSchoolCare)}</div>
                  </Row>
                </div>
              </div>
              <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
                <div className="tw-space-x-lg tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                  <Row label="Time Care is Needed">
                    <div>{`${data?.beforeAndAfterSchoolCare?.fromTime} - ${
                      data?.beforeAndAfterSchoolCare?.toTime || data?.toTime
                    }`}</div>
                  </Row>
                </div>
              </div>
            </>
          )}
          {isCareRequired && isEditing && (
            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <Row label="Additional Days">
                  <div className="tw-w-full tw-space-y-lg">
                    <CustomCheckboxButton
                      control={methods.control}
                      name="beforeAndAfterSchoolCare.monday"
                      label="Monday"
                      defaultValue={data?.beforeAndAfterSchoolCare?.monday ?? false}
                    />
                    <CustomCheckboxButton
                      control={methods.control}
                      name="beforeAndAfterSchoolCare.tuesday"
                      label="Tuesday"
                      defaultValue={data?.beforeAndAfterSchoolCare?.tuesday ?? false}
                    />
                    <CustomCheckboxButton
                      control={methods.control}
                      name="beforeAndAfterSchoolCare.wednesday"
                      label="Wednesday"
                      defaultValue={data?.beforeAndAfterSchoolCare?.wednesday ?? false}
                    />
                    <CustomCheckboxButton
                      control={methods.control}
                      name="beforeAndAfterSchoolCare.thursday"
                      label="Thursday"
                      defaultValue={data?.beforeAndAfterSchoolCare?.thursday ?? false}
                    />
                    <CustomCheckboxButton
                      control={methods.control}
                      name="beforeAndAfterSchoolCare.friday"
                      label="Friday"
                      defaultValue={data?.beforeAndAfterSchoolCare?.friday ?? false}
                      error={getErrorMessage(methods.formState.errors, 'beforeAndAfterSchoolCare')}
                    />
                  </div>
                </Row>
              </div>
            </div>
          )}
          {isCareRequired && isEditing && (
            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-space-x-lg tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <Row label="Time Care is Needed">
                  <div className="tw-w-full">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      defaultValue={data?.beforeAndAfterSchoolCare?.fromTime ?? ''}
                      name="fromTime"
                      disabled={!isEditing}
                      placeholder="Start Time"
                      containerClassName="tw-flex-1"
                    />
                  </div>
                  <div className="tw-flex tw-items-center tw-justify-center">-</div>
                  <div className="tw-w-full">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      defaultValue={data?.beforeAndAfterSchoolCare?.toTime ?? ''}
                      name="toTime"
                      disabled={!isEditing}
                      placeholder="End Time"
                      containerClassName="tw-flex-1"
                    />
                  </div>
                </Row>
              </div>
            </div>
          )}
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-space-x-lg tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <Row label="Enrolled">
                  <div className="tw-w-full">
                    {isLoadingData ? (
                      <TextSkeleton width={30} />
                    ) : isEditing ? (
                      <div className="tw-flex tw-w-full tw-space-x-2xl">
                        <div className="tw-w-full">
                          <CustomDatePicker 
                            name={'enrolledDate'} 
                            selected={enrolledDate} 
                            onChange={(date: Date | null) => handlePickEnrolledDate(date)} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        {!data ? '' : 
                          data?.enrolledDate ? (
                            data.enrolledDate instanceof Date
                              ? formatDate(data.enrolledDate, 'MM-DD-YYYY')
                              : (() => {
                                  const date = new Date(data.enrolledDate);
                                  return isNaN(date.getTime())
                                    ? data.enrolledDate
                                    : formatDate(date, 'MM-DD-YYYY');
                                })()
                          ) : ''
                        }
                      </div>
                    )}
                  </div>
                </Row>
              </div>
          </div>
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-space-x-lg tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <Row label="Started School">
                  <div className="tw-w-full">
                    {isLoadingData ? (
                      <TextSkeleton width={30} />
                    ) : isEditing ? (
                      <div className="tw-flex tw-w-full tw-space-x-2xl">
                        <div className="tw-w-full">
                          <CustomDatePicker 
                            name={'startedSchoolDate'} 
                            selected={startedSchoolDate} 
                            onChange={(date: Date | null) => handlePickStartedSchoolDate(date)} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        {!data ? '' : 
                          data?.startedSchoolDate ? (
                            data.startedSchoolDate instanceof Date
                              ? formatDate(data.startedSchoolDate, 'MM-DD-YYYY')
                              : (() => {
                                  const date = new Date(data.startedSchoolDate);
                                  return isNaN(date.getTime())
                                    ? data.startedSchoolDate
                                    : formatDate(date, 'MM-DD-YYYY');
                                })()
                          ) : ''
                        }
                      </div>

                    )}
                  </div>
                </Row>
              </div>
          </div>
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-space-x-lg tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <Row label="Disenrolled">
                  <div className="tw-w-full">
                    {isLoadingData ? (
                      <TextSkeleton width={30} />
                    ) : isEditing ? (
                      <div className="tw-flex tw-w-full tw-space-x-2xl">
                        <div className="tw-w-full">
                          <CustomDatePicker 
                            name={'disenrolledDate'} 
                            selected={disenrolledDate} 
                            onChange={(date: Date | null) => handlePickDisenrolledDate(date)} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        {!data ? '' : 
                          data?.disenrolledDate ? (
                            data.disenrolledDate instanceof Date
                              ? formatDate(data.disenrolledDate, 'MM-DD-YYYY')
                              : (() => {
                                  const date = new Date(data.disenrolledDate);
                                  return isNaN(date.getTime())
                                    ? data.disenrolledDate
                                    : formatDate(date, 'MM-DD-YYYY');
                                })()
                          ) : ''
                        }
                      </div>

                    )}
                  </div>
                </Row>
              </div>
          </div>
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
            <div className="tw-space-x-lg tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
              <div className="tw-flex tw-space-x-4xl tw-pb-2xl">
                <div className="md:tw-w-1/4 sm:tw-w-1/2">
                  <div className="tw-text-sm-semibold tw-text-secondary">Identification Photo</div>
                  <div className="tw-text-sm-regular tw-text-tertiary">
                    This will be used to for campus security and pickup / drop-off verification.
                  </div>
                </div>
                <div className="md:tw-w-2/4 sm:tw-w-1/2">
                  <div className="tw-flex md:tw-flex-row sm:tw-flex-col sm:tw-space-y-md tw-space-x-3xl">
                    {isEditing ? (
                      <>
                        <Avatar photoSize={64} link={data?.profilePicture || ''} />
                        <div className="tw-w-full">
                          <CustomInput
                            id={data?.id}
                            component="Student"
                            control={methods.control}
                            type="file"
                            name="profileImage"
                            icon={'cloud'}
                            label="profile image"
                            isProfile={true}
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
                      </>
                    ) : data ? (
                      <Avatar photoSize={64} link={data?.profilePicture || ''} />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
            <div className="">
              <Row label="Active Profile" isLast={true}>
                <div className="tw-w-full">
                  {isLoadingData ? (
                    <TextSkeleton width={30} />
                  ) : isEditing ? (
                    <div className="tw-flex tw-w-full tw-space-x-2xl">
                      <div className="tw-w-full">
                        <CustomBooleanRadioButton
                          name="active"
                          control={methods.control}
                          defaultValue={data.active}
                          onChange={(value: boolean) => {
                            if (value) setIsActive(true);
                            else setIsActive(false);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>{!data ? '' : data?.active === true ? 'Yes' : 'No'}</div>
                  )}
                </div>
              </Row>
            </div>
          </div>
          {isEditing && (
            <div className="tw-py-xl tw-flex tw-items-center tw-justify-end tw-border tw-border-b-0 tw-border-x-0 tw-border-solid tw-border-secondary">
              <div className="tw-flex tw-min-w-[1016px] tw-mx-4xl  tw-items-center tw-justify-end tw-space-x-lg">
                <div>
                  <button
                    className={
                      'tw-h-[40px] tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-white tw-text-button-secondary-color-fg tw-rounded-md tw-border tw-border-button-secondary-color-border tw-border-solid tw-shadow-sm hover:tw-bg-button-secondary-bg-hover'
                    }
                    onClick={handleCancel}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
                <div>
                  <button
                    className={
                      'tw-h-[40px] tw-w-[88px] tw-space-x-xs tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-brand tw-text-white tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover'
                    }
                    type="submit"
                    form={formId}
                  >
                    {isLoading ? (
                      <div role="status">
                        <LoadingSpinner width={25} />
                      </div>
                    ) : (
                      <>
                        <SaveIcon stroke={'white'} />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default StudentProfileTab;
