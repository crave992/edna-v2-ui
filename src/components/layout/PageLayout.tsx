import { NextPage } from "next";
import Head from "next/head";
import { Container, Row } from "react-bootstrap";

interface LayoutProps {
  children: React.ReactNode;
}

const PageLayout: NextPage<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Noorana</title>
      </Head>

      <div className="page_main">
        <Container>
          <Row className="align-items-center justify-content-center">
            {children}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default PageLayout;
