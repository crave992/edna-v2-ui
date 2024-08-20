import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import AddStudentInitial from "../../../components/common/Student/AddInitial";
import AddStudent from "../../../components/common/Student/Add";

const AddStudentPage = () => {
  useBreadcrumb({
    pageName: "Add Student",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/admin/dashboard",
      },
      {
        label: "Students",
        link: "/students",
      },
    ],
  });

  return (
    <>
      <Head>
        <title>Add Student - Noorana</title>
      </Head>
      <div className="add_student_page">
        <Container fluid>
          <Row className="justify-content-center mb-2">
            <Col md={12} lg={10} xl={8}>
              <AddStudentInitial />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AddStudentPage;
