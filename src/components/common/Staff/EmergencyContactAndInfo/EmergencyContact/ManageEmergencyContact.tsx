import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import { StaffEmergencyContactModel } from "@/models/StaffModel";
import { StaffEmergencyContactValidationSchema } from "@/validation/StaffValidationSchema";
import { StaffEmergencyContactDto } from "@/dtos/StaffDto";
import CustomInput from "../../../CustomFormControls/CustomInput";
import Loader from "../../../Loader";
import CustomSelect from "../../../CustomFormControls/CustomSelect";
import CountryDto from "@/dtos/CountryDto";
import StateDto from "@/dtos/StateDto";

const initialState: InModalState = {
  modalHeading: "Add Emergency Contact",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface ManageEmergencyContactProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const ManageEmergencyContact: NextPage<ManageEmergencyContactProps> = (
  props
) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchEmergencyContact = async (id: number) => {
    const response = await unitOfService.StaffEmergencyContactService.getById(
      id
    );
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let emergencyContact = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Emergency Contact",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
      setValue("id", emergencyContact.id);
      setValue("firstName", emergencyContact.firstName);
      setValue("lastName", emergencyContact.lastName || "");
      setValue("preferredName", emergencyContact.preferredName || "");
      setValue("relationship", emergencyContact.relationship || "");
      setValue("homeAddress", emergencyContact.homeAddress || "");
      setValue("workAddress", emergencyContact.workAddress || "");

      setValue("countryId", emergencyContact.countryId);
      await fetchState(emergencyContact.countryId);

      setValue("stateId", emergencyContact.stateId);
      setValue("city", emergencyContact.city);
      setValue("zipcode", emergencyContact.zipcode);
      setValue("email", emergencyContact.email || "");
      setValue("phone", emergencyContact.phone || "");
      setValue("priority", emergencyContact.priority || "");
    }
  };

  const [countries, setCountries] = useState<CountryDto[]>([]);
  const fetchCountry = async () => {
    const response = await unitOfService.CountryService.getAll("");
    if (response && response.status === 200 && response.data.data) {
      setCountries(response.data.data);
    }
  };

  const [statess, setStates] = useState<StateDto[]>([]);
  const fetchState = async (countryId: number) => {
    const response = await unitOfService.StateService.getByCountryId(countryId);
    if (response && response.status === 200 && response.data.data) {
      setStates(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchEmergencyContact(props.id);
        fetchCountry();
      }
    })();
  }, []);

  const { formState, handleSubmit, register, setValue, control } =
    useForm<StaffEmergencyContactModel>({
      resolver: yupResolver(StaffEmergencyContactValidationSchema),
      defaultValues: {
        id: 0,
        firstName: "",
        lastName: "",
        preferredName: "",
        relationship: "",
        homeAddress: "",
        workAddress: "",
        countryId: 0,
        stateId: 0,
        city: "",
        zipcode: "",
        email: "",
        phone: "",
        priority:"",
      },
    });

  const submitData = async (formData: StaffEmergencyContactModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<StaffEmergencyContactDto>>;
    if (states.isUpdate) {
      response = await unitOfService.StaffEmergencyContactService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.StaffEmergencyContactService.add(formData);
    }

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Emergency contact saved successfully");
      dispatch({
        type: InModalActionType.IS_REFRESH_REQUIRED,
        payload: true,
      });
      props.onClose(true);
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={() => {
          props.onClose(states.refreshRequired);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>{states.modalHeading}</Modal.Title>
        </Modal.Header>
        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
          <Form.Control type="hidden" {...register("id")} />
          <Modal.Body>
            <Row>
              <Col md={6} lg={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="First Name*"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    name="firstName"
                    placeholder="First Name*"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} lg={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Last Name"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    name="lastName"
                    placeholder="Last Name"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} lg={4}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Preferred Name"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    name="preferredName"
                    placeholder="Preferred Name"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} lg={4}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Relationship"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    name="relationship"
                    placeholder="Relationship"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group className="mb-3">
                  <FloatingLabel label="Select Priority">
                    <Form.Select
                      {...register("priority")}
                      
                    >
                      <option value="">Select Priority</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </Form.Select>
                  </FloatingLabel>
                </Form.Group>
                
              </Col>
              <Col md={6} lg={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Home Address*"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    name="homeAddress"
                    placeholder="Home Address*"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} lg={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Work Address"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    name="workAddress"
                    placeholder="Work Address*"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} lg={6}>
                <FloatingLabel label="" className="mb-3">
                  <CustomSelect
                    name="countryId"
                    control={control}
                    placeholder="Country*"
                    isSearchable={true}
                    onChange={async (option) => {
                      const selectedCountryId = +(option?.[0] || 0);
                      await fetchState(selectedCountryId);
                    }}
                    options={countries}
                    textField="name"
                    valueField="id"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} lg={6}>
                <FloatingLabel label="" className="mb-3">
                  <CustomSelect
                    name="stateId"
                    control={control}
                    placeholder="State*"
                    isSearchable={true}
                    options={statess}
                    textField="name"
                    valueField="id"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} lg={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="City*"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    name="city"
                    placeholder="city*"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} lg={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Zip*"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    name="zipcode"
                    placeholder="Zip*"
                  />
                </FloatingLabel>
              </Col>

              <Col md={6} lg={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    name="email"
                    placeholder="Email"
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} lg={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Phone*"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    name="phone"
                    placeholder="Phone*"
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_main orange_btn"
              onClick={() => {
                props.onClose(states.refreshRequired);
              }}
            >
              Close
            </Button>
            <Button className="btn_main" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {states.showLoader && <Loader />}
    </>
  );
};

export default ManageEmergencyContact;
