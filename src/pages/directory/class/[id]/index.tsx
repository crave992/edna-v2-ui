import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import Header from '@/components/ui/Directory/Class/Header';
import Chart from '@/components/ui/Directory/Class/Chart';
import Table from '@/components/ui/Directory/Class/Table';
import { useState } from 'react';
import UserEmergencyInformation from '@/components/ui/UserEmergencyInformation';
import { StudentBasicDto } from '@/dtos/StudentDto';
import ClassStats from '@/components/ui/Directory/Class/Stats';
import Birthdays from '@/components/ui/Directory/Class/Birthdays';
import { ClassImageGalleryDto } from '@/dtos/ClassDto';
import ImageGallery from '@/components/ui/Directory/Class/ImageGallery';
import ClassGuides from '@/components/ui/Directory/Class/Guides';
import StaffTabs from '@/components/ui/Directory/Staff/StaffTabs';
import MilestonesTab from '@/components/ui/Milestones/MilestonesTab';
import { useAreasQuery } from '@/hooks/queries/useAreasQuery';
import { useClass } from '@/hooks/queries/useClassesQuery';
import ImageGalleryPopup from '@/components/ui/Directory/Class/ImageGalleryPopup';
import { useRouter } from 'next/router';

interface ClassProfileProps {
  classId?: number;
}

const tabs = [
  { name: 'Overview', disabled: false },
  { name: 'Milestones', disabled: false },
  // { name: 'Accidents', disabled: false },
  // { name: 'Incidents', disabled: false },
];

const ClassProfile = ({ classId }: ClassProfileProps) => {
  const {
    query: { id },
  } = useRouter();
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentBasicDto | undefined>();
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showEditGalleryModal, setShowEditGalleryModal] = useState<boolean>(false);
  const [showEditClassModal, setShowEditClassModal] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('Overview');
  const selectedClassId = id ? Number(id) : classId;

  const { data: classData, isLoading: isLoadingClassData } = useClass(selectedClassId!);
  const { areas } = useAreasQuery(classData?.levelId!, selectedClassId!);

  const tableHeaders = [
    { name: 'Student', key: 'name' },
    { name: 'Allergy', key: 'emergency', style: 'tw-text-center' },
    { name: 'Age', key: 'age' },
    { name: 'Guardian', key: 'userContactMap' },
    { name: 'Attendance', key: 'attendance' },
  ];

  const tableRows = [
    { name: 'Student', key: 'name', type: 'avatar', style: 'tw-text-sm-medium' },
    { name: 'Allergy', key: 'userMedicalInformation', type: 'emergency', style: 'tw-items-center tw-justify-center' },
    { name: 'Age', key: 'age', type: 'text', style: 'tw-text-tertiary tw-text-sm-regular' },
    { name: 'Guardian', key: 'userContactMap', type: 'guardian', style: 'tw-text-sm-regular' },
    { name: 'Attendance', key: 'attendance', type: 'box_status' },
  ];

  return (
    <>
      <Head>
        <title>{`Class Profile | ${siteMetadata.title}`}</title>
      </Head>
      <Header
        classData={classData!}
        classId={selectedClassId}
        showEditGalleryModal={showEditGalleryModal}
        setShowEditGalleryModal={setShowEditGalleryModal}
        showEditClassModal={showEditClassModal}
        setShowEditClassModal={setShowEditClassModal}
      />
      {(showBanner ? showBanner : classData?.showBannerGallery ? true : false) && (
        <div className="tw-bg-secondary">
          <ImageGallery photos={classData?.classImageGallery.map((image: ClassImageGalleryDto) => image)!} />
        </div>
      )}
      <div
        className={`tw-bg-secondary ${selectedTab === 'Milestones' ? 'tw-space-y-4xl' : 'tw-space-y-3xl tw-pb-3xl'} `}
      >
        <StaffTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        {selectedTab === 'Overview' && (
          <>
            <ClassGuides classData={classData!} isLoading={isLoadingClassData} />
            <Chart data={areas} />
            {classData && classData.students.length > 0 && (
              <Birthdays classData={classData} isLoading={isLoadingClassData} />
            )}
            <ClassStats classData={classData!} isLoading={isLoadingClassData} />
            {classData && classData.students.length > 0 && (
              <Table
                tableHeaders={tableHeaders}
                tableRows={tableRows}
                data={classData?.students}
                isFetching={isLoadingClassData}
                setShowEmergencyInfo={setShowEmergencyInfo}
                attendance={classData?.classAttendance!}
                setSelectedUser={setSelectedStudent}
              />
            )}
          </>
        )}
        {selectedTab === 'Milestones' && classData && (
          <MilestonesTab
            classId={classData.id}
            showBanner={showBanner}
            classImageGallery={classData?.classImageGallery.length}
          />
        )}
      </div>
      <ImageGalleryPopup
        showModal={showEditGalleryModal}
        setShowModal={setShowEditGalleryModal}
        classData={classData!}
        showBanner={showBanner}
        setShowBanner={setShowBanner}
      />
      <UserEmergencyInformation
        showModal={showEmergencyInfo}
        setShowModal={setShowEmergencyInfo}
        component={'Student'}
        selectedUser={selectedStudent}
      />
    </>
  );
};

export default ClassProfile;
