import AddEmailSetting from "@/components/common/EmailSetting";
import AddParent from "@/components/common/Parent/AddParent";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";

const EmailSettingPage = () => {
    useBreadcrumb({
        pageName: "Email Setting",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Parents",
                link: "/admin/email-setting",
            },
        ],
    });
    return (
        <>
            <Head>
                <title>Email Setting - Noorana</title>
            </Head>
            <div className="add_Class">
                <Container fluid>
                    <Row>
                        <Col md={10} lg={6}>
                            <div className="db_heading_block">
                                <h1 className="db_heading">Configure Your Email</h1>
                            </div>
                            <div className="formBlock">
                                <AddEmailSetting />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default EmailSettingPage;
