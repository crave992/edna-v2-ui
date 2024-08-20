import { useEffect, useRef, useState } from 'react';
import MilestonesRow from '@/components/ui/Milestones/MilestonesRow';
import Slider from '@/components/common/Slider';
import { StudentDto, StudentMilestoneDto } from '@/dtos/StudentDto';
import { StudentMilestoneSkeleton } from '@/components/ui/Milestones/StudentMilestoneSkeleton';
import { isMobile } from 'react-device-detect';
import { useStudentMilestoneClassQuery, useStudentMilestoneStudentQuery } from '@/hooks/queries/useStudentsQuery';

interface MilestonesTabsProps {
  student?: StudentDto;
  classId?: number;
  showBanner?: boolean;
  classImageGallery?: number;
}

const groupDataByDay = (data: StudentMilestoneDto[] | undefined) => {
  if (!data || !Array.isArray(data)) return {}; // Return empty object if data is falsy or not an array

  const groupedData: Record<string, StudentMilestoneDto[]> = {};

  // Iterate through the data
  data.forEach((obj) => {
    // Extract the date without time information
    const date = obj.createdOn.split('T')[0];

    // Check if the date exists as a key in the accumulator object
    if (!groupedData[date]) {
      // If not, initialize it as an empty array
      groupedData[date] = [];
    }

    // Push the object to the corresponding date array
    groupedData[date].push(obj);
  });

  // Get the sorted keys (dates) in descending order
  const sortedKeys = Object.keys(groupedData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Create a new object with the keys sorted
  const sortedGroupedData: Record<string, StudentMilestoneDto[]> = {};
  sortedKeys.forEach((key) => {
    sortedGroupedData[key] = groupedData[key];
  });

  return sortedGroupedData;
};

const MilestonesTab = ({ student, classId, showBanner = false, classImageGallery = 0 }: MilestonesTabsProps) => {
  const milestonesRef = useRef<HTMLDivElement | null>(null);
  const [disableScroll, setDisableScroll] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [recordPerPage, setRecordPerPage] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [groupedData, setGroupedData] = useState<any>();

  const classQuery = {
    q: '',
    page: page,
    recordPerPage,
    sortBy,
    sortDirection,
    studentId: student && student.id!,
    classId: classId ?? 0,
  };

  const studentMilestoneStudentResult = useStudentMilestoneStudentQuery(classQuery);
  const studentMilestoneClassResult = useStudentMilestoneClassQuery(classQuery);

  const { data: studentsMilestonesData, isFetching: isFetchingStudentMilestoness } = student
    ? studentMilestoneStudentResult
    : studentMilestoneClassResult;

  useEffect(() => {
    if (studentsMilestonesData) {
      const localData = groupDataByDay(studentsMilestonesData.studentLessonNotes);
      const numberOfGroups = localData ? localData : 0;
      setGroupedData(numberOfGroups);
    }
  }, [studentsMilestonesData]);

  const getGuideContainerHeight = () => {
    return classImageGallery === 0 && isMobile
      ? 'calc(100vh - 345px)'
      : classImageGallery === 0 && !isMobile
      ? 'calc(100vh - 283px)'
      : showBanner && classImageGallery > 0 && isMobile
      ? 'calc(100vh - 541px)'
      : showBanner && classImageGallery > 0 && !isMobile
      ? 'calc(100vh - 283px)'
      : 'calc(100vh - 283px)';
  };

  const getAdminContainerHeight = () => {
    return 'calc(100vh - 308px)';
  };

  return (
    <div className="tw-p-4xl tw-pb-0 tw-pt-0">
      {isFetchingStudentMilestoness ? (
        <div
          className="tw-flex tw-flex-row tw-space-x-4xl"
          style={{
            height: student ? getAdminContainerHeight() : getGuideContainerHeight(),
          }}
        >
          <StudentMilestoneSkeleton noBorder={true} />
        </div>
      ) : groupedData && Object.keys(groupedData).length > 0 ? (
        <div style={{ height: student ? getAdminContainerHeight() : getGuideContainerHeight() }}>
          <Slider innerRef={milestonesRef} rootClass="drag tw-max-h-full" disabled={disableScroll} direction="col">
            <div ref={milestonesRef} className="no-scroll tw-flex tw-overflow-y-auto tw-flex-col tw-p-0 tw-space-y-4xl">
              {groupedData &&
                Object.keys(groupedData).map((label, index) => {
                  return (
                    <MilestonesRow
                      label={label}
                      milestones={groupedData[label]}
                      disableScroll={disableScroll}
                      setDisableScroll={setDisableScroll}
                      key={`milestone-row-${groupedData[label]}`}
                      student={student}
                      isLastRow={Object.keys(groupedData).length - 1 === index}
                    />
                  );
                })}
            </div>
          </Slider>
        </div>
      ) : (
        <div className="tw-flex tw-items-center tw-justify-center tw-text-md-semibold tw-text-secondary tw-pt-lg">
          No data available!
        </div>
      )}
    </div>
  );
};

export default MilestonesTab;
