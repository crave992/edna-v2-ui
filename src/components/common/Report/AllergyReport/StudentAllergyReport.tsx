import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next"
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row, Table } from "react-bootstrap";

import RecordPerPageOption from "../../RecordPerPageOption";
import ErrorLabel from "../../CustomError/ErrorLabel";
import { StudentBasicDto, StudentListResponseDto } from "@/dtos/StudentDto";

import UserDto from "@/dtos/UserDto";
import { useSession } from "next-auth/react";

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/pro-solid-svg-icons";
import { StudentAllergyListParams } from "@/params/StudentAllergyListParams";
import { StudentAllergyReportDto } from "@/dtos/StudentAllergyReportDto";
import StudentListParams from "@/params/StudentListParams";
import Link from "next/link";
import CustomSelect from "../../CustomFormControls/CustomSelect";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

const initialPageState: InPageState<StudentAllergyReportDto> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};


const StudentAllergyReport: NextPage<StudentAllergyListParams> = (props) => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<UserDto>();

    useEffect(() => {
        setUser(session?.user);
    }, [status]);

    const router = useRouter();
    initialPageState.currentPage = props.page;
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<StudentAllergyReportDto>, initialPageState);

    const { formState, handleSubmit, register, setValue, getValues, control } =
        useForm<StudentAllergyListParams>({
            defaultValues: {
                q: props.q,
                studentId: props.studentId,
                page: props.page,
                recordPerPage: props.recordPerPage,
                sortBy: props.sortBy,
                sortDirection: props.sortDirection,
            },
        });

    const { errors } = formState;

    async function actionFunction(p: StudentAllergyListParams) {
        const qs = require("qs");
        await fetchStudentAllergyReport(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

    const submitData = async (formData: StudentAllergyListParams) => {
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


    const [reportData, setReportData] = useState<any>();
    const fetchStudentAllergyReport = async (p?: StudentAllergyListParams) => {
        if (!p) {
            p = props;
        }

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.StudentAllergyService.getStudentAllergyReport(p);
        if (response && response.status === 200 && response.data.data) {

            dispatch({
                type: InPageActionType.SET_DATA,
                payload: response.data.data,
            });

            dispatch({
                type: InPageActionType.SHOW_LOADER,
                payload: false,
            });

            setReportData(response.data.data);
        }

    };

    useEffect(() => {
        (async () => {
            fetchStudentAllergyReport();
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
    const fetchStudentDetails = async (studentId: number) => {
        const response = await unitOfService.StudentService.getBasicStudentDetailsById(studentId);
        if (response && response.status === 200 && response.data.data) {
            setStudentDetail(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            fetchStudents();
        })();
    }, []);

    const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.name === "recordPerPage") {
            setValue("recordPerPage", +e.target.value);
        } else if (e.target.name === "studentId") {
            setValue("studentId", +e.target.value);
            await fetchStudentDetails(+e.target.value);
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
        const tableBody = [
            [
                { text: "Allergy Name", style: "tableHeader" },
                ...reportData.map((report: any) => ({ text: report.allergyName, alignment: "left" })),
            ],
            [
                { text: "Allergy Indication", style: "tableHeader" },
                ...reportData.map((report: any) => ({ text: report.allergyIndication, alignment: "left" })),
            ],
            [
                { text: "Action Taken Against Reaction", style: "tableHeader" },
                ...reportData.map((report: any) => ({ text: report.actionTakenAgainstReaction, alignment: "left" })),
            ],
            [
                { text: "Action Taken Against Serious Reaction", style: "tableHeader" },
                ...reportData.map((report: any) => ({ text: report.actionTakenAgainstSeriousReaction, alignment: "left" })),
            ],
            [
                { text: "Contact Person 1", style: "tableHeader" },
                ...reportData.map((report: any) => ({ text: report.contactPersonName1, alignment: "left" })),
            ],
            [
                { text: "Contact Person 1 Phone", style: "tableHeader" },
                ...reportData.map((report: any) => ({ text: report.contactPersonPhoneNumber1, alignment: "left" })),
            ],
            [
                { text: "Contact Person 2", style: "tableHeader" },
                ...reportData.map((report: any) => ({ text: report.contactPersonName2, alignment: "left" })),
            ],
            [
                { text: "Contact Person 2 Phone", style: "tableHeader" },
                ...reportData.map((report: any) => ({ text: report.contactPersonPhoneNumber2, alignment: "left" })),
            ],
            [
                { text: "Call an Ambulance", style: "tableHeader" },
                ...reportData.map((report: any) => ({ text: report.callAnAmbulance ? "Yes" : "No", alignment: "left" })),
            ],
           
        ];

        const docDefinition: any = {
            pageOrientation: 'portrait',
            content: [
                { text: "Allergy Report", style: "header" },
                { text: `Report Generated On: ${currentDate}`, style: "date" },
                { text: `Report Generated By: ${user?.fullName}`, style: "date" },
                { text: `Student Name: ${studentDetail?.name}`, style: "date" },
                {
                    style: "table",
                    table: {
                        headerRows: 1,
                        widths: ["*", "*"],
                        body: tableBody,
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
                    color: "#444444",
                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: "#444444",
                    margin: [0, 2, 0, 2],
                },
            },
        };

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: false,
        });

        pdfMake.createPdf(docDefinition).download(`${studentDetail?.name}_allergy_report.pdf`);
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
                                            <Col lg={3}>
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
                                            <Col lg={3}>
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
                        <div className="tableListItems">
                            <Table striped hover className="custom_design_table mb-0">
                                {states.data &&
                                    states.data.map((allergy) => {
                                        return (
                                                <tbody key={allergy.studentId}>
                                                    <tr>
                                                        <td><strong>Student Name</strong></td>
                                                        <td><strong>{allergy.studentName}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Allergy Name</td>
                                                        <td>{allergy.allergyName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Allergy Indication</td>
                                                        <td>{allergy.allergyIndication}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Action Taken Against Reaction</td>
                                                        <td>{allergy.actionTakenAgainstReaction}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Action Taken Against Serious Reaction</td>
                                                        <td>{allergy.actionTakenAgainstSeriousReaction}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Contact Person 1</td>
                                                        <td>{allergy.contactPersonName1}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Contact Person 1 Phone</td>
                                                        <td>{allergy.contactPersonPhoneNumber1}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Contact Person 2</td>
                                                        <td>{allergy.contactPersonName2}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Contact Person 2 Phone</td>
                                                        <td>{allergy.contactPersonPhoneNumber2}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Call an Ambulance</td>
                                                        <td>{allergy.callAnAmbulance ? 'Yes' : 'No'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Medical Form</td>
                                                    <td>{allergy.medicalForm && (<a href={allergy.medicalForm} target='_blank'>View</a>)} </td>
                                                    </tr>
                                                </tbody>
                                        );
                                    })}
                            </Table>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default StudentAllergyReport;