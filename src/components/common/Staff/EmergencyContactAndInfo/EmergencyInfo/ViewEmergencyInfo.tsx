import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffEmergencyInfoModel } from "@/models/StaffModel";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { StaffEmergencyInfoValidationSchema } from "@/validation/StaffValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import { Row, Col, FloatingLabel } from "react-bootstrap";
import { useForm } from "react-hook-form";
import CustomInput from "../../../CustomFormControls/CustomInput";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { StaffEmergencyInfoDto } from "@/dtos/StaffDto";
import Loader from "../../../Loader";

const initialPageState: InPageState<StaffEmergencyInfoDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

interface ViewEmergencyInfoProps {
  staffId: number;
}

const ViewEmergencyInfo: NextPage<ViewEmergencyInfoProps> = ({ staffId }) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(
    reducer<StaffEmergencyInfoDto>,
    initialPageState
  );

  const fetchEmergencyInfo = async () => {
    const response = await unitOfService.StaffService.getEmergencyInfoByStaffId(staffId);
    if (response && response.status === 200 && response.data.data) {
      let emergencyInfo = response.data.data;

      dispatch({
        type: InPageActionType.SET_DATA,
        payload: response.data.data,
      });

      setValue(
        "whatToDoInCaseOfEmergency",
        emergencyInfo.whatToDoInCaseOfEmergency || ""
      );
      setValue("preferredHospital", emergencyInfo.preferredHospital || "");
      setValue("doctorInformation", emergencyInfo.doctorInformation || "");
      setValue("phoneNumber", emergencyInfo.phoneNumber || "");
    }
  };

  useEffect(() => {
    (async () => {
      fetchEmergencyInfo();
    })();
  }, []);

  const { handleSubmit, register, setValue, control } =
    useForm<StaffEmergencyInfoModel>({
      resolver: yupResolver(StaffEmergencyInfoValidationSchema),
      defaultValues: {
        whatToDoInCaseOfEmergency: "",
        preferredHospital: "",
        doctorInformation: "",
        phoneNumber: "",
      },
    });  

  return (
    <>
      <div className="emergency-info mb-4">
        
          <Row className="mt-4">
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="What to do incase of an emergency?"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="whatToDoInCaseOfEmergency"
                  placeholder="What to do incase of an emergency?"
                  disabled={true}
                />
              </FloatingLabel>
            </Col>
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Preferred Hospital"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="preferredHospital"
                  placeholder="Preferred Hospital"
                  disabled={true}
                />
              </FloatingLabel>
            </Col>
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Doctor Info"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="doctorInformation"
                  placeholder="Doctor Info"
                  disabled={true}
                />
              </FloatingLabel>
            </Col>
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Phone Number"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="phoneNumber"
                  placeholder="Phone Number"
                  disabled={true}
                />
              </FloatingLabel>
            </Col>
          </Row>
       
      </div>
      {states.showLoader && <Loader />}
    </>
  );
};
export default ViewEmergencyInfo;
