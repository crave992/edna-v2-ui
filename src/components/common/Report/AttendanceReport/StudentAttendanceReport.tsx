import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { ClassAttendanceReportsListResponseDto } from "@/dtos/ClassAttendanceDto";
import { ClassAttendanceReportsListParams, ClassAttendanceReportsListParamsModel } from "@/params/ClassAttendanceReportsListParams";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { useForm } from "react-hook-form";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row, Table } from "react-bootstrap";
import { useDebounce } from "use-debounce";
import RecordPerPageOption from "../../RecordPerPageOption";
import ErrorLabel from "../../CustomError/ErrorLabel";
import Pagination from "../../Pagination";
import CustomInput from "../../CustomFormControls/CustomInput";
import { faDownload } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserDto from "@/dtos/UserDto";
import { useSession } from "next-auth/react";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


const initialPageState: InPageState<ClassAttendanceReportsListResponseDto> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const StudentAttendanceReport: NextPage<ClassAttendanceReportsListParams> = (props) => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<UserDto>();

    useEffect(() => {
        setUser(session?.user);
    }, [status]);

    const router = useRouter();
    initialPageState.currentPage = props.page;
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<ClassAttendanceReportsListResponseDto>, initialPageState);
    
    const initialFromDate = new Date();
    initialFromDate.setDate(initialFromDate.getDate() - 30);

    const { formState, handleSubmit, register, setValue, getValues, control } =
        useForm<ClassAttendanceReportsListParamsModel>({
            defaultValues: {
                q: props.q,
                fromDate: props.fromDate? new Date(unitOfService.DateTimeService.convertToLocalDate(new Date(props.fromDate))): initialFromDate,
                toDate: props.fromDate ? new Date(unitOfService.DateTimeService.convertToLocalDate(new Date(props.toDate))) : new Date(),
                classId: props.classId,
                page: props.page,
                recordPerPage: props.recordPerPage,
                sortBy: props.sortBy,
                sortDirection: props.sortDirection,
            },
        });
    
    const { errors } = formState;

    const submitData = async (formData: ClassAttendanceReportsListParamsModel) => {
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

    async function sortData(sortingColumn: string, sortDirection: string) {
        let values = getValues();
        values.sortBy = sortingColumn;
        values.sortDirection = sortDirection;
        setValue("sortBy", sortingColumn);
        setValue("sortDirection", sortDirection);

        await actionFunction(values);
    }

    async function actionFunction(p: ClassAttendanceReportsListParamsModel) {
        const qs = require("qs");
        await fetchStudentAttendanceReport(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }
    const [reportData, setReportData] = useState<any[]>([]);
    const fetchStudentAttendanceReport = async (p?: ClassAttendanceReportsListParamsModel) => {
        if (!p) {
            p = props as unknown as ClassAttendanceReportsListParamsModel;
        }

        const params = p as unknown as ClassAttendanceReportsListParams;
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });
        const response = await unitOfService.ClassAttendanceService.getReportsByStudent(params);
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
            fetchStudentAttendanceReport();
        })();
    }, [states.refreshRequired]);

    const formInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        let searchedText = e.target.value || "";
        setValue("q", searchedText);
        setValue("page", 1);
        dispatch({
            type: InPageActionType.SET_CURRENT_PAGE,
            payload: 1,
        });
    };

    const [searchedValue] = useDebounce(getValues().q, 1000);
    const [fromDate, setFromDate] = useState<string>(getValues().fromDate.toString());
    const [toDate, setToDate] = useState<string>(getValues().toDate.toString());


    useEffect(() => {
        (async () => {
            await actionFunction(getValues());
        })();
    }, [searchedValue, fromDate, toDate]);

    const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.name === "recordPerPage") {
            setValue("recordPerPage", +e.target.value);
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
        const tableBody = reportData.map((report: any) => [
            report.studentName,
            report.present,
            report.excuseAbsent,
            report.unexcusedAbsent,
            report.isTardy,
        ]);

        const docDefinition: any = {
            content: [
                { text: "Student Attendance Report", style: "header" },
                { text: `Report Generated On: ${currentDate}`, style: "date" },
                { text: `Report Generated By: ${user?.fullName}`, style: "date" },
                { text: `Report For: ${unitOfService.DateTimeService.convertToLocalDate(new Date(fromDate))} - ${unitOfService.DateTimeService.convertToLocalDate(new Date(toDate)) }`, style: "date" },
                {
                    style: "table",
                    table: {
                        headerRows: 1,
                        widths: ["*", "*", "*", "*", "*"],
                        body: [
                            [
                                { text: "Student Name", style: "tableHeader" },
                                { text: "Present", style: "tableHeader" },
                                { text: "Excused Absence", style: "tableHeader" },
                                { text: "Unexcused Absence", style: "tableHeader" },
                                { text: "Tardies", style: "tableHeader" },
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

        pdfMake.createPdf(docDefinition).download("student_attendance.pdf");
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
                                                     <Form.Label>From Date</Form.Label>
                                                     <CustomInput
                                                         control={control}
                                                         type="datepicker"
                                                         name={"fromDate"}
                                                         onDateSelect={(selectedDate: string) => {
                                                             setFromDate(selectedDate);
                                                         }}
                                                     />
                                                 </Form.Group>
                                             </Col>
                                             <Col lg={3} xl>
                                                 <Form.Group className="mb-3">
                                                     <Form.Label>To Date</Form.Label>
                                                     <CustomInput
                                                         control={control}
                                                         type="datepicker"
                                                         name={"toDate"}
                                                         onDateSelect={(selectedDate: string) => {
                                                             setToDate(selectedDate);
                                                         }}
                                                     />
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
                                                 <div className="searchSortBlock">
                                                     <div className="searchBlock">
                                                         <Form.Label>Search Student</Form.Label>
                                                         <FloatingLabel
                                                             controlId="floatingInput"
                                                             label="Search Student"
                                                             className="mb-3"
                                                         >
                                                             <Form.Control
                                                                 type="text"
                                                                 placeholder="Search Student"
                                                                 {...register("q")}
                                                                 onChange={formInputChange}
                                                             />
                                                         </FloatingLabel>
                                                     </div>
                                                 </div>
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
                                         <th className="align-middle">Student</th>
                                         <th>Present</th>
                                         <th>Excused Absence</th>
                                         <th>Unexcused Absence</th>
                                         <th>Tardies</th>
                                     </tr>
                                 </thead>

                                 <tbody>
                                     {states.data &&
                                         states.data?.reports.map((attendance) => {
                                             return (
                                                 <tr key={attendance.studentId}>
                                                     <td>{attendance.studentName}</td>
                                                     <td>{attendance.present}</td>
                                                     <td>{attendance.excuseAbsent}</td>
                                                     <td>{attendance.unexcusedAbsent}</td>
                                                     <td>{attendance.isTardy}</td>
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
    );
};

export default StudentAttendanceReport;

