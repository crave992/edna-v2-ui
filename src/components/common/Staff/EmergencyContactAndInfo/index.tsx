import { Col, Row } from "react-bootstrap";
import EmergencyContact from "./EmergencyContact";
import EmergencyInfo from "./EmergencyInfo";
import MedicalCondition from "./MedicalCondition";

const EmergencyContactAndInfo = () => {
  return (
    <>
      <div className="emergency_info_page">
        <Row>
          <Col xl={12} xxl={12}>
            <div className="formBlock">
              <EmergencyContact />
              <EmergencyInfo />
              <MedicalCondition />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default EmergencyContactAndInfo;
