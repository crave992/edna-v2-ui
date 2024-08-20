import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@/components/svg/SearchIcon';
import LessonDto from '@/dtos/LessonDto';
import { useClickOutside } from '@mantine/hooks';
import CloseIcon from '@/components/svg/CloseIcon';
import AddStudentRow from '@/components/ui/AddStudentRow';
import { StudentBasicDto, StudentDto } from '@/dtos/StudentDto';
import { useClassStudentsQuery } from '@/hooks/queries/useStudentsQuery';
import { useClassLessonsQuery } from '@/hooks/queries/useLessonsQuery';
import { RecordKeepingDto } from '@/dtos/RecordKeepingDto';

interface SectionProps {
  showModal?: boolean;
  setShowModal: Function;
  name: string;
  classId: number;
  levelId: number;
  lesson: LessonDto;
}

export default function AddStudentToLesson({ showModal, setShowModal, name, classId, levelId, lesson }: SectionProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const ref = useClickOutside(() => setShowModal(false));

  const { data: students } = useClassStudentsQuery({ classId });
  const { data: classLessons } = useClassLessonsQuery({ levelId, classId });

  const filteredStudents = useMemo(() => {
    if (!students || !classLessons) return [];

    const lessonStudentIds = classLessons
      .filter((classLesson: LessonDto) => classLesson.id === lesson?.id)
      .flatMap((classLesson: LessonDto) => classLesson.recordKeepings)
      .map((recordKeeping: RecordKeepingDto) => recordKeeping.studentId);

    return students
      .filter((student: StudentDto) => !lessonStudentIds.includes(student.id))
      .filter(
        (student: StudentDto) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [students, searchTerm, classLessons, lesson]);

  return (
    <AnimatePresence>
      {showModal ? (
        <>
          <div className="tw-bg-black/[0.3] tw-w-screen tw-h-screen tw-top-0 tw-left-0 tw-fixed tw-z-50" />
          <motion.div
            initial={{ right: -400 }}
            animate={{ right: 0 }}
            exit={{ right: -400 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="tw-fixed tw-z-50 tw-top-0 tw-right-0 tw-h-screen tw-w-[400px] tw-bg-white tw-shadow-xl"
            ref={ref}
          >
            <div className="tw-pt-3xl tw-pb-xl tw-px-3xl tw-space-y-3xl tw-border-solid tw-border-b tw-border-secondary tw-border-x-0 tw-border-t-0">
              <div>
                <div className="tw-justify-between tw-flex">
                  <div className="tw-text-xl-semibold tw-text-primary">Add Student</div>
                  <span className="tw-cursor-pointer" onClick={() => setShowModal(false)}>
                    <CloseIcon width="20" height="20" />
                  </span>
                </div>
                <div>{name}</div>
              </div>
              <div className="">
                <label
                  htmlFor="default-search"
                  className="tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 tw-sr-only tw-dark:text-white"
                >
                  Search
                </label>
                <div className="tw-relative tw-flex tw-items-center">
                  <div className="tw-absolute tw-inset-y-0 tw-start-0 tw-flex tw-items-center tw-ps-3.5 tw-pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="tw-block tw-w-full tw-py-2.5 tw-px-3.5 tw-ps-11 tw-text-md-regular tw-text-placeholder tw-border-primary tw-border tw-border-solid tw-rounded-md"
                    placeholder="Search"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    value={searchTerm}
                  />
                  {searchTerm && (
                    <div
                      className="tw-cursor-pointer tw-flex tw-items-center tw-absolute tw-right-3.5"
                      onClick={() => setSearchTerm('')}
                    >
                      <CloseIcon />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="tw-p-3xl tw-space-y-xl custom-thin-scrollbar tw-overflow-y-scroll tw-max-h-[calc(100vh-180px)]">
              {filteredStudents &&
                filteredStudents.map((student: StudentBasicDto) => {
                  return (
                    <AddStudentRow
                      key={student.id}
                      student={student}
                      lesson={lesson}
                      classId={classId}
                      levelId={levelId}
                    />
                  );
                })}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
