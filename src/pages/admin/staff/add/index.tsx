
import Staff from "@/components/common/Staff/AddStaff";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Col, Container, ListGroup, Row } from "react-bootstrap";

interface AddStaffProps extends CommonProps {
}

const AddStaff: NextPage<AddStaffProps> = (props) => {
    useBreadcrumb({
        pageName: "Add New Staff",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Staff",
                link: "/admin/staff/",
            },
            {
                label: "Add Staff",
                link: "/admin/staff/add-staff",
            },
        ],
    });


    return (
        <>
            <Head>
                <title>Add Staff - Noorana</title>
            </Head>
            <div className="staff_list_page">
                <Container fluid>
                    <Row>
                        <Col md={12} lg={12} xl={9} xxl={8}>
                            <div className='db_heading_block'>
                                <h1 className='db_heading'>Add New Staff Member</h1>
                            </div>
                            <div className="formBlock">
                                <Staff id={0} />
                            </div>
                        </Col>
                    </Row>

                </Container>
            </div>
        </>
    )
}
export default AddStaff;

