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
import { Col, FloatingLabel, Form, Row, Table } from "react-bootstrap";
import RecordPerPageOption from "../../RecordPerPageOption";
import ErrorLabel from "../../CustomError/ErrorLabel";
import Pagination from "../../Pagination";
import CustomInput from "../../CustomFormControls/CustomInput";
import { ClassListResponseDto } from "@/dtos/ClassDto";
import ClassListParams from "@/params/ClassListParams";
import { StaffBasicDto } from "@/dtos/StaffDto";


const initialPageState: InPageState<ClassAttendanceReportsListResponseDto> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const ClassAttendanceReport: NextPage<ClassAttendanceReportsListParams> = (props) => {
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


    async function actionFunction(p: ClassAttendanceReportsListParamsModel) {
        const qs = require("qs");
        await fetchClassAttendanceReport(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

    const fetchClassAttendanceReport = async (p?: ClassAttendanceReportsListParamsModel) => {
        if (!p) {
            p = props as unknown as ClassAttendanceReportsListParamsModel;
        }

        const params = p as unknown as ClassAttendanceReportsListParams;

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.ClassAttendanceService.getReportsByClass(params);
        if (response && response.status === 200 && response.data.data) {
            
            dispatch({
                type: InPageActionType.SET_DATA,
                payload: response.data.data,
            });

            dispatch({
                type: InPageActionType.SHOW_LOADER,
                payload: false,
            });
        }
    };

    useEffect(() => {
        (async () => {
            fetchClassAttendanceReport();
        })();
    }, [states.refreshRequired]);

    const [classes, setClass] = useState<ClassListResponseDto>();
    const fetchClass = async (p?: ClassListParams) => {
        const response = await unitOfService.ClassService.getAll(p);
        if (response && response.status === 200 && response.data.data) {
            setClass(response.data.data);
        }
    };

    const [staffs, setStaffs] = useState<StaffBasicDto[]>();
    const fetchStaff = async (id: number, p?: string) => {
        const response = await unitOfService.StaffService.getStaffByClassId(id, p || "");
        if (response && response.status === 200 && response.data.data) {
            const filteredStaffs = response.data.data.filter((staffL) => staffL.isMappedToClass === true);
            setStaffs(filteredStaffs);
        }
    };

    useEffect(() => {
        (async () => {
            fetchClass();
            
        })();
    }, [states.refreshRequired]);

   
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

    useEffect(() => {
        (async () => {
            await actionFunction(getValues());
        })();
    }, [fromDate, toDate]);

    const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.name === "recordPerPage") {
            setValue("recordPerPage", +e.target.value);
        } else if (e.target.name == "classId") {
            setValue("classId", +e.target.value);
            fetchStaff(getValues().classId, "");
        } 
        setValue("page", 1);
        dispatch({
            type: InPageActionType.SET_CURRENT_PAGE,
            payload: 1,
        });
        await actionFunction(getValues());
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
                                            <Col md={3}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Select Class</Form.Label>
                                                    <FloatingLabel label="Select Class">
                                                        <Form.Select
                                                            {...register("classId")}
                                                            onChange={formSelectChange}
                                                        >
                                                            <option value={0}>All</option>
                                                            {classes &&
                                                                classes.classes.map((classn) => {
                                                                    return (
                                                                        <option key={classn.id} value={classn.id}>
                                                                            {classn.name}
                                                                        </option>
                                                                    );
                                                                })}
                                                        </Form.Select>
                                                        {errors.classId && (
                                                            <ErrorLabel message={errors.classId.message} />
                                                        )}
                                                    </FloatingLabel>
                                                </Form.Group>
                                            </Col>
                                            <Col>
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
                                            <Col>
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
                                            <Col md={3}>
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
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {staffs && staffs.length > 0 && (
                            <div className="attendance_overview_bar p-2 mb-3">
                                <div className="mb-0">
                                    Assigned Staff:&nbsp;
                                    {staffs.map((staffL, index) => (
                                        <span className="me-0" key={staffL.id}>
                                            {staffL.name}{index !== staffs.length - 1 && ','}&nbsp;
                                        </span>
                                    ))}
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
                                        <th className="align-middle">Date</th>
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
                                                <tr key={attendance.id}>
                                                    <td>{unitOfService.DateTimeService.convertToLocalDate(attendance.attendanceDate)}</td>
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

export default ClassAttendanceReport;

