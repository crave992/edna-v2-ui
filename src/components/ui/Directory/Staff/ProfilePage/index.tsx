import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import StaffHeader from '@/components/ui/Directory/Staff/StaffHeader';
import StaffTabs from '@/components/ui/Directory/Staff/StaffTabs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ProfileTab from '@/components/ui/Directory/Staff/ProfileTab';
import ContactsTab from '@/components/ui/Directory/Staff/ContactsTab';
import UserEmergencyInformation from '@/components/ui/UserEmergencyInformation';
import { UpdateUserContactDto } from '@/dtos/UserContactDto';
import StaffFilesTab from '../FilesTab';
import { useStaffDirectoryQuery } from '@/hooks/queries/useStaffsQuery';

const StaffProfilePage = () => {
  const {
    query: { id },
  } = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>('Profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAddContact, setShowAddContact] = useState<boolean>(false);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<UpdateUserContactDto | undefined>();
  const [showUploadFile, setShowUploadFile] = useState<boolean>(false);

  const { data: staffData, isLoading: isLoadingStaffData } = useStaffDirectoryQuery(Number(id));

  const tabs = [
    { name: 'Profile', disabled: false },
    { name: 'Contacts', disabled: false },
    // { name: 'Forms', disabled: false },
    { name: 'Files', disabled: false },
    { name: 'Performance Evaluation', disabled: true },
    { name: 'Professional Development', disabled: true },
    { name: 'Credentials', disabled: true },
  ];

  return (
    <>
      <Head>
        <title>{`Staff Profile | ${siteMetadata.title}`}</title>
      </Head>

      <StaffHeader
        title={`${staffData?.firstName} ${staffData?.nickName ? `(${staffData?.nickName})` : ''} ${
          staffData?.lastName
        }`}
        subTitle={staffData?.jobTitle?.name}
        isFetchingStaff={isLoadingStaffData}
        classAssignment={staffData?.classAssignment ? staffData?.classAssignment.class.name : ''}
        selectedTab={selectedTab}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isLoading={isLoading}
        setShowUploadFile={setShowUploadFile}
        setShowAddContact={setShowAddContact}
        setSelectedContact={setSelectedContact}
        profilePicture={staffData?.profilePicture}
        setShowEmergencyInfo={setShowEmergencyInfo}
        firstName={staffData?.firstName}
        lastName={staffData?.lastName}
        classId={staffData?.classAssignment?.classId}
        hasSeverAllergy={staffData?.userMedicalInformation && staffData.userMedicalInformation.severeAllergies !== null}
        staffId={staffData?.id}
      />

      <StaffTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {selectedTab === 'Profile' && (
        <ProfileTab
          staffData={staffData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isLoadingStaffData={isLoadingStaffData}
        />
      )}
      {selectedTab === 'Contacts' && (
        <ContactsTab
          showAddContact={showAddContact}
          setShowAddContact={setShowAddContact}
          staffData={staffData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          id={Number(id)}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
        />
      )}
      {selectedTab === 'Files' && (
        <StaffFilesTab
          isFetching={isLoadingStaffData}
          data={staffData}
          showUploadFile={showUploadFile}
          setShowUploadFile={setShowUploadFile}
        />
      )}
      <UserEmergencyInformation
        showModal={showEmergencyInfo}
        setShowModal={setShowEmergencyInfo}
        component="Staff"
        selectedUser={staffData}
      />
    </>
  );
};

export default StaffProfilePage;
