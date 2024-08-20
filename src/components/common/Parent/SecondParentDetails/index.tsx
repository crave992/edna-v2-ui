import {
  Button,
  Col,
  FloatingLabel,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
  Image,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CountryDto from "@/dtos/CountryDto";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Loader from "../../Loader";
import { toast } from "react-toastify";
import { ParentUpdateModel } from "@/models/ParentModel";
import { ParentUpdateValidationSchema } from "@/validation/ParentValidationSchema";
import StateDto from "@/dtos/StateDto";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import CustomInput from "../../CustomFormControls/CustomInput";
import moment from "moment-timezone";
import { ParentDto } from "@/dtos/ParentDto";
import {
  faCamera,
  faKey,
  faPlusCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import ErrorLabel from "../../CustomError/ErrorLabel";

const SecondParentDetails = () => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
  } = useForm<ParentUpdateModel>({
    resolver: yupResolver(ParentUpdateValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      cellPhone: "",
      employer: "",
      homePhone: "",
      position: "",
      ssn: "",
      workEmail: "",
      addressLine1: "",
      addressLine2: "",
      countryId: 0,
      stateId: 0,
      city: "",
      zipcode: "",
      timezoneId: "",
    },
  });

  const [showLoader, setShowLoader] = useState<boolean>(false);

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

  const [mainParentId, setMainParentId] = useState<number>(0);
  const [imageSource, setImageSource] = useState("");
  const [currentUser, setCurrentUser] = useState<ParentDto>();
  const fetchSecondParentDetails = async () => {
    const response = await unitOfService.ParentService.getSecondParentDetails();
    if (response && response.status === 200 && response.data.data) {
      const currentUserDetails = response.data.data;
      setCurrentUser(currentUserDetails);
      setMainParentId(currentUserDetails.parentId ?? 0);
      setValue("email", currentUserDetails.email);
      setValue("firstName", currentUserDetails.firstName);
      setValue("lastName", currentUserDetails.lastName);
      setValue("cellPhone", currentUserDetails.cellPhone || "");
      setValue("workEmail", currentUserDetails.workEmail || "");
      setValue("employer", currentUserDetails.employer || "");
      setValue("position", currentUserDetails.position || "");
      setValue("ssn", currentUserDetails.ssn || "");

      setValue("timezoneId", currentUserDetails.timezoneId || "");
      setValue("addressLine1", currentUserDetails.addressLine1 || "");
      setValue("addressLine2", currentUserDetails.addressLine2 || "");
      setValue("countryId", currentUserDetails.countryId || 0);
      setValue("stateId", currentUserDetails.stateId || 0);
      await fetchState(currentUserDetails.countryId || 0);

      setValue("city", currentUserDetails.city || "");
      setValue("zipcode", currentUserDetails.zipcode || "");
      setImageSource(currentUserDetails.profilePicture || "");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCountry();
      await fetchSecondParentDetails();
    })();
  }, []);

  const [timezone, setTimeZone] = useState<{ label: string; value: string }[]>(
    []
  );

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

  return (
    <>
      <Row className="justify-content-center mb-2">
        <Col md={12} lg={10} xl={8}>
          <div className="formBlock account_profile d-flex justify-content-between align-items-center p-4">
            <div className="text-center">
              <h3>Second Parent Details</h3>
            </div>

            {!currentUser && (
              <div className="userActions">
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 50, hide: 100 }}
                  overlay={<Tooltip>Add Second Parent</Tooltip>}
                >
                  <Link
                    className="btn_main small"
                    href={"/parent/second-parent/add"}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} size="1x" />
                  </Link>
                </OverlayTrigger>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {currentUser && (
        <>
          <Row className="justify-content-center mb-2">
            <Col md={12} lg={10} xl={8}>
              <div className="formBlock account_profile d-flex justify-content-between align-items-center p-4">
                <div className="userDetailsMain">
                  <div className="userAvatar">
                    {imageSource && (
                      <Image
                        alt=""
                        fluid
                        style={{ maxWidth: "100px" }}
                        src={imageSource}
                      />
                    )}
                    <div className="edit_avatar">
                      <Form.Label htmlFor="profileImage">
                        <FontAwesomeIcon icon={faCamera} size="1x" />
                      </Form.Label>
                    </div>
                  </div>
                  <div className="userDetails">
                    <h2>
                      {currentUser.firstName} {currentUser.lastName}
                    </h2>
                  </div>
                </div>
              </div>
              {errors.profileImage && (
                <ErrorLabel message={errors.profileImage.message} />
              )}
              <Col md={12}>
                <Form.Control
                  type="file"
                  {...register("profileImage")}
                  id="profileImage"
                  style={{
                    opacity: 0,
                    pointerEvents: "none",
                    width: "0px",
                    height: "0px",
                  }}
                />
              </Col>
            </Col>
          </Row>

          <Row className="justify-content-center mb-5">
            <Col md={12} lg={10} xl={8}>
              <div className="formBlock">
                <Row>
                  <Col md={12}>
                    <h3 className="formBlock-heading text-left mt-3">
                      Basic Details
                    </h3>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="First Name*">
                            <CustomInput
                              control={control}
                              name="firstName"
                              placeholder="First Name*"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Last Name*">
                            <CustomInput
                              control={control}
                              name="lastName"
                              placeholder="Last Name*"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Email*">
                            <CustomInput
                              control={control}
                              name="email"
                              placeholder="Email*"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Work Email">
                            <CustomInput
                              control={control}
                              name="workEmail"
                              placeholder="Work Email"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Cell Phone*">
                            <CustomInput
                              control={control}
                              name="cellPhone"
                              placeholder="Cell Phone*"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Home Phone">
                            <CustomInput
                              control={control}
                              name="homePhone"
                              placeholder="Home Phone"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Employer">
                            <CustomInput
                              control={control}
                              name="employer"
                              placeholder="Employer"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Position">
                            <CustomInput
                              control={control}
                              name="position"
                              placeholder="Position"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="SSN">
                            <CustomInput
                              control={control}
                              name="ssn"
                              placeholder="SSN"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <CustomSelect
                            name="timezoneId"
                            control={control}
                            placeholder="Timezone"
                            options={timezone}
                            isSearchable={true}
                            textField="label"
                            valueField="value"
                            onChange={async (option) => {
                              const selectedTimeZone = (
                                option?.[0] || ""
                              ).toString();
                              setValue("timezoneId", selectedTimeZone);
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col md={12}>
                    <h3 className="formBlock-heading text-left mt-3">
                      Contact Details
                    </h3>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Address Line 1*">
                            <CustomInput
                              control={control}
                              name="addressLine1"
                              placeholder="Address Line 1*"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Address Line 2">
                            <CustomInput
                              control={control}
                              name="addressLine2"
                              placeholder="Address Line 2"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <CustomSelect
                            name="countryId"
                            control={control}
                            placeholder="Country"
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
                            placeholder="State"
                            options={states}
                            isSearchable={true}
                            textField="name"
                            valueField="id"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="City*">
                            <CustomInput
                              control={control}
                              name="city"
                              placeholder="City*"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Zipcode*">
                            <CustomInput
                              control={control}
                              name="zipcode"
                              placeholder="Zipcode*"
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {showLoader && <Loader />}
        </>
      )}
    </>
  );
};

export default SecondParentDetails;
