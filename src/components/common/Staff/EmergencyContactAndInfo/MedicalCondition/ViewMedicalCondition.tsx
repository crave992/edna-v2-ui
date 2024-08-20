import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffMedicalConditionModel } from "@/models/StaffModel";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { StaffMedicalConditionValidationSchema } from "@/validation/StaffValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useEffect, useReducer, useState } from "react";
import {
  Row,
  Col,
  FloatingLabel,
  Form,
  NavLink,
  Modal,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import CustomInput from "../../../CustomFormControls/CustomInput";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { StaffMedicalConditionDto } from "@/dtos/StaffDto";
import Loader from "../../../Loader";

const initialPageState: InPageState<StaffMedicalConditionDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

interface ViewMedicalConditionProps {
  staffId: number;
}

const ViewMedicalCondition: NextPage<ViewMedicalConditionProps> = ({
  staffId,
}) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(
    reducer<StaffMedicalConditionDto>,
    initialPageState
  );

  const fetchMedicalCondition = async () => {
    const response = await unitOfService.StaffService.getMedicalConditionByStaffId(staffId);
    if (response && response.status === 200 && response.data.data) {
      let medicalCondition = response.data.data;

      dispatch({
        type: InPageActionType.SET_DATA,
        payload: response.data.data,
      });

      setValue("conditionOne", medicalCondition.conditionOne || "");
      setValue("conditionTwo", medicalCondition.conditionTwo || "");
      setValue("medicineNames", medicalCondition.medicineNames || "");
      setValue("allergies", medicalCondition.allergies || "");
      setValue(
        "physicalImpairmentsNotes",
        medicalCondition.physicalImpairmentsNotes || ""
      );
      setValue("additionalComments", medicalCondition.additionalComments || "");
      setValue("acceptHippaTerms", medicalCondition.acceptHippaTerms);
    }
  };

  useEffect(() => {
    (async () => {
      fetchMedicalCondition();
    })();
  }, []);

  const { register, setValue, control } =
    useForm<StaffMedicalConditionModel>({
      resolver: yupResolver(StaffMedicalConditionValidationSchema),
      defaultValues: {
        conditionOne: "",
        conditionTwo: "",
        medicineNames: "",
        allergies: "",
        physicalImpairmentsNotes: "",
        additionalComments: "",
        acceptHippaTerms: false,
      },
    });  

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [hipaaInfo, setHipaaInfo] = useState<string>('');
  const fetchHipaaInfo = async () => {
    const response = await unitOfService.TermsAndPolicyService.getAll();
    if (response && response.status == 200 && response.data.data) {
      const hipaaContent = response.data.data;
      if (hipaaContent.hippa !== null) {
        setHipaaInfo(hipaaContent.hippa);
      } else {
        setHipaaInfo('');
      }
    }
  };

  useEffect(() => {
    (async () => {
      fetchHipaaInfo();
    })();
  }, []);

  return (
    <>
      <div className="medical-condition">
        <h3 className="formBlock-heading">Medical Conditions</h3>
        
          <Row className="mb-4">
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Condition 1"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="conditionOne"
                  placeholder="Condition 1"
                  disabled={true}
                />
              </FloatingLabel>
            </Col>
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Condition 2"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="conditionTwo"
                  placeholder="Condition 2"
                  disabled={true}
                />
              </FloatingLabel>
            </Col>
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Medicine Names"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="medicineNames"
                  placeholder="Medicine Names"
                  disabled={true}
                />
              </FloatingLabel>
            </Col>
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Allergies"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="allergies"
                  placeholder="Allergies"
                  disabled={true}
                />
              </FloatingLabel>
            </Col>
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Physical Impairments/Medical Conditions/Notes"
                className="mb-3"
              >
                <CustomInput
                  type="textarea"
                  textAreaRows={3}
                  control={control}
                  name="physicalImpairmentsNotes"
                  placeholder="Physical Impairments/Medical Conditions/Notes"
                  disabled={true}
                />
              </FloatingLabel>
            </Col>
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Additional Comments/Info"
                className="mb-3"
              >
                <CustomInput
                  type="textarea"
                  textAreaRows={3}
                  control={control}
                  name="additionalComments"
                  placeholder="Additional Comments/Info"
                  disabled={true}
                />
              </FloatingLabel>
            </Col>
            <Col md={12} lg={12}>
              <Form.Group className="">
                <Form.Check type="checkbox" id="checkbox">
                  <Form.Check.Input
                    type="checkbox"
                    {...register("acceptHippaTerms")}
                    disabled={true}
                  />
                  <Form.Check.Label>
                    I have read and understood the{" "}
                    <NavLink className="d-inline" onClick={handleShow}>
                      <strong>HIPPA</strong>
                    </NavLink>{" "}
                    and agree to abide by them
                  </Form.Check.Label>
                </Form.Check>
              </Form.Group>
            </Col>
          </Row>          
        
      </div>
      {states.showLoader && <Loader />}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>HIPAA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: hipaaInfo }}></div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ViewMedicalCondition;
