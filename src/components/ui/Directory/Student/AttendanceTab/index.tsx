import DirectoryTable from '@/components/ui/Directory/DirectoryTable';
import { useState } from 'react';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import StudentAddAttendance from './AddAttendance';
import { StudentDto } from '@/dtos/StudentDto';
import { AttendanceModel } from '@/models/ClassAttendanceModel';
import { useStudentAttendanceQuery } from '@/hooks/queries/useAttendanceQuery';

interface AttendanceTabProps {
  data: StudentDto;
  showAddAttendance: boolean;
  setShowAddAttendance: (showAddAttendance: boolean) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  selectedAttendance: AttendanceModel | undefined;
  setSelectedAttendance: (selectedAttendance: AttendanceModel | undefined) => void;
}

const StudentAttendanceTab = ({
  data,
  showAddAttendance,
  setShowAddAttendance,
  isEditing,
  setIsEditing,
  selectedAttendance,
  setSelectedAttendance,
}: AttendanceTabProps) => {
  const [shouldApplyFilters, setShouldApplyFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('attendanceDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<FilteredItemsDto>({
    Compensation: [],
    Level: [],
    Status: [],
  });

  const { data: studentAttendance, isFetching: isFetchingdata } = useStudentAttendanceQuery({
    studentId: data?.id!,
    sortBy,
    sortDirection,
  });

  const handleEdit = (data: AttendanceModel) => {
    setSelectedAttendance(data);
    setIsEditing(true);
    setShowAddAttendance(true);
  };


  const tableHeaders = [
    { name: 'Date', key: 'attendanceDate', sortable: true, style: '' },
    { name: 'Status', key: 'presentOrAbsent', sortable: true, style: '' },
    { name: 'Time', key: 'attendanceDate', sortable: false },
    { name: 'Note', key: 'note', sortable: false },
  ];

  const tableRows = [
    { name: 'Date', key: 'attendanceDate', type: 'date', format: 'MMMM Do, YYYY', bold: true, func: handleEdit, style: '!tw-text-left' },
    { name: 'Status', key: 'presentOrAbsent', type: 'attendance_status' },
    { name: 'Time', key: 'attendanceDate', type: 'date', format: 'h:mma', style: '!tw-text-left' },
    { name: 'Note', key: 'note', type: 'text', style: '!tw-text-left' },
  ];

  const handleSortChange = (newSortBy: string, newSortDirection: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  return (
    <>
      <DirectoryTable
        isFetching={isFetchingdata}
        data={studentAttendance}
        tableHeaders={tableHeaders}
        tableRows={tableRows}
        shouldApplyFilters={shouldApplyFilters}
        filteredItems={filteredItems}
        searchTerm={''}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        setShowEmergencyInfo={setShowEmergencyInfo}
      />
      {showAddAttendance && (
        <StudentAddAttendance
          showModal={showAddAttendance}
          setShowModal={setShowAddAttendance}
          student={data}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editDate={selectedAttendance}
        />
      )}
    </>
  );
};

export default StudentAttendanceTab;
