import AddParent from "@/components/common/Parent/AddParent";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";

const AddParentPage = () => {
  useBreadcrumb({
    pageName: "Add New Parent",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Parents",
        link: "/admin/parents/parent-list",
      },
      {
        label: "Add Parent",
        link: "/admin/parents/add-parents",
      },
    ],
  });
  return (
    <>
      <Head>
        <title>Add Parent - Noorana</title>
      </Head>
      <div className="add_Class">
        <Container fluid>
          <Row>
            <Col md={12} lg={8}>
              <div className="db_heading_block">
                <h1 className="db_heading">Parent/Guardian 1 Details</h1>
              </div>
              <div className="formBlock">
                <AddParent registrationCode={""}/>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AddParentPage;
