import LoginLayout from '@/components/layout/LoginLayout';
import CommonProps from '@/models/CommonProps';
import Head from 'next/head';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../_app';
import siteMetadata from '@/constants/siteMetadata';
import Start from '@/components/ui/OnBoarding/Start';

interface LoginPageProps extends CommonProps {}

const StartPage: NextPageWithLayout<LoginPageProps> = () => {
  return (
    <>
      <Head>
        <title>{`Onboarding - Start | ${siteMetadata.title}`}</title>
      </Head>
      <Start />
    </>
  );
};

StartPage.getLayout = function getLayout(page: ReactElement) {
  return <LoginLayout>{page}</LoginLayout>;
};

export default StartPage;
