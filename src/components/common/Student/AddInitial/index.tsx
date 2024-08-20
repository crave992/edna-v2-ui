import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import ProgramOptionDto from "@/dtos/ProgramOptionDto";
import ProgramOptionParams from "@/params/ProgramOptionParams";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faQuestionCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import {
  Form,
  Row,
  Col,
  FloatingLabel,
  FormLabel,
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
import { StudentSimpleValidationSchema } from "@/validation/StudentValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomFormError from "../../CustomFormControls/CustomFormError";
import LevelDto from "@/dtos/LevelDto";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loader from "../../Loader";
import { NextPage } from "next";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import CountryDto from "../../../../dtos/CountryDto";
import StateDto from "../../../../dtos/StateDto";

const initialPageState: InPageAddUpdateState<StudentDto> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
};


const AddStudentInitial: NextPage = () => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<StudentDto>, initialPageState);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<StudentModel>({
    resolver: yupResolver(StudentSimpleValidationSchema),
    defaultValues: {
      id: 0,
      firstName: "",
      lastName: "",
      parentEmail: "",
      gender: "",
      levelId: 0,
      programOptionId: 0,
      siblingAtSchool: false,
      includeInformationInDirectory: false,
      isBeforeAndAfterSchoolCareRequire: "false",
      beforeAndAfterSchoolCare: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        fromTime: "",
        toTime: "",
      },
    },
  });

  const submitData = async (data: StudentModel) => {
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

    const response = await unitOfService.StudentService.add(formData);

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 201 && response.data.data && data.parentEmail) {
      toast.success("Student added successfully and email sent with an instruction to complete the registration");
      router.push(`/students/`);
    } else if (response && response.status === 201 && response.data.data) {
      toast.success("Student added successfully");
      router.push(`/students/`);
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

  const [levels, setLevels] = useState<LevelDto[]>([]);
  const fetchLevel = async () => {
    const response = await unitOfService.LevelService.getAll();
    if (response && response.status == 200 && response.data.data) {
      setLevels(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProgramOption(0);
      await fetchLevel();
    })();
  }, []);

  return (
    <>
      <div className="db_heading_block">
        <h1 className="db_heading">Add Student</h1>
      </div>
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
            {/* <Col md={4}>
              <Form.Group className="mb-3">
                <FloatingLabel label="Parent/Guardian Email">
                  <CustomInput
                    control={control}
                    name="parentEmail"
                    placeholder="Email"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col> */}
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
                          return (
                            <Row key={po.id}>
                                <Col>
                                    <Form.Check
                                        inline
                                        type="radio"
                                        className="mb-3"
                                        id={`programOption-${po.id}`}
                                        value={po.id}
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
          </Row>
          <Button type="submit" className="btn_main mx-1">
            Save
          </Button>
          <Link className="btn_border mx-1" href={"/students"}>
            Cancel
          </Link>
        </div>
      </Form>

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
      {states.showLoader && <Loader />}
    </>
  );
};

export default AddStudentInitial;