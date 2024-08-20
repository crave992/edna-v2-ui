import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import { useEffect, useMemo, useState } from 'react';
import DirectoryFilters from '@/components/ui/Directory/DirectoryFilters';
import DirectoryHeader from '@/components/ui/Directory/DirectoryHeader';
import DirectoryPagination from '@/components/ui/Directory/DirectoryPagination';
import DirectoryTable from '@/components/ui/Directory/DirectoryTable';
import UserEmergencyInformation from '@/components/ui/UserEmergencyInformation';
import { useFocusContext } from '@/context/FocusContext';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import { StudentBasicDto, StudentDto } from '@/dtos/StudentDto';
import paginationSettings from '@/constants/paginationSettings';
import FilterDto from '@/dtos/FilterDto';
import AccessDeniedPage from '@/pages/account/access-denied';
import { useParentsDirectoryQuery } from '@/hooks/queries/useParentQuery';
import { ParentBasicDto } from '@/dtos/ParentDto';
import UserContactMapModel from '@/models/UserContactModel';

const ParentDirectoryPage = () => {
  const [isLeadGuide, setIsLeadGuide] = useState(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [shouldApplyFilters, setShouldApplyFilters] = useState<boolean>(false);
  const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [recordPerPage, setRecordPerPage] = useState<number>(paginationSettings.perPage);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { studentId } = useFocusContext();
  const { currentUserRoles } = useFocusContext();
  const [filteredItems, setFilteredItems] = useState<FilteredItemsDto>({
    Level: [],
    Status: ['Active'],
    Compensation: [],
  });

  const {
    data: parentsData,
    isFetching: isFetchingParents,
    isPreviousData,
  } = useParentsDirectoryQuery({
    q: searchTerm,
    page: page,
    recordPerPage,
    sortBy,
    sortDirection,
    registration: filteredItems.Registration?.length > 0 ? filteredItems.Registration.join(',') : '',
    status: filteredItems.Status?.length > 0 ? filteredItems.Status.join(',') : '',
  });

  const totalRecord = parentsData?.totalRecord ?? 0;
  const activeCount = parentsData?.activeCount ?? 0;
  const totalPages = parentsData?.totalPages ?? 0;

  const transformData = (data: { parent: ParentBasicDto[] }) => {
    return data?.parent.map((parent: ParentBasicDto) => {
      let relationship = '';
      parent?.students?.map((student: StudentBasicDto) => {
        student?.userContactMap?.map((contact: UserContactMapModel) => {
          if (contact?.contact?.firstName === parent.firstName && contact?.contact?.lastName === parent.lastName) {
            relationship = contact.relationship;
          }
        });
      });

      return {
        ...parent,
        relationship,
      };
    });
  };

  const transformedData = useMemo(() => transformData(parentsData), [parentsData, studentId]);

  const tableHeaders = [
    { name: 'Parent', key: 'name', sortable: true, style: '' },
    { name: 'Child', key: 'students', sortable: false, style: '' },
    { name: 'Relationship', key: 'relationship', sortable: true, style: '' },
    { name: 'Account Registration', key: 'registrationStatus', sortable: true, style: '' },
    { name: 'Last Login', key: 'lastLogin', sortable: false, style: '' },
    { name: 'Status', key: 'isActive', sortable: true, style: '' },
  ];

  const tableRows = [
    { name: 'Parent', key: 'name', type: 'avatar', link: '/directory/parent' },
    { name: 'Child', key: 'students', type: 'array', style: 'tw-text-sm-regular tw-text-tertiary' },
    { name: 'Relationship', key: 'relationship', type: 'text', style: 'tw-text-sm-regular tw-text-tertiary !tw-text-left' },
    {
      name: 'Account Registration',
      key: 'registrationStatus',
      type: 'box',
      style: 'tw-text-sm-regular tw-text-secondary',
    },
    {
      name: 'Last Login',
      key: 'lastLogin',
      type: 'date',
      style: 'tw-text-sm-regular tw-text-tertiary !tw-text-left',
      format: 'MM/DD/YY h:mma',
    },
    { name: 'Status', key: 'isActive', type: 'box_status', style: 'tw-text-sm-regular tw-text-secondary' },
  ];

  const filters: FilterDto[] = [
    { name: 'Registration', data: [{ name: 'Completed' }, { name: 'Pending' }] },
    {
      name: 'Status',
      data: [
        { name: 'Active', color: 'success' },
        { name: 'Inactive', color: 'error' },
      ],
    },
  ];

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filteredItems]);

  useEffect(() => {
    var isLead = currentUserRoles?.isLeadGuide ?? false;
    setIsLeadGuide(isLead);
  }, [currentUserRoles]);

  const handleSortChange = (newSortBy: string, newSortDirection: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  const selectedStudent = useMemo(() => {
    return parentsData?.parent.find((parent: StudentDto) => parent.id === studentId) || null;
  }, [parentsData, studentId]);

  return (
    <>
      {isLeadGuide || currentUserRoles?.hasAdminRoles || currentUserRoles?.isLeadAndAssociate ? (
        <>
          <Head>
            <title>{`Parent Directory | ${siteMetadata.title}`}</title>
          </Head>
          <DirectoryHeader
            isFetching={isFetchingParents}
            title="Parent Directory"
            subTitle={`${activeCount ?? 0} active ${totalRecord - activeCount ?? 0} inactive`}
            setShowFilters={setShowFilters}
            setShowAdd={setShowAddStudent}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            type="Parent"
            selectedFilters={filteredItems}
          />
          <DirectoryTable
            isFetching={isFetchingParents}
            data={transformedData}
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
            hasMoreData={parentsData?.hasMoreData}
            isPreviousData={isPreviousData}
            totalPages={totalPages}
          />
          <DirectoryFilters
            showModal={showFilters}
            setShowModal={setShowFilters}
            component="Parent"
            filters={filters}
            filteredItems={filteredItems}
            setFilteredItems={setFilteredItems}
            setShouldApplyFilters={setShouldApplyFilters}
          />
          <UserEmergencyInformation
            showModal={showEmergencyInfo}
            setShowModal={setShowEmergencyInfo}
            component="Parent"
            selectedUser={selectedStudent}
          />
        </>
      ) : (
        <AccessDeniedPage />
      )}
    </>
  );
};

export default ParentDirectoryPage;
