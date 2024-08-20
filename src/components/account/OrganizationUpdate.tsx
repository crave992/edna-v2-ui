import { NextPage } from "next";
import {
  Button,
  Col,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import CommonProps from "@/models/CommonProps";
import { useForm } from "react-hook-form";
import { OrganizationUpdateModel } from "@/models/OrganizationModel";
import { OrganizationUpdateValidationSchema } from "@/validation/OrganizationValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CountryDto from "@/dtos/CountryDto";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { useState, useEffect, ChangeEvent, useRef, useContext } from "react";
import { useRouter } from "next/router";
import Loader from "../common/Loader";
import { toast } from "react-toastify";
import OrganisationBasicDetailsUpdate from "../common/Organisation/BasicDetailsUpdate";
import OrganisationAddressUpdate from "../common/Organisation/AddressUpdate";
import OrganisationPrimaryContactUpdate from "../common/Organisation/PrimaryContactUpdate";
import { OrganizationDto } from "@/dtos/OrganizationDto";
import { faKey } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { OrganizationPrimaryContactModel } from "@/models/OrganizationPrimaryContactModel";
import ErrorLabel from "../common/CustomError/ErrorLabel";
import Avatar from "../common/Avatar";
import ImageCropperModal from "../common/ImageCropper";
import { useSession } from "next-auth/react";

interface OrganizationUpdateProps extends CommonProps {}

const OrganizationUpdate: NextPage<OrganizationUpdateProps> = () => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const { update } = useSession();

  const {
    formState: { errors, dirtyFields },
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
  } = useForm<OrganizationUpdateModel>({
    resolver: yupResolver(OrganizationUpdateValidationSchema),
    defaultValues: {
      schoolName: "",
      schoolEmail: "",
      phoneNumber: "",
      organizationTypeId: 0,
      websiteUrl: "",
      about: "",
      addressLine1: "",
      addressLine2: "",
      countryId: 0,
      stateId: 0,
      city: "",
      zipcode: "",
      timezoneId: "",
      currencyCode: "",
      croppedImage: "",
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

  const [imageSource, setImageSource] = useState("");
  const [currentUser, setCurrentUser] = useState<OrganizationDto>();
  const fetchCurrentUser = async () => {
    const response =
      await unitOfService.OrganizationService.getByCurrentUserId();
    if (response && response.status === 200 && response.data.data) {
      const currentUserDetails = response.data.data;
      setCurrentUser(currentUserDetails);
      setValue("schoolName", currentUserDetails.schoolName);
      setValue("schoolEmail", currentUserDetails.schoolEmail);
      setValue("phoneNumber", currentUserDetails.phoneNumber);
      setValue("organizationTypeId", currentUserDetails.organizationTypeId || 0);
      setValue("websiteUrl", currentUserDetails.websiteUrl);
      setValue("about", currentUserDetails.about);
      setValue("timezoneId", currentUserDetails.timezoneId);
      setValue("addressLine1", currentUserDetails.addressLine1);
      setValue("addressLine2", currentUserDetails.addressLine2);
      setValue("countryId", currentUserDetails.countryId);
      setValue("stateId", currentUserDetails.stateId);
      setValue("city", currentUserDetails.city);
      setValue("zipcode", currentUserDetails.zipcode);
      setValue("primaryContact", currentUserDetails.primaryContact);
      setValue("currencyCode", currentUserDetails.currencyCode);
      setImageSource(currentUserDetails.profilePicture);
    }
  }; 

  useEffect(() => {
    (async () => {
      await fetchCountry();
      await fetchCurrentUser();
    })();
  }, []);

  const [pushRoute, setPushRoute] = useState<boolean>(false);
  const submitData = async (data: OrganizationUpdateModel) => {
    setPushRoute(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof OrganizationUpdateModel];
      if (key === "primaryContact") {
        Object.keys(data.primaryContact).forEach((primaryContactKey) => {
          const primaryContactValue =
            data.primaryContact[
              primaryContactKey as keyof OrganizationPrimaryContactModel
            ];
          formData.append(
            `primaryContact.${primaryContactKey}`,
            primaryContactValue as string
          );
        });
      } else {
        formData.append(key, value as string);
      }
    });

    setShowLoader(true);
    let response = await unitOfService.OrganizationService.update(formData);
    setShowLoader(false);
    if (response && response.status === 200 && response.data.data) {
      toast.success("Profile updated successfully");

      update({ 
        fullName: response.data.data.schoolName,
      });
      await fetchCurrentUser();
      
      localStorage.setItem("utz", data.timezoneId || "");
      localStorage.setItem("curCode", data.currencyCode || "USD");

      //get locales based on coutryid
      const countryResponse = await unitOfService.CountryService.getById(data.countryId);
      if(countryResponse && countryResponse.status === 200 && countryResponse.data.data){
        localStorage.setItem("locales", countryResponse.data.data.locales || "en-US");
      }

    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

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
    let response = await unitOfService.OrganizationService.updatePicture(formData);
    setShowLoader(false);
    if (response && response.status === 200 && response.data.data) {
      toast.success("Profile picture updated successfully");

      update({
        profilePicture: response.data.data.profilePicture,
      })
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
                <div className="formBlock account_profile d-flex justify-content-between align-items-center p-4 mb-0">
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
                      <h2>{currentUser.schoolName}</h2>
                      <p>
                        Registration Date:{" "}
                        {unitOfService.DateTimeService.convertToLocalDate(
                          currentUser.registerDate
                        )}
                      </p>
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
                {errors.schoolLogo && (
                  <ErrorLabel message={errors.schoolLogo.message} />
                )}
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
                      <OrganisationBasicDetailsUpdate
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        getValues={getValues}
                        control={control}
                      />
                      <OrganisationAddressUpdate
                        register={register}
                        errors={errors}
                        countries={countries}
                        setValue={setValue}
                        getValues={getValues}
                        control={control}
                      />
                      <OrganisationPrimaryContactUpdate
                        register={register}
                        errors={errors}
                        countries={countries}
                        setValue={setValue}
                        getValues={getValues}
                        control={control}
                      />

                      <span className="text-center">
                        <Button type="submit" className="btn_main">
                          Update
                        </Button>
                      </span>
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

export default OrganizationUpdate;
