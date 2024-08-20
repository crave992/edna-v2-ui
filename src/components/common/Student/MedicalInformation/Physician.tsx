import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import { StudentPhysicianModel } from "@/models/StudentPhysicianModel";

import CountryDto from "@/dtos/CountryDto";
import { NextPage } from "next";
import { container } from "@/config/ioc";
import { useForm } from "react-hook-form";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useEffect, useReducer, useState } from "react";
import StateDto from "@/dtos/StateDto";

import { StudentPhysicianDto } from "@/dtos/StudentPhysicianDto";
import CommonProps from "@/models/CommonProps";
import {
  InPageAddUpdateActionType,
  InPageAddUpdateState,
  reducer,
} from "@/reducers/InPageAddUpdateAction";
import { StudentPhysicianValidationSchema } from "@/validation/StudentPhysicianValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/router";

const initialPageState: InPageAddUpdateState<StudentPhysicianDto> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
  isUpdating: false,
};

interface StudentPhysicianProps extends CommonProps {
  studentId: number;
  isDirty: boolean;
  setIsDirty: (_isDirty: boolean) => void;
}

const StudentPhysician: NextPage<StudentPhysicianProps> = ({ studentId, isDirty, setIsDirty }) => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [physicians, dispatch] = useReducer(
    reducer<StudentPhysicianDto>,
    initialPageState
  );

  const { handleSubmit, register, setValue, control, formState: { dirtyFields} } =
    useForm<StudentPhysicianModel>({
      resolver: yupResolver(StudentPhysicianValidationSchema),
      defaultValues: {
        studentId: studentId,
        name: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        countryId: 0,
        stateId: 0,
        city: "",
        zipcode: "",
        primaryInsuranceCenter: "",
        policyNumber: "",
      },
    });

  const fetchPhysicianDetails = async (studentId: number) => {
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StudentPhysicianService.getByStudentId(
      studentId
    );

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let physicianDetail = response.data.data;

      dispatch({
        type: InPageAddUpdateActionType.SHOW_LOADER,
        payload: false,
      });

      setValue("studentId", physicianDetail.studentId);
      setValue("name", physicianDetail.name);
      setValue("phoneNumber", physicianDetail.phoneNumber);
      setValue("addressLine1", physicianDetail.addressLine1 || "");
      setValue("addressLine2", physicianDetail.addressLine2 || "");
      setValue("countryId", physicianDetail.countryId || 0);
      await fetchState(physicianDetail.countryId || 0);
      setValue("stateId", physicianDetail.stateId || 0);
      setValue("city", physicianDetail.city || "");
      setValue("zipcode", physicianDetail.zipcode || "");
      setValue(
        "primaryInsuranceCenter",
        physicianDetail.primaryInsuranceCenter || ""
      );
      setValue("policyNumber", physicianDetail.policyNumber || "");
    }
  };

  const submitData = async (data: StudentPhysicianModel) => {
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StudentPhysicianService.save(data);

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Physician saved successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [countries, setCountry] = useState<CountryDto[]>();
  const fetchCountry = async () => {
    const response = await unitOfService.CountryService.getAll("");
    if (response && response.status === 200 && response.data.data) {
      setCountry(response.data.data);
    }
  };

  const [states, setState] = useState<StateDto[]>();
  const fetchState = async (countryId: number) => {
    const response = await unitOfService.StateService.getByCountryId(countryId);
    if (response && response.status === 200 && response.data.data) {
      setState(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchPhysicianDetails(studentId);
      await fetchCountry();
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(dirtyFields).length > 0) {
      setIsDirty(true);
    }
  }, [dirtyFields]);

  return (
    <>
      <Form
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit(submitData)}
      >
        <Form.Control type="hidden" {...register("studentId")} />
        <div className="formBlock">
          <Row>
            <Col md={12} lg={6}>
              <FloatingLabel label="Name*" className="mb-3">
                <CustomInput
                  control={control}
                  name="name"
                  placeholder="First Name*"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Phone Number*" className="mb-3">
                <CustomInput
                  control={control}
                  name="phoneNumber"
                  placeholder="Phone Number*"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Address Line 1*" className="mb-3">
                <CustomInput
                  control={control}
                  name="addressLine1"
                  placeholder="Address Line 1*"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Address Line 2" className="mb-3">
                <CustomInput
                  control={control}
                  name="addressLine2"
                  placeholder="Address Line 2"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="City*" className="mb-3">
                <CustomInput
                  control={control}
                  name="city"
                  placeholder="City*"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Zip*" className="mb-3">
                <CustomInput
                  control={control}
                  name="zipcode"
                  placeholder="Zip*"
                />
              </FloatingLabel>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <CustomSelect
                  name="countryId"
                  control={control}
                  placeholder="Country*"
                  options={countries}
                  isSearchable={true}
                  textField="name"
                  valueField="id"
                  onChange={async (option) => {
                    const selectedCountryId = +(option?.[0] || 0);
                    setValue("countryId", selectedCountryId);
                    setValue("stateId", 0);
                    await fetchState(selectedCountryId);
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <CustomSelect
                  name="stateId"
                  control={control}
                  placeholder="State*"
                  options={states}
                  isSearchable={true}
                  textField="name"
                  valueField="id"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Primary Insurance Carrier" className="mb-3">
                <CustomInput
                  control={control}
                  name="primaryInsuranceCenter"
                  placeholder="Primary Insurance Carrier"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Policy number" className="mb-3">
                <CustomInput
                  control={control}
                  name="policyNumber"
                  placeholder="Policy number"
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Button type="submit" className="btn_main mx-1">
            Save
          </Button>
          <Link
            href={`/students/info/${studentId}`}
            className="btn_border mx-1"
          >
            Cancel
          </Link>
        </div>
      </Form>
      {physicians.showLoader && <Loader />}
    </>
  );
};

export default StudentPhysician;
