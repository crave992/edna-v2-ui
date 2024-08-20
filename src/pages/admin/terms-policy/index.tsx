import useBreadcrumb from "@/hooks/useBreadcrumb";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PaginationParams from "@/params/PaginationParams";
import HipaaInfo from "@/components/common/TermsPolicy/Hipaa";
import ParentRegistration from "@/components/common/TermsPolicy/ParentRegistration";
import DirectoryCodeOfConduct from "@/components/common/TermsPolicy/DirectoryCodeOfConduct";

interface TermsPolicyPageProps extends PaginationParams { }

const TermsPolicyPage: NextPage<TermsPolicyPageProps> = (props) => {
    useBreadcrumb({
        pageName: "Terms & Policy Setup",
        breadcrumbs: [
            {
                label: "Terms & Policy Setup",
                link: "/admin/terms-policy",
            },
        ],
    });
    return (
        <>
            <Head>
                <title>Terms &amp; Policy Setup</title>
            </Head>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="db_heading_block">
                            <h1 className="db_heading">Terms &amp; Policy Setup</h1>
                        </div>
                        <Tabs>
                            <TabList>
                                <Tab>HIPAA</Tab>
                                <Tab>Parent Registration</Tab>
                                <Tab>Code Of Conduct</Tab>
                            </TabList>

                            <TabPanel>
                               <HipaaInfo/>
                            </TabPanel>
                            <TabPanel>
                                <ParentRegistration/>
                            </TabPanel>
                            <TabPanel>
                                <DirectoryCodeOfConduct/>
                            </TabPanel>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
export default TermsPolicyPage;

export const getServerSideProps: GetServerSideProps<
    TermsPolicyPageProps
> = async (context) => {
    let initialParamas: TermsPolicyPageProps = {
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
