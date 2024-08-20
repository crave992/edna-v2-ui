import useBreadcrumb from "@/hooks/useBreadcrumb";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PaginationParams from "@/params/PaginationParams";
import AddPerformanceEvaluationSetting from "@/components/common/PerformanceEvaluation/PerformanceEvaluationSetting";
import PerformanceEvaluationQuestionPage from "@/components/common/PerformanceEvaluation/PerformanceEvaluationQuestion";

interface PerformanceEvaluationPageProps extends PaginationParams {}

const PerformanceEvaluationPage: NextPage<PerformanceEvaluationPageProps> = (
  props
) => {
  useBreadcrumb({
    pageName: "Performance Evaluation Setup",
    breadcrumbs: [
      {
        label: "Performance Evaluation",
        link: "/admin/performance-evaluation",
      },
    ],
  });
  return (
    <>
      <Head>
        <title>Performance Evaluation</title>
      </Head>
      <Container fluid>
        <Row>
          <Col md={12}>
            <div className="db_heading_block">
              <h1 className="db_heading">Performance Evaluation Setting</h1>
            </div>
            <Tabs>
              <TabList>
                <Tab>Setting</Tab>
                <Tab>Questions</Tab>
              </TabList>

              <TabPanel>
                <AddPerformanceEvaluationSetting />
              </TabPanel>
              <TabPanel>
                <PerformanceEvaluationQuestionPage q={props.q} />
              </TabPanel>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default PerformanceEvaluationPage;

export const getServerSideProps: GetServerSideProps<
  PerformanceEvaluationPageProps
> = async (context) => {
  let initialParamas: PerformanceEvaluationPageProps = {
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
