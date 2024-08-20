import { Col, Row } from "react-bootstrap";
import Certificate from "./Certificate";
import Degree from "./Degree";

const DegreeCertificates = () => {
  return (
    <>
      <div className="formBlock">
        <Row>
          <Col xxl={6} className="mb-4">
            <Degree />
          </Col>
          <Col xxl={6}>
            <Certificate />
          </Col>
        </Row>
      </div>
    </>
  );
};
export default DegreeCertificates;
