import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
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
import { SecondParentModel } from "@/models/ParentModel";
import { SecondParentValidationSchema } from "@/validation/ParentValidationSchema";
import StateDto from "@/dtos/StateDto";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import CustomInput from "../../CustomFormControls/CustomInput";
import moment from "moment-timezone";

const AddSecondParent = () => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
  } = useForm<SecondParentModel>({
    resolver: yupResolver(SecondParentValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
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

  const [imageSource, setImageSource] = useState<string>("");
  const [states, setState] = useState<StateDto[]>();
  const fetchState = async (countryId: number) => {
    const response = await unitOfService.StateService.getByCountryId(countryId);
    if (response && response.status === 200 && response.data.data) {
      setState(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCountry();
    })();
  }, []);

  const submitData = async (data: SecondParentModel) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof SecondParentModel];
      if (key === "profileImage") {
        formData.append(key, data?.[key][0]);
      } else {
        formData.append(key, value as string);
      }
    });

    setShowLoader(true);
    let response = await unitOfService.ParentService.addSecondParent(formData);
    setShowLoader(false);
    if (response && response.status === 201 && response.data.data) {
      toast.success("Seond parent added successfully");
      router.push("/parent/dashboard");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

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
      <Form
        method="post"
        autoComplete="off"
        className="register_form"
        onSubmit={handleSubmit(submitData)}
      >
        <Row className="justify-content-center mb-2">
          <Col md={12} lg={10} xl={8}>
            <div className="formBlock account_profile">
              <div className="text-center">
                <h3>Add Second Parent</h3>
              </div>
            </div>
            <Col md={12}>
              <Form.Control
                type="file"
                {...register("profileImage")}
                id="profileImage"
                onChange={handleImageChange}
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
                    Account Information
                  </h3>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <FloatingLabel label="Username*">
                          <CustomInput
                            control={control}
                            name="userName"
                            placeholder="Username*"
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
                        <FloatingLabel label="Password*">
                          <CustomInput
                            type="password"
                            control={control}
                            name="password"
                            placeholder="Password*"
                          />
                        </FloatingLabel>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <FloatingLabel label="Confirm Password*">
                          <CustomInput
                            type="password"
                            control={control}
                            name="confirmPassword"
                            placeholder="Confirm Password*"
                          />
                        </FloatingLabel>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
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

                  <div className="text-center">
                    <Button type="submit" className="btn_main">
                      Add
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {showLoader && <Loader />}
      </Form>
    </>
  );
};

export default AddSecondParent;
