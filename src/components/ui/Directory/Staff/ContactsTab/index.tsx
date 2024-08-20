import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import AddOrUpdateContact from '@/components/ui/AddOrUpdateContact';
import StaffDto from '@/dtos/StaffDto';
import DirectoryFilters from '@/components/ui/Directory/DirectoryFilters';
import DirectoryPagination from '@/components/ui/Directory/DirectoryPagination';
import DirectoryTable from '@/components/ui/Directory/DirectoryTable';
import { useState } from 'react';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import FilterDto from '@/dtos/FilterDto';
import { UpdateUserContactDto } from '@/dtos/UserContactDto';
import paginationSettings from '@/constants/paginationSettings';
import { useStaffContactsyQuery } from '@/hooks/queries/useStaffsQuery';

interface ContactsTabProps {
  showAddContact: boolean;
  setShowAddContact: Function;
  staffData: StaffDto;
  isEditing: boolean;
  id: number;
  setIsEditing: Function;
  selectedContact: UpdateUserContactDto | undefined;
  setSelectedContact: Function;
}

const ContactsTab = ({
  showAddContact,
  setShowAddContact,
  staffData,
  isEditing,
  id,
  setIsEditing,
  selectedContact,
  setSelectedContact,
}: ContactsTabProps) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [shouldApplyFilters, setShouldApplyFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [recordPerPage, setRecordPerPage] = useState<number>(paginationSettings.perPage);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<FilteredItemsDto>({
    Compensation: [],
    Level: [],
    Status: [],
  });

  const {
    data: staffContacts,
    isFetching: isFetchingStaffData,
    isPreviousData,
  } = useStaffContactsyQuery({
    q: searchTerm,
    page: page,
    recordPerPage,
    sortBy,
    sortDirection,
    staffId: id,
  });

  const totalPages = staffContacts?.totalPages ?? 0;

  const handleEdit = (data: UpdateUserContactDto) => {
    setSelectedContact(data);
    setIsEditing(true);
    setShowAddContact(true);
  };

  const tableHeaders = [
    { name: 'Individual', key: 'contact', sortable: false },
    { name: 'Relationship', key: 'relationship', sortable: false },
    { name: 'Phone', key: 'contact', sortable: false },
    { name: 'Email', key: 'contact', sortable: false },
    { name: 'Date Added', key: 'contact', sortable: false },
  ];

  const tableRows = [
    { name: 'Individual', key: 'contact', type: 'avatar', func: handleEdit },
    { name: 'Relationship', key: 'role', type: 'box' },
    { name: 'Phone', key: 'contact', type: 'phone', style: '!tw-text-left' },
    { name: 'Email', key: 'contact', type: 'email', style: 'tw-truncate !tw-text-left' },
    { name: 'Date Added', key: 'contact', type: 'date', style: '!tw-text-left' },
  ];

  const filters: FilterDto[] = [{ name: 'Relationship', data: [] }];

  const handleSortChange = (newSortBy: string, newSortDirection: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  return (
    <>
      <Head>
        <title>{`Staff Contacts | ${siteMetadata.title}`}</title>
      </Head>
      <DirectoryTable
        isFetching={isFetchingStaffData}
        data={staffContacts?.userContacts}
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
        hasMoreData={staffContacts?.hasMoreData}
        isPreviousData={isPreviousData}
        totalPages={totalPages}
      />
      <DirectoryFilters
        showModal={showFilters}
        setShowModal={setShowFilters}
        component={'Staff Contacts'}
        filters={filters}
        filteredItems={filteredItems}
        setFilteredItems={setFilteredItems}
        setShouldApplyFilters={setShouldApplyFilters}
      />
      {showAddContact && (
        <AddOrUpdateContact
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          showModal={showAddContact}
          setShowModal={setShowAddContact}
          component="Staff"
          id={staffData.id}
          contact={selectedContact}
        />
      )}
    </>
  );
};

export default ContactsTab;
