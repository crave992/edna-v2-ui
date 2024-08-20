import Registration from '@/components/account/Registration';
import PageLayout from '@/components/layout/PageLayout';
import RoleDto from '@/dtos/RoleDto';
import { Role } from '@/helpers/Roles';
import CommonProps from '@/models/CommonProps';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { NextPageWithLayout } from '../_app';
import siteMetadata from '@/constants/siteMetadata';
import Image from 'next/image';

interface RegisterPageProps extends CommonProps {}

const RegisterPage: NextPageWithLayout<RegisterPageProps> = () => {
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
        <title>{`Register | ${siteMetadata.title}`}</title>
      </Head>
      <Col md="8">
        <div className="register_block my-5">
          <div className="form_logo_name">
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_PATH}/${siteMetadata.imageLongLogo}`}
              width={siteMetadata.imageLongLogoWidth}
              height={siteMetadata.imageLongLogoHeight}
              alt={siteMetadata.title}
              title={`${siteMetadata.title} Logo`}
            />
            <h1>Register New School</h1>
          </div>
          <div className="register_form_block">
            <Registration />
          </div>
        </div>
      </Col>
    </>
  );
};

RegisterPage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default RegisterPage;
