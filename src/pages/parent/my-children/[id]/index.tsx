import StudentDetailsPage from '@/pages/directory/student/[id]';
import { useRouter } from 'next/router';
import React from 'react';

const ChildProfile = () => {
  const router = useRouter();
  const { id } = router.query;

  return <StudentDetailsPage studentId={String(id)} />;
};

export default ChildProfile;
