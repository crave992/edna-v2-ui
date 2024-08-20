import {
  Button,
  Col,
  FloatingLabel,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CountryDto from "@/dtos/CountryDto";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { useState, useEffect, ChangeEvent, useRef, useContext } from "react";
import { useRouter } from "next/router";
import Loader from "../common/Loader";
import { toast } from "react-toastify";
import { faKey } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ParentUpdateModel } from "@/models/ParentModel";
import { ParentUpdateValidationSchema } from "@/validation/ParentValidationSchema";
import { ParentDto } from "@/dtos/ParentDto";
import StateDto from "@/dtos/StateDto";
import CustomSelect from "../common/CustomFormControls/CustomSelect";
import CustomInput from "../common/CustomFormControls/CustomInput";
import moment from "moment-timezone";
import Avatar from "../common/Avatar";
import ImageCropperModal from "../common/ImageCropper";
import { useSession } from "next-auth/react";

const ParentUpdate = () => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const { data: session, update } = useSession();

  const {
    formState: { dirtyFields },
    handleSubmit,
    setValue,
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

  const { register: reg, setValue: setVal } =  useForm();
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

  const [imageSource, setImageSource] = useState("");
  const [currentUser, setCurrentUser] = useState<ParentDto>();
  const fetchCurrentUser = async () => {
    const response = await unitOfService.ParentService.getByCurrentUserId();
    if (response && response.status === 200 && response.data.data) {
      const currentUserDetails = response.data.data;
      setCurrentUser(currentUserDetails);

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
      await fetchCurrentUser();
    })();
  }, []);

  const [pushRoute, setPushRoute] = useState<boolean>(false);
  const submitData = async (data: ParentUpdateModel) => {
    setPushRoute(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof ParentUpdateModel];
      formData.append(key, value as string);
    });

    // new Response(formData).text().then(console.log)

    setShowLoader(true);
    let response = await unitOfService.ParentService.update(formData);
    setShowLoader(false);
    if (response && response.status === 200 && response.data.data) {
      toast.success("Profile updated successfully");
      localStorage.setItem("utz", data.timezoneId || "");

      update({ 
        fullName: response.data.data.firstName+' '+response.data.data.lastName,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
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

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [tempProfilePicture, setTempProfilePicture] = useState<string>('');
  const [maxFileError, setMaxFileError] = useState<boolean>(false);

  const handleImageSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setMaxFileError(true);
        setTempProfilePicture('');
        if (inputFileRef.current) {
          inputFileRef.current.value = '';
        }

        return;
      }
      setMaxFileError(false);
  
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (reader.result) {
          setProfilePicture(reader.result?.toString() || '');
        }
      });
      reader.readAsDataURL(file);
      setIsEditingProfilePicture(true);
    }
  };

  const onSavePicture = async (image: string) => {
    setVal("croppedImage", image);

    if (inputFileRef.current) {
        inputFileRef.current.value = '';
    }

    const formData = new FormData();
    formData.append("croppedImage", image as string);

    // new Response(formData).text().then(console.log)
    let response = await unitOfService.ParentService.updatePicture(formData);
    setShowLoader(false);
    if (response && response.status === 200 && response.data.data) {
      toast.success("Profile picture updated successfully");

      update({
        profilePicture: response.data.data.profilePicture,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }

    setImageSource(image);
    setIsEditingProfilePicture(false);
  };

  const onClosePictureModal = (_: unknown) => {
    setImageSource('');
    setIsEditingProfilePicture(false);

    if (inputFileRef.current) {
        inputFileRef.current.value = '';
    }
  };

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
      {currentUser && (
        <>
          <Form method="PUT">
            <Row className="justify-content-center mb-2">
              <Col md={12} lg={10} xl={8}>
                <div className="formBlock account_profile d-flex justify-content-between align-items-center p-4">
                  <div className="userDetailsMain">
                    <div className="tw-flex tw-items-center tw-mr-[15px]">
                      <Avatar imageSrc={imageSource || ''} size={100} name="croppedImage" edit={true}/>
                      <Form.Control
                        type="file"
                        accept=".jpg, .jpeg, .png, .heic, .bmp"
                        {...reg("croppedImage")}
                        id="croppedImage"
                        onChange={handleImageSelected}
                        style={{
                            display: 'none'
                        }}
                      />
                    </div>
                    <div className="userDetails">
                      <h2>
                        {session?.user.fullName}
                      </h2>
                    </div>
                  </div>
                  <div className="userActions">
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 50, hide: 100 }}
                      overlay={<Tooltip>Change Password</Tooltip>}
                    >
                      <Link
                        className="btn_main small"
                        href={"/account/change-password"}
                      >
                        <FontAwesomeIcon icon={faKey} size="1x" />
                      </Link>
                    </OverlayTrigger>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
          <Form
            method="post"
            autoComplete="off"
            className="register_form"
            onSubmit={handleSubmit(submitData)}
          >
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

                      <div className="text-center">
                        <Button type="submit" className="btn_main">
                          Update
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
      )}
      <Modal
        show={isEditingProfilePicture}
        size="lg"
        dialogClassName="modal-60w"
        onHide={() => setIsEditingProfilePicture(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
            <Modal.Title>Crop Profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageCropperModal
            picture={profilePicture}
            closeModal={onClosePictureModal}
            savePicture={onSavePicture}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ParentUpdate;
