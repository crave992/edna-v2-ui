import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import SaveIcon from '@/components/svg/SaveIcon';
import { useQueryClient } from '@tanstack/react-query';
import 'react-datepicker/dist/react-datepicker.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import LevelDto from '@/dtos/LevelDto';
import ArrowCircleRightIcon from '@/components/svg/ArrowCircleRight';
import { StudentModel } from '@/models/StudentModel';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import { addStudent } from '@/services/api/addStudent';
import ProgramOptionDto from '@/dtos/ProgramOptionDto';
import { useProgramOptionQuery } from '@/hooks/queries/useProgramOptionsQuery';
import { useLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import { useRaceQuery } from '@/hooks/queries/useRaceQuery';
import { useEthnicityQuery } from '@/hooks/queries/useEthnicityQuery';
import { useFocusContext } from '@/context/FocusContext';
import { replaceLevelName } from '@/utils/replaceLevelName';
import CustomButton from '../CustomButton';

interface AddStudentDirectoryProps {
  showModal?: boolean;
  setShowModal: Function;
  component: string;
}

interface SaveData {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date | null;
  levelId: number;
  programOptionId: number;
  enrolledDate: Date | null;
  startedSchoolDate: Date | null;
  disenrolledDate: Date | null;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.string().required('Date of Birth is required'),
  ethnicityCategoryId: Yup.number().required('Race is required'),
  ethnicityId: Yup.number().required('Ethnicity is required'),
});

