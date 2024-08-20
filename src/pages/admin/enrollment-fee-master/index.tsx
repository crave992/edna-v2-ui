import AdditionalFeePage from "@/components/common/EnrollmentFeesMaster/AdditionalFees";
import PastDueFeePage from "@/components/common/EnrollmentFeesMaster/PastDueFees";
import ProgramOptionPage from "@/components/common/EnrollmentFeesMaster/ProgramOption";
import RegistrationFeeSetupPage from "@/components/common/EnrollmentFeesMaster/RegistrationFees";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import PaginationParams from "@/params/PaginationParams";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

interface EnrollmnetFeeMastePageProps extends PaginationParams {
    levelId: number;
}

const EnrollmnetFeeMastePage: NextPage<EnrollmnetFeeMastePageProps> = (props) => {
    useBreadcrumb({
        pageName: "Fee Structure",
        breadcrumbs: [
            {
                label: "Fee Structure",
                link: "/admin/enrollment-fee-master",
            },
        ],
    });
    return (
        <>
            <Head>
                <title>Enrollment & Fees Master</title>
            </Head>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="db_heading_block">
                            <h1 className="db_heading">Setup - Fee Structure</h1>
                        </div>
                        <Tabs>
                            <TabList>
                                <Tab>Program Option</Tab>
                                <Tab>Additional Fees</Tab>
                                <Tab>Registration Fees</Tab>
                                <Tab>Past Due Fees</Tab>
                            </TabList>
                                
                            
                            <TabPanel>
                                <ProgramOptionPage levelId={props.levelId} q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} />
                            </TabPanel>
                            <TabPanel>
                                <AdditionalFeePage levelId={props.levelId} q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} />
                            </TabPanel>
                            <TabPanel>
                                <RegistrationFeeSetupPage q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection}/>
                            </TabPanel>
                            <TabPanel>
                                <PastDueFeePage q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} />
                            </TabPanel>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
export default EnrollmnetFeeMastePage;

export const getServerSideProps: GetServerSideProps<EnrollmnetFeeMastePageProps> = async (
    context
) => {
    let initialParamas: EnrollmnetFeeMastePageProps = {
        q: `${context.query.q || ""}`,
        levelId: +(context.query.levelId || 0),
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

