import MasterAreaPage from "@/components/common/LessonMaster/MasterArea";
import MasterLessonPage from "@/components/common/LessonMaster/MasterLesson";
import MasterTopicPage from "@/components/common/LessonMaster/MasterTopic";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import PaginationParams from "@/params/PaginationParams";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

interface MasterLessonSetupPageProps extends PaginationParams {
    levelId: number;
    areaId: number;
    topicId: number;
}

const MasterLessonSetupPage: NextPage<MasterLessonSetupPageProps> = (props) => {
    useBreadcrumb({
        pageName: "Lesson Master Setup",
        breadcrumbs: [
            {
                label: "Lesson Setup",
                link: "/superadmin/lesson-master",
            },
        ],
    });
    return (
        <>
            <Head>
                <title>Lesson Master</title>
            </Head>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="db_heading_block">
                            <h1 className="db_heading">Setup - Lesson Master</h1>
                        </div>
                        <Tabs>
                            <TabList>
                                <Tab>Area</Tab>
                                <Tab>Topic</Tab>
                                <Tab>Lesson</Tab>
                            </TabList>

                            <TabPanel>
                                <MasterAreaPage levelId={props.levelId} q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} />
                            </TabPanel>
                            <TabPanel>
                                <MasterTopicPage areaId={props.areaId} levelId={props.levelId} q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} />
                            </TabPanel>
                            <TabPanel>
                                <MasterLessonPage areaId={props.areaId} levelId={props.levelId} topicId={props.topicId} q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} />
                            </TabPanel>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
export default MasterLessonSetupPage;

export const getServerSideProps: GetServerSideProps<MasterLessonSetupPageProps> = async (
    context
) => {
    let initialParamas: MasterLessonSetupPageProps = {
        q: `${context.query.q || ""}`,
        areaId: +(context.query.areaId || 0),
        levelId: +(context.query.levelId || 0),
        topicId: +(context.query.topicId || 0),
        page: +(context.query.page || 1),
        recordPerPage: +(
            context.query.recordPerPage ||
            +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)
        ),
        sortBy: `${context.query.sortBy || "_"}`,
        sortDirection: `${context.query.sortDirection || "_"}`,
    };

    return {
        props: initialParamas,
    };
};

