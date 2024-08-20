import AddParent from '@/components/common/Parent/AddParent';
import Head from 'next/head';
import { Col, Container, Row } from 'react-bootstrap';
import { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import LoginLayout from '@/components/layout/LoginLayout';
import siteMetadata from '@/constants/siteMetadata';
import Image from 'next/image';

const RegisterParentPage = () => {
  const router = useRouter();
  const registrationCode = router.query.code as string;

  return (
    <>
      <Head>
        <title>{`Add Parent | ${siteMetadata.title}`}</title>
      </Head>
      <div className="login_form_block w-100">
        <Image
          src={`${process.env.NEXT_PUBLIC_CDN_PATH}/${siteMetadata.imageLongLogo}`}
          width={siteMetadata.imageLongLogoWidth}
          height={siteMetadata.imageLongLogoHeight}
          alt={siteMetadata.title}
          title={`${siteMetadata.title} Logo`}
        />
        <h1>Register Parent</h1>
        <Container className="d-flex align-items-center justify-content-center" style={{ height: '70vh' }}>
          <Row>
            <Col lg={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">Details</h1>
              </div>
              <div className="formBlock">
                <AddParent registrationCode={registrationCode} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

RegisterParentPage.getLayout = function getLayout(page: ReactElement) {
  return <LoginLayout>{page}</LoginLayout>;
};

export default RegisterParentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
