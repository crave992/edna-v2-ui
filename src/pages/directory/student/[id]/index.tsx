import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import Header from '@/components/ui/Directory/Student/Header';
import Tabs from '@/components/ui/Directory/Student/Tabs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ContactsTab from '@/components/ui/Directory/Student/ContactsTab';
import { calculateAgeForDirectory } from '@/utils/calculateAgeForDirectory';
import UserEmergencyInformation from '@/components/ui/UserEmergencyInformation';
import StudentAboutTab from '@/components/ui/Directory/Student/AboutTab';
import ProfileTab from '@/components/ui/Directory/Student/ProfileTab';
import StudentPermissionsTab from '@/components/ui/Directory/Student/PermissionsTab';
import StudentAttendanceTab from '@/components/ui/Directory/Student/AttendanceTab';
import { AttendanceModel } from '@/models/ClassAttendanceModel';
import { UpdateUserContactDto } from '@/dtos/UserContactDto';
import FilesTab from '@/components/ui/Directory/Student/FilesTab';
import MilestonesTab from '@/components/ui/Milestones/MilestonesTab';
import { useStudentClassDirectoryQuery, useStudentDirectoryQuery } from '@/hooks/queries/useStudentsQuery';

const StudentDetailsPage = ({ studentId }: { studentId?: string }) => {
  const {
    query: { id },
  } = useRouter();
  const selectedStudentId = studentId ? Number(studentId) : Number(id);
  const [selectedTab, setSelectedTab] = useState<string>('Profile');
  const [selectedContact, setSelectedContact] = useState<UpdateUserContactDto | undefined>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState<boolean>(false);
  const [showAddContact, setShowAddContact] = useState<boolean>(false);
  const [showAddAttendance, setShowAddAttendance] = useState<boolean>(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceModel | undefined>();
  const [showUploadFile, setShowUploadFile] = useState<boolean>(false);

  const { data: student, isLoading: isFetchingStudent } = useStudentDirectoryQuery(selectedStudentId);
  const { data: studentClass } = useStudentClassDirectoryQuery(selectedStudentId);

  const hasLevel = student?.levelId || student?.levelId != 0;
  const tabs = [
    { name: 'Profile', disabled: false },
    { name: 'About', disabled: false },
    {
      name: 'Permissions',
      disabled: !hasLevel,
      disabledSupportingText: "Assign a Level first to adjust this student's permissions.",
    },
    { name: 'Contacts', disabled: false },
    // { name: 'Forms', disabled: true },
    { name: 'Files', disabled: false },
    { name: 'Milestones', disabled: false },
    {
      name: 'Attendance',
      disabled: studentClass && studentClass.length == 0 ? true : false,
      disabledSupportingText: 'Student does not belong to a class.',
    },
  ];

  const getFormId = (selectedTab: string) => {
    switch (selectedTab) {
      case 'Profile':
        return 'update-student';
      case 'About':
        return 'update-student-about';
      case 'Permissions':
        return 'update-student-permissions';
      default:
        return '';
    }
  };

  return (
    <>
      <Head>
        <title>{`Student Profile | ${siteMetadata.title}`}</title>
      </Head>
      <Header
        classData={studentClass && studentClass.length > 0 ? studentClass : []}
        isFetchingStudent={isFetchingStudent}
        photoLink={student?.profilePicture !== null ? student?.profilePicture : ''}
        title={`${student?.firstName} ${student?.nickName ? `(${student?.nickName})` : ''} ${student?.lastName}`}
        subTitle={`${calculateAgeForDirectory(student?.dateOfBirth)}`}
        selectedTab={selectedTab}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isLoading={isLoading}
        setShowUploadFile={setShowUploadFile}
        setShowAddContact={setShowAddContact}
        setShowEmergency={setShowEmergencyInfo}
        setShowAddAttendance={setShowAddAttendance}
        formId={getFormId(selectedTab)}
        firstName={student?.firstName}
        lastName={student?.lastName}
        hasSeverAllergy={student?.userMedicalInformation && student.userMedicalInformation.severeAllergies !== null}
        studentContacts={student?.userContactMap}
      />
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        classes={studentClass && studentClass.length > 0 ? studentClass : []}
        studentId={selectedStudentId}
      />

      {selectedTab === 'Profile' && (
        <ProfileTab
          data={student}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isLoadingData={isFetchingStudent}
          formId="update-student"
        />
      )}
      {selectedTab === 'Contacts' && (
        <ContactsTab
          showAddContact={showAddContact}
          setShowAddContact={setShowAddContact}
          data={student}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          id={selectedStudentId}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
        />
      )}
      {selectedTab === 'About' && (
        <StudentAboutTab
          studentId={selectedStudentId}
          data={student}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setIsLoading={setIsLoading}
          isLoadingData={isFetchingStudent}
          formId="update-student-about"
        />
      )}
      {selectedTab === 'Permissions' && (
        <StudentPermissionsTab
          data={student}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setIsLoading={setIsLoading}
          isLoadingData={isFetchingStudent}
          formId="update-student-permissions"
        />
      )}
      {selectedTab === 'Files' && (
        <FilesTab
          isFetching={isFetchingStudent}
          data={student}
          showUploadFile={showUploadFile}
          setShowUploadFile={setShowUploadFile}
        />
      )}
      {selectedTab === 'Milestones' && (
        <div className="tw-pt-4xl tw-bg-secondary">
          <MilestonesTab student={student} classId={studentClass?.[0]?.classId} />
        </div>
      )}
      {selectedTab === 'Attendance' && (
        <StudentAttendanceTab
          data={student}
          showAddAttendance={showAddAttendance}
          setShowAddAttendance={setShowAddAttendance}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          selectedAttendance={selectedAttendance}
          setSelectedAttendance={setSelectedAttendance}
        />
      )}
      {showEmergencyInfo && (
        <UserEmergencyInformation
          showModal={showEmergencyInfo}
          setShowModal={setShowEmergencyInfo}
          component="Student"
          selectedUser={student}
        />
      )}
    </>
  );
};

export default StudentDetailsPage;
