import useBreadcrumb from "@/hooks/useBreadcrumb";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LevelPage from "../../../components/common/CommonMaster/Level";
import SemesterPage from "../../../components/common/CommonMaster/Semester";
import JobTitle from "../../../components/common/CommonMaster/JobTitle";
import UserRolePage from "../../../components/common/CommonMaster/UserRole";
import PaginationParams from "@/params/PaginationParams";
import siteMetadata from "@/constants/siteMetadata";

interface CommonMasterSetupPageProps extends PaginationParams {}

const CommonMasterSetupPage: NextPage<CommonMasterSetupPageProps> = (props) => {
  useBreadcrumb({
    pageName: "Common Master Setup",
    breadcrumbs: [
      {
        label: "Common Setup",
        link: "/admin/common-master",
      },
    ],
  });
  return (
    <>
      <Head>
        <title>{`Common Master | ${siteMetadata.title}`}</title>
      </Head>
      <Container className="tw-mt-3">
        <Row>
          <Col md={12}>
            <div className="db_heading_block">
              <h1 className="db_heading">Setup - Common Master</h1>
            </div>
            <Tabs>
              <TabList>
                <Tab>User Role</Tab>
                <Tab>Job Title</Tab>
                <Tab>Semester</Tab>
                <Tab>Level</Tab>
              </TabList>

              <TabPanel>
                <UserRolePage q={props.q} />
              </TabPanel>
              <TabPanel>
                <JobTitle
                  q={props.q}
                  page={props.page}
                  recordPerPage={props.recordPerPage}
                  sortBy={props.sortBy}
                  sortDirection={props.sortDirection}
                />
              </TabPanel>
              <TabPanel>
                <SemesterPage q={props.q} />
              </TabPanel>
              <TabPanel>
                <LevelPage q={props.q} />
              </TabPanel>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default CommonMasterSetupPage;

export const getServerSideProps: GetServerSideProps<
  CommonMasterSetupPageProps
> = async (context) => {
  let initialParamas: CommonMasterSetupPageProps = {
    q: `${context.query.q || ""}`,
    page: +(context.query.page || 1),
    recordPerPage: +(
      context.query.recordPerPage ||
      +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)
    ),
    sortBy: `${context.query.sortBy || "name"}`,
    sortDirection: `${context.query.sortDirection || "asc"}`,
  };

  return {
    props: initialParamas,
  };
};
