import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import ProgramOptionDto from "@/dtos/ProgramOptionDto";
import ProgramOptionParams from "@/params/ProgramOptionParams";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faQuestionCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import {
  Form,
  Row,
  Col,
  FloatingLabel,
  FormLabel,
  NavLink,
  Button,
  Modal,
  Table,
} from "react-bootstrap";
import numeral from "numeral";
import Link from "next/link";
import {
  InPageAddUpdateActionType,
  InPageAddUpdateState,
  reducer,
} from "@/reducers/InPageAddUpdateAction";
import { StudentDto } from "@/dtos/StudentDto";
import { useForm } from "react-hook-form";
import {
  StudentBeforeAndAfterSchoolCareModel,
  StudentModel,
} from "@/models/StudentModel";
import { StudentUpdateValidationSchema } from "@/validation/StudentValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "../../CustomFormControls/CustomInput";
import ErrorLabel from "../../CustomError/ErrorLabel";
import CustomFormError from "../../CustomFormControls/CustomFormError";
import LevelDto from "@/dtos/LevelDto";
import StateDto from "@/dtos/StateDto";
import CountryDto from "@/dtos/CountryDto";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Loader from "../../Loader";
import ImageCropperModal from "../../ImageCropper";
import Avatar from "../../Avatar";

const initialPageState: InPageAddUpdateState<StudentDto> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
};

interface UpdateStudentPageParams {
  student: StudentDto;
}

