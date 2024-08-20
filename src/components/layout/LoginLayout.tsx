import { NextPage } from 'next';
import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';

interface LayoutProps {
  children: React.ReactNode;
}

const LoginLayout: NextPage<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>{siteMetadata.title}</title>
      </Head>
      <div className="tw-w-full tw-items-center tw-flex tw-justify-center tw-bg-gradient-to-b tw-from-white tw-to-[#E0E5EB]">
        {children}
      </div>
    </>
  );
};

export default LoginLayout;
