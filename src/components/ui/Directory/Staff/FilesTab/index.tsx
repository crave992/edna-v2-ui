import DirectoryTable from '@/components/ui/Directory/DirectoryTable';
import { useState } from 'react';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import UploadFile from '../../UploadFile';
import StaffDto, { StaffBasicDto } from '@/dtos/StaffDto';

interface StaffFilesTabProps {
  isFetching: boolean;
  data: StaffBasicDto;
  showUploadFile: boolean;
  setShowUploadFile: (showUploadFile: boolean) => void;
}

const StaffFilesTab = ({ isFetching, data, showUploadFile, setShowUploadFile }: StaffFilesTabProps) => {
  const [filteredItems, setFilteredItems] = useState<FilteredItemsDto>({
    Compensation: [],
    Level: [],
    Status: [],
  });
  const [shouldApplyFilters, setShouldApplyFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);

  const tableHeaders = [
    { name: 'Name', key: 'fileName', sortable: false, style: '' },
    { name: 'Size', key: 'fileSize', sortable: false, style: '' },
    { name: 'Type', key: 'fileType', sortable: false, style: '' },
    { name: 'Uploaded', key: 'createdOn', sortable: false, style: '' },
  ];

  const tableRows = [
    { name: 'Name', key: 'fileName', type: 'name', style: '!tw-text-left' },
    { name: 'Size', key: 'fileSize', type: 'fileSize', style: '!tw-text-left' },
    { name: 'Type', key: 'fileType', type: 'text', format: 'uppercase', style: '!tw-text-left' },
    { name: 'Uploaded', key: 'createdOn', type: 'date', format: 'MM/DD/YY', style: '!tw-text-left' },
  ];

  const handleSortChange = (newSortBy: string, newSortDirection: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  return (
    <>
      <DirectoryTable
        isFetching={isFetching}
        data={data.userFiles as any}
        tableHeaders={tableHeaders}
        tableRows={tableRows}
        shouldApplyFilters={shouldApplyFilters}
        filteredItems={filteredItems}
        searchTerm={''}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        setShowEmergencyInfo={setShowEmergencyInfo}
        tableClassName="!tw-border-b-1 !tw-border-t-0"
        hasContextMenu={true}
      />
      {showUploadFile && (
        <UploadFile
          showModal={showUploadFile}
          setShowModal={setShowUploadFile}
          data={data as unknown as StaffDto}
          type="staff"
        />
      )}
    </>
  );
};

export default StaffFilesTab;
