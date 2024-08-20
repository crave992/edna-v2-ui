import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import DirectoryHeader from '@/components/ui/Directory/DirectoryHeader';
import DirectoryTable from '@/components/ui/Directory/DirectoryTable';
import { useState, useEffect } from 'react';
import DirectoryFilters from '@/components/ui/Directory/DirectoryFilters';
import DirectoryPagination from '@/components/ui/Directory/DirectoryPagination';
import AddStaff from '@/components/ui/AddStaff';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import FilterDto from '@/dtos/FilterDto';
import UserEmergencyInformation from '@/components/ui/UserEmergencyInformation';
import StaffDto from '@/dtos/StaffDto';
import paginationSettings from '@/constants/paginationSettings';
import { useSalaryTypesQuery } from '@/hooks/queries/useSalaryQuery';
import { useLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import { useStaffsDirectoryQuery } from '@/hooks/queries/useStaffsQuery';
import LevelDto from '@/dtos/LevelDto';
import { useFocusContext } from '@/context/FocusContext';
import { replaceLevelName } from '@/utils/replaceLevelName';

const StaffDirectoryPage = () => {
  const { organization } = useFocusContext();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [shouldApplyFilters, setShouldApplyFilters] = useState<boolean>(false);
  const [showAddStaff, setShowAddStaff] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [recordPerPage, setRecordPerPage] = useState<number>(paginationSettings.perPage);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffDto | undefined>();
  const [filteredItems, setFilteredItems] = useState<FilteredItemsDto>({
    Compensation: [],
    Level: [],
    Status: ['Active'],
  });

  const {
    data: staff,
    isFetching: isFetchingStaffMembers,
    isPreviousData,
  } = useStaffsDirectoryQuery({
    q: searchTerm,
    page: page,
    recordPerPage,
    sortBy,
    sortDirection,
    level: filteredItems.Level?.length > 0 ? filteredItems.Level.join(',') : '',
    salaryType: filteredItems.Compensation?.length > 0 ? filteredItems.Compensation.join(',') : '',
    status: filteredItems.Status?.length > 0 ? filteredItems.Status.join(',') : '',
    role: '',
  });

  const { data: salaryTypes } = useSalaryTypesQuery();
  const { data: levels } = useLevelsQuery();

  const modifiedLevels = levels?.map((level: LevelDto) => ({
    ...level,
    name: replaceLevelName(level.name, organization?.termInfo),
  }));

  const totalRecord = staff?.totalRecord ?? 0;
  const activeCount = staff?.activeCount ?? 0;
  const totalPages = staff?.totalPages ?? 0;

  const tableHeaders = [
    { name: 'Staff Member', key: 'name', sortable: true, style: '' },
    {
      name: 'Allergy',
      key: 'emergency',
      sortable: false,
      style: 'tw-text-center',
    },
    { name: 'Title', key: 'jobTitle', sortable: true, style: '' },
    { name: 'Class', key: 'classAssignment', sortable: false, style: '' },
    { name: 'Hired', key: 'hiredDate', sortable: true, style: '' },
  ];

  const tableRows = [
    { name: 'Staff Member', key: 'name', type: 'avatar', link: '/directory/staff' },
    { name: 'Allergy', key: 'userMedicalInformation', type: 'emergency', style: 'tw-items-center tw-justify-center' },
    { name: 'Title', key: 'jobTitle', type: 'text', style: 'tw-text-sm-regular tw-text-tertiary !tw-text-left' },
    { name: 'Class', key: 'classAssignment', type: 'class', style: 'tw-text-sm-regular tw-text-tertiary !tw-text-left' },
    { name: 'Hired', key: 'hiredDate', type: 'date', style: 'tw-text-sm-regular tw-text-tertiary !tw-text-left' },
  ];

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filteredItems]);

  const filters: FilterDto[] = [
    { name: 'Level', data: modifiedLevels },
    { name: 'Compensation', data: salaryTypes },
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
      <Head>
        <title>{`Staff Directory | ${siteMetadata.title}`}</title>
      </Head>
      <DirectoryHeader
        title={'Staff Directory'}
        subTitle={`${activeCount ?? 0} active ${totalRecord - activeCount ?? 0} inactive`}
        setShowFilters={setShowFilters}
        setShowAdd={setShowAddStaff}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        type="Staff"
        isFetching={isFetchingStaffMembers}
        selectedFilters={filteredItems}
      />
      <DirectoryTable
        isFetching={isFetchingStaffMembers}
        data={staff?.staff}
        tableHeaders={tableHeaders}
        tableRows={tableRows}
        shouldApplyFilters={shouldApplyFilters}
        filteredItems={filteredItems}
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        setShowEmergencyInfo={setShowEmergencyInfo}
        setSelectedUser={setSelectedStaff}
      />
      <DirectoryPagination
        page={page}
        setPage={setPage}
        hasMoreData={staff?.hasMoreData}
        isPreviousData={isPreviousData}
        totalPages={totalPages}
      />

      <DirectoryFilters
        showModal={showFilters}
        setShowModal={setShowFilters}
        component="Staff"
        filters={filters}
        filteredItems={filteredItems}
        setFilteredItems={setFilteredItems}
        setShouldApplyFilters={setShouldApplyFilters}
      />
      <AddStaff showModal={showAddStaff} setShowModal={setShowAddStaff} component="Staff" />
      <UserEmergencyInformation
        showModal={showEmergencyInfo}
        setShowModal={setShowEmergencyInfo}
        component="Staff"
        selectedUser={selectedStaff}
      />
    </>
  );
};

export default StaffDirectoryPage;
