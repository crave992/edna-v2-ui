import ForgotPassword from '@/components/account/ForgotPassword';
import LoginLayout from '@/components/layout/LoginLayout';
import RoleDto from '@/dtos/RoleDto';
import { Role } from '@/helpers/Roles';
import CommonProps from '@/models/CommonProps';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { NextPageWithLayout } from '../_app';
import siteMetadata from '@/constants/siteMetadata';

interface ForgotPasswordPageProps extends CommonProps {
  userId: string;
}

const ForgotPasswordPage: NextPageWithLayout<ForgotPasswordPageProps> = (props) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && session.user) {
      let redirectUrl = '/admin/dashboard';
      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);

      if (roles.indexOf(Role.NooranaAdmin) >= 0) {
        redirectUrl = '/admin/dashboard';
      }

      router.push(`${redirectUrl}`);
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>{`Forgot Password | ${siteMetadata.title}`}</title>
      </Head>

      <div className="tw-w-[400px]">
        <ForgotPassword />
      </div>
    </>
  );
};

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <LoginLayout>{page}</LoginLayout>;
};

export default ForgotPasswordPage;

export const getServerSideProps: GetServerSideProps<ForgotPasswordPageProps> = async (context) => {
  var session = await getSession(context);
  return {
    props: {
      userId: session?.user.id || '',
    },
  };
};
