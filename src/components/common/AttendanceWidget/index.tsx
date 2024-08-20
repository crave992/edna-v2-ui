import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ClassAttendanceDto from '@/dtos/ClassAttendanceDto';
import StudentStatus from './StudentStatus';
import AttendanceCloseIcon from '@/components/svg/AttendanceCloseIcon';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useClickOutside } from '@mantine/hooks';
import { CustomAutoCompleteNoControls } from '../NewCustomFormControls/CustomAutocomplete';
import UsersIcon from '@/components/svg/UsersIcon';
import { CustomSearchInput } from '../NewCustomFormControls/CustomInput';
import { useFocusContext } from '@/context/FocusContext';
import { useRouter } from 'next/router';
import { useClassAttendanceQuery } from '@/hooks/queries/useAttendanceQuery';
import ClassDto from '@/dtos/ClassDto';
import AttendanceSkeleton from './AttendanceSkeleton';

interface AttendanceWidgetProps {
  openAttendanceWidget?: boolean;
  handleClose: Function;
  buttonRef: HTMLButtonElement | null;
}

interface StudentUpdateData {
  classId: number;
  studentId: number;
  attendanceDate: string;
  presenceType: string;
  action: string;
  isTardy: boolean;
}

interface Item {
  id: number;
  name: string;
  [key: string]: any;
}

const AttendanceWidget = ({ openAttendanceWidget, handleClose, buttonRef }: AttendanceWidgetProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [studentsToSave, setStudentsToSave] = useState<Array<StudentUpdateData>>([]);
  const [widgetRef, setWidgetRef] = useState<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { currentUserRoles, classId, setClassId, classes, selectedClass, setSelectedClass } = useFocusContext();
  const timeout = useRef<NodeJS.Timeout>();
  useClickOutside(() => handleClose(), null, [buttonRef, widgetRef]);

  const { data: attendance, isLoading: isFetchingAttendance } = useClassAttendanceQuery({
    classId: selectedClass ? selectedClass.id : Number(classId),
  });

  useEffect(() => {
    if (classes) {
      const localClass = classes.find((classItem: Item) => classItem.id === classId);
      if (classId !== selectedClass?.id) setSelectedClass(localClass!);
    }
  }, [classId, classes, openAttendanceWidget]);

  const attendanceCount = useMemo(
    () => attendance && attendance.filter((e: ClassAttendanceDto) => e.presentOrAbsent === 'Present')?.length,
    [attendance]
  );

  const mutation = useMutation(
    (data: {
      classId: number;
      studentId: number;
      attendanceDate: string;
      presenceType: string;
      action: string;
      isTardy: boolean;
    }) =>
      fetch(`/api/attendance`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    {
      onMutate: async (variables) => {
        queryClient.setQueryData(['attendance', { class: classId }], (old: ClassAttendanceDto[] | undefined) => {
          if (!old) return old; // Return old data if undefined
          const index = old.findIndex((data) => data.studentId === variables.studentId);
          old[index].isTardy = variables.isTardy;
          old[index].presentOrAbsent = variables.presenceType;
          return old;
        });
      },
      onSuccess: (data) => {
        if (data.ok) {
          queryClient.invalidateQueries(['attendance', { class: selectedClass?.id }]);
          queryClient.invalidateQueries(['classes', selectedClass?.id]);
        }
      },
      onError: (error) => {
        console.error('Error saving attendance status:', error);
      },
    }
  );

  const handleSave = (students: StudentUpdateData[]) => {
    // Clear the existing timeout if there is one
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // Set a new timeout to call handleSave after 5 seconds
    timeout.current = setTimeout(() => {
      if (students.length !== 0) {
        Promise.all(
          students.map(function (student) {
            return mutation.mutate(student);
          })
        ).then(() => {
          setStudentsToSave([]);
        });
      }
    }, 5000);
  };

  //Save Changes when closed //stop saving on closed
  // useEffect(() => {
  //   if (!openAttendanceWidget) handleSave();
  // }, [openAttendanceWidget]);

  useEffect(() => {
    if (selectedClass) {
      setSearchTerm('');
    }
  }, [selectedClass]);

  const handleSelectClass = (data: ClassDto) => {
    setSelectedClass(data);
    setClassId(data.id);
  };

  return (
    <AnimatePresence>
      {openAttendanceWidget ? (
        <motion.div
          initial={{ right: -400 }}
          animate={{ right: 0 }}
          exit={{ right: -400 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="tw-w-[400px] tw-bg-white tw-fixed tw-top-0 tw-right-0 tw-h-screen tw-z-[100] tw-overflow-y-scroll custom-scrollbar tw-shadow"
          ref={setWidgetRef}
        >
          <div className="tw-sticky tw-top-0 tw-bg-white">
            <div className="tw-p-3xl">
              <div className="tw-flex tw-justify-between tw-items-end">
                <div className="tw-text-xl-semibold tw-text-primary">Attendance</div>
                <div className="tw-p-2 tw-cursor-pointer" onClick={() => handleClose()}>
                  <AttendanceCloseIcon />
                </div>
              </div>
            </div>
            {!currentUserRoles?.hasAdminRoles && (
              <div
                className={`tw-flex tw-pl-6 tw-pr-3 tw-text-sm tw-text-tertiary tw-pb-4 ${
                  (classes && classes.length <= 1) ||
                  (router.pathname !== '/directory/student' &&
                    router.pathname !== '/directory/parent' &&
                    'tw-border-0 tw-border-b tw-border-secondary tw-border-solid')
                } `}
              >
                {`${
                  classes === null
                    ? 'No class assigned for current user'
                    : attendanceCount && attendanceCount < 2
                    ? `${attendanceCount} student marked present`
                    : `${attendanceCount ? attendanceCount : 0} students marked present`
                }`}
              </div>
            )}
            {currentUserRoles?.hasAdminRoles ||
            (classes?.length > 1 &&
              router.pathname !== '/staff/dashboard' &&
              router.pathname.split('/')[1] !== 'focus') ? (
              <div className="tw-p-3xl tw-pt-0 tw-space-y-lg tw-pb-xl tw-border-b tw-border-solid tw-border-secondary tw-border-0">
                <CustomAutoCompleteNoControls
                  selectedItems={selectedClass!}
                  setSelectedItems={handleSelectClass}
                  data={classes}
                  component="Select Class"
                  name="associateGuideId"
                  placeHolderIcon="user"
                  iconLeading={<UsersIcon />}
                />
                <CustomSearchInput
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  placeholder="Search"
                  disabled={!selectedClass}
                />
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="tw-px-6">
            {isFetchingAttendance ? (
              <AttendanceSkeleton />
            ) : (
              attendance &&
              attendance.length > 0 &&
              attendance.map((attendant: ClassAttendanceDto) => {
                if (attendant.studentName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
                  return (
                    <StudentStatus
                      key={attendant.studentId}
                      attendant={attendant}
                      classId={selectedClass?.id!}
                      studentsToSave={studentsToSave}
                      setStudentsToSave={setStudentsToSave}
                      handleSave={handleSave}
                    />
                  );
              })
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AttendanceWidget;
