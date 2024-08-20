import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { Button, Col, FloatingLabel, Form, Image, Row } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import ErrorLabel from "../../CustomError/ErrorLabel";

import Loader from "../../Loader";
import StaffModel from "@/models/StaffModel";
import StaffValidationSchema from "@/validation/StaffValidationSchema";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { AxiosResponse } from "axios";
import StaffDto from "@/dtos/StaffDto";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import { JobTitleDto } from "@/dtos/JobTitleDto";
import { UserRoleDto } from "@/dtos/UserRoleDto";
import SalaryTypeDto from "@/dtos/SalaryTypeDto";
import {
  InPageAddUpdateActionType,
  InPageAddUpdateState,
  reducer,
} from "@/reducers/InPageAddUpdateAction";

interface StaffProps extends CommonProps {
  id: number;
}

const initialPageState: InPageAddUpdateState<StaffDto> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
};

const Staff: NextPage<StaffProps> = (props) => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<StaffDto>, initialPageState);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<StaffModel>({
    resolver: yupResolver(StaffValidationSchema),
    defaultValues: {
      id: 0,
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      // password: "",
      // confirmPassword: "",
      //empStartDate: new Date(),
      //salaryAmount: 0,
      description: "",
      jobTitleId: 0,
      systemRole: "",
      salaryTypeId: 0,
    },
  });

  const submitData = async (data: StaffModel) => {
    data.userName = data.email;
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof StaffModel];
      if (key === "profileImage") {
        formData.append(key, data?.[key][0]);
      } else {
        formData.append(key, value as string);
      }
    });

    const response = await unitOfService.StaffService.add(formData);

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 201 && response.data.data) {
      toast.success("Staff added successfully and activation email sent with an information to activate account");
      router.push("/admin/staff/");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchStaff = async (id: number) => {
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    let response = await unitOfService.StaffService.getBasicDetailById(id);
    if (response && response.status === 200 && response.data.data) {
      const staff = response.data.data;

      dispatch({
        type: InPageAddUpdateActionType.SHOW_LOADER,
        payload: false,
      });

      dispatch({
        type: InPageAddUpdateActionType.SET_DATA,
        payload: staff,
      });
    }
  };

  const [jobTitles, setJobTitle] = useState<JobTitleDto[]>([]);
  const fetchJobTitle = async () => {
    const response = await unitOfService.JobTitleService.getAllForDropDown();
    if (response && response.status === 200 && response.data.data) {
      setJobTitle(response.data.data);
    }
  };

  const [roles, setRoles] = useState<UserRoleDto[]>([]);
  const fetchUserRole = async () => {
    const response = await unitOfService.UserRoleService.getAll("");
    if (response && response.status === 200 && response.data.data) {
      setRoles(response.data.data);
    }
  };

  const [salaryType, setSalaryType] = useState<SalaryTypeDto[]>([]);
  const fetchSalaryType = async () => {
    const response = await unitOfService.SalaryTypeService.getAll();
    if (response && response.status === 200 && response.data.data) {
      setSalaryType(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchJobTitle();
      await fetchUserRole();
      await fetchSalaryType();
    })();
  }, []);

  const [imageSource, setImageSource] = useState("");
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSource(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Form
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit(submitData)}
      >
        <Form.Control type="hidden" {...register("id")} />
        <Row>
          <Col md={6} lg={6} className="mb-3">
            <div className="imageUpload">
              {imageSource && (
                <Image
                  alt=""
                  fluid
                  style={{ maxWidth: "100px" }}
                  src={imageSource}
                />
              )}
              <Form.Control
                type="file"
                {...register("profileImage")}
                readOnly
                onChange={handleImageChange}
              />
            </div>
            {errors.profileImage && (
              <ErrorLabel message={errors.profileImage.message} />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6} lg={4}>
            <FloatingLabel label="" className="mb-3">
              <CustomSelect
                name="title"
                control={control}
                placeholder="Title*"
                isSearchable={true}
                options={[
                  { label: "Mr.", value: "Mr." },
                  { label: "Mrs.", value: "Mrs." },
                  { label: "Ms.", value: "Ms." },
                ]}
                textField="label"
                valueField="value"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="First Name*" className="mb-3">
              <CustomInput
                control={control}
                name="firstName"
                placeholder="First Name*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="Last Name*" className="mb-3">
              <CustomInput
                control={control}
                name="lastName"
                placeholder="Last Name*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="Email*" className="mb-3">
              <CustomInput
                control={control}
                name="email"
                placeholder="Email*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="" className="mb-3">
              <CustomSelect
                name="systemRole"
                control={control}
                placeholder="Role*"
                isSearchable={true}
                options={roles}
                textField="name"
                valueField="id"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="" className="mb-3">
              <CustomSelect
                name="jobTitleId"
                control={control}
                placeholder="Job Title*"
                isSearchable={true}
                options={jobTitles}
                textField="name"
                valueField="id"
              />
            </FloatingLabel>
          </Col>

          <Col md={6} lg={4}>
            <FloatingLabel label="" className="mb-3">
              <CustomInput
                type="datepicker"
                control={control}
                name="empStartDate"
                placeholder="Employment Start Date*"
                dateFormat="MM/dd/yyyy"
              />
            </FloatingLabel>
          </Col>

          <Col md={6} lg={4}>
            <FloatingLabel label="" className="mb-3">
              <CustomSelect
                name="salaryTypeId"
                control={control}
                placeholder="Salary Type*"
                isSearchable={true}
                options={salaryType}
                textField="name"
                valueField="id"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="Salary Amount*" className="mb-3">
              <CustomInput
                control={control}
                name="salaryAmount"
                placeholder="Salary Amount*"
              />
            </FloatingLabel>
          </Col>

          <Col md={12} lg={12}>
            <FloatingLabel
              label="A simple description about the staff"
              className="mb-3"
            >
              <CustomInput
                control={control}
                type="textarea"
                name="description"
                placeholder="A simple description about the staff"
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Button type="submit" className="btn_main mx-1">
          Save
        </Button>
        <Button
          type="button"
          className="btn_border mx-1"
          onClick={() => {
            router.push("/admin/staff/");
          }}
        >
          Cancel
        </Button>
      </Form>
      {states.showLoader && <Loader />}
    </>
  );
};
export default Staff;
