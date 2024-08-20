import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import SaveIcon from '@/components/svg/SaveIcon';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import ClassDto, { ClassAddDto, ClassStaffDto } from '@/dtos/ClassDto';
import ClassValidationSchema from '@/validation/ClassValidationSchema';
import LevelDto from '@/dtos/LevelDto';
import DropdownChevron from '@/components/svg/DropdownChevron';
import Multiselect from 'multiselect-react-dropdown';
import CloseIcon from '@/components/svg/CloseIcon';
import { StudentBasicDto } from '@/dtos/StudentDto';
import Avatar from '../Avatar';
import CustomAutoComplete from '@/components/common/NewCustomFormControls/CustomAutocomplete';
import { useStudentsQuery } from '@/hooks/queries/useStudentsQuery';
import { useStaffsQuery } from '@/hooks/queries/useStaffsQuery';
import { useLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import TrashIcon from '@/components/svg/TrashIcon';
import { deleteClass } from '@/services/api/deleteClass';
import { useRouter } from 'next/router';
import { useFocusContext } from '@/context/FocusContext';
import { replaceLevelName } from '@/utils/replaceLevelName';

interface AddClassProps {
  showModal?: boolean;
  setShowModal: Function;
  isEdit: boolean;
  classData?: ClassDto;
}

interface Item {
  id: number;
  name: string;
  [key: string]: any;
}

export default function AddEditClass({ showModal, setShowModal, isEdit, classData }: AddClassProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<Item | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<ClassStaffDto[] | null>(null);
  const [selectedAssociateGuide, setSelectedAssociateGuide] = useState<ClassStaffDto[] | null>();
  const [selectedSpecialist, setSelectedSpecialist] = useState<ClassStaffDto[] | null>();
  const [selectedStudents, setSelectedStudents] = useState<StudentBasicDto[] | null>();
  const [isOpenStudent, setIsOpenStudent] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [shouldConfirm, setShouldConfirm] = useState<boolean>(false);
  const { currentUserRoles, organization } = useFocusContext();

  const { data: levels } = useLevelsQuery();
  const { data: staff } = useStaffsQuery();
  const { data: students } = useStudentsQuery();

  const modifiedLevels = levels?.map((level: LevelDto) => ({
    ...level,
    name: replaceLevelName(level.name, organization?.termInfo),
  }));

  const methods = useForm<ClassAddDto>({
    resolver: yupResolver(ClassValidationSchema),
    mode: 'onChange',  
  });
  const capacity = methods.watch('capacity');

  useEffect(() => {
    if (classData) {
      if (classData.levelId) {
        methods.setValue('levelId', classData.levelId || selectedLevel?.id!);
        setSelectedLevel(classData.level);
      }

      if (isEdit && showModal) {
        methods.setValue('id', classData?.id);
        methods.setValue('name', classData?.name);
        methods.setValue('capacity', classData?.capacity);
        methods.setValue('location', classData?.location);
        if (classData.classStaff) {
          const selectedGuides = classData.classStaff.filter((staff) => staff.type === 1);
          setSelectedGuide(selectedGuides && selectedGuides.length > 0 ? selectedGuides : []);
          methods.setValue('leadGuides', selectedGuides);

          const selectedAssociateGuide = classData.classStaff.filter((staff) => staff.type === 2);
          setSelectedAssociateGuide(
            selectedAssociateGuide && selectedAssociateGuide.length > 0 ? selectedAssociateGuide : []
          );
          methods.setValue('associateGuides', selectedAssociateGuide);

          const selectedSpecialist = classData.classStaff.filter((staff) => staff.type === 3);
          setSelectedSpecialist(selectedSpecialist && selectedSpecialist.length > 0 ? selectedSpecialist : []);
          methods.setValue('specialistGuides', selectedSpecialist);
        }

        if (classData.students) {
          const selectedStudents = classData.students;
          setSelectedStudents(selectedStudents && selectedStudents.length > 0 ? selectedStudents : []);
          methods.setValue('students', selectedStudents);
        }
      } else {
        setSelectedStudents(null);
      }
    }
  }, [classData, isEdit, showModal]);

  useEffect(() => {
    const body = document.querySelector('body');

    // Add the class to disable scrolling when the modal is open
    if (showModal) {
      body && body.classList.add('body-scroll-lock');
    } else {
      // Remove the class when the modal is closed
      body && body.classList.remove('body-scroll-lock');
    }

    // Cleanup effect
    return () => {
      body && body.classList.remove('body-scroll-lock');
    };
  }, [showModal]);

  const resetData = () => {
    setSelectedLevel(null);
    setSelectedGuide(null);
    setSelectedAssociateGuide(null);
    setSelectedStudents(null);
    setShowModal(false);
    methods.reset();
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await deleteClass(classData?.id).then(() => {
        queryClient.invalidateQueries(['classes-directory']);
        router.push('/directory/class');
      });
    } catch (error) {
      console.error('Error deleting class:', error);
    } finally {
      setIsDeleteLoading(false);
      setShouldConfirm(false);
      setIsDeleteLoading(false);
      resetData();
    }
  };

  const saveMutation = useMutation(
    (data: ClassAddDto) =>
      fetch(`/api/class/`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    {
      onSuccess: () => {
        resetData();
        queryClient.invalidateQueries(['classes']);
        queryClient.invalidateQueries(['attendance', { class: classData?.id }]);
        queryClient.invalidateQueries(['classes-directory']);
        queryClient.invalidateQueries(['students', { class: classData?.id }]);
      },
      onError: (error) => {
        console.error('Error saving class:', error);
      },
    }
  );

  const updateMutation = useMutation(
    (data: ClassAddDto) =>
      fetch(`/api/class/${classData?.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    {
      onSuccess: () => {
        resetData();
        queryClient.invalidateQueries(['classes']);
        queryClient.invalidateQueries(['attendance', { class: classData?.id }]);
        queryClient.invalidateQueries(['classes-directory']);
        queryClient.invalidateQueries(['students', { class: classData?.id }]);
      },
      onError: (error) => {
        console.error('Error saving class:', error);
      },
    }
  );

  const handleSave = async (data: ClassAddDto) => {
    var filteredStudents = selectedStudents && selectedStudents?.filter((student) => student !== null);

    //remove extra students if capacity is not enough
    if (filteredStudents && capacity < filteredStudents.length) {
      filteredStudents = filteredStudents.slice(0, capacity);
      data.students = filteredStudents;
    }

    const studentClassAssignment =
      filteredStudents &&
      filteredStudents.map((student) => ({
        studentId: student.id,
        classId: isEdit ? classData?.id : 0,
      }));

    const requestData: ClassAddDto = {
      ...data,
      leadGuideClassAssignment: data.leadGuides
        ? data.leadGuides.map((guide) => ({
            staffId: guide.id,
            classId: isEdit ? classData?.id : 0,
          }))
        : null,
      associateGuideClassAssignment: data.associateGuides
        ? data.associateGuides.map((guide) => ({
            staffId: guide.id,
            classId: isEdit ? classData?.id : 0,
          }))
        : null,
      specialistClassAssignment: data.specialistGuides
        ? data.specialistGuides.map((guide) => ({
            staffId: guide.id,
            classId: isEdit ? classData?.id : 0,
          }))
        : null,
      // @ts-ignore
      studentClassAssignment: filteredStudents && filteredStudents.length > 0 ? studentClassAssignment : [],
    };

    isEdit ? updateMutation.mutate(requestData) : saveMutation.mutate(requestData);
  };

  const handleClose = () => {
    resetData();
    setShowModal(false);
  };

  const customStyles = {
    multiselectContainer: {
      border: '#D0D5DD 1px solid',
      borderRadius: '8px',
      color: 'red',
    },
    searchBox: {
      border: 'transparent',
    },
    inputField: {
      margin: '5px',
    },
    chips: {
      background: 'white',
      border: '#D0D5DD 1px solid',
      borderRadius: '6px',
      color: '#344054',
      fontSize: '14px',
      fontColor: '#344054',
      fontWeight: 500,
      paddingLeft: '5px',
    },
    optionContainer: {
      background: 'white',
      color: 'red',
      marginTop: '5px',
      paddingTop: '5px',
      borderRadius: '8px',
    },
    option: {
      color: '#344054',
      fontSize: '14px',
      fontColor: '#344054',
      fontWeight: 500,
    },
    groupHeading: {},
  };

  const filteredData =
    students &&
    students.student &&
    students.student.length > 0 &&
    students.student.filter((student: StudentBasicDto) => {
      return (
        !classData?.students.some((current: StudentBasicDto) => current.id === student.id) &&
        !(selectedStudents && selectedStudents.some((selected) => selected && selected.id === student.id))
      );
    });

  const selectedValueDecorator = (value: ReactNode, option: ClassStaffDto) => (
    <div className="tw-flex tw-items-center tw-space-x-[5px]">
      {option && option.profilePicture ? (
        <>
          <Avatar link={option.profilePicture} photoSize={16} firstName={option.firstName} lastName={option.lastName} />
          <div>{option.firstName}</div>
        </>
      ) : (
        <>
          <Avatar link={option.profilePicture} photoSize={16} noImage />
          <div>{option.firstName}</div>
        </>
      )}
    </div>
  );

  const optionValueDecorator = (value: ReactNode, option: ClassStaffDto) => (
    <div className="tw-flex tw-flex-row tw-space-x-[5px]">
      {option && (
        <>
          <Avatar link={option.profilePicture} photoSize={16} firstName={option.firstName} lastName={option.lastName} />
          <div>{`${option.firstName} ${option.lastName}`}</div>
        </>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {showModal ? (
        <>
          {/* Backdrop */}
          <div className="tw-p-4xl tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-flex tw-items-start tw-justify-center tw-overflow-y-scroll tw-max-h-screen tw-bg-black/[0.3] tw-z-20 tw-min-h-screen">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tw-p-3xl tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50"
            >
              <FormProvider {...methods}>
                <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)}>
                  <div className="tw-justify-between tw-flex tw-mb-2xl">
                    <div className="tw-flex tw-flex-col">
                      <div className="tw-text-primary tw-text-lg-semibold">{`${isEdit ? 'Edit' : 'Add'} Class`}</div>
                      <div>{classData?.name}</div>
                    </div>
                    <span className="tw-cursor-pointer" onClick={() => handleClose()}>
                      <NotesCloseIcon />
                    </span>
                  </div>

                  <div className="tw-space-y-xl">
                    <input hidden name="id" />
                    <div className="tw-space-y-sm">
                      <div className="tw-text-secondary tw-text-sm-medium">Name</div>
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="name"
                        placeholder="Primary 6, Mrs. David’s Class, etc."
                        containerClassName="tw-w-full"
                        defaultValue={classData?.name}
                      />
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-secondary tw-text-sm-medium">Level</div>
                      <div className="tw-flex tw-flex-row tw-gap-x-lg tw-w-full">
                        <CustomDropdown
                          selectedItems={selectedLevel}
                          setSelectedItems={setSelectedLevel}
                          data={modifiedLevels}
                          component={modifiedLevels?.map((level: LevelDto) => level.name).join(', ')}
                          control={methods.control}
                          name="levelId"
                        />
                      </div>
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-secondary tw-text-sm-medium">Class Capacity</div>
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="capacity"
                        placeholder="1-40"
                        containerClassName="tw-flex-1"
                        defaultValue={classData?.capacity}
                      />
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-secondary tw-text-sm-medium">Location</div>
                      <div className="tw-flex tw-flex-row tw-gap-x-lg tw-w-full">
                        <CustomInput
                          control={methods.control}
                          type="text"
                          name="location"
                          placeholder="Broadway Street, Lubbock, Texas"
                          containerClassName={'tw-flex-1'}
                          defaultValue={classData?.location}
                        />
                      </div>
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-secondary tw-text-sm-medium">
                        {organization && organization?.termInfo && organization?.termInfo?.teacher
                          ? organization.termInfo.teacher
                          : 'Lead Guide'}
                      </div>
                      <div className="tw-flex tw-flex-col tw-gap-y-lg tw-w-full">
                        <Controller
                          control={methods.control}
                          name="leadGuides"
                          defaultValue={classData?.classStaff.filter((guide) => guide.type === 1) || []}
                          render={({ field: { value, onChange } }) => {
                            const customizedOptions = staff.staff?.filter(
                              (item1: ClassStaffDto) =>
                                !selectedAssociateGuide?.some((guide) => guide.id === item1.id) &&
                                !selectedSpecialist?.some((specialist) => specialist.id === item1.id)
                            );

                            return (
                              <Multiselect
                                options={staff.staff?.filter(
                                  (item1: ClassStaffDto) =>
                                    !selectedAssociateGuide?.some((guide) => guide.id === item1.id) &&
                                    !selectedSpecialist?.some((specialist) => specialist.id === item1.id)
                                )}
                                selectedValues={value}
                                selectedValueDecorator={(value, option) => selectedValueDecorator(value, option)}
                                optionValueDecorator={(value, option) => optionValueDecorator(value, option)}
                                onSelect={(selectedList) => {
                                  onChange(selectedList);
                                  setSelectedGuide(selectedList);
                                }}
                                onRemove={(selectedList) => {
                                  onChange(selectedList);
                                  setSelectedGuide(selectedList);
                                }}
                                closeOnSelect={true}
                                avoidHighlightFirstOption={true}
                                displayValue="firstName"
                                closeIcon="cancel"
                                placeholder={`Select ${
                                  organization && organization?.termInfo && organization?.termInfo?.teacher
                                    ? organization.termInfo.teacher
                                    : 'Guide'
                                }`}
                                style={customStyles}
                                customCloseIcon={
                                  <div className="tw-cursor-pointer tw-ml-sm -tw-mr-sm">
                                    <CloseIcon />
                                  </div>
                                }
                              />
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-secondary tw-text-sm-medium">
                        {organization && organization?.termInfo && organization?.termInfo?.assistant
                          ? organization.termInfo.assistant
                          : 'Associates'}
                      </div>
                      <div className="tw-flex tw-flex-col tw-gap-y-lg tw-w-full">
                        <Controller
                          control={methods.control}
                          name="associateGuides"
                          defaultValue={classData?.classStaff.filter((guide) => guide.type === 2) || []}
                          render={({ field: { value, onChange } }) => {
                            return (
                              <Multiselect
                                options={staff?.staff.filter(
                                  (item1: ClassStaffDto) =>
                                    !selectedGuide?.some((guide) => guide.id === item1.id) &&
                                    !selectedSpecialist?.some((specialist) => specialist.id === item1.id)
                                )}
                                selectedValues={value}
                                selectedValueDecorator={(value, option) => selectedValueDecorator(value, option)}
                                optionValueDecorator={(value, option) => optionValueDecorator(value, option)}
                                onSelect={(selectedList) => {
                                  onChange(selectedList);
                                  setSelectedAssociateGuide(selectedList);
                                }}
                                onRemove={(selectedList) => {
                                  onChange(selectedList);
                                  setSelectedAssociateGuide(selectedList);
                                }}
                                closeOnSelect={true}
                                avoidHighlightFirstOption={true}
                                displayValue="firstName"
                                closeIcon="cancel"
                                placeholder={`Select ${
                                  organization && organization?.termInfo && organization?.termInfo?.assistant
                                    ? organization.termInfo.assistant
                                    : 'Associates'
                                }`}
                                style={customStyles}
                                customCloseIcon={
                                  <div className="tw-cursor-pointer tw-ml-sm -tw-mr-sm">
                                    <CloseIcon />
                                  </div>
                                }
                              />
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="tw-space-y-sm">
                      <div className="tw-text-secondary tw-text-sm-medium">
                        {organization && organization?.termInfo && organization?.termInfo?.specialist
                          ? organization.termInfo.specialist
                          : 'Specialist'}
                      </div>
                      <div className="tw-flex tw-flex-col tw-gap-y-lg tw-w-full">
                        <Controller
                          control={methods.control}
                          name="specialistGuides"
                          defaultValue={classData?.classStaff.filter((guide) => guide.type === 3) || []}
                          render={({ field: { value, onChange } }) => {
                            return (
                              <Multiselect
                                options={staff?.staff.filter(
                                  (item1: ClassStaffDto) =>
                                    !selectedGuide?.some((guide) => guide.id === item1.id) &&
                                    !selectedAssociateGuide?.some((associateGuide) => associateGuide.id === item1.id)
                                )}
                                selectedValues={value}
                                selectedValueDecorator={(value, option) => selectedValueDecorator(value, option)}
                                optionValueDecorator={(value, option) => optionValueDecorator(value, option)}
                                onSelect={(selectedList) => {
                                  onChange(selectedList);
                                  setSelectedSpecialist(selectedList);
                                }}
                                onRemove={(selectedList) => {
                                  onChange(selectedList);
                                  setSelectedSpecialist(selectedList);
                                }}
                                closeOnSelect={true}
                                avoidHighlightFirstOption={true}
                                displayValue="firstName"
                                closeIcon="cancel"
                                placeholder={`Select ${
                                  organization && organization?.termInfo && organization?.termInfo?.specialist
                                    ? organization.termInfo.specialist
                                    : 'Specialist'
                                }`}
                                style={customStyles}
                                customCloseIcon={
                                  <div className="tw-cursor-pointer tw-ml-sm -tw-mr-sm">
                                    <CloseIcon />
                                  </div>
                                }
                              />
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="tw-space-y-sm">
                      <div
                        className="tw-flex tw-justify-between tw-cursor-pointer"
                        onClick={() => setIsOpenStudent(!isOpenStudent)}
                      >
                        <div className="tw-text-secondary tw-text-sm-medium">Students</div>
                        <div
                          className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                            isOpenStudent ? 'tw-rotate-180' : ''
                          }`}
                        >
                          <DropdownChevron />
                        </div>
                      </div>
                      {isOpenStudent && (
                        <div className="tw-space-y-lg">
                          {capacity > 0 &&
                            [...Array(Number(capacity))].map((_, index) => {
                              return (
                                <div key={index}>
                                  <CustomAutoComplete
                                    control={methods.control}
                                    name="students"
                                    data={filteredData}
                                    component="Student"
                                    showDropdown={false}
                                    hasRightText={true}
                                    rightText={
                                      selectedStudents && selectedStudents[index] && selectedStudents[index].age
                                    }
                                    selectedItems={(selectedStudents && selectedStudents[index]) || null}
                                    setSelectedItems={(items: StudentBasicDto) => {
                                      setSelectedStudents((prevSelectedStudents) => {
                                        const newSelectedStudents = [...(prevSelectedStudents || [])];
                                        newSelectedStudents[index] = items;
                                        return newSelectedStudents;
                                      });
                                    }}
                                  />
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="tw-pt-4xl tw-flex tw-items-center tw-justify-between">
                    <div className="tw-cursor-pointer">
                      {isEdit &&
                        currentUserRoles?.hasAdminRoles &&
                        classData?.isActive &&
                        (isDeleteLoading ? (
                          <div role="status" className="tw-cursor-progress">
                            <NotesSpinner />
                          </div>
                        ) : !shouldConfirm ? (
                          <div onClick={() => setShouldConfirm(true)} className="tw-flex tw-space-x-md">
                            <TrashIcon color={'error'} />
                            <div className="tw-text-md-semibold tw-text-error">Delete Class</div>
                          </div>
                        ) : (
                          <div className="tw-flex tw-justify-center tw-flex-col tw-items-center">
                            Are you sure?
                            <div className="tw-flex tw-flex-row tw-gap-lg">
                              <button
                                className="tw-h-[36px] tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-center tw-py-md tw-px-xl tw-bg-white tw-rounded-md tw-border tw-border-secondary tw-border-solid tw-shadow-sm"
                                type="button"
                                onClick={() => setShouldConfirm(false)}
                              >
                                No
                              </button>
                              <button
                                className="tw-h-[36px] tw-text-sm-semibold tw-text-white tw-flex tw-items-center tw-justify-center tw-py-md tw-px-xl tw-bg-button-primary-error tw-rounded-md tw-border tw-border-button-primary-error tw-border-solid tw-shadow-sm"
                                type="button"
                                onClick={() => handleDelete()}
                              >
                                Yes
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="tw-pt-0 tw-flex tw-items-center tw-justify-between">
                      <div></div>
                      <div className="tw-flex tw-space-x-lg tw-items-center tw-justify-center">
                        <button
                          className="tw-h-[44px] tw-text-md-semibold tw-text-button-secondary-fg tw-rounded-md tw-px-xl tw-py-[10px] tw-shadow-sm tw-bg-white tw-border tw-border-primary tw-border-solid hover:tw-bg-button-secondary-hover"
                          onClick={() => handleClose()}
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          className="tw-w-[99px] tw-h-[44px] tw-rounded-md tw-px-xl tw-py-[10px] tw-gap-sm tw-shadow-sm tw-bg-brand-primary tw-border tw-border-brand tw-border-solid noprint hover:tw-bg-button-primary-hover"
                          type="submit"
                        >
                          {saveMutation.isLoading || updateMutation.isLoading ? (
                            <div
                              role="status"
                              className="tw-w-[60px] tw-h-[22px] tw-flex tw-items-center tw-justify-center"
                            >
                              <NotesSpinner />
                            </div>
                          ) : (
                            <div className="tw-flex tw-space-x-sm">
                              <div>
                                <SaveIcon />
                              </div>
                              <div className="tw-text-md-semibold tw-text-white">Save</div>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
