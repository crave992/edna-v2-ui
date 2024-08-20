import ResetPassword from '@/components/account/ResetPassword';
import LoginLayout from '@/components/layout/LoginLayout';
import RoleDto from '@/dtos/RoleDto';
import { Role } from '@/helpers/Roles';
import CommonProps from '@/models/CommonProps';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { NextPageWithLayout } from '../_app';
import siteMetadata from '@/constants/siteMetadata';

interface ResetPasswordPageProps extends CommonProps {}

const ResetPasswordPage: NextPageWithLayout<ResetPasswordPageProps> = () => {
  const router = useRouter();
  const { userId, token } = router.query as { userId: string; token: string };
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && session.user && status == 'authenticated') {
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
        <title>{`Reset Password | ${siteMetadata.title}`}</title>
      </Head>

      <div className="tw-w-[400px]">
        <ResetPassword token={token} userId={userId} />
      </div>
    </>
  );
};

ResetPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <LoginLayout>{page}</LoginLayout>;
};

export default ResetPasswordPage;
