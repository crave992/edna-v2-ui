import InvoiceConfiguration from "@/components/common/PaymentMaster/InvoiceConfiguration";
import SpecialFeeListPage from "@/components/common/PaymentMaster/SpecialFeeList";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import PaginationParams from "@/params/PaginationParams";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import OutsidePaymentMethodPage from "../../../components/common/PaymentMaster/OutsidePaymentMethod";
import PaymentMethodPage from "../../../components/common/PaymentMaster/PaymentMethod";


interface PaymentMasterSetupPageProps extends PaginationParams {
    q: string;
 }

const PaymentMasterSetupPage: NextPage<PaymentMasterSetupPageProps> = (props) => {
    useBreadcrumb({
        pageName: "Payment Setup",
        breadcrumbs: [
            {
                label: "Payment Setup",
                link: "/admin/common-master",
            },
        ],
    });
    return (
        <>
            <Head>
                <title>Payment Master</title>
            </Head>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="db_heading_block">
                            <h1 className="db_heading">Setup - Payment Master</h1>
                        </div>
                        <Tabs>
                            <TabList>
                                <Tab>Payment Methods</Tab>
                                <Tab>Outside Payment Methods</Tab>
                                <Tab>Special Fee List</Tab>
                                <Tab>Invoicing</Tab>
                            </TabList>

                            <TabPanel>
                                <PaymentMethodPage q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection}/>
                            </TabPanel>
                            <TabPanel>
                                <OutsidePaymentMethodPage q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} />
                            </TabPanel>
                            <TabPanel>
                                <SpecialFeeListPage q={props.q} page={props.page} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} />
                            </TabPanel>
                            <TabPanel>
                                <InvoiceConfiguration q={props.q} />
                            </TabPanel>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
export default PaymentMasterSetupPage;

export const getServerSideProps: GetServerSideProps<PaymentMasterSetupPageProps> = async (
    context
) => {
    let initialParamas: PaymentMasterSetupPageProps = {
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

