import ChangePassword from '@/components/account/ChangePassword';
import siteMetadata from '@/constants/siteMetadata';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import CommonProps from '@/models/CommonProps';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { Col, Row } from 'react-bootstrap';

interface ChangePasswordPageProps extends CommonProps {
  userId: string;
}

const ChangePasswordPage: NextPage<ChangePasswordPageProps> = (props) => {
  useBreadcrumb({
    pageName: 'Change Password',
    breadcrumbs: [
      {
        label: 'Change Password',
        link: '/account/change-password',
      },
    ],
  });

  console.log(props);

  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>{`Change Password | ${siteMetadata.title}`}</title>
      </Head>
      <div className={`change_password_page tw-mt-[10px] ${Number(session?.user.staffRoleId) > 0 && 'container'}`}>
        <Row>
          <Col md={12} lg={10} xl={8}>
            <div className="db_heading_block">
              <h1 className="db_heading">Change Your Password</h1>
            </div>
            <Row>
              <Col>
                <ChangePassword userId={props.userId} />
              </Col>
              <Col>
                <div className="formBlock">
                  <h3 className="formBlock-heading">Password requirements</h3>
                  <p className="">To create a new password, you have to meet all of the following requirements:</p>
                  <ul>
                    <li>Minimum 8 character</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one special character</li>
                    <li>At least one number</li>
                    <li>Can not be the same as a previous password</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default ChangePasswordPage;

export const getServerSideProps: GetServerSideProps<ChangePasswordPageProps> = async (context) => {
  var session = await getSession(context);
  return {
    props: {
      userId: session?.user.id || '',
    },
  };
};
