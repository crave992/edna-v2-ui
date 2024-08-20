import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import PaginationParams from "@/params/PaginationParams";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import HolidayTypeSetupPage from "../../../components/common/NotificationMaster/HolidayType";
import NotificationUrgencyPage from "../../../components/common/NotificationMaster/NotificationUrgency";

interface NotificationMasterSetupPageProps extends CommonProps {
  q: string;
}

const NotificationMasterSetupPage: NextPage<NotificationMasterSetupPageProps> = (props) => {
  useBreadcrumb({
    pageName: "Notification & Holidays",
    breadcrumbs: [
      {
        label: "Notification & Holiday",
        link: "/admin/notification-master",
      },
    ],
  });
  return (
    <>
      <Head>
        <title>Notification Master</title>
      </Head>
      <Container fluid>
        <Row>
          <Col md={12}>
            <div className="db_heading_block">
              <h1 className="db_heading">Setup - Notification</h1>
            </div>
            <Tabs>
              <TabList>
                <Tab>Notification</Tab>
                <Tab>Holiday</Tab>
              </TabList>
              <TabPanel>
                <NotificationUrgencyPage q={""} />
              </TabPanel>
              <TabPanel>
                <HolidayTypeSetupPage q={""} />
              </TabPanel>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default NotificationMasterSetupPage;

export const getServerSideProps: GetServerSideProps<NotificationMasterSetupPageProps> = async (
  context
) => {
  let initialParamas: NotificationMasterSetupPageProps = {
    q: `${context.query.q || ""}`,
  };

  return {
    props: initialParamas,
  };
};
