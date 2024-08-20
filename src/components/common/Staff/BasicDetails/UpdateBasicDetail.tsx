import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CountryDto from "@/dtos/CountryDto";
import { EthnicityCategoryDto, EthnicityDto } from "@/dtos/EthnicityDto";
import StaffDto, { StaffCertifiedForLevelDto } from "@/dtos/StaffDto";
import StateDto from "@/dtos/StateDto";
import CommonProps from "@/models/CommonProps";
import { StaffUpdateBySelfModel } from "@/models/StaffModel";
import {
  InPageAddUpdateActionType,
  InPageAddUpdateState,
  reducer,
} from "@/reducers/InPageAddUpdateAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { StaffUpdateBySelfValidationSchema } from "@/validation/StaffValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useEffect, useReducer, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import Loader from "../../Loader";
import moment from "moment-timezone";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface UpdateBasicDetailProps extends CommonProps {}

const initialPageState: InPageAddUpdateState<StaffDto> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
};

const UpdateBasicDetail: NextPage<UpdateBasicDetailProps> = (props) => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const { update } = useSession();
  const [staffBasic, dispatch] = useReducer(
    reducer<StaffDto>,
    initialPageState
  );

  const {
    formState: { dirtyFields },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<StaffUpdateBySelfModel>({
    resolver: yupResolver(StaffUpdateBySelfValidationSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      description: "",
      addressLine1: "",
      addressLine2: "",
      countryId: 0,
      stateId: 0,
      city: "",
      zipcode: "",
      personalEmail: "",
      phoneNumber: "",
      ethnicityCategoryId: 0,
      ethnicityId: 0,
      timezoneId: "",
    },
  });

  const [levels, setLevel] = useState<StaffCertifiedForLevelDto[]>([]);
  const fetchStaffDetails = async () => {
    let response =
      await unitOfService.StaffService.getCurrentStaffBasicDetail();
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    if (response && response.status === 200 && response.data.data) {
      let staffDetail = response.data.data;

      dispatch({
        type: InPageAddUpdateActionType.SHOW_LOADER,
        payload: false,
      });

      setValue("title", staffDetail.title);
      setValue("firstName", staffDetail.firstName);
      setValue("lastName", staffDetail.lastName);
      setValue("description", staffDetail.description || "");
      setValue("addressLine1", staffDetail.addressLine1 || "");
      setValue("addressLine2", staffDetail.addressLine2 || "");
      setValue("countryId", staffDetail.countryId || 0);
      await fetchState(staffDetail.countryId || 0);
      setValue("stateId", staffDetail.stateId || 0);
      setValue("city", staffDetail.city || "");
      setValue("zipcode", staffDetail.zipcode || "");
      setValue("personalEmail", staffDetail.personalEmail || "");
      setValue("phoneNumber", staffDetail.phoneNumber || "");
      setValue("ethnicityCategoryId", staffDetail.ethnicityCategoryId || 0);
      await fetchEthnicity(staffDetail.ethnicityCategoryId || 0);
      setValue("ethnicityId", staffDetail.ethnicityId || 0);
      setLevel(staffDetail.certificationByLevel);
      setValue("timezoneId", staffDetail.timezoneId);
    }
  };

  const [pushRoute, setPushRoute] = useState<boolean>(false);
  const submitData = async (data: StaffUpdateBySelfModel) => {
    setPushRoute(true);
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof StaffUpdateBySelfModel];
      if (key === "profileImage") {
        // @ts-ignore: Unreachable code error
        formData.append(key, data?.[key][0]);
      } else if (key === "certifiedForLevels") {
        let finalValue = value;
        formData.append(key, JSON.stringify(finalValue));
      } else {
        formData.append(key, value as string);
      }
    });
    const response = await unitOfService.StaffService.updateBySelf(formData);

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Info updated successfully");

      update({ 
        fullName: response.data.data.firstName+' '+response.data.data.lastName,
      });

      localStorage.setItem("utz", data.timezoneId || "");
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

  const [ethnicityCategories, setEthnicityCategory] =
    useState<EthnicityCategoryDto[]>();
  const fetchEthnicityCategory = async () => {
    const response =
      await unitOfService.EthnicityService.getEthnicityCategory();
    if (response && response.status === 200 && response.data.data) {
      setEthnicityCategory(response.data.data);
    }
  };

  const [ethnicities, setEthnicity] = useState<EthnicityDto[]>();
  const fetchEthnicity = async (categoryId: number) => {
    const response =
      await unitOfService.EthnicityService.getEthnicityByCategoryId(categoryId);
    if (response && response.status === 200 && response.data.data) {
      setEthnicity(response.data.data);
    }
  };

  const [timezone, setTimeZone] = useState<{ label: string; value: string }[]>(
    []
  );

  useEffect(() => {
    (async () => {
      await fetchCountry();
      await fetchEthnicityCategory();
      await fetchStaffDetails();
    })();
  }, []);

  useEffect(() => {
    const timezones = moment.tz.names();
    const formattedTimezones = timezones.map((timezone) => {
      return {
        label: timezone,
        value: timezone,
      };
    });
    setTimeZone(formattedTimezones);
  }, []);

  useEffect(() => {
    const warningText = 'You have unsaved changes. Are you sure you want to leave this page?';

    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (Object.keys(dirtyFields).length == 0) return;
      e.preventDefault();

      return (e.returnValue = warningText);
    };

    const handleBrowseAway = () => {
      if ((Object.keys(dirtyFields).length > 0 && pushRoute) || Object.keys(dirtyFields).length == 0) return;
      if (window.confirm(warningText)) {
        router.events.off('routeChangeStart', handleBrowseAway);
        return;
      }
      router.events.emit('routeChangeError');

      throw 'routeChange aborted.';
    };

    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [dirtyFields, pushRoute]);

  return (
    <>
      <div className="formBlock">
        <h3 className="formBlock-heading">Basic Info</h3>
        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
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

            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Address Line 1"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="addressLine1"
                  placeholder="Address Line 1*"
                />
              </FloatingLabel>
            </Col>
            <Col md={6} lg={6}>
              <FloatingLabel
                controlId="floatingInput"
                label="Address Line 2"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="addressLine2"
                  placeholder="Address Line 2*"
                />
              </FloatingLabel>
            </Col>

            <Col md={6} lg={4}>
              <FloatingLabel
                controlId="floatingInput"
                label="City*"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="city"
                  placeholder="City*"
                />
              </FloatingLabel>
            </Col>

            <Col md={6} lg={4}>
              <FloatingLabel
                controlId="floatingInput"
                label="Zip"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="zipcode"
                  placeholder="Zip*"
                />
              </FloatingLabel>
            </Col>

            <Col md={6} lg={4} className="mb-3">
              <CustomSelect
                name="countryId"
                control={control}
                placeholder="Country*"
                isSearchable={true}
                options={countries}
                textField="name"
                valueField="id"
                onChange={async (option) => {
                  const selectedCountryId = +(option?.[0] || 0);
                  await fetchState(selectedCountryId);
                }}
              />
            </Col>
            <Col md={6} lg={4} className="mb-3">
              <CustomSelect
                name="stateId"
                control={control}
                placeholder="State*"
                isSearchable={true}
                options={states}
                textField="name"
                valueField="id"
              />
            </Col>

            <Col md={6} lg={4}>
              <FloatingLabel
                controlId="floatingInput"
                label="Personal Email"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="personalEmail"
                  placeholder="Personal Email"
                />
              </FloatingLabel>
            </Col>
            <Col md={6} lg={4}>
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

            <Col md={6} lg={4} className="mb-3">
              <CustomSelect
                name="ethnicityCategoryId"
                control={control}
                placeholder="Race"
                options={ethnicityCategories}
                isSearchable={true}
                textField="name"
                valueField="id"
                onChange={async (option) => {
                  const selectedEthnicityCategoryId = +(option?.[0] || 0);
                  await fetchEthnicity(selectedEthnicityCategoryId);
                }}
              />
            </Col>

            <Col md={6} lg={4} className="mb-3">
              <CustomSelect
                name="ethnicityId"
                control={control}
                placeholder="Ethnicity"
                options={ethnicities}
                isSearchable={true}
                textField="name"
                valueField="id"
              />
            </Col>

            <Col md={6} lg={4} className="mb-3">
              <CustomSelect
                name="timezoneId"
                control={control}
                placeholder="Timezone"
                options={timezone}
                isSearchable={true}
                textField="label"
                valueField="value"
              />
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={12}>
              <Form.Label>
                I am Certified to handle (Select one or more levels):
              </Form.Label>
              <Form.Group className="mb-3">
                {levels &&
                  levels.map((level) => (
                    <span key={level.levelId}>
                      <Form.Check
                        inline
                        label={level.levelName}
                        value={level.levelId}
                        type="checkbox"
                        id={`certifiedLevel_${level.levelId}`}
                        {...register("certifiedForLevels")}
                        defaultChecked={level.isCertified}
                      />
                    </span>
                  ))}
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" className="btn_main">
            Update
          </Button>
        </Form>
        {staffBasic.showLoader && <Loader />}
      </div>
    </>
  );
};
export default UpdateBasicDetail;
