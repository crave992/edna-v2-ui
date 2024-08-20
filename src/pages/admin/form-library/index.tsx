import useBreadcrumb from "@/hooks/useBreadcrumb";
import { faQuestionCircle, faScreenUsers} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";

const FormLibraryPage: NextPage = (props) => {
    useBreadcrumb({
        pageName: "Form Library",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Form Library",
                link: "/admin/form-library",
            },
        ],
    });

    return (
        <>
            <Head>
                <title>Form Library - Noorana</title>
            </Head>

            <div className="home_page">
                <Container fluid>
                    <Row>
                        <Col>
                            <div className="db_heading_block">
                                <h1 className="db_heading">Student Forms</h1>
                            </div>
                        </Col>
                    </Row>
                    <Row xs={1} md={2} lg={3} xl={4} xxl={4} className="mb-4">
                        <Col>
                            <div className="db_data_overview_each small_box">
                                <div className="dataName">
                                    <span>Student Forms</span>
                                </div>
                                <Link href={"/admin/student-form"} className="dataPageUrl">
                                    View/Add
                                </Link>
                                <FontAwesomeIcon icon={faScreenUsers} />
                            </div>
                        </Col>
                        <Col>
                            <div className="db_data_overview_each small_box">
                                <div className="dataName">
                                    <span>Student Questions</span>
                                </div>
                                <Link href={"/admin/student-questions"} className="dataPageUrl">
                                    View/Add
                                </Link>
                                <FontAwesomeIcon icon={faQuestionCircle} />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="db_heading_block">
                                <h1 className="db_heading">Staff Forms</h1>
                            </div>
                        </Col>
                    </Row>
                    <Row xs={2} md={3} lg={4} xl={5} className="mb-4">
                        <Col>
                            <div className="db_data_overview_each small_box">
                                <div className="dataName">
                                    <span>Employment Forms</span>
                                </div>
                                <Link href={"/admin/employment-form"} className="dataPageUrl">
                                    View/Add
                                </Link>
                                <FontAwesomeIcon icon={faScreenUsers} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default FormLibraryPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {},
    };
};
