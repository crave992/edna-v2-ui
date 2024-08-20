import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { Col, Row } from "react-bootstrap";
import ViewDegree from "./Degree/ViewDegree";
import ViewCertificate from "./Certificate/ViewCertificate";

interface ViewDegreeCertificatesProps extends CommonProps {
  staffId: number;
}

const ViewDegreeCertificates: NextPage<ViewDegreeCertificatesProps> = ({
  staffId,
}) => {
  return (
    <>
      <div className="formBlock">
        <Row>
          <Col xxl={6} className="mb-4">
            <ViewDegree staffId={staffId} />
          </Col>
          <Col xxl={6}>
            <ViewCertificate staffId={staffId} />
          </Col>
        </Row>
      </div>
    </>
  );
};
export default ViewDegreeCertificates;
