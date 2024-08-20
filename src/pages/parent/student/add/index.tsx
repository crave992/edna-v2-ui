import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import AddStudent from "@/components/common/Student/Add";

const AddStudentPage = () => {
  useBreadcrumb({
    pageName: "Add Student",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/parent/dashboard",
      },
      {
        label: "Child",
        link: "/parent/student/add",
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
              <AddStudent />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AddStudentPage;
