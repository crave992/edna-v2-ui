import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import DirectoryHeader from '@/components/ui/Directory/DirectoryHeader';
import DirectoryTable from '@/components/ui/Directory/DirectoryTable';
import { useEffect, useMemo, useState } from 'react';
import DirectoryFilters from '@/components/ui/Directory/DirectoryFilters';
import DirectoryPagination from '@/components/ui/Directory/DirectoryPagination';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import AddStudentDirectory from '@/components/ui/AddStudentDirectory';
import UserEmergencyInformation from '@/components/ui/UserEmergencyInformation';
import { useFocusContext } from '@/context/FocusContext';
import { StudentBasicDto, StudentDto } from '@/dtos/StudentDto';
import paginationSettings from '@/constants/paginationSettings';
import FilterDto from '@/dtos/FilterDto';
import { useStudentsDirectoryQuery } from '@/hooks/queries/useStudentsQuery';
import { useLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import { useClassesQuery } from '@/hooks/queries/useClassesQuery';
import LevelDto from '@/dtos/LevelDto';
import { replaceLevelName } from '@/utils/replaceLevelName';

const StudentDirectoryPage = () => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [gridOneMinWidth, setGridOneMinWidth] = useState<number>(Infinity);
  const [shouldApplyFilters, setShouldApplyFilters] = useState<boolean>(false);
  const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [recordPerPage, setRecordPerPage] = useState<number>(paginationSettings.perPage);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { studentId, currentUserRoles, organization } = useFocusContext();
  const [filteredItems, setFilteredItems] = useState<FilteredItemsDto>({
    Level: [],
    Status: ['Active'],
    Age: [],
    Class: [],
  });

  const {
    data: studentsData,
    isFetching: isFetchingStudents,
    isPreviousData,
  } = useStudentsDirectoryQuery({
    q: searchTerm,
    page: page,
    recordPerPage,
    sortBy,
    sortDirection,
    levels: filteredItems.Level?.length > 0 ? filteredItems.Level.join(',') : '',
    ages: filteredItems.Age?.length > 0 ? filteredItems.Age.join(',') : '',
    status: filteredItems.Status?.length > 0 ? filteredItems.Status.join(',') : '',
    classes: filteredItems.Class?.length > 0 ? filteredItems.Class.join(',') : '',
  });

  const { data: levels } = useLevelsQuery();
  const { data: classes } = useClassesQuery({
    isAdmin:
      currentUserRoles?.hasSuperAdminRoles || currentUserRoles?.hasAccountOwnerRoles || currentUserRoles?.hasAdminRoles,
    staffId: currentUserRoles?.staffId!,
  });

  const totalRecord = studentsData?.totalRecord ?? 0;
  const activeCount = studentsData?.activeCount ?? 0;
  const totalPages = studentsData?.totalPages ?? 0;

  const tableHeaders = [
    { name: 'Student', key: 'name', sortable: true, style: '' },
    {
      name: 'Allergy',
      key: 'userMedicalInformation',
      sortable: false,
      style: 'tw-text-center',
    },
    { name: 'Age', key: 'age', sortable: true, style: '' },
    { name: 'Class', key: 'classes', sortable: true, style: '' },
    { name: 'Level', key: 'levelName', sortable: true, style: '' },
    { name: 'Status', key: 'active', sortable: true, style: '' },
  ];

  const tableRows = [
    { name: 'Student', key: 'name', type: 'avatar', link: '/directory/student' },
    { name: 'Allergy', key: 'userMedicalInformation', type: 'emergency' },
    { name: 'Age', key: 'age', type: 'text', style: 'tw-text-sm-regular tw-text-tertiary !tw-text-left' },
    { name: 'Class', key: 'classes', type: 'class', style: 'tw-text-sm-regular tw-text-tertiary !tw-text-left' },
    { name: 'Level', key: 'levelName', type: 'box', style: 'tw-text-sm-regular tw-text-secondary' },
    { name: 'Status', key: 'active', type: 'box_status', style: 'tw-text-sm-regular tw-text-secondary' },
  ];

  const filters: FilterDto[] = [
    { name: 'Level', data: levels },
    {
      name: 'Age',
      data: [{ name: '0-3' }, { name: '3-6' }, { name: '6+' }],
    },
    {
      name: 'Status',
      data: [
        { name: 'Active', color: 'success' },
        { name: 'Inactive', color: 'error' },
      ],
    },
    { name: 'Class', data: classes },
  ];

  const modifiedStudentsData = studentsData?.student.map((student: StudentBasicDto) => ({
    ...student,
    levelName: replaceLevelName(student.levelName, organization?.termInfo),
  }));

  const modifiedLevels = levels?.map((level: LevelDto) => ({
    ...level,
    name: replaceLevelName(level.name, organization?.termInfo),
  }));

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filteredItems]);

  const handleSortChange = (newSortBy: string, newSortDirection: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  const selectedStudent = useMemo(() => {
    return studentsData?.student.find((student: StudentDto) => student.id === studentId) || null;
  }, [studentsData, studentId]);

  const filtersWithModifiedLevels = filters.map((filter) => {
    if (filter.name === 'Level') {
      return { ...filter, data: modifiedLevels };
    }
    return filter;
  });

  return (
    <>
      <Head>
        <title>{`Student Directory | ${siteMetadata.title}`}</title>
      </Head>
      <DirectoryHeader
        isFetching={isFetchingStudents}
        title="Student Directory"
        subTitle={`${activeCount ?? 0} active ${totalRecord - activeCount ?? 0} inactive`}
        setShowFilters={setShowFilters}
        setShowAdd={setShowAddStudent}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        selectedFilters={filteredItems}
        type="Student"
      />
      <DirectoryTable
        isFetching={isFetchingStudents}
        data={modifiedStudentsData}
        tableHeaders={tableHeaders}
        tableRows={tableRows}
        shouldApplyFilters={shouldApplyFilters}
        filteredItems={filteredItems}
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        setShowEmergencyInfo={setShowEmergencyInfo}
      />
      <DirectoryPagination
        page={page}
        setPage={setPage}
        hasMoreData={studentsData?.hasMoreData}
        isPreviousData={isPreviousData}
        totalPages={totalPages}
      />
      <DirectoryFilters
        showModal={showFilters}
        setShowModal={setShowFilters}
        component="Student"
        filters={filtersWithModifiedLevels}
        filteredItems={filteredItems}
        setFilteredItems={setFilteredItems}
        setShouldApplyFilters={setShouldApplyFilters}
      />
      {showAddStudent && (
        <AddStudentDirectory showModal={showAddStudent} setShowModal={setShowAddStudent} component="Student" />
      )}
      {showEmergencyInfo && (
        <UserEmergencyInformation
          showModal={showEmergencyInfo}
          setShowModal={setShowEmergencyInfo}
          component="Student"
          selectedUser={selectedStudent}
        />
      )}
    </>
  );
};

export default StudentDirectoryPage;
