

import AddClassPage from "@/components/common/Class/AddClass";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Col, Container, ListGroup, Row } from "react-bootstrap";

interface AddClassProps extends CommonProps {
}



const AddClass: NextPage<AddClassProps> = (props) => {
    useBreadcrumb({
        pageName: "Add New Class",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Class",
                link: "/admin/class/",
            },
            {
                label: "Add Class",
                link: "/admin/staff/add",
            },
        ],
    });


    return (
        <>
            <Head>
                <title>Add Class - Noorana</title>
            </Head>
            <div className="staff_list_page">
                <Container fluid>
                    <Row>
                        <Col md={12} lg={10} xl={8}>
                            <div className='db_heading_block'>
                                <h1 className='db_heading'>Add New Class</h1>
                            </div>
                            <div className="formBlock">
                                <AddClassPage id={0}/>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </div>
        </>
    )
}
export default AddClass;

