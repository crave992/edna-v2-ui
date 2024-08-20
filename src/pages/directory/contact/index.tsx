import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';

const ContactDirectoryPage = () => {

  return (
    <>
      <Head>
        <title>{`Contact Directory | ${siteMetadata.title}`}</title>
      </Head>
      Contact Directory
    </>
  );
};

export default ContactDirectoryPage;