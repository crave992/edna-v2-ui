import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import AreaDto from "@/dtos/AreaDto";
import { ClassBasicDto } from "@/dtos/ClassDto";
import LessonDto from "@/dtos/LessonDto";
import LevelDto from "@/dtos/LevelDto";
import { StudentBasicDto, StudentDto } from "@/dtos/StudentDto";
import TopicDto from "@/dtos/TopicDto";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faCircleMinus, faCirclePlus, faClockRotateLeft, faInfo, faMinus, faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useState, useEffect, ChangeEvent } from "react";
import { Row, Col, Form, Table, Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import ViewLessonShortDetails from "../../LessonMaster/Lesson/ViewLessonShortDetails";
import ViewViewRecordKeepingHistory from "./ViewViewRecordKeepingHistory";

interface ViewRecordKeepingProps {
  levelId: number;
  classId: number;
  areaId: number;
  topicId: number;
  studentId: number;
  q: string;
}

const ViewRecordKeeping: NextPage<ViewRecordKeepingProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { handleSubmit, setValue, getValues, control } =
    useForm<ViewRecordKeepingProps>({
      defaultValues: {
        levelId: props.levelId,
        classId: props.classId,
        areaId: props.areaId,
        topicId: props.topicId,
        studentId: props.studentId,
        q: props.q,
      },
    });

  const [lessons, setLesson] = useState<LessonDto[]>([]);
  const fetchLesson = async (formData: ViewRecordKeepingProps) => {
    if (
      formData.levelId > 0 &&
      formData.areaId > 0 &&
      formData.topicId > 0 &&
      formData.classId > 0
    ) {
      const response =
        await unitOfService.LessonService.getByLevelAreaAndTopicAndClassAndStudentId(
          formData.levelId,
          formData.areaId,
          formData.topicId,
          formData.classId,
          formData.studentId,
          formData.q || ""
        );
      if (response && response.status === 200 && response.data.data) {
        setLesson(response.data.data);
      } else {
        setLesson([]);
      }
    } else {
      setLesson([]);
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

  const [areas, setArea] = useState<AreaDto[]>([]);
  const fetchArea = async (levelId: number) => {
    const response = await unitOfService.AreaService.getAreaByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setArea(response.data.data);
    }
  };

  const [topics, setTopic] = useState<TopicDto[]>([]);
  const fetchTopic = async (levelId: number, areaId: number) => {
    const response = await unitOfService.TopicService.getTopicByLevelAndArea(
      levelId,
      areaId
    );
    if (response && response.status === 200 && response.data.data) {
      setTopic(response.data.data);
    }
  };

  const [studentDetail, setStudentDetail] = useState<StudentDto>();
  const fetchStudentDetail = async (id: number) => {
    const response = await unitOfService.StudentService.getByStudentId(id);
    if (response && response.status === 200 && response.data.data) {
      setStudentDetail(response.data.data);
    }
  };

  const formSelectChange = async (controlName: string, value: number) => {
    if (controlName == "levelId") {
      setValue("levelId", value);
      if (value > 0) {
        await fetchClass(value);
        await fetchArea(value);
      } else {
        setClass([]);
        setArea([]);
      }
      setValue("areaId", 0);
      setValue("topicId", 0);
      setTopic([]);
    } else if (controlName == "classId") {
      setValue("classId", value);
    } else if (controlName == "areaId") {
      setValue("areaId", value);
      fetchTopic(getValues().levelId, value);
    } else if (controlName == "topicId") {
      setValue("topicId", value);
    }

    fetchLesson(getValues());
  };

  useEffect(() => {
    (async () => {
      await fetchStudentDetail(props.studentId);
      await fetchLevel();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (studentDetail && props.levelId === 0) {
        setValue("levelId", studentDetail.levelId);
        await fetchClass(studentDetail.levelId);
        await fetchArea(studentDetail.levelId);
      }
    })();
  }, [studentDetail]);

  const [searchText, setSearchText] = useState<string>("");
  const formInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || "";
    setValue("q", searchedText);
    setSearchText(searchedText);
  };

  const [searchedValue] = useDebounce(searchText, 1000);
  useEffect(() => {
    (async () => {
      await fetchLesson(getValues());
    })();
  }, [searchedValue]);


  const [lessonId, setLessonId] = useState<number>(0);
  const [viewLesson, setViewLesson] = useState<boolean>(false);
  const openViewLessonModal = (cid: number) => {
    setLessonId(cid);
    setViewLesson(true);
  };

  const closeViewLessonModal = () => {
    setLessonId(0);
    setViewLesson(false);
  };

  const [recordKeepingId, setRecordKeepingId] = useState<number>(0);
  const [viewHistory, setViewHistory] = useState<boolean>(false);
  const openViewHistoryModal = (cid: number) => {
    setRecordKeepingId(cid);
    setViewHistory(true);
  };

  const closeViewHistoryModal = () => {
    setRecordKeepingId(0);
    setViewHistory(false);
  };

  return (
    <>
      <div className="home_page">
        <Container fluid>
          <Row>
            <Col>
              <div className="db_heading_block">
                <h1 className="db_heading">
                  Lessons: {studentDetail?.firstName}{" "}
                  {studentDetail?.middleName} {studentDetail?.lastName}
                </h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="mb-3">
              <Form
                method="get"
                autoComplete="off"
                onSubmit={handleSubmit(fetchLesson)}
              >
                <Row>
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
                        await formSelectChange("classId", selectedId);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Select Area</Form.Label>
                    <CustomSelect
                      name="areaId"
                      control={control}
                      placeholder="Select Area*"
                      options={areas}
                      isSearchable={true}
                      textField="name"
                      valueField="id"
                      onChange={async (option) => {
                        const selectedId = +(option?.[0] || 0);
                        await formSelectChange("areaId", selectedId);
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Select Topic</Form.Label>
                    <CustomSelect
                      name="topicId"
                      control={control}
                      placeholder="Select Topic*"
                      options={topics}
                      isSearchable={true}
                      textField="name"
                      valueField="id"
                      onChange={async (option) => {
                        const selectedId = +(option?.[0] || 0);
                        await formSelectChange("topicId", selectedId);
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-3">
                    <CustomInput
                      name="q"
                      control={control}
                      placeholder="Search by lesson name*"
                      onChange={formInputChange}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="formBlock">
                <div className="table-responsive table_fixed_height">
                  <Table
                    className="table-fixed custom_design_table lesson_overview_table"
                    striped="columns"
                    bordered
                    hover
                    variant="light"
                  >
                    <thead>
                      <tr>
                        <th>Lesson</th>
                        <th>Scheduled</th>
                        <th>Last Presented</th>
                        <th>Practicing</th>
                        <th>Acquired</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessons &&
                        lessons.map((lesson) => {
                          const recordKeep = lesson.recordKeepings?.find(
                            (e) => e.studentId === props.studentId
                          );
                          return (
                            <tr key={lesson.id}>
                              <td key={lesson.id}>{lesson.name}</td>
                              <td>
                                {recordKeep?.plannedDate &&
                                  unitOfService.DateTimeService.convertToLocalDate(
                                    recordKeep?.plannedDate
                                  )}
                              </td>
                              <td>
                                {recordKeep?.presentedDate &&
                                  unitOfService.DateTimeService.convertToLocalDate(
                                    recordKeep?.presentedDate
                                  )}
                              </td>
                              <td>
                                <div className="count_number mb-1">
                                  <span className="count_btn">
                                    <FontAwesomeIcon icon={faCircleMinus} />
                                  </span>
                                  <span className="mx-1" style={{ color: (recordKeep?.practiceCount ?? 0) > 5 ? 'red' : 'black' }}>{recordKeep?.practiceCount}</span>
                                  <span className="count_btn">
                                    <FontAwesomeIcon icon={faCirclePlus} />
                                  </span>
                                </div>
                                Last Practice: {recordKeep?.practicingDate &&
                                  unitOfService.DateTimeService.convertToLocalDate(
                                    recordKeep?.practicingDate
                                  )}
                              </td>
                              <td>
                                {recordKeep?.acquiredDate &&
                                  unitOfService.DateTimeService.convertToLocalDate(
                                    recordKeep?.acquiredDate
                                  )}
                              </td>
                              <td>
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Lesson Info</Tooltip>}
                                >
                                  <span
                                    className="btn_main small anchor-span"
                                    onClick={() => {
                                      openViewLessonModal(lesson.id);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faInfo} size="1x" />
                                  </span>
                                </OverlayTrigger>
                                {recordKeep && (
                                  <>
                                    <OverlayTrigger
                                      placement="top"
                                      delay={{ show: 50, hide: 100 }}
                                      overlay={<Tooltip>History</Tooltip>}
                                    >
                                      <span
                                        className="btn_main small anchor-span"
                                        onClick={() => {
                                          openViewHistoryModal(recordKeep.id);
                                        }}
                                      >
                                        <FontAwesomeIcon
                                          icon={faClockRotateLeft}
                                          size="1x"
                                        />
                                      </span>
                                    </OverlayTrigger>
                                  </>

                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {viewLesson && (
        <ViewLessonShortDetails
          id={lessonId}
          isOpen={viewLesson}
          onClose={closeViewLessonModal}
        />
      )}

      {viewHistory && (
        <ViewViewRecordKeepingHistory
          id={recordKeepingId}
          isOpen={viewHistory}
          onClose={closeViewHistoryModal}
        />
      )}
    </>
  );
};
export default ViewRecordKeeping;
