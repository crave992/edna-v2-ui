import { Col, Row } from "react-bootstrap";
import { NextPage } from "next";
import ViewEmergencyContact from "./EmergencyContact/ViewEmergencyContact";
import ViewEmergencyInfo from "./EmergencyInfo/ViewEmergencyInfo";
import ViewMedicalCondition from "./MedicalCondition/ViewMedicalCondition";

interface ViewEmergencyContactAndInfoProps {
  staffId: number;
}

const ViewEmergencyContactAndInfo: NextPage<
  ViewEmergencyContactAndInfoProps
> = ({ staffId }) => {
  return (
    <>
      <div className="emergency_info_page">
        <Row>
          <Col xl={12} xxl={12}>
            <div className="formBlock">
              <ViewEmergencyContact staffId={staffId} />
              <ViewEmergencyInfo staffId={staffId} />
              <ViewMedicalCondition staffId={staffId} />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default ViewEmergencyContactAndInfo;
