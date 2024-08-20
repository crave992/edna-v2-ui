import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CommonProps from "@/models/CommonProps";
import { StaffEmergencyInfoModel } from "@/models/StaffModel";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { StaffEmergencyInfoValidationSchema } from "@/validation/StaffValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import { Button, Row, Col, FloatingLabel, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
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

interface EmergencyInfoProps extends CommonProps {}

const EmergencyInfo: NextPage<EmergencyInfoProps> = () => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(
    reducer<StaffEmergencyInfoDto>,
    initialPageState
  );

  const fetchEmergencyInfo = async () => {
    const response = await unitOfService.StaffService.getEmergencyInfo();
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

  const { formState, handleSubmit, register, setValue, control } =
    useForm<StaffEmergencyInfoModel>({
      resolver: yupResolver(StaffEmergencyInfoValidationSchema),
      defaultValues: {
        whatToDoInCaseOfEmergency: "",
        preferredHospital: "",
        doctorInformation: "",
        phoneNumber: "",
      },
    });

  const submitData = async (formData: StaffEmergencyInfoModel) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    let response = await unitOfService.StaffService.saveEmergencyInfo(formData);
    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Emergency info saved successfully");
      dispatch({
        type: InPageActionType.SHOW_LOADER,
        payload: false,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      <div className="emergency-info mb-4">
        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
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
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Button type="submit" className="btn_main">
            Save
          </Button>
        </Form>
      </div>
      {states.showLoader && <Loader />}
    </>
  );
};
export default EmergencyInfo;
