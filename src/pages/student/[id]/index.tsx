import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import StudentDetailsPage from '@/pages/directory/student/[id]';

const DirectoryStudentFocus = () => {
  return (
    <>
      <Head>
        <title>{`Student Directory | Focus Student | ${siteMetadata.title}`}</title>
      </Head>
      <StudentDetailsPage />
    </>
  );
};

export default DirectoryStudentFocus;
