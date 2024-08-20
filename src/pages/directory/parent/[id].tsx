import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import Header from '@/components/ui/Directory/Parent/Header';
import Tabs from '@/components/ui/Directory/Parent/Tabs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ProfileTab from '@/components/ui/Directory/Parent/ProfileTab';
import AccessDeniedPage from '@/pages/account/access-denied';
import { useFocusContext } from '@/context/FocusContext';
import { useParentDirectoryQuery } from '@/hooks/queries/useParentQuery';

const ParentDetailsPage = ({ parentId }: { parentId?: number }) => {
  const {
    query: { id },
  } = useRouter();
  const selectedParentId = parentId ? parentId : Number(id);
  const [selectedTab, setSelectedTab] = useState<string>('Profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { currentUserRoles } = useFocusContext();

  const { data: parent, isFetching: isFetchingParent } = useParentDirectoryQuery(selectedParentId!);

  const tabs = [
    { name: 'Profile', disabled: false },
    // { name: 'Forms', disabled: true },
    { name: 'Invoices', disabled: true },
  ];

  const getFormId = (selectedTab: string) => {
    switch (selectedTab) {
      case 'Profile':
        return 'update-parent';
      default:
        return '';
    }
  };

  return (
    <>
      {(!currentUserRoles?.isAssociateGuide && !currentUserRoles?.isSpecialist) ||
      currentUserRoles?.isLeadAndAssociate ||
      currentUserRoles?.hasAdminRoles ? (
        <>
          <Head>
            <title>{`Parent Profile | ${siteMetadata.title}`}</title>
          </Head>

          <Header
            childData={parent?.students}
            isFetchingParent={isFetchingParent}
            photoLink={parent?.profilePicture}
            title={`${parent?.firstName} ${parent?.nickName ? `(${parent?.nickName})` : ''} ${parent?.lastName}`}
            subTitle={``}
            selectedTab={selectedTab}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isLoading={isLoading}
            formId={getFormId(selectedTab)}
            firstName={parent?.firstName}
            lastName={parent?.lastName}
          />
          <Tabs
            tabs={tabs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
          {selectedTab === 'Profile' && (
            <ProfileTab
              data={parent}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isLoadingData={isFetchingParent}
              formId="update-parent"
            />
          )}
        </>
      ) : (
        <AccessDeniedPage />
      )}
    </>
  );
};

export default ParentDetailsPage;
