import ConfirmBox from "@/components/common/ConfirmBox";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import Pagination from "@/components/common/Pagination";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { ClassListResponseDto, ClassStaffDto } from "@/dtos/ClassDto";
import LevelDto from "@/dtos/LevelDto";
import SemesterDto from "@/dtos/SemesterDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import ClassListParams from "@/params/ClassListParams";
import LevelListParams from "@/params/LevelListParams";
import PaginationParams from "@/params/PaginationParams";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faEdit, faInfo, faPlusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { Col, Container, FloatingLabel, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

const initialPageState: InPageState<ClassListResponseDto> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};


interface ClassListProps extends PaginationParams {
    levelId: number;
    sepAreaId: number;
    sepLevelId: number;
}



const ClassList: NextPage<ClassListParams> = (props) => {
    useBreadcrumb({
        pageName: "Classes",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Class List",
                link: "/admin/class",
            },
        ],
    });


    const router = useRouter();
    initialPageState.currentPage = props.page;
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<ClassListResponseDto>, initialPageState);
    
    const { formState, handleSubmit, register, setValue, getValues } =
        useForm<ClassListParams>({
            defaultValues: {
                levelId: props.levelId,
                semesterId: props.semesterId,
                q: props.q,
                page: props.page,
                recordPerPage: props.recordPerPage,
                sortBy: props.sortBy,
                sortDirection: props.sortDirection,
            },
        });

    const { errors } = formState;
    
    const openDeleteModal = (cid: number) => {
        dispatch({
            type: InPageActionType.SET_ID,
            payload: cid,
        });

        dispatch({
            type: InPageActionType.SHOW_DELETE_MODAL,
            payload: true,
        });
    };

    const closeDeleteModal = () => {
        dispatch({
            type: InPageActionType.SET_ID,
            payload: 0,
        });

        dispatch({
            type: InPageActionType.SHOW_DELETE_MODAL,
            payload: false,
        });
    };

    const deleteClass = async () => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.ClassService.delete(states.id);

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 204) {
            closeDeleteModal();

            toast.success("Class deleted successfully");

            dispatch({
                type: InPageActionType.IS_REFRESH_REQUIRED,
                payload: !states.refreshRequired,
            });
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };

    const submitData = async (formData: ClassListParams) => {
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

    async function actionFunction(p: ClassListParams) {
        const qs = require("qs");
        await fetchClass(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

    const fetchClass = async (p?: ClassListParams) => {
        if (!p) {
            p = props;
        }
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });
        const response = await unitOfService.ClassService.getAll(p);
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

    const [levels, setLevel] = useState<LevelDto[]>([]);
    const fetchLevel = async (q?: LevelListParams) => {
        const response = await unitOfService.LevelService.getAll(q);
        if (response && response.status === 200 && response.data.data) {
            setLevel(response.data.data);
        }
    };

    const [semester, setSemester] = useState<SemesterDto[]>([]);
    const fetchSemester = async (q?: string) => {
        const response = await unitOfService.SemesterService.getAll(q || '');
        if (response && response.status === 200 && response.data.data) {
            setSemester(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            fetchClass();
        })();
    }, [states.refreshRequired]);

    useEffect(() => {
        (async () => {
            fetchClass();
            fetchLevel();
            fetchSemester();
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

    useEffect(() => {
        (async () => {
            await actionFunction(getValues());
        })();
    }, [searchedValue]);



    const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.name === "levelId") {
            setValue("levelId", +e.target.value);
        } else if (e.target.name === "semesterId") {
            setValue("semesterId", +e.target.value);
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
            <Head>
                <title>Class List - Noorana</title>
            </Head>
            <div className="class_page">
                <Container fluid>
                    <Row>
                        
                            <Col lg={12} xl={12}>
                                <div className='db_heading_block'>
                                    <h1 className='db_heading'>Class List</h1>
                                </div>
                                <Form
                                    method="get"
                                    autoComplete="off"
                                    onSubmit={handleSubmit(submitData)}
                                >
                                    <Form.Control type="hidden" {...register("sortBy")} />
                                    <Form.Control type="hidden" {...register("page")} />
                                    <Form.Control type="hidden" {...register("sortDirection")} />
                                    <Row className="">
                                        <Col>
                                            <Form.Group className="mb-3">
                                                <FloatingLabel label="Filter by Level">
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
                                        <Col>
                                            <Form.Group className="mb-3">
                                                <FloatingLabel label="Filter by Semester">
                                                    <Form.Select
                                                        {...register("semesterId")}
                                                        onChange={formSelectChange}
                                                    >
                                                        <option value={0}>All</option>
                                                        {semester &&
                                                            semester.map((semester) => {
                                                                return (
                                                                    <option key={semester.id} value={semester.id}>
                                                                        {semester.name}
                                                                    </option>
                                                                );
                                                            })}
                                                    </Form.Select>
                                                    {errors.semesterId && (
                                                        <ErrorLabel message={errors.semesterId.message} />
                                                    )}
                                                </FloatingLabel>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <div className="searchSortBlock">
                                                <div className="searchBlock">
                                                    <FloatingLabel
                                                        controlId="floatingInput"
                                                        label="Search Class"
                                                        className="mb-3"
                                                    >
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Search lesson"
                                                            {...register("q")}
                                                            onChange={formInputChange}
                                                        />
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="text-end">
                                            <Link href='/admin/class/add' className='btn_main'><FontAwesomeIcon icon={faPlusCircle} size="1x" /> Class Setup</Link>
                                        </Col>
                                    </Row>
                                </Form>

                                <div className="formBlock table-responsive">
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
                                                <th>Class Name</th>
                                                <th>Level</th>
                                                <th>Semester</th>
                                                <th>Lead Guide</th>
                                                <th className="text-center">Capacity</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {states.data &&
                                                states.data?.classes.map((classname) => {
                                                    return (
                                                        <tr key={classname.id}>
                                                            <td>{classname.name}</td>
                                                            <td>{classname.level.name}</td>
                                                            <td>{classname.semester.name}</td>
                                                            <td>
                                                                {classname.classStaff?.map((staff: ClassStaffDto) => {
                                                                    return `${staff.firstName} ${staff.firstName}`;
                                                                })}
                                                            </td>                                                            
                                                            <td className="text-center">{classname.capacity}</td>
                                                            <td className="text-center">
                                                                <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Class Details</Tooltip>}>
                                                                    <Link className="btn_main small" href={`/admin/class/info/${classname.id}`}><FontAwesomeIcon icon={faInfo} size="1x" /></Link>
                                                                </OverlayTrigger>
                                                                <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Edit</Tooltip>}>
                                                                    <Link className="btn_main small" href={`/admin/class/edit/${classname.id}`} ><FontAwesomeIcon icon={faEdit} size="1x" /></Link>
                                                                </OverlayTrigger>                                                                
                                                            </td>
                                                        </tr> 
                                                    )
                                                })
                                            }
                                            
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
                </Container>
            </div>

            {states.showDeleteModal && (
                <ConfirmBox
                    isOpen={states.showDeleteModal}
                    onClose={closeDeleteModal}
                    onSubmit={deleteClass}
                    bodyText="Are you sure want to delete this class?"
                    noButtonText="Cancel"
                    yesButtonText="Confirm"
                />
            )}
        </>
    )
}
 
export default ClassList;

export const getServerSideProps: GetServerSideProps<ClassListParams> = async (context) => {
    let initialParamas: ClassListParams = {
        q: `${context.query.q || ""}`,
        levelId: +(context.query.levelId || 0),
        semesterId: +(context.query.semesterId || 0),
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
