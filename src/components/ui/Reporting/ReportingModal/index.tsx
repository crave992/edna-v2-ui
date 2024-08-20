import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import { useEffect, useState } from 'react';
import { useReportingIcons } from '@/hooks/useReportingIcons';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ReportingValidationSchema, { ReportingValidationNoDateSchema } from '@/validation/ReportingValidationSchema';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import Tabs from '@/components/common/Tabs';
import CustomRadioButton from '@/components/common/NewCustomFormControls/CustomRadioButton';
import { useLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import { replaceLevelName } from '@/utils/replaceLevelName';
import { useFocusContext } from '@/context/FocusContext';
import LevelDto from '@/dtos/LevelDto';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import { useClassesQuery } from '@/hooks/queries/useClassesQuery';
import { ReportingGenerateDto } from '@/dtos/ReportingDto';
import CustomAutoComplete from '@/components/common/NewCustomFormControls/CustomAutocomplete';
import { useStudentsQuery } from '@/hooks/queries/useStudentsQuery';
import { StudentBasicDto } from '@/dtos/StudentDto';
import PlusIcon from '@/components/svg/PlusIcon';
import CustomButton from '../../CustomButton';
import FileDownloadIcon from '@/components/svg/FileDownloadIcon';
import CustomCheckboxButton from '@/components/common/NewCustomFormControls/CustomCheckboxButton';
import { useStaffsQuery } from '@/hooks/queries/useStaffsQuery';
import { StaffBasicDto } from '@/dtos/StaffDto';
import generateReport from '@/services/api/generateReports';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CustomDateRangePicker from '@/components/common/CustomDateRangePicker';
import NotesSpinner from '@/components/svg/NotesSpinner';
import CheckCircleIcon from '@/components/svg/CheckCircle';
import useNotification from '@/hooks/useNotification';
dayjs.extend(customParseFormat);

interface ReportingModalProps {
  showModal?: boolean;
  setShowModal: Function;
  type: string;
}

interface Item {
  id: number;
  name: string;
  [key: string]: any;
}

type AllergyKeys = keyof NonNullable<ReportingGenerateDto['allergies']>;
type EmergencyContactKeys = keyof NonNullable<ReportingGenerateDto['emergencyContacts']>;
type OtherInformationKeys = keyof NonNullable<ReportingGenerateDto['otherInformation']>;
type StatusKeys = keyof NonNullable<ReportingGenerateDto['status']>;
type StudentsProfileKeys = keyof NonNullable<ReportingGenerateDto['studentsProfile']>;
type ProgramKeys = keyof NonNullable<ReportingGenerateDto['program']>;
type StudentContactsKeys = keyof NonNullable<ReportingGenerateDto['studentContacts']>;
type ParentsProfileKeys = keyof NonNullable<ReportingGenerateDto['parentsProfile']>;
type EmployementKeys = keyof NonNullable<ReportingGenerateDto['employment']>;
type StaffProfileKeys = keyof NonNullable<ReportingGenerateDto['staffProfile']>;
type StaffContactsKeys = keyof NonNullable<ReportingGenerateDto['staffContacts']>;

const noStaffTabs = ['School', 'Level', 'Class', 'Student'];
const withStaffTabs = ['Staff', 'School', 'Level', 'Class', 'Student'];
const staffDirectoryTabs = ['All Staff', 'Level', 'Class'];

export default function ReportingModal({ showModal, setShowModal, type }: ReportingModalProps) {
  const [activeTab, setActiveTab] = useState(noStaffTabs[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Item | null>(null);
  const [selectedClass, setSelectedClass] = useState<Item | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<StudentBasicDto[] | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffBasicDto[] | null>(null);
  const [numberOfStudentsOrStaff, setNumberOfStudentsOrStaff] = useState<number>(1);
  const [dateRange, setDateRange] = useState<(Date | null)[]>([null, null]);
  const [startDate, endDate] = dateRange;
  const getColor = useReportingIcons;
  const notify = useNotification;
  const colorProps = getColor(type);
  const { organization, currentUserRoles } = useFocusContext();
  const { data: levels } = useLevelsQuery();
  const { data: classes } = useClassesQuery({
    isAdmin:
      currentUserRoles?.hasSuperAdminRoles || currentUserRoles?.hasAccountOwnerRoles || currentUserRoles?.hasAdminRoles,
    staffId: currentUserRoles?.staffId!,
  });
  const { data: students } = useStudentsQuery();
  const { data: staff } = useStaffsQuery();

  const modifiedLevels = levels?.map((level: LevelDto) => ({
    ...level,
    name: replaceLevelName(level.name, organization?.termInfo),
  }));

  const methods = useForm<ReportingGenerateDto>({
    resolver: yupResolver(
      type === 'Academic' || type === 'Attendance' ? ReportingValidationNoDateSchema : ReportingValidationSchema
    ),
    defaultValues: {
      title: '',
      includeNotes: 2,
    },
  });

  useEffect(() => {
    if (type === 'Staff') setActiveTab(staffDirectoryTabs[0]);
  }, []);

  useEffect(() => {
    const body = document.querySelector('body');

    if (showModal) {
      body && body.classList.add('body-scroll-lock');
    } else {
      body && body.classList.remove('body-scroll-lock');
      setActiveTab(noStaffTabs[0]);
      setSelectedClass(null);
      setSelectedLevel(null);
      setSelectedStudents(null);
      setSelectedStaff(null);
      setNumberOfStudentsOrStaff(1);
      methods.reset();
    }

    return () => {
      body && body.classList.remove('body-scroll-lock');
    };
  }, [showModal]);

  useEffect(() => {
    setSelectedClass(null);
    setSelectedLevel(null);
    setSelectedStudents(null);
    setSelectedStaff(null);
    setNumberOfStudentsOrStaff(1);
    methods.setValue('classId', undefined);
    methods.setValue('levelId', undefined);
    methods.setValue('staffs', undefined);
    methods.setValue('students', undefined);
  }, [activeTab]);

  if (!colorProps) {
    return null;
  }

  const { icon: Icon, color, background } = colorProps;

  const submitData = async (formData: ReportingGenerateDto) => {
    setIsLoading(true);
    let data = {};
    const commonData = {
      ...(formData.staffs && { staffId: selectedStaff?.map((staff) => staff.id) }),
      ...(formData.students && { studentId: selectedStudents?.map((student) => student.id) }),
      ...(formData.classId && { classId: formData.classId }),
      ...(formData.levelId && { levelId: formData.levelId }),
    };

    if (type === 'Medical') {
      const allergyKeys = Object.keys(formData?.allergies ?? {});
      const emergencyContactKeys = Object.keys(formData?.emergencyContacts ?? {});
      const otherInformationKeys = Object.keys(formData?.otherInformation ?? {});

      data = {
        reportTitle: formData.title,
        allergy: allergyKeys.filter((allergy) => formData?.allergies?.[allergy as AllergyKeys] === true),
        medication: formData?.medications === 1,
        immunization: formData?.immunizations === 1,
        emergencyContact: emergencyContactKeys.filter(
          (contact) => formData?.emergencyContacts?.[contact as EmergencyContactKeys] === true
        ),
        otherInformation: otherInformationKeys.filter(
          (otherInfo) => formData?.otherInformation?.[otherInfo as OtherInformationKeys] === true
        ),
        ...commonData,
      };
    } else if (type === 'Attendance') {
      const statusKeys = Object.keys(formData?.status ?? {});
      data = {
        reportTitle: formData.title,
        status: statusKeys.filter((status) => formData?.status?.[status as StatusKeys] === true),
        fromDate: dayjs(startDate).format('YYYY/MM/DD'),
        toDate: dayjs(endDate).format('YYYY/MM/DD'),
        includeNotes: formData?.includeNotes === 1,
        ...commonData,
      };
    } else if (type === 'Students') {
      const studentsProfileKeys = Object.keys(formData?.studentsProfile ?? {});
      const programKeys = Object.keys(formData?.program ?? {});
      const studentContactsKeys = Object.keys(formData?.studentContacts ?? {});
      data = {
        reportTitle: formData.title,
        studentsProfile: studentsProfileKeys.filter(
          (studentProfile) => formData?.studentsProfile?.[studentProfile as StudentsProfileKeys] === true
        ),
        program: programKeys.filter((program) => formData?.program?.[program as ProgramKeys] === true),
        aboutQuestions: formData?.aboutQuestions === 1,
        permissions: formData?.permissions === 1,
        studentContacts: studentContactsKeys.filter(
          (studentContact) => formData?.studentContacts?.[studentContact as StudentContactsKeys] === true
        ),
        ...commonData,
      };
    } else if (type === 'Parents') {
      const parentsProfileKeys = Object.keys(formData?.parentsProfile ?? {});
      data = {
        reportTitle: formData.title,
        parentsProfile: parentsProfileKeys.filter(
          (parentProfile) => formData?.parentsProfile?.[parentProfile as ParentsProfileKeys] === true
        ),
        includeLinkedChildren: formData?.includeLinkedChildren === 1,
        ...commonData,
      };
    } else if (type === 'Staff') {
      const employmentKeys = Object.keys(formData?.employment ?? {});
      const staffProfileKeys = Object.keys(formData?.staffProfile ?? {});
      const staffContactsKeys = Object.keys(formData?.staffContacts ?? {});
      data = {
        reportTitle: formData.title,
        employment: employmentKeys.filter((employ) => formData?.employment?.[employ as EmployementKeys] === true),
        staffProfile: staffProfileKeys.filter(
          (profile) => formData?.staffProfile?.[profile as StaffProfileKeys] === true
        ),
        staffContacts: staffContactsKeys.filter(
          (staffContact) => formData?.staffContacts?.[staffContact as StaffContactsKeys] === true
        ),
        ...commonData,
      };
    } else if (type === 'Class') {
      data = {
        reportTitle: formData.title,
        classLeadGuide: formData?.classLeadGuide === 1,
        classStaff: formData?.classStaff === 1,
        classLevel: formData?.classLevel === 1,
        classCapacity: formData?.classCapacity === 1,
        classStudentList: formData?.classStudentList === 1,
        ...commonData,
      };
    } else if (type === 'Academic') {
      data = {
        reportTitle: formData.title,
        progressLeadGuide: formData?.progressLeadGuide === 1,
        progressStaff: formData?.progressStaff === 1,
        progressLevel: formData?.progressLevel === 1,
        progressCapacity: formData?.progressCapacity === 1,
        fromDate: dayjs(startDate).format('YYYY/MM/DD'),
        toDate: dayjs(endDate).format('YYYY/MM/DD'),
        ...commonData,
      };
    }

    const res = await generateReport(type, data);
    if (res) notify('File downloaded', <CheckCircleIcon />);
    setIsLoading(false);
    setShowModal(false);
  };

  const handlePickDate = (dates: (Date | null)[], name: string) => {
    methods.setValue('date', dayjs(dates[0]).format('YYYY/MM/DD'));
    setDateRange(dates);
  };

  const filteredDataStudent =
    students &&
    students.student &&
    students.student.length > 0 &&
    students.student.filter((student: StudentBasicDto) => {
      return !(selectedStudents && selectedStudents.some((selected: Item) => selected && selected.id === student.id));
    });

  const filteredDataStaff =
    staff &&
    staff.staff &&
    staff.staff.length > 0 &&
    staff.staff.filter((staff: StaffBasicDto) => {
      return !(selectedStaff && selectedStaff.some((selected: Item) => selected && selected.id === staff.id));
    });

  const handleSelectionChange = (id: number) => {
    // const selectedOption = programOptions?.find((option: ProgramOptionDto) => option.id === id);
    // if (selectedOption) {
    //   setSelectedProgram(selectedOption);
    //   methods.setValue('programOptionId', selectedOption.id);
    // }
  };

  console.log('methods.getValues()', methods.getValues());

  const getTypeName = () => {
    switch (type) {
      case 'Class':
        return 'Class Directory';
      case 'Students':
        return 'Student Directory';
      case 'Parents':
        return 'Parent Directory';
      case 'Staff':
        return 'Staff Directory';
      case 'Academic':
        return 'Academic Progress';
      default:
        return type;
    }
  };

  return (
    <AnimatePresence>
      {showModal ? (
        <>
          {/* Backdrop */}
          <div className="tw-p-3xl tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-flex tw-items-start tw-justify-center tw-overflow-y-scroll tw-max-h-screen tw-bg-black/[0.3] tw-z-20 !tw-mt-0 tw-min-h-screen tw-pt-[80px]">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tw-p-3xl tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50"
            >
              <div className="tw-flex tw-relative tw-justify-center tw-items-center tw-w-full tw-flex-col tw-space-y-xl tw-pb-2xl">
                <div className="tw-p-lg tw-rounded-full" style={{ background: background }}>
                  <Icon color={color} width={'24'} height={'24'} fill={type === 'Medical' ? '' : background} />
                </div>
                <div className="tw-text-lg-semibold tw-text-primary">{getTypeName()} Report</div>
                <span
                  className="tw-cursor-pointer tw-absolute tw-top-0 tw-right-0 !tw-mt-0"
                  onClick={() => setShowModal(false)}
                >
                  <NotesCloseIcon />
                </span>
              </div>

              <FormProvider {...methods}>
                <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(submitData)} id="login">
                  <div className="tw-space-y-2xl">
                    <CustomInput control={methods.control} type="text" name="title" placeholder="Report Title" />
                    {(type === 'Attendance' || type === 'Academic') && (
                      <CustomDateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(dates: (Date | null)[]) => handlePickDate(dates, 'dates')}
                        name="date"
                        placeholder="Date"
                        dateRange={true}
                      />
                    )}
                    {type !== 'Class' && (
                      <Tabs
                        tabNames={
                          type === 'Staff' ? staffDirectoryTabs : type === 'Medical' ? withStaffTabs : noStaffTabs
                        }
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                      />
                    )}
                    {activeTab === 'Level' && (
                      <CustomDropdown
                        selectedItems={selectedLevel}
                        setSelectedItems={setSelectedLevel}
                        data={modifiedLevels}
                        component={modifiedLevels?.map((level: LevelDto) => level.name).join(', ')}
                        control={methods.control}
                        name="levelId"
                      />
                    )}
                    {activeTab === 'Class' && (
                      <CustomDropdown
                        selectedItems={selectedClass}
                        setSelectedItems={setSelectedClass}
                        data={classes}
                        component={'Class'}
                        control={methods.control}
                        name="classId"
                      />
                    )}
                    {activeTab === 'Student' && (
                      <div className="tw-space-y-sm">
                        {[...Array(Number(numberOfStudentsOrStaff))].map((_, index) => {
                          return (
                            <div key={`student-input-${index}`}>
                              <CustomAutoComplete
                                control={methods.control}
                                name="students"
                                data={filteredDataStudent}
                                component="Student"
                                showDropdown={false}
                                hasRightText={true}
                                rightText={selectedStudents && selectedStudents[index] && selectedStudents[index].age}
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
                        <div
                          className="tw-space-x-sm tw-flex tw-items-center tw-justify-center tw-cursor-pointer"
                          onClick={() => setNumberOfStudentsOrStaff(numberOfStudentsOrStaff + 1)}
                        >
                          <PlusIcon stroke={'#00466E'} />
                          <span className="tw-text-sm-semibold tw-text-button-tertiary-fg">Add Student</span>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Staff' && type === 'Medical' && (
                      <div className="tw-space-y-sm">
                        {[...Array(Number(numberOfStudentsOrStaff))].map((_, index) => {
                          return (
                            <div key={`staff-input-${index}`}>
                              <CustomAutoComplete
                                control={methods.control}
                                name="staffs"
                                data={filteredDataStaff}
                                component="Staff"
                                showDropdown={false}
                                hasRightText={false}
                                rightText={''}
                                selectedItems={(selectedStaff && selectedStaff[index]) || null}
                                setSelectedItems={(items: StaffBasicDto) => {
                                  setSelectedStaff((prevSelectedStaff) => {
                                    const newSelectedStaff = [...(prevSelectedStaff || [])];
                                    newSelectedStaff[index] = items;
                                    return newSelectedStaff;
                                  });
                                }}
                              />
                            </div>
                          );
                        })}
                        <div
                          className="tw-space-x-sm tw-flex tw-items-center tw-justify-center tw-cursor-pointer"
                          onClick={() => setNumberOfStudentsOrStaff(numberOfStudentsOrStaff + 1)}
                        >
                          <PlusIcon stroke={'#00466E'} />
                          <span className="tw-text-sm-semibold tw-text-button-tertiary-fg">Add Staff</span>
                        </div>
                      </div>
                    )}

                    {/* ATTENDANCE */}
                    {type === 'Attendance' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Status</div>
                        <div className="tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="status.Present"
                            label="Present"
                            defaultValue={''}
                          />
                          <CustomCheckboxButton
                            control={methods.control}
                            name="status.Tardy"
                            label="Tardy"
                            defaultValue={''}
                          />
                          <CustomCheckboxButton
                            control={methods.control}
                            name="status.Excused"
                            label="Excused"
                            defaultValue={''}
                          />
                          <CustomCheckboxButton
                            control={methods.control}
                            name="status.Unexcused"
                            label="Unexcused"
                            defaultValue={''}
                          />
                          <CustomCheckboxButton
                            control={methods.control}
                            name="status.ReleasedEarly"
                            label="Released Early"
                            defaultValue={''}
                          />

                          {/* <CustomRadioButton
                            control={methods.control}
                            name="status"
                            option={{ id: 1, name: 'Present' }}
                            onSelectionChange={handleSelectionChange}
                            icon={'check'}
                          />
                          <CustomRadioButton
                            control={methods.control}
                            name="status"
                            option={{ id: 2, name: 'Tardy' }}
                            onSelectionChange={handleSelectionChange}
                            icon={'check'}
                          />
                          <CustomRadioButton
                            control={methods.control}
                            name="status"
                            option={{ id: 3, name: 'Excused' }}
                            onSelectionChange={handleSelectionChange}
                            icon={'check'}
                          />
                          <CustomRadioButton
                            control={methods.control}
                            name="status"
                            option={{ id: 4, name: 'Unexcused' }}
                            onSelectionChange={handleSelectionChange}
                            icon={'check'}
                          />
                          <CustomRadioButton
                            control={methods.control}
                            name="status"
                            option={{ id: 5, name: 'Released Early' }}
                            onSelectionChange={handleSelectionChange}
                            icon={'check'}
                          /> */}
                        </div>
                      </div>
                    )}

                    {type === 'Attendance' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Include Notes</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="includeNotes"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="includeNotes"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* END ATTENDANCE */}

                    {/* MEDICAL */}
                    {type === 'Medical' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Medications</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="medications"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="medications"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Medical' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Immunizations</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="immunizations"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="immunizations"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Medical' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Allergies</div>
                        <div className="tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="allergies.Severe"
                            label="Severe"
                            defaultValue={''}
                          />
                          <CustomCheckboxButton
                            control={methods.control}
                            name="allergies.NonSevere"
                            label="Non-severe"
                            defaultValue={''}
                          />
                          <CustomCheckboxButton
                            control={methods.control}
                            name="allergies.FoodRestrictions"
                            label="Food Restrictions"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                    )}
                    {type === 'Medical' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Emergency Contacts</div>
                        <div className="tw-space-x-lg tw-flex tw-flex-row">
                          <div className="tw-flex-1">
                            <CustomCheckboxButton
                              control={methods.control}
                              name="emergencyContacts.All"
                              label="All"
                              defaultValue={''}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomCheckboxButton
                              control={methods.control}
                              name="emergencyContacts.First"
                              label="1st"
                              defaultValue={''}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomCheckboxButton
                              control={methods.control}
                              name="emergencyContacts.Second"
                              label="2nd"
                              defaultValue={''}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomCheckboxButton
                              control={methods.control}
                              name="emergencyContacts.Third"
                              label="3rd"
                              defaultValue={''}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Medical' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Other Information</div>
                        <div className="tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="otherInformation.MedicalConditions"
                            label="Medical Conditions & Impairments"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="otherInformation.PreferredHospital"
                            label="Preferred Hospital"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="otherInformation.WhatToDoInCase"
                            label="What to do in case of an emergency?"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                    )}
                    {/* END MEDICAL */}

                    {/* STUDENT DIRECTORY */}
                    {type === 'Students' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Profile</div>
                        <div className="tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="studentsProfile.DateOfBirth"
                            label="Date Of Birth"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="studentsProfile.Gender"
                            label="Gender"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="studentsProfile.Demographics"
                            label="Demographics"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="studentsProfile.Address"
                            label="Address"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                    )}
                    {type === 'Students' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Program</div>
                        <div className="tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="program.Level"
                            label="Level"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="program.Program"
                            label="Program"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="program.AdditionalCare"
                            label="Additional Care"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                    )}
                    {type === 'Students' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">About Questions</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="aboutQuestions"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="aboutQuestions"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Students' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Permissions</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="permissions"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="permissions"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Students' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Contacts</div>
                        <div className="tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="studentContacts.Guardian"
                            label="Guardian"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="studentContacts.FamilyOrFriend"
                            label="Family/Friend"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="studentContacts.ChildCare"
                            label="Childcare"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="studentContacts.HealthCare"
                            label="Healthcare"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                    )}
                    {/* END STUDENT DIRECTORY */}

                    {/* PARENT DIRECTORY */}
                    {type === 'Parents' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Profile</div>
                        <div className="tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="parentsProfile.HomeEmail"
                            label="Home Email"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="parentsProfile.WorkEmail"
                            label="Work Email"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="parentsProfile.CellPhone"
                            label="Cell Phone"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="parentsProfile.HomePhone"
                            label="Home Phone"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="parentsProfile.Address"
                            label="Address"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="parentsProfile.Occupation"
                            label="Occupation"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                    )}
                    {type === 'Parents' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Include Linked Children</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="includeLinkedChildren"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="includeLinkedChildren"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* END PARENT DIRECTORY */}

                    {/* STAFF DIRECTORY */}
                    {type === 'Staff' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Employment</div>
                        <div className="tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="employment.Position"
                            label="Position"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="employment.Compensation"
                            label="Compensation"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="employment.StartDate"
                            label="Start Date"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="employment.TerminationDate"
                            label="Termination Date"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="employment.TerminationReason"
                            label="Termination Reason"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                    )}
                    {type === 'Staff' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Profile</div>
                        <div className="tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffProfile.Description"
                            label="Description"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffProfile.WorkEmail"
                            label="Work Email"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffProfile.PersonalEmail"
                            label="Personal Email"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffProfile.CellPhone"
                            label="Cell Phone"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffProfile.HomePhone"
                            label="Home Phone"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffProfile.Demographics"
                            label="Demographics"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffProfile.Address"
                            label="Address"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                    )}
                    {type === 'Staff' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Contacts</div>
                        <div className="tw-space-y-lg">
                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffContacts.Guardian"
                            label="Guardian"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffContacts.FamilyOrFriend"
                            label="Family/Friend"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffContacts.ChildCare"
                            label="Childcare"
                            defaultValue={''}
                          />

                          <CustomCheckboxButton
                            control={methods.control}
                            name="staffContacts.HealthCare"
                            label="Healthcare"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                    )}
                    {/* END STAFF DIRECTORY */}

                    {/* CLASS DIRECTORY */}
                    {type === 'Class' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Lead Guide</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="classLeadGuide"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="classLeadGuide"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Class' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Staff</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="classStaff"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="classStaff"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Class' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Level</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="classLevel"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="classLevel"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Class' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Enrolled / Capacity Count</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="classCapacity"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="classCapacity"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Class' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Student List</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="classStudentList"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="classStudentList"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* END CLASS DIRECTORY */}

                    {/* ACADEMIC PROGRESS */}
                    {type === 'Academic' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Lead Guide</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="progressLeadGuide"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="progressLeadGuide"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Academic' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Staff</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="progressStaff"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="progressStaff"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Academic' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Level</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="progressLevel"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="progressLevel"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {type === 'Academic' && (
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Enrolled / Capacity Count</div>
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="progressCapacity"
                              option={{ id: 2, name: 'No' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                          <div className="tw-flex-1">
                            <CustomRadioButton
                              control={methods.control}
                              name="progressCapacity"
                              option={{ id: 1, name: 'Yes' }}
                              onSelectionChange={handleSelectionChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* END ACADEMIC PROGRESS */}
                  </div>

                  <div className="tw-pt-0 tw-mt-4xl tw-flex tw-items-center tw-justify-end">
                    <div className="tw-flex tw-items-center tw-justify-center">
                      <CustomButton
                        text="Generate"
                        heirarchy="primary"
                        btnSize="lg"
                        type="submit"
                        iconLeading={isLoading ? <NotesSpinner /> : <FileDownloadIcon />}
                      />
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