const UpdateStudent: NextPage<UpdateStudentPageParams> = ({ student }) => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<StudentDto>, initialPageState);

  const {
    formState: { errors, dirtyFields },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<StudentModel>({
    resolver: yupResolver(StudentUpdateValidationSchema),
    defaultValues: {
      id: student.id,
      firstName: student.firstName || "",
      middleName: student.middleName || "",
      lastName: student.lastName || "",
      dob: new Date(
        unitOfService.DateTimeService.convertToLocalDate(student.dateOfBirth)
      ),
      gender: student.gender || "",
      levelId: student.levelId,
      programOptionId: student.programOptionId,
      addressLine1: student.addressLine1 || "",
      addressLine2: student.addressLine2 || "",
      countryId: student.countryId || 0,
      stateId: student.stateId || 0,
      city: student.city || "",
      zipcode: student.zipcode || "",
      hobbies: student.hobbies || "",
      achievements: student.achievements || "",
      likes: student.likes || "",
      dislikes: student.dislikes || "",
      strengths: student.strengths || "",
      areasOfNeededGrowth: student.areasOfNeededGrowth || "",
      siblingAtSchool: student.siblingAtSchool || false,
      includeInformationInDirectory:
        student.includeInformationInDirectory || false,
      isBeforeAndAfterSchoolCareRequire:
        student.isBeforeAndAfterSchoolCareRequire === true ? "true" : "false",
      beforeAndAfterSchoolCare: {
        monday: student.beforeAndAfterSchoolCare?.monday || false,
        tuesday: student.beforeAndAfterSchoolCare?.tuesday || false,
        wednesday: student.beforeAndAfterSchoolCare?.wednesday || false,
        thursday: student.beforeAndAfterSchoolCare?.thursday || false,
        friday: student.beforeAndAfterSchoolCare?.friday || false,
        fromTime: student.beforeAndAfterSchoolCare?.fromTime || "",
        toTime: student.beforeAndAfterSchoolCare?.toTime || "",
      },
    },
  });

  const { register: reg, setValue: setVal } = useForm();
  const [pushRoute, setPushRoute] = useState<boolean>(false);
  const submitData = async (data: StudentModel) => {
    setPushRoute(true);
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof StudentModel];
      if (key === "beforeAndAfterSchoolCare") {
        Object.keys(data.beforeAndAfterSchoolCare).forEach(
          (beforeAndAfterSchoolCareKey) => {
            const beforeAndAfterSchoolCareValue =
              data.beforeAndAfterSchoolCare[
                beforeAndAfterSchoolCareKey as keyof StudentBeforeAndAfterSchoolCareModel
              ];
            formData.append(
              `beforeAndAfterSchoolCare.${beforeAndAfterSchoolCareKey}`,
              beforeAndAfterSchoolCareValue as string
            );
          }
        );
      } else {
        formData.append(key, value as string);
      }
    });

    // new Response(formData).text().then(console.log)

    const response = await unitOfService.StudentService.update(data.id, formData);
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      toast.success("Student bio updated successfully");
      router.push(`/parent/student/profile/${student.id}`);
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [showProgramOptionPopUp, setShowProgramOptionPopUp] = useState(false);
  const [showProgramOptionContainer, setShowProgramOptionContainer] =
    useState(false);
  const [programOptions, setProgramOptions] = useState<ProgramOptionDto[]>([]);
  const fetchProgramOption = async (levelId: number) => {
    const filterOption: ProgramOptionParams = {
      levelId: levelId,
      page: 1,
      q: "",
      recordPerPage: 1000,
      sortBy: "name",
      sortDirection: "asc",
    };
    const response = await unitOfService.ProgramOptionService.getAll(
      filterOption
    );
    if (response && response.status === 200 && response.data.data) {
      setProgramOptions(response.data.data?.programOptions || []);
    }
  };

  const [showDirectoryCodeOfConductPopUp, setShowDirectoryCodeOfConductPopUp] =
    useState(false);
  const [directoryCodeOfConduct, setDirectoryCodeOfConduct] =
    useState<string>("");
  const fetchCodeOfConduct = async () => {
    const response = await unitOfService.TermsAndPolicyService.getAll();
    if (response && response.status == 200 && response.data.data) {
      const codeOfConduct = response.data.data;
      if (codeOfConduct.directoryCodeOfConduct) {
        setDirectoryCodeOfConduct(codeOfConduct.directoryCodeOfConduct);
      } else {
        setDirectoryCodeOfConduct("");
      }
    }
  };

  const [levels, setLevels] = useState<LevelDto[]>([]);
  const fetchLevel = async () => {
    const response = await unitOfService.LevelService.getAll();
    if (response && response.status == 200 && response.data.data) {
      setLevels(response.data.data);
    }
  };

  const [countries, setCountry] = useState<CountryDto[]>();
  const fetchCountry = async () => {
    const response = await unitOfService.CountryService.getAll("");
    if (response && response.status === 200 && response.data.data) {
      setCountry(response.data.data);
    }
  };

  const [state, setState] = useState<StateDto[]>();
  const fetchState = async (countryId: number) => {
    const response = await unitOfService.StateService.getByCountryId(countryId);
    if (response && response.status === 200 && response.data.data) {
      setState(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProgramOption(student.programOption.levelId);
      await fetchCodeOfConduct();
      await fetchLevel();
      await fetchCountry();
      await fetchState(student.countryId || 0);
      setValue("levelId", student.programOption.levelId);
      setValue("programOptionId", student.programOptionId);
      setShowProgramOptionContainer(true);
    })();
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
    setVal("id", student.id);
    setVal("croppedImage", image);

    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }

    const formData = new FormData();
    formData.append("id", student.id as unknown as string);
    formData.append("croppedImage", image as string);

    // new Response(formData).text().then(console.log)
    let response = await unitOfService.StudentService.updatePicture(formData);
    if (response && response.status === 200 && response.data.data) {
      toast.success("Profile picture updated successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }

    setProfilePicture(image);
    setIsEditingProfilePicture(false);
  };

  const onClosePictureModal = (_: unknown) => {
    setProfilePicture('');
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
      <div className="db_heading_block">
        <h1 className="db_heading">Update Child</h1>
      </div>
      <Form method="put">
        <Form.Control type="hidden" {...reg("id")} />
        <div className="formBlock">
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Avatar
                  imageSrc={profilePicture || student.profilePicture}
                  size={100}
                  name="croppedImage"
                  edit={true}
                />
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
                {errors.profileImage && (
                  <CustomFormError error={errors.profileImage} />
                )}
                {maxFileError && (
                  <div className="tw-text-red-700 relative">
                    <span className="tw-block sm:tw-inline">Maximum of 25MB is allowed.</span>
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </div>
      </Form>
      <Form
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit(submitData)}
      >
        <Form.Control type="hidden" {...register("id")} />
        <div className="formBlock">
          <Row>
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <FloatingLabel label="Middle Name">
                  <CustomInput
                    control={control}
                    name="middleName"
                    placeholder="Middle Name"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <FloatingLabel label="">
                  <CustomInput
                    type="datepicker"
                    control={control}
                    name="dob"
                    placeholder="Date Of Birth*"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <FloatingLabel label="Gender*">
                  <Form.Select aria-label="Gender*" {...register("gender")}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non Binary/Non-Conforming">
                      Non Binary/Non-Conforming
                    </option>
                    <option value="Transgender">Transgender</option>
                    <option value="Prefer not to respond">
                      Prefer not to respond
                    </option>
                  </Form.Select>
                  {errors.gender && <CustomFormError error={errors.gender} />}
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <FloatingLabel label="Level*">
                  <Form.Select
                    disabled={true}
                    aria-label="Level*"
                    {...register("levelId")}
                    onChange={async (e: ChangeEvent<HTMLSelectElement>) => {
                      const selectedValue = +e.target.value;
                      setValue("programOptionId", 0);
                      if (selectedValue > 0) {
                        setShowProgramOptionContainer(true);
                        fetchProgramOption(selectedValue);
                      } else {
                        setShowProgramOptionContainer(false);
                        setProgramOptions([]);
                      }
                    }}
                  >
                    <option value="0">Select Level</option>
                    {levels &&
                      levels.map((level) => {
                        return (
                          <option key={level.id} value={level.id}>
                            {level.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {errors.levelId && <CustomFormError error={errors.levelId} />}
                </FloatingLabel>
              </Form.Group>
            </Col>
            {showProgramOptionContainer && (
              <Col md={12}>
                <div className="p-3 bg-gray mb-3">
                  <FormLabel className="mb-3">
                    Program Options*{" "}
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      size="1x"
                      onClick={() => setShowProgramOptionPopUp(true)}
                    />
                  </FormLabel>
                  <Form.Group>
                    <div>
                      {programOptions &&
                        programOptions.map((po) => {
                          const isChecked = po.id === student.programOptionId;
                          return (
                            <Row key={po.id}>
                                <Col>
                                    <Form.Check
                                        disabled={true}
                                        inline
                                        type="radio"
                                        className="mb-3"
                                        id={`programOption-${po.id}`}
                                        value={po.id}
                                        checked={isChecked}
                                        {...register("programOptionId")}
                                        label={`${po.name} ${po.timeSchedule}`}
                                    />
                                </Col>
                            </Row>
                          );
                        })}
                    </div>
                    {errors.programOptionId && (
                      <CustomFormError error={errors.programOptionId} />
                    )}
                  </Form.Group>
                </div>
              </Col>
            )}

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
                  placeholder="Select Country*"
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
                  placeholder="Select State*"
                  options={state}
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
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel label="Hobbies" className="mb-3">
                  <CustomInput
                    control={control}
                    name="hobbies"
                    placeholder="Hobbies"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel label="Achievement" className="mb-3">
                  <CustomInput
                    control={control}
                    name="achievements"
                    placeholder="Achievement"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <FloatingLabel label="Likes" className="mb-3">
                  <CustomInput
                    control={control}
                    name="likes"
                    placeholder="Likes"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <FloatingLabel label="Dislikes" className="mb-3">
                  <CustomInput
                    control={control}
                    name="dislikes"
                    placeholder="Dislikes"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <FloatingLabel label="Strengths" className="mb-3">
                  <CustomInput
                    control={control}
                    name="strengths"
                    placeholder="Strengths"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <FloatingLabel label="Areas of needed growth" className="mb-3">
                  <CustomInput
                    control={control}
                    name="areasOfNeededGrowth"
                    placeholder="Areas of needed growth"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={12}>
              <FormLabel className="mb-2">
                If you require before and after school care, please indicate the
                following:
              </FormLabel>
              <Form.Group className="mb-3">
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    className="mb-3"
                    id="isBeforeAndAfterSchoolCareRequire-1"
                    value="true"
                    {...register("isBeforeAndAfterSchoolCareRequire")}
                    label="Yes"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    className="mb-3"
                    id="isBeforeAndAfterSchoolCareRequire-2"
                    value="false"
                    {...register("isBeforeAndAfterSchoolCareRequire")}
                    label="No"
                  />
                </div>
                {errors.isBeforeAndAfterSchoolCareRequire && (
                  <CustomFormError
                    error={errors.isBeforeAndAfterSchoolCareRequire}
                  />
                )}
              </Form.Group>
            </Col>
            <Col md={12}>
              <FormLabel className="mb-2">
                <strong>Days additional care needed:</strong>
              </FormLabel>
              <Form.Group className="mb-3">
                <div>
                  <Form.Check
                    inline
                    type="checkbox"
                    className="mb-3"
                    id="beforeAndAfterSchoolCare.monday"
                    {...register("beforeAndAfterSchoolCare.monday")}
                    label="Monday"
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    className="mb-3"
                    id="beforeAndAfterSchoolCare.tuesday"
                    {...register("beforeAndAfterSchoolCare.tuesday")}
                    label="Tuesday"
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    className="mb-3"
                    id="beforeAndAfterSchoolCare.wednesday"
                    {...register("beforeAndAfterSchoolCare.wednesday")}
                    label="Wednesday"
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    className="mb-3"
                    id="beforeAndAfterSchoolCare.thursday"
                    {...register("beforeAndAfterSchoolCare.thursday")}
                    label="Thursday"
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    className="mb-3"
                    id="beforeAndAfterSchoolCare.friday"
                    {...register("beforeAndAfterSchoolCare.friday")}
                    label="Friday"
                  />
                </div>
              </Form.Group>
              {errors.beforeAndAfterSchoolCare && (
                <ErrorLabel message={errors.beforeAndAfterSchoolCare.message} />
              )}
            </Col>
            <Col md={12} className="mb-3">
              <FormLabel className="mb-2">
                <strong>Times additional care needed:</strong>
              </FormLabel>
              <Row>
                <Col>
                  <FloatingLabel label="From" className="mb-3">
                    <CustomInput
                      type="time"
                      control={control}
                      name="beforeAndAfterSchoolCare.fromTime"
                      placeholder="From"
                    />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel label="To" className="mb-3">
                    <CustomInput
                      type="time"
                      control={control}
                      name="beforeAndAfterSchoolCare.toTime"
                      placeholder="To"
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <div>
                  <Form.Check
                    inline
                    className="mb-3"
                    id="siblingAtSchool"
                    defaultChecked={false}
                    {...register("siblingAtSchool")}
                    label="Siblings at school"
                  />
                </div>
                {errors.siblingAtSchool && (
                  <ErrorLabel message={errors.siblingAtSchool.message} />
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <div>
                  <Form.Check
                    inline
                    className="mb-3"
                    type="checkbox"
                    id="includeInformationInDirectory"
                    defaultChecked={false}
                    {...register("includeInformationInDirectory")}
                    label="Include information in directories"
                  />
                </div>
                {errors.includeInformationInDirectory && (
                  <ErrorLabel
                    message={errors.includeInformationInDirectory.message}
                  />
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <p>
                *Read{" "}
                <NavLink
                  className="orange_color d-inline"
                  onClick={() => setShowDirectoryCodeOfConductPopUp(true)}
                >
                  Directory Code of Conduct
                </NavLink>
              </p>
            </Col>
          </Row>
          <Button type="submit" className="btn_main mx-1">
            Save
          </Button>
          <Button className="btn_border mx-1" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </Form>

      {states.showLoader && <Loader />}

      <Modal
        show={showProgramOptionPopUp}
        size="lg"
        onHide={() => setShowProgramOptionPopUp(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Program Option Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped hover className="custom_design_table mb-0">
            <thead>
              <tr>
                <th>Program Option</th>
                <th>Description</th>
                <th className="text-center">Monthly Tuition Fee</th>
              </tr>
            </thead>
            <tbody>
              {programOptions &&
                programOptions.map((option) => {
                  return (
                    <tr key={option.id}>
                      <td>{option.name}</td>
                      <td>{option.timeSchedule}</td>
                      <td className="text-center">
                        {numeral(option.fees).format("$0,0.00")}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal
        show={showDirectoryCodeOfConductPopUp}
        size="lg"
        dialogClassName="modal-60w"
        onHide={() => setShowDirectoryCodeOfConductPopUp(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Directory code of conduct</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: directoryCodeOfConduct }}
          ></div>
        </Modal.Body>
      </Modal>
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

export default UpdateStudent;
