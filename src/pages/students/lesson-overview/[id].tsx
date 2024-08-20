import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import ViewLessonShortDetails from "@/components/common/LessonMaster/Lesson/ViewLessonShortDetails";
import Loader from "@/components/common/Loader";
import AddRecordKeepingNotes from "@/components/common/Student/RecordKeeping/AddRecordKeepingNotes";
import SaveRecordKeepingIndividualStatus from "@/components/common/Student/RecordKeeping/SaveRecordKeepingIndividualStatus";
import ViewViewRecordKeepingHistory from "@/components/common/Student/RecordKeeping/ViewViewRecordKeepingHistory";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import AreaDto from "@/dtos/AreaDto";
import { ClassBasicDto } from "@/dtos/ClassDto";
import LessonDto from "@/dtos/LessonDto";
import { StudentBasicDto } from "@/dtos/StudentDto";
import TopicDto from "@/dtos/TopicDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import {
  faClockRotateLeft,
  faInfo,
  faMessageLines,
  faPlus,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
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
import { useDebounce } from "use-debounce";

interface StudentLessonOverviewProps {
  id: number;
  levelId: number;
  classId: number;
  areaId: number;
  topicId: number;
  q: string;
}

const LessonPlanningPage: NextPage<StudentLessonOverviewProps> = (props) => {
  useBreadcrumb({
    pageName: "Lesson Overview",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Students",
        link: "/students",
      },
      {
        label: "Profile",
        link: `/students/info/${props.id}`,
      },
      {
        label: "Lessons",
        link: `/students/lesson-overview/${props.id}`,
      },
    ],
  });

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { handleSubmit, setValue, getValues, control } =
    useForm<StudentLessonOverviewProps>({
      defaultValues: {
        levelId: props.levelId,
        classId: props.classId,
        areaId: props.areaId,
        topicId: props.topicId,
        q: props.q,
      },
    });

  const [busy, setBusy] = useState<boolean>(false);

  const [student, setStudent] = useState<StudentBasicDto>();
  const fetchStudent = async (id: number) => {
    setBusy(true);
    const response =
      await unitOfService.StudentService.getBasicStudentDetailsById(id);
    if (response && response.status === 200 && response.data.data) {
      setStudent(response.data.data);
    }
    setBusy(false);
  };

  const [lessons, setLesson] = useState<LessonDto[]>([]);
  const fetchLesson = async (formData: StudentLessonOverviewProps) => {
    
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
          props.id,
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

  const [classes, setClass] = useState<ClassBasicDto[]>([]);
  const fetchClass = async (levelId: number) => {
    const response = await unitOfService.ClassService.getClassByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setClass(response.data.data);

      //set default selected class
      if(student?.classes && student.classes.length > 0){
        var classId = student.classes[0].id;
        setValue("classId", classId);
        await formSelectChange("classId", classId);
      }
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

  useEffect(() => {
    (async () => {
      
      if (student && props.levelId === 0) {
        setBusy(true);
        setValue("levelId", student.programOption.levelId);
        await fetchClass(student.programOption.levelId);
        await fetchArea(student.programOption.levelId);
        setBusy(false);
      }
    })();
  }, [student]);

  const formSelectChange = async (controlName: string, value: number) => {
    setBusy(true);
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
    } else if (controlName == "areaId") {
      setValue("areaId", value);
      fetchTopic(getValues().levelId, value);
    } else if (controlName == "topicId") {
      setValue("topicId", value);
    }

    await fetchLesson(getValues());
    setBusy(false);
  };

  useEffect(() => {
    (async () => {
      await fetchStudent(props.id);
    })();
  }, []);

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


  const [newLessonId, setNewLessonId] = useState<number>(0);
  const [addNotes, setAddNotes] = useState<boolean>(false);
  const openAddNotesModal = (eachLessonId: number) => {
    setAddNotes(true);
    setNewLessonId(eachLessonId);
  };

  const closeAddNotesModal = () => {
    setAddNotes(false);
  };


  return (
    <>
      <Head>
        <title>Lesson Planning</title>
      </Head>
      <div className="home_page">
        <Container fluid>
          <Row>
            <Col>
              <div className="db_heading_block">
                {student && (
                  <h1 className="db_heading">Student: {student.name} {!student.active && "(Inactive)"}</h1>
                )}
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
                        <th>Planned</th>
                        <th>Presented</th>
                        <th>Practicing</th>
                        <th>Acquired</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessons &&
                        lessons.map((lesson) => {
                          const recordKeeping = lesson.recordKeepings?.find(
                            (e) => e.studentId === props.id
                          );
                          const isStudentMapped = lesson.studentIds?.filter(
                            (e) => e == props.id
                          );
                          const isLessonAssigned =
                            isStudentMapped && isStudentMapped.length > 0
                              ? true
                              : false;

                          return (
                            <tr key={lesson.id}>
                              <td key={lesson.id}>{lesson.name}</td>
                              <td>
                                <SaveRecordKeepingIndividualStatus
                                  classId={getValues().classId}
                                  isLessonAssigned={isLessonAssigned}
                                  lessonId={lesson.id}
                                  studentId={props.id}
                                  recordKeeping={recordKeeping}
                                  status="planned"
                                />
                              </td>
                              <td>
                                <SaveRecordKeepingIndividualStatus
                                  classId={getValues().classId}
                                  isLessonAssigned={isLessonAssigned}
                                  lessonId={lesson.id}
                                  studentId={props.id}
                                  recordKeeping={recordKeeping}
                                  status="presented"
                                />
                              </td>
                              <td>
                                <SaveRecordKeepingIndividualStatus
                                  classId={getValues().classId}
                                  isLessonAssigned={isLessonAssigned}
                                  lessonId={lesson.id}
                                  studentId={props.id}
                                  recordKeeping={recordKeeping}
                                  status="practicing"
                                />
                              </td>
                              <td>
                                <SaveRecordKeepingIndividualStatus
                                  classId={getValues().classId}
                                  isLessonAssigned={isLessonAssigned}
                                  lessonId={lesson.id}
                                  studentId={props.id}
                                  recordKeeping={recordKeeping}
                                  status="acquired"
                                />
                              </td>

                              <td>
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Info</Tooltip>}
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

                                {recordKeeping && (
                                  <>
                                    <OverlayTrigger
                                      placement="top"
                                      delay={{ show: 50, hide: 100 }}
                                      overlay={<Tooltip>Notes</Tooltip>}
                                    >
                                      <span
                                        className="btn_main small anchor-span"
                                        onClick={() => {
                                          openAddNotesModal(lesson.id);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faMessageLines} size="1x" />
                                      </span>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                      placement="top"
                                      delay={{ show: 50, hide: 100 }}
                                      overlay={<Tooltip>History</Tooltip>}
                                    >
                                      <span
                                        className="btn_main small anchor-span"
                                        onClick={() => {
                                          openViewHistoryModal(recordKeeping.id);
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

      {addNotes && (
        <AddRecordKeepingNotes
          studentId={props.id}
          lessonId={newLessonId}
          classId={getValues().classId}
          isOpen={addNotes}
          onClose={closeAddNotesModal}
        />
      )}

      {viewHistory && (
        <ViewViewRecordKeepingHistory
          id={recordKeepingId}
          isOpen={viewHistory}
          onClose={closeViewHistoryModal}
        />
      )}

      {busy && <Loader />}

    </>
  );
};
export default LessonPlanningPage;

export const getServerSideProps: GetServerSideProps<
  StudentLessonOverviewProps
> = async (context) => {
  let initialParamas: StudentLessonOverviewProps = {
    id: +(context.query.id || 0),
    levelId: +(context.query.levelId || 0),
    classId: +(context.query.classId || 0),
    areaId: +(context.query.areaId || 0),
    topicId: +(context.query.topicId || 0),
    q: `${context.query.q || ""}`,
  };

  return {
    props: initialParamas,
  };
};
