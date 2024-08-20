import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { ClassBasicDto, ClassForStaffDashboardDto } from "@/dtos/ClassDto";
import LevelDto from "@/dtos/LevelDto";
import SepAreaDto from "@/dtos/SepAreaDto";
import SepLevelDto from "@/dtos/SepLevelDto";
import { SepTopicAssessmentDto } from "@/dtos/SepTopicDto";
import { StudentBasicDto } from "@/dtos/StudentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faFileLines } from "@fortawesome/pro-regular-svg-icons";
import { faHistory } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { useForm } from "react-hook-form";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import SEPAssessmentModel from "@/models/SEPAssessmentModel";
import { toast } from "react-toastify";
import ViewHistory from "@/components/common/Student/SEPAssessment/ViewHistory";
import SaveComment from "@/components/common/Student/SEPAssessment/SaveComment";

interface SEPAssessmentPageProps {
  levelId: number;
  classId: number;
  studentId: number;
  sepAreaId: number;
  sepLevelId: number;
}

const SEPAssessmentPage: NextPage<SEPAssessmentPageProps> = (props) => {
  useBreadcrumb({
    pageName: "SEP Assessment",
    breadcrumbs: [
      {
        label: "SEP Assessment",
        link: "/students/sep-assessment",
      },
    ],
  });

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { handleSubmit, setValue, getValues, control } =
    useForm<SEPAssessmentPageProps>({
      defaultValues: {
        levelId: props.levelId,
        classId: props.classId,
        studentId: props.studentId,
        sepAreaId: props.sepAreaId,
        sepLevelId: props.sepLevelId,
      },
    });

  const [sepTopics, setSepTopic] = useState<SepTopicAssessmentDto[]>([]);
  const fetchTopics = async (formData: SEPAssessmentPageProps) => {
    setSepTopic([]);
    if (
      formData.studentId > 0 &&
      formData.classId > 0 &&
      formData.levelId > 0 &&
      formData.sepAreaId > 0 &&
      formData.sepLevelId > 0
    ) {
      const response =
        await unitOfService.SEPAssessmentService.getSepTopicsForAssessment(
          formData.studentId,
          formData.classId,
          formData.levelId,
          formData.sepAreaId,
          formData.sepLevelId
        );
      if (response && response.status === 200 && response.data.data) {
        setSepTopic(response.data.data);
      } else {
        setSepTopic([]);
      }
    }
  };

  const [levels, setLevel] = useState<LevelDto[]>([]);
  const fetchLevel = async () => {
    const response = await unitOfService.LevelService.getAll();
    if (response && response.status === 200 && response.data.data) {
      setLevel(response.data.data);
    }
  };

  const [classes, setClass] = useState<ClassBasicDto[]>([]);
  const fetchClass = async (levelId: number) => {
    const response = await unitOfService.ClassService.getClassByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setClass(response.data.data);
    }
  };

  const [students, setStudents] = useState<StudentBasicDto[]>([]);
  const fetchStudents = async (classId: number) => {
    const response = await unitOfService.StudentService.getByClassId(classId);
    if (response && response.status === 200 && response.data.data) {
      setStudents(response.data.data);
    }
  };

  const [sepAreas, setSepArea] = useState<SepAreaDto[]>([]);
  const fetchSepArea = async (levelId: number) => {
    const response = await unitOfService.SepAreaService.getAreaByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setSepArea(response.data.data);
    }
  };

  const [sepLevel, setSepLevel] = useState<SepLevelDto[]>([]);
  const fetchSepLevel = async (levelId: number, areaId: number) => {
    const response = await unitOfService.SepLevelService.getLevelByLevelAndArea(
      levelId,
      areaId
    );
    if (response && response.status === 200 && response.data.data) {
      setSepLevel(response.data.data);
    }
  };

  const formSelectChange = async (controlName: string, value: number) => {
    if (controlName == "levelId") {
      setValue("levelId", value);
      if (value > 0) {
        await fetchClass(value);
        await fetchSepArea(value);
      } else {
        setClass([]);
        setSepArea([]);
      }

      setStudents([]);
      setSepLevel([]);

      setValue("classId", 0);
      setValue("sepAreaId", 0);
      setValue("studentId", 0);
      setValue("sepLevelId", 0);
    } else if (controlName == "classId") {
      setValue("classId", value);
      await fetchStudents(value);
    } else if (controlName == "studentId") {
      setValue("studentId", value);
    } else if (controlName == "sepAreaId") {
      setValue("sepAreaId", value);
      await fetchSepLevel(getValues().levelId, value);
    } else if (controlName == "sepLevelId") {
      setValue("sepLevelId", value);
    }

    fetchTopics(getValues());
  };

  useEffect(() => {
    (async () => {
      await fetchLevel();

      const storedLevelId = localStorage.getItem('levelIdSEP');
      if (storedLevelId) {
        const parsedLevelId = parseInt(storedLevelId, 10);
        if (!isNaN(parsedLevelId)) {
          await formSelectChange('levelId', parsedLevelId);
        }

        
  
        const storedClassId = localStorage.getItem('classIdSEP');
        if (storedClassId) {
          const parsedClassId = parseInt(storedClassId, 10);
          if (!isNaN(parsedClassId)) {
            formSelectChange('classId', parsedClassId);
          }
        }
      }
    })();
  }, []);

  useEffect(() => {
    const storedStudentId = localStorage.getItem('studentIdSEP');
    if (storedStudentId) {
      const parsedStudentId = parseInt(storedStudentId, 10);
      if (!isNaN(parsedStudentId)) {
        formSelectChange('studentId', parsedStudentId);
      }
    }
  }, [students]);

  useEffect(() => {
    const storedAreaId = localStorage.getItem('sepAreaIdSEP');
    if (storedAreaId) {
      const parsedAreaId = parseInt(storedAreaId, 10);
      if (!isNaN(parsedAreaId)) {
        formSelectChange('sepAreaId', parsedAreaId);
      }
    }
  }, [sepAreas]);

  useEffect(() => {
    const storedSepLevelId = localStorage.getItem('sepLevelIdSEP');
    if (storedSepLevelId) {
      const parsedSepLevelId = parseInt(storedSepLevelId, 10);
      if (!isNaN(parsedSepLevelId)) {
        formSelectChange('sepLevelId', parsedSepLevelId);
      }
    }
  }, [sepLevel]);
  
  const marks = {
    0: "Not Started",
    1: "Rarely",
    2: "Sometimes",
    3: "Often",
    4: "Frequently",
    5: "Always",
  };

  const handleSliderChange = async (
    sepTopicId: number,
    newValue: number | number[]
  ) => {
    if (typeof newValue === "number") {
      let model: SEPAssessmentModel = {
        action: "rating",
        value: newValue.toString(),
      };
      const response = await unitOfService.SEPAssessmentService.save(
        getValues().studentId,
        getValues().classId,
        sepTopicId,
        model
      );
      if (response && response.status === 200) {
      } else {
        const error =
          unitOfService.ErrorHandlerService.getErrorMessage(response);
        toast.error(error);
      }
    }
  };

  const [viewHistory, setViewHistory] = useState<boolean>(false);
  const [sepTopicId, setSepTopicId] = useState<number>(0);
  const [sepAssessmentId, setSEPAssessmentId] = useState<number>(0);
  const openViewHistoryModal = (
    sepAssessmentId: number,
    sepTopicId: number
  ) => {
    setSEPAssessmentId(sepAssessmentId);
    setSepTopicId(sepTopicId);
    setViewHistory(true);
  };

  const closeViewHistoryModal = () => {
    setSEPAssessmentId(0);
    setSepTopicId(0);
    setViewHistory(false);
  };

  const [saveComment, setSaveComment] = useState<boolean>(false);  
  const openSaveCommentModal = (
    sepAssessmentId: number,
    sepTopicId: number
  ) => {
    setSEPAssessmentId(sepAssessmentId);
    setSepTopicId(sepTopicId);
    setSaveComment(true);
  };

  const closeSaveCommentModal = () => {
    setSEPAssessmentId(0);
    setSepTopicId(0);
    setSaveComment(false);
  };

  return (
    <>
      <Head>
        <title>SEP Assessment - Noorana</title>
      </Head>
      <div className="sep_assessment_page">
        <Container className="mt-3">
          <Row>
            <Col>
              <div className="db_heading_block">
                <h1 className="db_heading">SEP Assessment</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Form
              method="get"
              autoComplete="off"
              onSubmit={handleSubmit(fetchTopics)}
            >
              <Row className="mb-4">
                <Col>
                  <Form.Label>Select Level</Form.Label>
                  <CustomSelect
                    name="levelId"
                    control={control}
                    placeholder="Select Level*"
                    options={levels}
                    isSearchable={true}
                    textField="name"
                    valueField="id"
                    onChange={async (option) => {
                      const selectedId = +(option?.[0] || 0);
                      localStorage.setItem("levelIdSEP", selectedId.toString());
                      await formSelectChange("levelId", selectedId);
                    }}
                  />
                </Col>
                <Col>
                  <Form.Label>Select Class</Form.Label>
                  <CustomSelect
                    name="classId"
                    control={control}
                    placeholder="Select Class*"
                    options={classes}
                    isSearchable={true}
                    textField="name"
                    valueField="id"
                    onChange={async (option) => {
                      const selectedId = +(option?.[0] || 0);
                      localStorage.setItem("classIdSEP", selectedId.toString());
                      await formSelectChange("classId", selectedId);
                    }}
                  />
                </Col>
                <Col>
                  <Form.Label>Select Student</Form.Label>
                  <CustomSelect
                    name="studentId"
                    control={control}
                    placeholder="Select Student*"
                    options={students}
                    isSearchable={true}
                    textField="name"
                    valueField="id"
                    onChange={async (option) => {
                      const selectedId = +(option?.[0] || 0);
                      localStorage.setItem("studentIdSEP", (option || '').toString());
                      await formSelectChange("studentId", selectedId);
                    }}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Form.Label>Select Area</Form.Label>
                  <CustomSelect
                    name="sepAreaId"
                    control={control}
                    placeholder="Select Area*"
                    options={sepAreas}
                    isSearchable={true}
                    textField="name"
                    valueField="id"
                    onChange={async (option) => {
                      const selectedId = +(option?.[0] || 0);
                      localStorage.setItem("sepAreaIdSEP", (option || '').toString());
                      await formSelectChange("sepAreaId", selectedId);
                    }}
                  />
                </Col>
                <Col>
                  <Form.Label>Select Level</Form.Label>
                  <CustomSelect
                    name="sepLevelId"
                    control={control}
                    placeholder="Select Level*"
                    options={sepLevel}
                    isSearchable={true}
                    textField="name"
                    valueField="id"
                    onChange={async (option) => {
                      const selectedId = +(option?.[0] || 0);
                      localStorage.setItem("sepLevelIdSEP", (option || '').toString());
                      await formSelectChange("sepLevelId", selectedId);
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </Row>
          <Row>
            <Col md={12}>
              <Table striped hover className="custom_design_table mb-0">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th colSpan={6}>
                      <span className="d-flex flex-1 justify-content-between">
                        <span>Not Started</span>
                        <span>Rarely</span>
                        <span>Sometimes</span>
                        <span>Often</span>
                        <span>Frequently</span>
                        <span>Always</span>
                      </span>
                    </th>
                    <th className="text-center">Last Update</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sepTopics &&
                    sepTopics.map((topic) => {
                      let selecetdValue = +topic.status;

                      return (
                        <tr key={topic.sepTopicId}>
                          <td>{topic.sepTopicName}</td>

                          <td colSpan={6}>
                            <Slider
                              min={0}
                              max={5}
                              step={1}
                              marks={marks}
                              defaultValue={selecetdValue}
                              onChange={(selectedValue: number | number[]) => {
                                handleSliderChange(
                                  topic.sepTopicId,
                                  selectedValue
                                );
                              }}
                              railStyle={{ backgroundColor: "#ccc" }}
                              trackStyle={{ backgroundColor: "#0084ff" }}
                              handleStyle={{
                                borderColor: "#0084ff",
                                backgroundColor: "#0084ff",
                              }}
                              dotStyle={{
                                borderColor: "#0084ff",
                                backgroundColor: "#0084ff",
                              }}
                            />
                          </td>
                          <td className="text-center">
                            {topic.assessmentDate &&
                              unitOfService.DateTimeService.convertToLocalDate(
                                topic.assessmentDate
                              )}
                          </td>
                          <td className="text-center">
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Notes</Tooltip>}
                            >
                              <span
                                className="btn_main small anchor-span"
                                onClick={() => {
                                  openSaveCommentModal(
                                    topic.sepAssessmentId,
                                    topic.sepTopicId
                                  );
                                }}
                              >
                                <FontAwesomeIcon icon={faFileLines} size="1x" />
                              </span>
                            </OverlayTrigger>

                            {topic.sepAssessmentId > 0 && (
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>History</Tooltip>}
                              >
                                <span
                                  className="btn_main small anchor-span"
                                  onClick={() => {
                                    openViewHistoryModal(
                                      topic.sepAssessmentId,
                                      topic.sepTopicId
                                    );
                                  }}
                                >
                                  <FontAwesomeIcon icon={faHistory} size="1x" />
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>

      {viewHistory && (
        <ViewHistory
          isOpen={viewHistory}
          onClose={closeViewHistoryModal}
          classId={getValues().classId}
          sepAssessmentId={sepAssessmentId}
          sepTopicId={sepTopicId}
          studentId={getValues().studentId}
        />
      )}

      {saveComment && (
        <SaveComment
          isOpen={saveComment}
          onClose={closeSaveCommentModal}
          classId={getValues().classId}
          sepAssessmentId={sepAssessmentId}
          sepTopicId={sepTopicId}
          studentId={getValues().studentId}
        />
      )}
    </>
  );
};
export default SEPAssessmentPage;

export const getServerSideProps: GetServerSideProps<
  SEPAssessmentPageProps
> = async (context) => {
  let initialParamas: SEPAssessmentPageProps = {
    levelId: +(context.query.levelId || 0),
    classId: +(context.query.classId || 0),
    studentId: +(context.query.studentId || 0),
    sepAreaId: +(context.query.sepAreaId || 0),
    sepLevelId: +(context.query.sepLevelId || 0),
  };

  return {
    props: initialParamas,
  };
};
