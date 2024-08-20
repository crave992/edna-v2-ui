import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import SaveIcon from '@/components/svg/SaveIcon';
import { useQueryClient } from '@tanstack/react-query';
import 'react-datepicker/dist/react-datepicker.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import { StudentDto } from '@/dtos/StudentDto';
import { addStudentAttendance } from '@/services/api/addStudentAttendance';
import dayjs from 'dayjs';
import { AttendanceModel, ClassAttendanceUpdateModel } from '@/models/ClassAttendanceModel';
import { AttendanceValidationSchema } from '@/validation/AttendanceValidationSchema';
import { useStudentClassDirectoryQuery } from '@/hooks/queries/useStudentsQuery';

interface AddAttendanceProps {
  showModal?: boolean;
  setShowModal: (showModal: boolean) => void;
  student: StudentDto;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editDate: AttendanceModel | undefined;
}

export default function StudentAddAttendance({
  showModal,
  setShowModal,
  student,
  isEditing,
  setIsEditing,
  editDate,
}: AddAttendanceProps) {
  const [attendanceDate, setAttendanceDate] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{ name: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data: studentClass } = useStudentClassDirectoryQuery(student?.id);

  const methods = useForm<ClassAttendanceUpdateModel>({
    resolver: yupResolver(AttendanceValidationSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    methods.setValue('studentId', student?.id);
    methods.setValue('classId', studentClass.length > 0 && studentClass[0].classId);
    setAttendanceDate(new Date());
    methods.setValue('attendanceDate', new Date());

    if (isEditing) {
      setAttendanceDate(new Date(editDate?.attendanceDate!));
      methods.setValue('attendanceDate', new Date(editDate?.attendanceDate!));
      methods.setValue('time', convertTime24to12((editDate?.attendanceDate || '').toString()));
      methods.setValue('note', editDate?.note!);
      setSelectedStatus({ name: editDate?.presentOrAbsent === "Present" && editDate?.isTardy ? 'Tardy' : (editDate?.presentOrAbsent!).replace(' Absent',  editDate?.presentOrAbsent === 'Excuse Absent' ? 'd' : '') });
      methods.setValue('presenceType', editDate?.presentOrAbsent || selectedStatus?.name!);
    }
  }, [showModal]);
  
  const resetData = () => {
    setAttendanceDate(new Date());
    setSelectedStatus(null);
    setShowModal(false);
    setIsEditing(false);
    methods.reset();
  };

  const handleSuccess = () => {
    resetData();
    setIsLoading(false);
    queryClient.invalidateQueries(['attendance', { student: student?.id }]);
    setShowModal(false);
  };

  const convertTime12to24 = (time12h: string): string => {
    const match = time12h.match(/(\d{1,2}):(\d{2})(am|pm)/);

    if (!match) {
      console.error('Invalid time format');
      return '';
    }

    let [, hours, minutes, modifier] = match;
    let hoursInt = parseInt(hours, 10);

    if (hoursInt === 12) {
      hoursInt = modifier === 'am' ? 0 : 12;
    } else if (modifier === 'pm') {
      hoursInt += 12;
    }

    const formattedHours = `0${hoursInt}`.slice(-2);

    return `${formattedHours}:${minutes}`;
  };

  const convertTime24to12 = (date: string): string => {
    const newDate = new Date(date);
    let hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours %= 12;
    hours = hours || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutesStr}${ampm}`;
  };

  const handleSave = async (data: ClassAttendanceUpdateModel) => {
    setIsLoading(true);
    const formData = new FormData();
    let action, isTardy, presenceType = "Present";
    switch (selectedStatus?.name) {
      case 'Present':
        action = 'present_absent';
        isTardy = false;
        presenceType = 'Present';
        break;
      case 'Unexcused':
        action = 'present_absent';
        isTardy = false;
        presenceType = 'Unexcused_Absent';
        break;
      case 'Excused':
        action = 'present_absent';
        isTardy = false;
        presenceType = 'Excuse_Absent';
        break;
      case 'Released':
        action = 'present_absent';
        presenceType = 'Released';
        isTardy = false;
        break;
      case 'Tardy':
        action = 'tardy';
        isTardy = true;
        break;
      default:
        return;
    }

    const time24 = convertTime12to24(data.time!);

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof ClassAttendanceUpdateModel];
      if (key === 'attendanceDate') {
        var date = new Date(`${dayjs(attendanceDate).format('YYYY-MM-DD')}T${time24}`);
        formData.append(key, date.toISOString());
      } else if (key === 'presenceType') {
        formData.append(key, presenceType as string);
      } else {
        formData.append(key, value as string);
      }
    });

    formData.append('action', action);
    formData.append('isTardy', String(isTardy));

    new Response(formData).text().then(console.log);
    try {
      await addStudentAttendance(formData);
      queryClient.invalidateQueries(['attendance', { student: student?.id }]);

      handleSuccess();
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
    setAttendanceDate(date);
    methods.setValue('attendanceDate', date);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="tw-bg-black/[0.3] tw-w-screen tw-h-screen tw-top-0 tw-left-0 tw-fixed tw-z-20" />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: '-65%', x: '-50%' }}
            animate={{ opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, y: '-65%' }}
            transition={{ duration: 0.3 }}
            className="tw-fixed tw-top-2/4 tw-left-2/4 tw-translate-y-[-50%] tw-translate-x-[-50%] tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50"
          >
            <FormProvider {...methods}>
              <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)}>
                <div className="tw-p-3xl">
                  <div className="tw-justify-between tw-flex">
                    <div className="tw-font-black tw-text-lg">{isEditing ? 'Edit' : 'Add'} Attendance</div>
                    <span className="tw-cursor-pointer" onClick={resetData}>
                      <NotesCloseIcon />
                    </span>
                  </div>
                  <div className="tw-text-sm-regular tw-text-tertiary">
                    {`
                      ${student?.firstName}
                      ${student?.nickName ? `(${student?.nickName})` : ''}
                      ${student?.lastName}
                      ${
                        editDate && isEditing
                          ? `- ${dayjs(editDate.attendanceDate).format('MMMM Do, YYYY')}, ${editDate.presentOrAbsent}`
                          : ''
                      }
                    `}
                  </div>
                </div>

                <div className="tw-px-3xl tw-py-0 tw-space-y-xl">
                  {!isEditing && (
                    <div className="tw-mb-4">
                      <CustomDatePicker
                        name="attendanceDate"
                        selected={attendanceDate}
                        onChange={(date: Date | null) => handlePickDate(date)}
                      />
                    </div>
                  )}
                  <div className="tw-mb-4">
                    <div className="tw-text-sm tw-text-[#344054] tw-font-medium tw-mb-1.5">Time</div>
                    <div className="tw-flex tw-gap-x-3 tw-w-full">
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="time"
                        placeholder="Time"
                        containerClassName="tw-flex-1"
                      />
                    </div>
                  </div>
                  <div className="tw-mb-4 tw-space-y-sm">
                    <div className="tw-text-sm-medium tw-text-secondary">Status</div>
                    <div className="tw-flex tw-w-full tw-gap-x-3">
                      <div className="tw-flex-1">
                        <CustomDropdown
                          selectedItems={selectedStatus}
                          setSelectedItems={setSelectedStatus}
                          data={[
                            { id: 0, name: 'Present' },
                            { id: 1, name: 'Tardy' },
                            { id: 2, name: 'Unexcused' },
                            { id: 2, name: 'Excused' },
                            { id: 3, name: 'Released' },
                          ]}
                          component={[
                            { name: 'Present' },
                            { name: 'Tardy' },
                            { name: 'Unexcused' },
                            { name: 'Excused' },
                            { name: 'Released' },
                          ]
                            .map((status) => status.name)
                            .join(', ')}
                          control={methods.control}
                          name="presenceType"
                          withStatusDot={true}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-mb-4">
                    <div className="tw-text-sm tw-text-[#344054] tw-font-medium tw-mb-1.5">Note</div>
                    <div className="tw-flex tw-gap-x-3 tw-w-full">
                      <Controller
                        name="note"
                        control={methods.control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            className="tw-w-full tw-rounded-md tw-border-secondary tw-py-lg tw-px-14px tw-resize-none"
                            rows={5}
                            placeholder="Enter a note..."
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="tw-pt-4xl tw-pb-3xl tw-px-3xl tw-flex tw-items-center tw-justify-between">
                  <div className="tw-space-x-md"></div>
                  <div className="tw-flex tw-items-center tw-justify-center tw-space-x-lg">
                    <button
                      className="tw-text-md-semibold tw-rounded-md tw-px-xl tw-py-10px tw-shadow-sm tw-bg-white tw-text-secondary tw-border tw-border-secondary tw-border-solid"
                      onClick={resetData}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="tw-font-semibold tw-rounded-md tw-px-xl tw-py-10px tw-shadow-sm tw-bg-brand-primary tw-text-white tw-border tw-border-brand tw-border-solid"
                      type="submit"
                    >
                      {isLoading ? (
                        <div
                          role="status"
                          className="tw-w-[60px] tw-h-[22px] tw-flex tw-items-center tw-justify-center"
                        >
                          <NotesSpinner />
                        </div>
                      ) : (
                        <div className="tw-flex tw-space-x-sm">
                          <SaveIcon />
                          <div>Save</div>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
