import AddOrUpdateContact from '@/components/ui/AddOrUpdateContact';
import DirectoryFilters from '@/components/ui/Directory/DirectoryFilters';
import DirectoryPagination from '@/components/ui/Directory/DirectoryPagination';
import DirectoryTable from '@/components/ui/Directory/DirectoryTable';
import { useState } from 'react';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import FilterDto from '@/dtos/FilterDto';
import { UpdateUserContactDto } from '@/dtos/UserContactDto';
import { StudentDto } from '@/dtos/StudentDto';
import paginationSettings from '@/constants/paginationSettings';
import { useStudentContactQuery } from '@/hooks/queries/useStudentsQuery';

interface ContactsTabProps {
  showAddContact: boolean;
  setShowAddContact: Function;
  data: StudentDto;
  isEditing: boolean;
  id: number;
  setIsEditing: Function;
  selectedContact: UpdateUserContactDto | undefined;
  setSelectedContact: Function;
}

const ContactsTab = ({
  showAddContact,
  setShowAddContact,
  data,
  isEditing,
  id,
  setIsEditing,
  selectedContact,
  setSelectedContact,
}: ContactsTabProps) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<FilteredItemsDto>({
    Compensation: [],
    Level: [],
    Status: [],
  });
  const [shouldApplyFilters, setShouldApplyFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [recordPerPage, setRecordPerPage] = useState<number>(paginationSettings.perPage);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);

  const {
    data: studentContacts,
    isFetching: isFetchingdata,
    isPreviousData,
  } = useStudentContactQuery({ studentId: id });

  const totalPages = studentContacts?.totalPages ?? 0;

  const handleEdit = (data: UpdateUserContactDto) => {
    setSelectedContact(data);
    setIsEditing(true);
    setShowAddContact(true);
  };

  const tableHeaders = [
    { name: 'Individual', key: 'contact', sortable: false },
    { name: 'Relationship', key: 'relationship', sortable: false },
    { name: 'Role', key: 'role', sortable: false },
    { name: 'Phone', key: 'contact', sortable: false },
    { name: 'Email', key: 'contact', sortable: false },
    { name: 'Pickup', key: 'pickupAuthorization', sortable: false },
    { name: 'Date Added', key: 'contact', sortable: false },
  ];

  const tableRows = [
    { name: 'Individual', key: 'contact', type: 'avatar', func: handleEdit, style: '!tw-text-left' },
    { name: 'Relationship', key: 'relationship', type: 'text', style: '!tw-text-left' },
    { name: 'Role', key: 'role', type: 'box', style: '!tw-text-left' },
    { name: 'Phone', key: 'contact', type: 'phone', style: '!tw-text-left' },
    { name: 'Email', key: 'contact', type: 'email', style: 'tw-truncate !tw-text-left' },
    { name: 'Pickup', key: 'pickupAuthorization', type: 'box_boolean', style: '!tw-text-left' },
    { name: 'Date Added', key: 'contact', type: 'date', style: '!tw-text-left' },
  ];

  const filters: FilterDto[] = [{ name: 'Relationship', data: [] }];

  const handleSortChange = (newSortBy: string, newSortDirection: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  return (
    <>
      <DirectoryTable
        isFetching={isFetchingdata}
        data={studentContacts?.userContacts}
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
        hasMoreData={studentContacts?.hasMoreData}
        isPreviousData={isPreviousData}
        totalPages={totalPages}
      />
      <DirectoryFilters
        showModal={showFilters}
        setShowModal={setShowFilters}
        component={'Student Contacts'}
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
          component="Student"
          id={id}
          contact={selectedContact}
        />
      )}
    </>
  );
};

export default ContactsTab;
