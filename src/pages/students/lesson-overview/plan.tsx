import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import ViewLesson from "@/components/common/LessonMaster/Lesson/ViewLesson";
import AssignLesson from "@/components/common/Student/LessonAssignment/AssignLesson";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import AreaDto from "@/dtos/AreaDto";
import { ClassBasicDto } from "@/dtos/ClassDto";
import LessonDto from "@/dtos/LessonDto";
import LevelDto from "@/dtos/LevelDto";
import TopicDto from "@/dtos/TopicDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faInfo, faPlusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
import {
    Col,
    Container,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

interface LessonPlanningPageProps {
    levelId: number;
    classId: number;
    areaId: number;
    topicId: number;
    q: string;
}

const LessonPlanningPage: NextPage<LessonPlanningPageProps> = (props) => {
    useBreadcrumb({
        pageName: "Lesson Planning",
        breadcrumbs: [
            {
                label: "Lesson Planning",
                link: "/students/lesson-planning",
            },
        ],
    });

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const { handleSubmit, setValue, getValues, control } =
        useForm<LessonPlanningPageProps>({
            defaultValues: {
                levelId: props.levelId,
                classId: props.classId,
                areaId: props.areaId,
                topicId: props.topicId,
                q: props.q,
            },
        });

    const [lessons, setLesson] = useState<LessonDto[]>([]);
    const fetchLesson = async (formData: LessonPlanningPageProps) => {
        if (formData.levelId > 0 && formData.areaId > 0 && formData.topicId > 0) {
            const response = await unitOfService.LessonService.getByLevelAreaAndTopic(
                formData.levelId,
                formData.areaId,
                formData.topicId,
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
            await fetchLevel();

            const storedLevelId = localStorage.getItem('lessonPlanLevelId');
            if (storedLevelId) {
                const parsedLevelId = parseInt(storedLevelId, 10);
                if (!isNaN(parsedLevelId)) {
                    await formSelectChange('levelId', parsedLevelId);
                }

                const storedClassId = localStorage.getItem('lessonPlanClassId');
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
        const storedAreaId = localStorage.getItem('lessonPlanAreaId');
        if (storedAreaId) {
            const parsedAreaId = parseInt(storedAreaId, 10);
            if (!isNaN(parsedAreaId)) {
                formSelectChange('areaId', parsedAreaId);
            }
        }
      }, [areas]);

    useEffect(() => {
        const storedTopicId = localStorage.getItem('lessonPlanTopicId');
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

    const [classId, setClassId] = useState<number>(0);
    const [lessonId, setLessonId] = useState<number>(0);
    const [lessonName, setLessonName] = useState<string>("");

    const [viewLesson, setViewLesson] = useState<boolean>(false);
    const openViewLessonModal = (cid: number) => {
        setLessonId(cid);
        setViewLesson(true);
    };

    const closeViewLessonModal = () => {
        setLessonId(0);
        setViewLesson(false);
    };

    const [showLessonAssignmentModal, setShowLessonAssignmentModal] =
        useState<boolean>(false);

    const assignLesson = (classId: number, lessonId: number, lessonName: string) => {
        setClassId(classId);
        setLessonId(lessonId);
        setLessonName(lessonName);
        setShowLessonAssignmentModal(true);
    };

    const hideAssignLessonModal = () => {
        setClassId(0);
        setLessonId(0);
        setLessonName("");
        setShowLessonAssignmentModal(false);
    };

    return (
        <>
            <Head>
                <title>Lesson Planning</title>
            </Head>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="db_heading_block">
                            <h1 className="db_heading">Lesson Planning</h1>
                        </div>

                        <div className="parent_list_page">
                            <div className="formBlock">
                                <Row>
                                    <Col md={12} lg={12}>
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
                                                            localStorage.setItem("lessonPlanLevelId", (option || '').toString());
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
                                                            localStorage.setItem("lessonPlanClassId", (option || '').toString());
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
                                                            localStorage.setItem("lessonPlanAreaId", (option || '').toString());
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
                                                            localStorage.setItem("lessonPlanTopicId", (option || '').toString());
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

                                        <div className="tableListItems mt-3">
                                            <Table striped hover className="custom_design_table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Level</th>
                                                        <th>Area</th>
                                                        <th>Topic</th>
                                                        <th>Lesson</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {lessons &&
                                                        lessons.map((lesson) => {
                                                            return (
                                                                <tr key={lesson.id}>
                                                                    <td>{lesson.level.name}</td>
                                                                    <td>{lesson.area.name}</td>
                                                                    <td>{lesson.topic.name}</td>
                                                                    <td>{lesson.name}</td>
                                                                    <td className="text-center">
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
                                                                                <FontAwesomeIcon
                                                                                    icon={faInfo}
                                                                                    size="1x"
                                                                                />
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            delay={{ show: 50, hide: 100 }}
                                                                            overlay={<Tooltip>Assign</Tooltip>}
                                                                        >
                                                                            <span
                                                                                className="btn_main small anchor-span"
                                                                                onClick={() => {
                                                                                    assignLesson(
                                                                                        getValues().classId,
                                                                                        lesson.id,
                                                                                        lesson.name
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    icon={faPlusCircle}
                                                                                    size="1x"
                                                                                />
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {viewLesson && (
                <ViewLesson
                    id={lessonId}
                    isOpen={viewLesson}
                    onClose={closeViewLessonModal}
                />
            )}

            {showLessonAssignmentModal && (
                <Modal
                    show={showLessonAssignmentModal}
                    onHide={hideAssignLessonModal}
                    backdrop="static"
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Assign &quot;{lessonName}&quot; Lesson</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
                    >
                        <AssignLesson
                            classId={classId}
                            lessonId={lessonId}
                            onClose={hideAssignLessonModal}
                        />
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};
export default LessonPlanningPage;

export const getServerSideProps: GetServerSideProps<
    LessonPlanningPageProps
> = async (context) => {
    let initialParamas: LessonPlanningPageProps = {
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
