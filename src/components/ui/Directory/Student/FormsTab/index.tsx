import AddOrUpdateContact from '@/components/ui/AddOrUpdateContact';
import DirectoryFilters from '@/components/ui/Directory/DirectoryFilters';
import DirectoryPagination from '@/components/ui/Directory/DirectoryPagination';
import DirectoryTable from '@/components/ui/Directory/DirectoryTable';
import { useState } from 'react';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import FilterDto from '@/dtos/FilterDto';
import { UpdateUserContactDto } from '@/dtos/UserContactDto';
import { StudentDto } from '@/dtos/StudentDto';
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

const StudentFormsTab = ({
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
  const [shouldApplyFilters, setShouldApplyFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [recordPerPage, setRecordPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<FilteredItemsDto>({
    Compensation: [],
    Level: [],
    Status: [],
  });

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
    { name: 'Individual', key: 'name', sortable: true },
    { name: 'Relationship', key: 'relationship', sortable: true },
    { name: 'Role', key: 'role', sortable: true },
    { name: 'Phone', key: 'phone', sortable: true },
    { name: 'Email', key: 'email', sortable: true },
    { name: 'Pickup', key: 'pickup', sortable: false },
    { name: 'Date Added', key: 'dateAdded', sortable: true },
  ];

  const tableRows = [
    { name: 'Individual', key: 'name', type: 'avatar', func: handleEdit },
    { name: 'Relationship', key: 'relationship', type: 'text' },
    { name: 'Role', key: 'role', type: 'box' },
    { name: 'Phone', key: 'phone', type: 'text' },
    { name: 'Email', key: 'email', type: 'text' },
    { name: 'Pickup', key: 'pickupAuthorization', type: 'box_boolean' },
    { name: 'Date Added', key: 'dateAdded', type: 'date' },
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
        component={'student Contacts'}
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
          component="Contact"
          id={id}
          contact={selectedContact}
        />
      )}
    </>
  );
};

export default StudentFormsTab;
