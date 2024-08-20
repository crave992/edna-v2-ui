import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import SaveRecordKeeping from "@/components/common/Student/RecordKeeping/SaveRecordKeeping";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import AreaDto from "@/dtos/AreaDto";
import { ClassBasicDto } from "@/dtos/ClassDto";
import LessonDto from "@/dtos/LessonDto";
import LevelDto from "@/dtos/LevelDto";
import { StudentBasicDto } from "@/dtos/StudentDto";
import TopicDto from "@/dtos/TopicDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

interface RecordKeepingPageProps {
  levelId: number;
  classId: number;
  areaId: number;
  topicId: number;
  q: string;
}

const RecordKeepingPage: NextPage<RecordKeepingPageProps> = (props) => {
  useBreadcrumb({
    pageName: "Record Keeping",
    breadcrumbs: [
      {
        label: "Record Keeping",
        link: "/students/record-keeping",
      },
    ],
  });

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { handleSubmit, setValue, getValues, control } =
    useForm<RecordKeepingPageProps>({
      defaultValues: {
        levelId: props.levelId,
        classId: props.classId,
        areaId: props.areaId,
        topicId: props.topicId,
        q: props.q,
      },
    });

  const [lessons, setLesson] = useState<LessonDto[]>([]);
  const fetchLesson = async (formData: RecordKeepingPageProps) => {
    if (
      formData.levelId > 0 &&
      formData.areaId > 0 &&
      formData.topicId > 0 &&
      formData.classId > 0
    ) {
      const response =
        await unitOfService.LessonService.getByLevelAreaAndTopicAndClass(
          formData.levelId,
          formData.areaId,
          formData.topicId,
          formData.classId,
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

  const [levels, setLevels] = useState<LevelDto[]>([]);
  const fetchLevel = async () => {
    const response = await unitOfService.LevelService.getAll();
    if (response && response.status === 200 && response.data.data) {
      setLevels(response.data.data);
    }
  };

  const [classes, setClasses] = useState<ClassBasicDto[]>([]);
  const fetchClass = async (levelId: number) => {
    const response = await unitOfService.ClassService.getClassByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setClasses(response.data.data);
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

  const [students, setStudent] = useState<StudentBasicDto[]>([]);
  const fetchStudent = async (classId: number) => {
    const response = await unitOfService.StudentService.getByClassId(classId);
    if (response && response.status === 200 && response.data.data) {
      setStudent(response.data.data);
    }
  };

  const formSelectChange = async (controlName: string, value: number) => {
    if (controlName == "levelId") {
      setValue("levelId", value);
      if (value > 0) {
        await fetchClass(value);
        await fetchArea(value);
      } else {
        setClasses([]);
        setArea([]);
      }
      setValue("areaId", 0);
      setValue("topicId", 0);
      setTopic([]);
      setStudent([]);
    } else if (controlName == "classId") {
      setValue("classId", value);
      await fetchStudent(value);
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
      await fetchLevel();

      const storedLevelId = localStorage.getItem('recordKeepingLevelId');
      if (storedLevelId) {
        const parsedLevelId = parseInt(storedLevelId, 10);
        if (!isNaN(parsedLevelId)) {
          await formSelectChange('levelId', parsedLevelId);
        }

        const storedClassId = localStorage.getItem('recordKeepingClassId');
        if (storedClassId) {
          const parsedClassId = parseInt(storedClassId, 10);
          if (!isNaN(parsedClassId)) {
            formSelectChange('classId', parsedClassId);
          }
        }
      }

      // await fetchClass(props.levelId);
      // await fetchArea(props.levelId);
      // await fetchStudent(props.classId);
    })();
  }, []);

  useEffect(() => {
    const storedAreaId = localStorage.getItem('recordKeepingAreaId');
    if (storedAreaId) {
      const parsedAreaId = parseInt(storedAreaId, 10);
      if (!isNaN(parsedAreaId)) {
        formSelectChange('areaId', parsedAreaId);
      }
    }
  }, [areas]);

  useEffect(() => {
    const storedTopicId = localStorage.getItem('recordKeepingTopicId');
    if (storedTopicId) {
      const parsedTopicId = parseInt(storedTopicId, 10);
      if (!isNaN(parsedTopicId)) {
        formSelectChange('topicId', parsedTopicId);
      }
    }
  }, [topics]);

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

  return (
    <>
      <Head>
        <title>Record Keeping</title>
      </Head>

      <div className="home_page">
        <Container fluid>
          <Row>
            <Col>
              <div className="db_heading_block">
                <h1 className="db_heading">Record Keeping</h1>
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
                        localStorage.setItem("recordKeepingLevelId", selectedId.toString());
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
                        localStorage.setItem("recordKeepingClassId", selectedId.toString());
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
                        localStorage.setItem("recordKeepingAreaId", selectedId.toString());
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
                        localStorage.setItem("recordKeepingTopicId", selectedId.toString());
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
                        {students &&
                          students.map((stud) => {
                            return <th key={stud.id}>{stud.name} {!stud.active && "(Inactive)"}</th>;
                          })}
                      </tr>
                    </thead>
                    <tbody>
                      {lessons &&
                        lessons.map((lesson) => {
                          return (
                            <tr key={lesson.id}>
                              <td key={lesson.id}>{lesson.name}</td>

                              {students &&
                                students.map((stud) => {

                                  const isStudentMapped = lesson.studentIds?.filter((e) => e == stud.id);
                                  const isLessonAssigned = isStudentMapped && isStudentMapped.length > 0 ? true : false;
                                  const recordKeeping = lesson.recordKeepings?.find((e) => e.studentId == stud.id);

                                  return (
                                    <td key={stud.id}>
                                        <SaveRecordKeeping 
                                            classId={getValues().classId}
                                            isLessonAssigned={isLessonAssigned}
                                            lessonId={lesson.id}
                                            studentId={stud.id}
                                            recordKeeping={recordKeeping}
                                        />                                      
                                    </td>
                                  );
                                })}
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
    </>
  );
};
export default RecordKeepingPage;

export const getServerSideProps: GetServerSideProps<
  RecordKeepingPageProps
> = async (context) => {
  let initialParamas: RecordKeepingPageProps = {
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
