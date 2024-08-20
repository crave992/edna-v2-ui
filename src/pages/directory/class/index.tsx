import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import DirectoryHeader from '@/components/ui/Directory/DirectoryHeader';
import DirectoryTable from '@/components/ui/Directory/DirectoryTable';
import { useState, useEffect } from 'react';
import DirectoryFilters from '@/components/ui/Directory/DirectoryFilters';
import DirectoryPagination from '@/components/ui/Directory/DirectoryPagination';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import FilterDto from '@/dtos/FilterDto';
import paginationSettings from '@/constants/paginationSettings';
import AddEditClass from '@/components/ui/AddEditClass';
import AccessDeniedPage from '@/pages/account/access-denied';
import { useFocusContext } from '@/context/FocusContext';
import { useLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import { useSemesterQuery } from '@/hooks/queries/useSemesterQuery';
import { useClassesDirectoryQuery } from '@/hooks/queries/useClassesQuery';
import LevelDto from '@/dtos/LevelDto';
import ClassDto from '@/dtos/ClassDto';
import { replaceLevelName } from '@/utils/replaceLevelName';

const ClassDirectoryPage = () => {
  const { currentUserRoles, organization } = useFocusContext();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [shouldApplyFilters, setShouldApplyFilters] = useState<boolean>(false);
  const [showAddClass, setShowAddClass] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [recordPerPage, setRecordPerPage] = useState<number>(paginationSettings.perPage);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filteredItems, setFilteredItems] = useState<FilteredItemsDto>({
    Compensation: [],
    Level: [],
    Status: ['Active'],
    Semester: [],
  });

  const {
    data: classes,
    isFetching: isFetchingClasses,
    isPreviousData,
  } = useClassesDirectoryQuery({
    q: searchTerm,
    page: page,
    recordPerPage,
    sortBy,
    sortDirection,
    level: filteredItems.Level.length > 0 ? filteredItems.Level.join(',') : '',
    semester: filteredItems.Semester?.length > 0 ? filteredItems.Semester.join(',') : '',
    status: filteredItems.Status?.length > 0 ? filteredItems.Status.join(',') : '',
  });
  const { data: semesters } = useSemesterQuery();
  const { data: levels } = useLevelsQuery();

  const modifiedLevels = levels?.map((level: LevelDto) => ({
    ...level,
    name: replaceLevelName(level.name, organization?.termInfo),
  }));

  const modifiedClasses = classes?.classes?.map((classes: ClassDto) => ({
    ...classes,
    level: {
      ...classes.level,
      name: replaceLevelName(classes.level?.name, organization?.termInfo),
    },
  }));

  const totalRecord = classes?.totalRecord ?? 0;
  const activeCount = classes?.activeCount ?? 0;
  const totalPages = classes?.totalPages ?? 0;

  const tableHeaders = [
    { name: 'Class', key: 'name', sortable: true, style: '' },
    {
      name:
        organization && organization?.termInfo && organization?.termInfo?.teacher
          ? organization.termInfo.teacher
          : 'Lead Guide',
      key: 'classStaff',
      sortable: true,
      style: '',
    },
    { name: 'Staff', key: 'classStaff', sortable: false, style: '' },
    { name: 'Level', key: 'level', sortable: true, style: '' },
    { name: 'Enrolled / Capacity', key: 'capacity', sortable: false, style: '' },
    { name: 'Attendance', key: 'attendance', sortable: true, style: '' },
  ];

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filteredItems]);

  const tableRows = [
    { name: 'Class', key: 'name', type: 'primary', first: true, link: '/directory/class' },
    {
      name:
        organization && organization?.termInfo && organization?.termInfo?.teacher
          ? organization.termInfo.teacher
          : 'Lead Guide',
      key: 'classStaff',
      type: 'lead',
      style: 'tw-text-sm-regular tw-text-tertiary',
    },
    {
      name: 'Staff',
      key: 'classStaff',
      type: 'associate-specialist',
      style: 'tw-text-sm-regular tw-text-tertiary',
      component: 'staff',
    },
    { name: 'Level', key: 'level', type: 'level', style: 'tw-text-sm-regular tw-text-secondary' },
    { name: 'Enrolled / Capacity', key: 'capacity', type: 'capacity', style: 'tw-text-sm-regular tw-text-tertiary' },
    { name: 'Attendance', key: 'classAttendance', type: 'attendance', style: 'tw-text-sm-regular tw-text-tertiary' },
  ];

  const filters: FilterDto[] = [
    { name: 'Level', data: modifiedLevels },
    { name: 'Semester', data: semesters },
    {
      name: 'Status',
      data: [
        { name: 'Active', color: 'success' },
        { name: 'Inactive', color: 'error' },
      ],
    },
  ];

  const handleSortChange = (newSortBy: string, newSortDirection: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  return (
    <>
      {!currentUserRoles?.isAssociateGuide ||
      currentUserRoles?.isLeadAndAssociate ||
      currentUserRoles?.hasAdminRoles ? (
        <>
          <Head>
            <title>{`Class Directory | ${siteMetadata.title}`}</title>
          </Head>
          <DirectoryHeader
            title="Class Directory"
            subTitle={`${activeCount ?? 0} active ${totalRecord - activeCount ?? 0} inactive`}
            setShowFilters={setShowFilters}
            setShowAdd={setShowAddClass}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            type="Class"
            isFetching={isFetchingClasses}
            selectedFilters={filteredItems}
          />
          <DirectoryTable
            isFetching={isFetchingClasses}
            data={modifiedClasses}
            tableHeaders={tableHeaders}
            tableRows={tableRows}
            shouldApplyFilters={shouldApplyFilters}
            filteredItems={filteredItems}
            searchTerm={searchTerm}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
          <DirectoryPagination
            page={page}
            setPage={setPage}
            hasMoreData={classes?.hasMoreData}
            isPreviousData={isPreviousData}
            totalPages={totalPages}
          />
          <DirectoryFilters
            showModal={showFilters}
            setShowModal={setShowFilters}
            component="Class"
            filters={filters}
            filteredItems={filteredItems}
            setFilteredItems={setFilteredItems}
            setShouldApplyFilters={setShouldApplyFilters}
          />
          <AddEditClass showModal={showAddClass} setShowModal={setShowAddClass} isEdit={false} />
        </>
      ) : (
        <AccessDeniedPage />
      )}
    </>
  );
};

export default ClassDirectoryPage;
