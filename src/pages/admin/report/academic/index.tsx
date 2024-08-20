
import StudentAcademicReport from "@/components/common/Report/AcademicReport/StudentAcademicReport";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { LessonReportsListParams } from "@/params/LessonListParams";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

interface AcademicReportProps extends LessonReportsListParams {
    q: string;
}

const AcademicReport: NextPage<AcademicReportProps> = (props) => {
    useBreadcrumb({
        pageName: "Academic Report",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Academic Report",
                link: "/admin/report/academic",
            },
        ],
    });

    return (
        <>
            <Head>
                <title>Academic Report - Noorana</title>
            </Head>

            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="db_heading_block">
                            <h1 className="db_heading">Academic Report</h1>
                        </div>
                        <StudentAcademicReport classId={props.classId} studentId={props.studentId} levelId={props.levelId} areaId={props.areaId} topicId={props.topicId} status={props.status} q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AcademicReport;

export const getServerSideProps: GetServerSideProps<
    LessonReportsListParams
> = async (context) => {
    let initialParamas: LessonReportsListParams = {
        q: `${context.query.q || ""}`,
        status: `${context.query.status || ""}`,
        page: +(context.query.page || 1),
        classId: + (context.query.classId || 0),
        studentId: + (context.query.studentId || 0),
        levelId: +(context.query.levelId || 0),
        areaId: +(context.query.areaId || 0),
        topicId: +(context.query.topicId || 0),
        recordPerPage: +(
            context.query.recordPerPage ||
            +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)
        ),
        sortBy: `${context.query.sortBy || "date"}`,
        sortDirection: `${context.query.sortDirection || "desc"}`,
    };

    return {
        props: initialParamas,
    };
};