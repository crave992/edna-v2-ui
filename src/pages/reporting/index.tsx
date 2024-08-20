import Table from '@/components/ui/Reporting/Table';
import DirectoryHeader from '@/components/ui/Directory/DirectoryHeader';
import TypeCard from '@/components/ui/Reporting/TypeCard';
import siteMetadata from '@/constants/siteMetadata';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import Head from 'next/head';
import React, { useState } from 'react';
import ReportingDto from '@/dtos/ReportingDto';
import ReportingModal from '@/components/ui/Reporting/ReportingModal';

const types = [
  { name: 'Medical', description: '7/12/24' },
  // { name: 'Academic', description: 'Updated' }, Commented for now to disable
  { name: 'Attendance', description: 'Updated' },
  { name: 'Students', description: '7/12/24' },
  { name: 'Parents', description: '7/12/24' },
  // { name: 'Staff', description: 'Updated' },
  // { name: 'Class', description: 'Updated' },
];

const data: ReportingDto[] = [
  {
    id: 1,
    report: 'Report Title',
    date: '10/10/24',
    data: 'Data Point One, Data Point Two, Data Point three',
    type: 'Academic Progress',
  },
  {
    id: 2,
    report: 'Report Title',
    date: '10/10/24',
    data: 'Data Point One, Data Point Two, Data Point three',
    type: 'Academic Progress',
  },
  {
    id: 3,
    report: 'Report Title',
    date: '10/10/24',
    data: 'Data Point One, Data Point Two, Data Point three',
    type: 'Academic Progress',
  },
  {
    id: 4,
    report: 'Report Title',
    date: '10/10/24',
    data: 'Data Point One, Data Point Two, Data Point three',
    type: 'Academic Progress',
  },
  {
    id: 5,
    report: 'Report Title',
    date: '10/10/24',
    data: 'Data Point One, Data Point Two, Data Point three',
    type: 'Academic Progress',
  },
  {
    id: 6,
    report: 'Report Title',
    date: '10/10/24',
    data: 'Data Point One, Data Point Two, Data Point three',
    type: 'Academic Progress',
  },
  {
    id: 7,
    report: 'Report Title',
    date: '10/10/24',
    data: 'Data Point One, Data Point Two, Data Point three',
    type: 'Academic Progress',
  },
  {
    id: 8,
    report: 'Report Title',
    date: '10/10/24',
    data: 'Data Point One, Data Point Two, Data Point three',
    type: 'Academic Progress',
  },
  {
    id: 9,
    report: 'Report Title',
    date: '10/10/24',
    data: 'Data Point One, Data Point Two, Data Point three',
    type: 'Academic Progress',
  },
];

const Reporting = () => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<FilteredItemsDto>({
    Compensation: [],
    Level: [],
    Status: ['Active'],
    Semester: [],
  });

  const tableHeaders = [
    { name: 'Report', key: 'report' },
    { name: 'Date', key: 'date' },
    { name: 'Data', key: 'data' },
    { name: 'Type', key: 'type' },
  ];

  const tableRows = [
    { name: 'Report', key: 'report', type: 'text', style: 'tw-text-sm-medium' },
    { name: 'Date', key: 'date', type: 'text', style: 'tw-items-center tw-justify-center' },
    { name: 'Data', key: 'data', type: 'text', style: 'tw-text-tertiary tw-text-sm-regular' },
    { name: 'Type', key: 'type', type: 'box', style: 'tw-text-sm-regular' },
  ];

  return (
    <>
      <Head>
        <title>{`Reporting | ${siteMetadata.title}`}</title>
      </Head>
      <div className="tw-space-y-3xl tw-bg-secondary">
        <div className="tw-border-b tw-border-0 tw-border-solid tw-border-secondary tw-bg-primary">
          <DirectoryHeader
            title="Reporting"
            subTitle={`62 Reports`}
            setShowFilters={setShowFilters}
            setShowAdd={setFilteredItems}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            type="Class"
            isFetching={false}
            selectedFilters={filteredItems}
            showAddButton={false}
            component={'reporting'}
          />
        </div>
        <div className="tw-space-x-xl tw-w-full tw-flex tw-px-4xl">
          {types.map((type, index) => {
            return (
              <TypeCard type={type} setShowModal={setShowModal} setType={setType} key={`type-card-${type}-${index}`} />
            );
          })}
        </div>
        <div className={`tw-invisible`}>
          {/*  Added tw-invisible to hide for now */}
          <Table tableHeaders={tableHeaders} tableRows={tableRows} data={data} isFetching={false} />
        </div>
        <ReportingModal showModal={showModal} setShowModal={setShowModal} type={type} />
      </div>
    </>
  );
};

export default Reporting;