export default function AddStudentDirectory({ showModal, setShowModal, component }: AddStudentDirectoryProps) {
  const { organization } = useFocusContext();
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [selectedGender, setSelectedGender] = useState<{ name: string } | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<{ id: number; name: string } | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<{ id: number; name: string } | null>(null);
  const [selectedEthnicity, setSelectedEthnicity] = useState<{ id: number; name: string } | null>(null);
  const [selectedEthnicityCategory, setSelectedEthnicityCategory] = useState<{ id: number; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [enrolledDate, setEnrolledDate] = useState<Date | null>(null);
  const [startedSchoolDate, setStartedSchoolDate] = useState<Date | null>(null);

  const { data: levels } = useLevelsQuery();
  const { data: programOptions } = useProgramOptionQuery(selectedLevel?.id!);

  const modifiedLevels = levels?.map((level: LevelDto) => ({
    ...level,
    name: replaceLevelName(level.name, organization?.termInfo),
  }));

  const methods = useForm<StudentModel>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const { data: ethnicityCategory } = useRaceQuery();
  const { data: ethnicity } = useEthnicityQuery(selectedEthnicityCategory?.id!);

  const resetData = () => {
    setDateOfBirth(new Date());
    setSelectedGender(null);
    setSelectedLevel(null);
    setSelectedProgram(null);
    setSelectedEthnicity(null);
    setSelectedEthnicityCategory(null);
    setEnrolledDate(null);
    setStartedSchoolDate(null);
    setShowModal(false);
    setEnrolledDate(null);
    setStartedSchoolDate(null);
    methods.reset();
  };

  const handleSuccess = () => {
    setIsLoading(false);
    queryClient.invalidateQueries(['students-directory']);
    resetData();
  };

  const handleSave = async (data: StudentModel) => {
    setIsLoading(true);

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof SaveData];
      if (key === 'gender') {
        formData.append(key, selectedGender?.name as string);
      } else if (key === 'enrolledDate') {
        formData.append(key, data.enrolledDate?.toISOString() as string);
      } else if (key === 'startedSchoolDate') {
        formData.append(key, data.startedSchoolDate?.toISOString() as string);
      } else {
        formData.append(key, value as string);
      }
    });

    await addStudent(formData).then(() => {
      queryClient.invalidateQueries(['students']);
      handleSuccess();
    });
  };

  useEffect(() => {
    setDateOfBirth(new Date());
    const body = document.querySelector('body');

    if (showModal) {
      body && body.classList.add('body-scroll-lock');
    } else {
      body && body.classList.remove('body-scroll-lock');
    }

    return () => {
      body && body.classList.remove('body-scroll-lock');
    };
  }, [showModal]);

  const handlePickDate = (date: Date | null) => {
    setDateOfBirth(date);
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

  useEffect(() => {
    methods.setValue('programOptionId', null);
    setSelectedProgram(null);
  }, [selectedLevel]);

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="tw-p-4xl tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-flex tw-items-start tw-justify-center tw-overflow-y-scroll tw-max-h-screen tw-bg-black/[0.3] tw-z-20 tw-min-h-screen">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50 custom-thin-scrollbar"
            >
              <FormProvider {...methods}>
                <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)}>
                  <div className="tw-p-3xl tw-justify-between tw-flex">
                    <div className="tw-font-black tw-text-lg">Add {component}</div>
                    <span className="tw-cursor-pointer" onClick={resetData}>
                      <NotesCloseIcon />
                    </span>
                  </div>

                  <div className="tw-px-3xl tw-py-0 tw-space-y-xl">
                    <div className="tw-space-y-sm">
                      <div className="tw-text-sm-medium tw-text-secondary">Name</div>
                      <div className="tw-flex tw-w-full tw-gap-x-3">
                        <div className="tw-flex-1">
                          <CustomInput
                            control={methods.control}
                            type="text"
                            name="firstName"
                            placeholder="First"
                            containerClassName="tw-flex-1"
                          />
                        </div>
                        <div className="tw-flex-1">
                          <CustomInput
                            control={methods.control}
                            type="text"
                            name="lastName"
                            placeholder="Last"
                            containerClassName="tw-flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="tw-space-y-sm">
                      <div className="tw-text-sm-medium tw-text-secondary">Gender</div>
                      <div className="tw-flex tw-w-full tw-gap-x-3">
                        <div className="tw-flex-1">
                          <CustomDropdown
                            selectedItems={selectedGender}
                            setSelectedItems={setSelectedGender}
                            data={[
                              { id: 0, name: 'Male' },
                              { id: 1, name: 'Female' },
                            ]}
                            component={[{ name: 'Male' }, { name: 'Female' }].map((gender) => gender.name).join(', ')}
                            control={methods.control}
                            name="gender"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-sm-medium tw-text-secondary">Demographics</div>
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
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-sm-medium tw-text-secondary">Date of Birth</div>
                      <CustomDatePicker
                        name="dob"
                        selected={dateOfBirth}
                        onChange={(date: Date | null) => handlePickDate(date)}
                      />
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-sm-medium tw-text-secondary">Level</div>
                      <div className="tw-flex tw-w-full tw-gap-x-3">
                        <div className="tw-flex-1">
                          <CustomDropdown
                            selectedItems={selectedLevel}
                            setSelectedItems={setSelectedLevel}
                            data={modifiedLevels}
                            component={
                              modifiedLevels &&
                              modifiedLevels.length > 0 &&
                              modifiedLevels.map((level: LevelDto) => level.name).join(', ')
                            }
                            control={methods.control}
                            name="levelId"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-sm-medium tw-text-secondary">Program Options</div>
                      <div className="tw-flex tw-w-full tw-gap-x-3">
                        <div className="tw-flex-1">
                          {selectedLevel !== null ? (
                            <CustomDropdown
                              selectedItems={selectedProgram}
                              setSelectedItems={setSelectedProgram}
                              data={
                                programOptions &&
                                programOptions.length > 0 &&
                                programOptions?.map((program: ProgramOptionDto) => ({
                                  ...program,
                                  name: `${program.name} - ${program.timeSchedule}`,
                                }))
                              }
                              component="Select program options"
                              control={methods.control}
                              name="programOptionId"
                            />
                          ) : (
                            <CustomInput
                              control={methods.control}
                              type="text"
                              name="programOptionId"
                              placeholder="Select a level first"
                              disabled
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-sm-medium tw-text-secondary">Enrolled</div>
                      <CustomDatePicker
                        name={'enrolledDate'}
                        selected={enrolledDate}
                        onChange={(date: Date | null) => handlePickEnrolledDate(date)}
                      />
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-sm-medium tw-text-secondary">Started School</div>
                      <CustomDatePicker
                        name={'startedSchoolDate'}
                        selected={startedSchoolDate}
                        onChange={(date: Date | null) => handlePickStartedSchoolDate(date)}
                      />
                    </div>
                  </div>
                  <div className="tw-pt-4xl tw-pb-3xl tw-px-3xl tw-flex tw-items-center tw-justify-between">
                    <div className="tw-space-x-md">
                      {/* <label className="tw-flex tw-items-center">
                      <input
                        type="checkbox"
                        checked={isChildContactAdded}
                        className={`tw-w-[16px] tw-h-[16px] ${
                          isChildContactAdded ? 'tw-bg-brand-primary' : 'tw-bg-white'
                        } tw-border tw-border-primary tw-border-solid tw-rounded tw-cursor-pointer`}
                        onChange={(e) => setIsChildContactAdded(e.target.checked)}
                      />
                      {isChildContactAdded && <CheckMarkIcon />}
                      <div className="tw-text-md-semibold">Add Child Contact</div>
                    </label> */}
                    </div>
                    <div className="tw-flex tw-items-center tw-justify-center tw-space-x-lg">
                      <CustomButton text="Cancel" btnSize="lg" heirarchy="secondary-gray" onClick={resetData} />
                      <CustomButton
                        text="Save"
                        btnSize="lg"
                        heirarchy="primary"
                        type="submit"
                        iconLeading={isLoading ? <NotesSpinner /> : <SaveIcon />}
                      />
                    </div>
                  </div>
                </form>
              </FormProvider>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
