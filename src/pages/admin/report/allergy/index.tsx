

import StudentAllergyReport from "@/components/common/Report/AllergyReport/StudentAllergyReport";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { StudentAllergyListParams } from "@/params/StudentAllergyListParams";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";

interface AllergyReportProps extends StudentAllergyListParams {
    q: string;
}

const AllergyReport: NextPage<AllergyReportProps> = (props) => {
    useBreadcrumb({
        pageName: "Allergy Report",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Allergy Report",
                link: "/admin/report/allergy",
            },
        ],
    });

    return (
        <>
            <Head>
                <title>Allergy Report - Noorana</title>
            </Head>

            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="db_heading_block">
                            <h1 className="db_heading">Allergy Report</h1>
                        </div>
                        <StudentAllergyReport studentId={props.studentId} q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} classId={props.classId} levelId={props.levelId} />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AllergyReport;

export const getServerSideProps: GetServerSideProps<
    StudentAllergyListParams
> = async (context) => {
    let initialParamas: StudentAllergyListParams = {
        q: `${context.query.q || ""}`,
        page: +(context.query.page || 1),
        classId: + (context.query.classId || 0),
        levelId: + (context.query.levelId || 0),
        studentId: + (context.query.studentId || 0),
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