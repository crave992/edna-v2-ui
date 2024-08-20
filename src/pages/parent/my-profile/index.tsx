import siteMetadata from '@/constants/siteMetadata';
import { useFocusContext } from '@/context/FocusContext';
import { useParentQuery } from '@/hooks/queries/useParentQuery';
import ParentDetailsPage from '@/pages/directory/parent/[id]';
import Head from 'next/head';
import React from 'react';

const ParentMyProfile = () => {
  const { currentUserRoles } = useFocusContext();
  const { data: parentInfo } = useParentQuery(currentUserRoles?.isParent!);

  return (
    <>
      <Head>
        <title>{`My Profile | ${siteMetadata.title}`}</title>
      </Head>
      <ParentDetailsPage parentId={parentInfo?.id} />
    </>
  );
};

export default ParentMyProfile;
