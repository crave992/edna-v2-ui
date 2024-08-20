import Login from '@/components/account/Login';
import LoginLayout from '@/components/layout/LoginLayout';
import { AdminRoles, Role } from '@/helpers/Roles';
import CommonProps from '@/models/CommonProps';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { NextPageWithLayout } from '../_app';
import siteMetadata from '@/constants/siteMetadata';

interface LoginPageProps extends CommonProps {}

const LoginPage: NextPageWithLayout<LoginPageProps> = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && session.user) {
      const user = session.user;
      let redirectUrl = '';
      const roles = (user?.roles || []).map((el) => el.name);
      const isAdmin = AdminRoles.some((role) => roles.includes(role));
      const isParent = roles.includes(Role.Parent);
      const isStaff = roles.includes(Role.Staff);

      localStorage.setItem('at', user.token);
      localStorage.setItem('rt', user.refreshToken);
      localStorage.setItem('userEmail', user.email);

      localStorage.setItem('utz', user.timezoneId || '');
      localStorage.setItem('curCode', user.currencyCode || 'USD');
      localStorage.setItem('locales', user.locales || 'en-US');

      if (user.passwordUpdateRequiredForNewRegistration) {
        redirectUrl = '/account/new/change-password';
      } else if(!user.hasAcceptedTermsAndConditions) {
        redirectUrl = '/account/terms-and-conditions';
      } else if (isAdmin) {
        redirectUrl = '/admin/dashboard';
      } else if (isStaff && session.user?.hasClass) {
        redirectUrl = '/staff/dashboard';
      } else if (isStaff) {
        redirectUrl = `/staff/${session.user?.staffId}`;
      } else if (isParent) {
        redirectUrl = '/parent/my-profile';
      }

      router.push(redirectUrl);
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>{`Login | ${siteMetadata.title}`}</title>
      </Head>
      <Login />
    </>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <LoginLayout>{page}</LoginLayout>;
};

export default LoginPage;
