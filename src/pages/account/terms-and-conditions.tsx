import ForgotPassword from '@/components/account/ForgotPassword';
import LoginLayout from '@/components/layout/LoginLayout';
import RoleDto from '@/dtos/RoleDto';
import { AdminRoles, Role } from '@/helpers/Roles';
import CommonProps from '@/models/CommonProps';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { NextPageWithLayout } from '../_app';
import siteMetadata from '@/constants/siteMetadata';
import TermsAndConditions from '@/components/account/TermsAndConditions';

interface TermsAndConditionsPageProps extends CommonProps {
  userId: string;
}

const TermsAndConditionsPage: NextPageWithLayout<TermsAndConditionsPageProps> = (props) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    var user = session?.user;
    if (user && user.hasAcceptedTermsAndConditions) {
      let redirectUrl = '/admin/dashboard';
      
      const roles = (user?.roles || []).map((el) => el.name);
      const isAdmin = AdminRoles.some((role) => roles.includes(role));
      const isParent = roles.includes(Role.Parent);
      const isStaff = roles.includes(Role.Staff);

      if (isAdmin) {
        redirectUrl = '/admin/dashboard';
      } else if (isStaff && user?.hasClass) {
        redirectUrl = '/staff/dashboard';
      } else if (isStaff) {
        redirectUrl = `/staff/${user?.staffId}`;
      } else if (isParent) {
        redirectUrl = '/parent/my-profile';
      }

      router.push(`${redirectUrl}`);
    }
  }, [session?.user]);

  return (
    <>
      <Head>
        <title>{`Terms and Conditions | ${siteMetadata.title}`}</title>
      </Head>

      <div className="tw-w-[800px]">
        <TermsAndConditions />
      </div>
    </>
  );
};

TermsAndConditionsPage.getLayout = function getLayout(page: ReactElement) {
  return <LoginLayout>{page}</LoginLayout>;
};

export default TermsAndConditionsPage;

export const getServerSideProps: GetServerSideProps<TermsAndConditionsPageProps> = async (context) => {
  var session = await getSession(context);
  return {
    props: {
      userId: session?.user.id || '',
    },
  };
};
