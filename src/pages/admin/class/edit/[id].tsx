
import AddClassPage from "@/components/common/Class/AddClass";
import Staff from "@/components/common/Staff/AddStaff";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import StaffListParams from "@/params/StaffListParams";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Col, Container, ListGroup, Row } from "react-bootstrap";

interface EditClassProps extends CommonProps {
    id: number;
}



const EditClass: NextPage<EditClassProps> = (props) => {
    useBreadcrumb({
        pageName: "Edit Class",
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
                label: "Edit Class",
                link: `/admin/class/edit/${props.id}`,
            },
        ],
    });

    return (
        <>
            <Head>
                <title>Edit Class - Noorana</title>
            </Head>
            <div className="staff_list_page">
                <Container fluid>
                    <Row>
                        <Col md={8} lg={9}>
                            <div className='db_heading_block'>
                                <h1 className='db_heading'>Edit Class</h1>
                            </div>
                            <div className="formBlock">
                                <AddClassPage id={props.id}/>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </div>
        </>
    )
}
export default EditClass;

export const getServerSideProps: GetServerSideProps<
    EditClassProps
> = async (context) => {
    let initialParamas: EditClassProps = {
        id: +(context.query.id || 0),
    };

    return {
        props: initialParamas,
    };
};