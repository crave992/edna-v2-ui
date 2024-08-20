import ClassAttendanceReport from "@/components/common/Report/AttendanceReport/ClassAttendanceReport";
import StudentAttendanceReport from "@/components/common/Report/AttendanceReport/StudentAttendanceReport";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { ClassAttendanceReportsListParams } from "@/params/ClassAttendanceReportsListParams";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

interface AttendanceReportProps extends ClassAttendanceReportsListParams {
    q: string;
}

const AttendanceReport: NextPage<AttendanceReportProps> = (props) => {
    useBreadcrumb({
        pageName: "Attendance Report",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Attendance Report",
                link: "/admin/report/attendance",
            },
        ],
    });

    return (
        <>
            <Head>
                <title>Attendance Report - Noorana</title>
            </Head>

            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="db_heading_block">
                            <h1 className="db_heading">Attendance Report</h1>
                        </div>
                        <Tabs>
                            <TabList>
                                <Tab>Students</Tab>
                                <Tab>Class</Tab>
                            </TabList>

                            <TabPanel>
                                <StudentAttendanceReport q={props.q} fromDate={props.fromDate} toDate={props.toDate} classId={props.classId} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection}/>
                            </TabPanel>
                            <TabPanel>
                                <ClassAttendanceReport q={props.q} fromDate={props.fromDate} toDate={props.toDate} classId={props.classId} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} />
                            </TabPanel>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AttendanceReport;

export const getServerSideProps: GetServerSideProps<
    ClassAttendanceReportsListParams
> = async (context) => {
    let initialParamas: ClassAttendanceReportsListParams = {
        q: `${context.query.q || ""}`,
        fromDate: `${context.query.fromDate || ""}`,
        toDate: `${context.query.toDate || ""}`,
        page: +(context.query.page || 1),
        classId: +(context.query.classId || 0),
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