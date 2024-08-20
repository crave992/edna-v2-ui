import useBreadcrumb from "@/hooks/useBreadcrumb";
import PaginationParams from "@/params/PaginationParams";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import SepAreaPage from "../../../components/common/SepMaster/SepArea";
import SepLevelPage from "../../../components/common/SepMaster/SepLevel";
import SepTopicPage from "../../../components/common/SepMaster/SepTopic";

interface SepMasterSetupProps extends PaginationParams {
  levelId: number;
  sepAreaId: number;
  sepLevelId: number;
}

const SepMasterSetupPage: NextPage<SepMasterSetupProps> = (props) => {
  useBreadcrumb({
    pageName: "SEP Master Setup",
    breadcrumbs: [
      {
        label: "SEP Setup",
        link: "/admin/sep-master",
      },
    ],
  });
  return (
    <>
      <Head>
        <title>SEP Master</title>
      </Head>
      <Container fluid>
        <Row>
          <Col md={12}>
            <div className="db_heading_block">
              <h1 className="db_heading">Setup - SEP Master</h1>
            </div>
            <Tabs>
              <TabList>
                <Tab>SEP Area</Tab>
                <Tab>SEP Level</Tab>
                <Tab>SEP Topic</Tab>
              </TabList>

              <TabPanel>
                <SepAreaPage
                  levelId={props.levelId}
                  q={props.q}
                  page={props.page}
                  recordPerPage={props.recordPerPage}
                  sortBy={props.sortBy}
                  sortDirection={props.sortDirection}
                />
              </TabPanel>
              <TabPanel>
                <SepLevelPage
                  sepAreaId={props.sepAreaId}
                  levelId={props.levelId}
                  q={props.q}
                  page={props.page}
                  recordPerPage={props.recordPerPage}
                  sortBy={props.sortBy}
                  sortDirection={props.sortDirection}
                />
              </TabPanel>
              <TabPanel>
                <SepTopicPage
                  sepLevelId={props.sepLevelId}
                  sepAreaId={props.sepAreaId}
                  levelId={props.levelId}
                  q={props.q}
                  page={props.page}
                  recordPerPage={props.recordPerPage}
                  sortBy={props.sortBy}
                  sortDirection={props.sortDirection}
                />
              </TabPanel>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default SepMasterSetupPage;

export const getServerSideProps: GetServerSideProps<
  SepMasterSetupProps
> = async (context) => {
  let initialParamas: SepMasterSetupProps = {
    q: `${context.query.q || ""}`,
    levelId: +(context.query.levelId || 0),
    sepAreaId: +(context.query.sepAreaId || 0),
    sepLevelId: +(context.query.sepLevelId || 0),
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
