import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import { LessonReportsListResponseDto } from "@/dtos/LessonDto";
import { LessonReportsListParams } from "@/params/LessonListParams"
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next"
import { useRouter } from "next/router";
import { ChangeEvent, Fragment, useEffect, useReducer, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row, Table } from "react-bootstrap";
import RecordPerPageOption from "../../RecordPerPageOption";
import ErrorLabel from "../../CustomError/ErrorLabel";
import { StudentBasicDto, StudentListResponseDto } from "@/dtos/StudentDto";
import StudentListParams from "@/params/StudentListParams";
import Pagination from "../../Pagination";
import LevelDto from "@/dtos/LevelDto";
import AreaDto from "@/dtos/AreaDto";
import TopicDto from "@/dtos/TopicDto";
import UserDto from "@/dtos/UserDto";
import { useSession } from "next-auth/react";

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/pro-solid-svg-icons";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

const initialPageState: InPageState<LessonReportsListResponseDto> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};


const StudentAcademicReport: NextPage<LessonReportsListParams> = (props) => { 
    const { data: session, status } = useSession();
    const [user, setUser] = useState<UserDto>();

    useEffect(() => {
        setUser(session?.user);
    }, [status]);

    const router = useRouter();
    initialPageState.currentPage = props.page;
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<LessonReportsListResponseDto>, initialPageState);

    const { formState, handleSubmit, register, setValue, getValues, control } =
        useForm<LessonReportsListParams>({
            defaultValues: {
                q: props.q,
                studentId: props.studentId,
                levelId:props.levelId,
                areaId: props.areaId,
                topicId: props.topicId,
                page: props.page,
                recordPerPage: props.recordPerPage,
                sortBy: props.sortBy,
                sortDirection: props.sortDirection,
            },
        });

    const { errors } = formState;

    async function actionFunction(p: LessonReportsListParams) {
        const qs = require("qs");
        await fetchStudentAcademicReport(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

    const submitData = async (formData: LessonReportsListParams) => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        dispatch({
            type: InPageActionType.SET_CURRENT_PAGE,
            payload: 1,
        });

        formData.page = 1;
        setValue("page", formData.page);

        await actionFunction(formData);
    };

    async function changePage(pageNumber: number) {
        dispatch({
            type: InPageActionType.SET_CURRENT_PAGE,
            payload: pageNumber,
        });

        let values = getValues();
        values.page = pageNumber;
        setValue("page", pageNumber);

        await actionFunction(values);
    }


    const [reportData, setReportData] = useState<any[]>([]);
    const fetchStudentAcademicReport = async (p?: LessonReportsListParams) => {
        if (!p) {
            p = props;
        }

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.LessonService.getReportByStudent(p);
        if (response && response.status === 200 && response.data.data) {
            
            dispatch({
                type: InPageActionType.SET_DATA,
                payload: response.data.data,
            });

            dispatch({
                type: InPageActionType.SHOW_LOADER,
                payload: false,
            });

            setReportData(response.data.data.reports);
        }
        
    };

    useEffect(() => {
        (async () => {
            fetchStudentAcademicReport();
        })();
    }, [states.refreshRequired]);


    const [students, setStudents] = useState<StudentListResponseDto>();
    const fetchStudents = async (p?: StudentListParams) => {
        if (!p) {
            p = props;
        }
        const response = await unitOfService.StudentService.getStudents(p);
        if (response && response.status === 200 && response.data.data) {
            setStudents(response.data.data);
        }
    };

    const [studentDetail, setStudentDetail] = useState<StudentBasicDto>();
    const fetchStudentDetails = async (studentId:number) => {
        const response = await unitOfService.StudentService.getBasicStudentDetailsById(studentId);
        if (response && response.status === 200 && response.data.data) {
            setStudentDetail(response.data.data);
        }
    };

    const [levels, setLevel] = useState<LevelDto[]>([]);
    const fetchLevel = async () => {
        const response = await unitOfService.LevelService.getAll();
        if (response && response.status === 200 && response.data.data) {
            setLevel(response.data.data);
        }
    };

    const [levelDetails, setLevelDetails] = useState<LevelDto | null>(null);
    const fetchLevelDetail = async (id: number) => {
        const response = await unitOfService.LevelService.getById(id);
        if (response && response.status === 200 && response.data.data) {
            setLevelDetails(response.data.data);
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

    useEffect(() => {
        (async () => {
            fetchStudents();
            fetchLevel();
            fetchAreaByLevel(0);
            fetchTopicByLevelAndArea(0, 0);
        })();
    }, []);

    const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.name === "recordPerPage") {
            setValue("recordPerPage", +e.target.value);
        } else if (e.target.name === "studentId") {
            setValue("studentId", +e.target.value);
            setValue("levelId", 0);
            setValue("areaId", 0);
            setValue("topicId", 0);
            setValue("status", '');
            setLevelDetails(null);
            await fetchAreaByLevel(0);
            await fetchTopicByLevelAndArea(0, 0);
            await fetchStudentDetails(+e.target.value);
            await fetchLevelDetail(0);
        } else if (e.target.name === "levelId") {
            setValue("levelId", +e.target.value);
            setValue("areaId", 0);
            setValue("topicId", 0);
            setLevelDetails(null);
            await fetchAreaByLevel(+e.target.value);
            await fetchLevelDetail(+e.target.value);
        } else if (e.target.name === "areaId") {
            setValue("areaId", +e.target.value);
            setValue("topicId", 0);
            await fetchTopicByLevelAndArea(getValues().levelId, +e.target.value);
        } else if (e.target.name === "topicId") {
            setValue("topicId", +e.target.value);
        } else if (e.target.name === "status") {
            setValue("status", e.target.value);
        }
        setValue("page", 1);
        dispatch({
            type: InPageActionType.SET_CURRENT_PAGE,
            payload: 1,
        });
        await actionFunction(getValues());
    };

    const generatePDF = async () => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });
        const currentDate = unitOfService.DateTimeService.convertToLocalDate(new Date());
        const tableBody = reportData.map((report: any) => {
            const recordKeeping = report.recordKeepings[0];
            return [
                report.name,
                report.area.name,
                report.topic.name,
                recordKeeping ? `${unitOfService.DateTimeService.convertToLocalDate(recordKeeping.createdOn)}` : '',
                recordKeeping ? recordKeeping.practiceCount : '',
                recordKeeping ? recordKeeping.rePresented : '',
                recordKeeping ? recordKeeping.status : '',
            ]
        });

        const docDefinition: any = {
            pageOrientation: 'landscape',
            content: [
                { text: "Academic Report", style: "header" },
                { text: `Report Generated On: ${currentDate}`, style: "date" },
                { text: `Report Generated By: ${user?.fullName}`, style: "date" },
                {
                    text: [
                        { text: `Student: ${studentDetail?.name}`, style: "date" },
                        levelDetails ? { text: ', ', style: "date" } : null,
                        levelDetails ? { text: `Level: ${levelDetails.name}`, style: "date" } : null
                    ]
                },
                {
                    style: "table",
                    table: {
                        headerRows: 1,
                        widths: ["*", "*", "*", "*", "*", "*", "*"],
                        body: [
                            [
                                { text: "Lesson", style: "tableHeader" },
                                { text: "Area", style: "tableHeader" },
                                { text: "Topic", style: "tableHeader" },
                                { text: "Introduced", style: "tableHeader" },
                                { text: "Times Practiced", style: "tableHeader" },
                                { text: "Represented", style: "tableHeader" },
                                { text: "Acquired", style: "tableHeader" },
                            ],
                            ...tableBody,
                        ],
                    },
                    layout: {
                        hLineWidth: function (i: number, node: any) {
                            return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                        },
                        vLineWidth: function (i: number, node: any) {
                            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                        },
                        hLineColor: function (i: number, node: any) {
                            return (i === 0 || i === node.table.body.length) ? '#dbe7f1' : '#dbe7f1';
                        },
                        vLineColor: function (i: number, node: any) {
                            return (i === 0 || i === node.table.widths.length) ? '#dbe7f1' : '#dbe7f1';
                        },
                    }
                },

            ],

            styles: {
                header: {
                    fontSize: 15,
                    bold: true,
                    alignment: "center",
                    margin: [0, 0, 0, 5],
                    color: "#444444",
                },
                date: {
                    fontSize: 10,
                    bold: true,
                    alignment: "center",
                    margin: [0, 0, 0, 3],
                    color: "#666666",
                },
                table: {
                    margin: [0, 10, 0, 10],
                    fontSize: 10,
                    borderWidth: 0,
                    color: "#444444",
                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    fillColor: "#dbe7f1",
                    color: "#000000",
                    margin: [0, 2, 0, 2],
                },
            },
        };
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: false,
        });

        pdfMake.createPdf(docDefinition).download(`${studentDetail?.name}_academic_report.pdf`);
    };

    return (
        <>
            <div>
                <Row>
                    <Col md={12}>
                        <div className="formBlock">
                            <Row>
                                <Col md={12}>
                                    <Form
                                        method="get"
                                        autoComplete="off"
                                        onSubmit={handleSubmit(submitData)}
                                    >
                                        <Form.Control type="hidden" {...register("sortBy")} />
                                        <Form.Control type="hidden" {...register("page")} />
                                        <Form.Control type="hidden" {...register("sortDirection")} />

                                        <Row className="align-items-center">
                                            <Col lg={3} xl>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Select Student</Form.Label>
                                                    <FloatingLabel label="Select Student">
                                                        <Form.Select
                                                            {...register("studentId")}
                                                            onChange={formSelectChange}
                                                        >
                                                            <option value={0}>All</option>
                                                            {students &&
                                                                students.student.map((student) => {
                                                                    return (
                                                                        <option key={student.id} value={student.id}>
                                                                            {student.name} {!student.active && "(Inactive)"}
                                                                        </option>
                                                                    );
                                                                })}
                                                        </Form.Select>
                                                        {errors.studentId && (
                                                            <ErrorLabel message={errors.studentId.message} />
                                                        )}
                                                    </FloatingLabel>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={3} xl>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Level</Form.Label>
                                                    <FloatingLabel label="Level">
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
                                                        {errors.levelId && (
                                                            <ErrorLabel message={errors.levelId.message} />
                                                        )}
                                                    </FloatingLabel>
                                                </Form.Group>
                                            </Col>
                                            
                                            <Col lg={3} xl>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Area</Form.Label>
                                                    <FloatingLabel label="Area">
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
                                                        {errors.areaId && (
                                                            <ErrorLabel message={errors.areaId.message} />
                                                        )}
                                                    </FloatingLabel>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={3} xl>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Topic</Form.Label>
                                                    <FloatingLabel label="Topic">
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
                                                        {errors.topicId && (
                                                            <ErrorLabel message={errors.topicId.message} />
                                                        )}
                                                    </FloatingLabel>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={3} xl>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Status</Form.Label>
                                                    <FloatingLabel label="Status">
                                                        <Form.Select
                                                            {...register("status")}
                                                            onChange={formSelectChange}
                                                        >
                                                            <option value=''>All</option>
                                                            <option value='planned'>Planned</option>
                                                            <option value='presented'>Presented</option>
                                                            <option value='practicing'>Practicing</option>
                                                            <option value='acquired'>Acquired</option>
                                                        </Form.Select>
                                                        {errors.topicId && (
                                                            <ErrorLabel message={errors.topicId.message} />
                                                        )}
                                                    </FloatingLabel>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={3} xl>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Record Per Page</Form.Label>
                                                    <FloatingLabel label="Record Per Page">
                                                        <Form.Select
                                                            {...register("recordPerPage")}
                                                            onChange={formSelectChange}
                                                        >
                                                            <RecordPerPageOption />
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                    {errors.recordPerPage && (
                                                        <ErrorLabel message={errors.recordPerPage.message} />
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col lg={3} xl>
                                                <Button className="btn_main mt-2" onClick={generatePDF}><FontAwesomeIcon icon={faDownload} size="1x" /> PDF</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {studentDetail && (
                            <div className="attendance_overview_bar p-2 mb-3">
                                <div className="mb-0">
                                    <p className="mb-0">Student:&nbsp;<span className="me-0">{studentDetail.name}</span>
                                        {levelDetails && (
                                            <>
                                                &nbsp;| Level: &nbsp;<span className="me-0">{levelDetails.name}</span>
                                            </>
                                        )}</p>
                                </div>
                            </div>
                        )}
                        <div className="tableListItems">
                            <div>
                                {!states.showLoader && (
                                    <Pagination
                                        className="pagination-bar"
                                        currentPage={states.currentPage}
                                        totalCount={states.data?.totalRecord}
                                        pageSize={getValues().recordPerPage}
                                        onPageChange={(page: number) => changePage(page)}
                                    />
                                )}
                            </div>
                            <Table striped hover className="custom_design_table mb-0">
                                <thead>
                                    <tr>
                                        <th className="align-middle">Name</th>
                                        <th className="align-middle">Area</th>
                                        <th className="align-middle">Topic</th>
                                        <th className="align-middle">Introduced Date</th>
                                        <th className="align-middle">Times Practiced</th>
                                        <th className="align-middle">Re-presented</th>
                                        <th className="align-middle">Acquired</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {states.data &&
                                        states.data?.reports.map((lesson) => {
                                            return (
                                                <tr key={lesson.id}>
                                                    <td>{lesson.name}</td>
                                                    <td>{lesson.area.name}</td>
                                                    <td>{lesson.topic.name}</td>
                                                    {lesson.recordKeepings && lesson.recordKeepings.length > 0 ? (
                                                        lesson.recordKeepings.map((recordKeeping) => (
                                                            <Fragment key={recordKeeping.id}>
                                                                <td>{unitOfService.DateTimeService.convertToLocalDate(recordKeeping.createdOn)}</td>
                                                                <td>{recordKeeping.practiceCount}</td>
                                                                <td>{recordKeeping.rePresented}</td>
                                                                <td>{recordKeeping.status}</td>
                                                            </Fragment>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                        </>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </Table>
                            <div>
                                {!states.showLoader && (
                                    <Pagination
                                        className="pagination-bar"
                                        currentPage={states.currentPage}
                                        totalCount={states.data?.totalRecord}
                                        pageSize={getValues().recordPerPage}
                                        onPageChange={(page: number) => changePage(page)}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default StudentAcademicReport;