import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import AreaDto from "@/dtos/AreaDto";
import LessonDto from "@/dtos/LessonDto";
import LevelDto from "@/dtos/LevelDto";
import { StudentBasicDto } from "@/dtos/StudentDto";
import TopicDto from "@/dtos/TopicDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faInfo, faPlus, faTrash, faUser } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import {
    Button,
    ButtonGroup,
    Col,
    Container,
    FloatingLabel,
    Form,
    Image,
    Modal,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import LessonListParams from "@/params/LessonListParams";
import PaginationParams from "@/params/PaginationParams";
import { AssignStudentInLessonModel } from "@/models/LessonModel";
import { toast } from "react-toastify";
import { ClassBasicDto } from "@/dtos/ClassDto";
import ViewLessonShortDetails from "@/components/common/LessonMaster/Lesson/ViewLessonShortDetails";
import LevelListParams from "@/params/LevelListParams";

interface LessonPlanPageProps extends PaginationParams {
    id: number;
    levelId: number;
    areaId: number;
    topicId: number;
    classId: number;
}


const StudentLessonPlanPage: NextPage<LessonPlanPageProps> = (props) => {
    useBreadcrumb({
        pageName: "Assign Lessons",
        breadcrumbs: [
            {
                label: "Dashboard",
                link: "/admin/dashboard",
            },
            {
                label: "Student Profile",
                link: `/students/info/${props.id}`,
            },
            {
                label: "Lesson Plan",
                link: `/students/lesson-plan/${props.id}`,
            },
        ],
    });
    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    

    const [studentDetails, setStudentDetails] = useState<StudentBasicDto>();
    const fetchStudent = async (studentId: number) => {
        let response = await unitOfService.StudentService.getBasicStudentDetailsById(studentId);
        if (response && response.status === 200 && response.data.data) {
            setStudentDetails(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchStudent(props.id);
        })();
    }, []);

    const { formState, handleSubmit, register, setValue, getValues, control } =
        useForm<LessonPlanPageProps>({
            defaultValues: {
                id: props.id,
                areaId: props.areaId,
                levelId: props.levelId,
                topicId: props.topicId,
                classId: props.classId,
            },
            
        });

    const { errors } = formState;


    async function actionFunction(p: LessonListParams) {
        const qs = require("qs");
        await fetchLesson(props.id, p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

    const [levels, setLevel] = useState<LevelDto[]>([]);
    const fetchLevel = async (q?: LevelListParams) => {
        const response = await unitOfService.LevelService.getAll(q);
        if (response && response.status === 200 && response.data.data) {
            setLevel(response.data.data);
        }
    };

    const [areas, setArea] = useState<AreaDto[]>([]);
    const fetchAreaByLevel = async (levelId: number) => {
        const response = await unitOfService.AreaService.getAreaByLevel(levelId);
        if (response && response.status === 200 && response.data.data) {
            setArea(response.data.data);
        }
    };

    const [topics, setTopic] = useState<TopicDto[]>([]);
    const fetchTopicByLevelAndArea = async (levelId: number, areaId: number) => {
        const response = await unitOfService.TopicService.getTopicByLevelAndArea(levelId, areaId);
        if (response && response.status === 200 && response.data.data) {
            setTopic(response.data.data);
        }
    };

    const [lessons, setLesson] = useState<LessonDto[]>([]);
    const [assignedLessons, setAssignedLesson] = useState<LessonDto[]>([]);
    const fetchLesson = async (studentId: number, p?: LessonListParams) => {


        if(studentId > 0 && p && p.levelId > 0 && p.areaId > 0 && p.topicId > 0 && p.classId && p.classId > 0){
            const response = await unitOfService.LessonService.getByStudentId(studentId, p);
            if (response && response.status === 200 && response.data.data) {
                setLesson(response.data.data);
                setAssignedLesson(response.data.data);
            }
        }else{
            setLesson([]);
            setAssignedLesson([]);
        }

    };

    const [lessonDetails, setLessonDetails] = useState<LessonDto>();
    const fetchLessonDetails = async (lessonId:number) => {
        const response = await unitOfService.LessonService.getById(lessonId);
        if (response && response.status === 200 && response.data.data) {
            setLessonDetails(response.data.data);
            
        }
    };

    const [viewLessonPopup, setViewLessonPopup] = useState<boolean>(false);
    const [showLessonPopup, setShowLessonPopup] = useState<number>(0);
    const openLessonPopup = (lesId:number) => {
        setShowLessonPopup(lesId);
        setViewLessonPopup(true);
        fetchLessonDetails(lesId);
    };
    const closeLessonPopup = () => {
        setShowLessonPopup(0);
        setViewLessonPopup(false);
    };

    const [classes, setClasses] = useState<ClassBasicDto[]>([]);
    const fetchClass = async (studentId: number) => {
        const response = await unitOfService.ClassService.getClassByStudentId(studentId);
        if (response && response.status === 200 && response.data.data) {
            setClasses(response.data.data);
        }
    };


    useEffect(() => {
        (async () => {
            fetchLevel();
            fetchTopicByLevelAndArea(0, 0);
            fetchAreaByLevel(0);
            fetchLesson(props.id);
            fetchClass(props.id)
        })();
    }, []);


    const assignStudentToLesson = async (classId: number, studentId: number, lessonId: number) => {
        const assignment: AssignStudentInLessonModel = {
            classId: classId,
            studentId: studentId,
            lessonId: lessonId,
        };
        const response = await unitOfService.LessonService.assignStudentInLesson(assignment);
        if (response && response.status === 201) {
            toast.success("Lesson assigned successfully");
            fetchLesson(props.id, {
                areaId: getValues().areaId,
                levelId: getValues().levelId,
                topicId: getValues().topicId,
                classId: getValues().classId,
                page: 1,
                q: "",
                recordPerPage: 0,
                sortBy: "",
                sortDirection: "",
                
            });
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };

    const removeStudentfromLesson = async (classId: number, studentId: number, lessonId: number) => {
        const assignment: AssignStudentInLessonModel = {
            classId: classId,
            studentId: studentId,
            lessonId: lessonId,
        };
        const response = await unitOfService.LessonService.removeStudentFromLesson(assignment);
        if (response && response.status === 204) {
            toast.success("Lesson removed successfully");
            fetchLesson(props.id, {
                areaId: getValues().areaId,
                levelId: getValues().levelId,
                topicId: getValues().topicId,
                classId: getValues().classId,
                page: 1,
                q: "",
                recordPerPage: 0,
                sortBy: "",
                sortDirection: "",

            });
        } else if (response && response.status === 404) {
            toast.error("Lessson not assigned with this class.");
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };
    
    const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.name === "levelId") {
            let levelId = +(e.target.value || 0);
            setValue("levelId", levelId);
            setValue("areaId", 0);
            setValue("topicId", 0);
            await fetchAreaByLevel(levelId);
            await fetchTopicByLevelAndArea(levelId, getValues().areaId);
        } else if (e.target.name === "areaId") {
            let areaId = +(e.target.value || 0);
            setValue("areaId", areaId);
            setValue("topicId", 0);
            await fetchTopicByLevelAndArea(getValues().levelId, areaId);
        } else if (e.target.name === "topicId") {
            setValue("topicId", +e.target.value);
        } else if (e.target.name === "classId") {
            setValue("classId", +e.target.value);
        }
        await actionFunction(getValues());
    };

    const [activeButton, setActiveButton] = useState(0);
    const filterLesson = (type: string) => {
        if (type == "all") {
            setAssignedLesson(lessons);
        } else if (type == "assigned") {
            const assignedLessonFilter = lessons.filter(
                (e) => e.isMappedToStudent === true
            );
            setAssignedLesson(assignedLessonFilter);
        }
    };
 
    
      
    return (
        <>
            <Head>
                <title>Assign Lessons</title>
            </Head>
            <Container fluid>
                <Row>
                    <Col md={6} lg={5} xxl={4}>
                        
                        <div className="user_profile formBlock">
                            <div className="user_image">
                                {studentDetails?.profilePicture ? (
                                    <Image fluid alt={studentDetails?.name} src={studentDetails?.profilePicture}/>
                                ) : (
                                    <FontAwesomeIcon icon={faUser} size="2x" />
                                )}
                            </div>
                            <div className="user_detail">
                                <h2>{studentDetails?.name}</h2>                                
                                <p>Age: {studentDetails?.age}</p>
                                <p>Level: {studentDetails?.levelName}</p>
                                <p>Class: {studentDetails?.classes &&
                                    studentDetails?.classes.map((cla) => {
                                        return (
                                            <span key={cla.id}>
                                                {cla.name},&nbsp;
                                            </span>
                                        );
                                    })}
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6} lg={7} xxl={8}>
                        <div className="db_heading_block">
                            <h1 className="db_heading">Assign Lessons</h1>
                            <ButtonGroup aria-label="Basic example">
                                <Button variant={activeButton === 0 ? "sort active" : "sort"}
                                    onClick={() => {
                                        setActiveButton(0);
                                        filterLesson("all");
                                    }}
                                >All</Button>
                                <Button variant={activeButton === props.id ? "sort active" : "sort"}
                                    onClick={() => {
                                        setActiveButton(props.id);
                                        filterLesson("assigned");
                                    }}
                                >
                                    Assigned
                                </Button>
                            </ButtonGroup>
                        </div>
                        
                        <div className="formBlock">
                            <Form method="get" autoComplete="off">
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Select Class">
                                                <Form.Select
                                                    {...register("classId")}
                                                    onChange={formSelectChange}
                                                >
                                                    <option value={0}>All</option>
                                                    {classes &&
                                                        classes.map((classn) => {
                                                            return (
                                                                <option key={classn.id} value={classn.id}>
                                                                    {classn.name}
                                                                </option>
                                                            );
                                                        })}
                                                </Form.Select>
                                                {errors.classId && (<ErrorLabel message={errors.classId.message} />)}
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Select Level">
                                                <Form.Select
                                                    {...register("levelId")}
                                                    onChange={formSelectChange}
                                                >
                                                    <option value={0}>All</option>
                                                    {levels &&
                                                        levels.map((level) => {
                                                            return (
                                                                <option key={level.id} value={level.id}>
                                                                    {level.name}
                                                                </option>
                                                            );
                                                        })}
                                                </Form.Select>
                                                {errors.levelId && (<ErrorLabel message={errors.levelId.message} />)}
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Select Area">
                                                <Form.Select
                                                    {...register("areaId")}
                                                    onChange={formSelectChange}
                                                >
                                                    <option value={0}>All</option>
                                                    {areas &&
                                                        areas.map((area) => {
                                                            return (
                                                                <option key={area.id} value={area.id}>
                                                                    {area.name}
                                                                </option>
                                                            );
                                                        })}
                                                </Form.Select>
                                                {errors.areaId && (<ErrorLabel message={errors.areaId.message} />)}
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Select Topic">
                                                <Form.Select
                                                    {...register("topicId")}
                                                    onChange={formSelectChange}
                                                >
                                                    <option value={0}>All</option>
                                                    {topics &&
                                                        topics.map((topic) => {
                                                            return (
                                                                <option key={topic.id} value={topic.id}>
                                                                    {topic.name}
                                                                </option>
                                                            );
                                                        })}
                                                </Form.Select>
                                                {errors.topicId && (<ErrorLabel message={errors.topicId.message} />)}
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                            <div className="tableListItems">
                                <Table striped hover className="custom_design_table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Lesson Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {assignedLessons && assignedLessons.map((lesson) => {
                                                return (
                                                    <tr key={lesson.id}>
                                                        <td>{lesson.name}</td>
                                                        <td>
                                                            <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Info</Tooltip>}>
                                                                <span className="btn_main small anchor-span"
                                                                    onClick={() => {openLessonPopup(lesson.id);}}
                                                                >
                                                                    <FontAwesomeIcon icon={faInfo} size="1x" />
                                                                </span>
                                                            </OverlayTrigger>
                                                            {lesson.isMappedToStudent === true ? (
                                                                <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Remove</Tooltip>}>
                                                                    <span className="btn_main orange_btn small anchor-span"
                                                                    onClick={() => {
                                                                        removeStudentfromLesson(getValues().classId, props.id, lesson.id);
                                                                    }}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} size="1x" />
                                                                    </span>
                                                                </OverlayTrigger>
                                                            ) : (
                                                                <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Assign</Tooltip>}>
                                                                    <span className="btn_main small anchor-span"
                                                                    onClick={() => {
                                                                        assignStudentToLesson(getValues().classId, props.id, lesson.id);
                                                                    }}
                                                                    >
                                                                        <FontAwesomeIcon icon={faPlus} size="1x" />
                                                                    </span>
                                                                </OverlayTrigger>
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

            {viewLessonPopup && (
                <ViewLessonShortDetails
                    id={showLessonPopup}
                    isOpen={viewLessonPopup}
                    onClose={closeLessonPopup}
                />
            )}
            
        </>
    );
};
export default StudentLessonPlanPage;

export const getServerSideProps: GetServerSideProps<
    LessonPlanPageProps
> = async (context) => {
    let initialParamas: LessonPlanPageProps = {
        id: +(context.query.id || 0),
        levelId: +(context.query.levelId || 0),
        areaId: +(context.query.areaId || 0),
        topicId: +(context.query.topicId || 0),
        classId: +(context.query.classId || 0),
        q: `${context.query.q || ""}`,
        page: +(context.query.page || 1),
        recordPerPage: +(
            context.query.recordPerPage ||
            +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)
        ),
        sortBy: `${context.query.sortBy || "name"}`,
        sortDirection: `${context.query.sortDirection || "asc"}`,
    };

    return {
        props: initialParamas,
    };
};
