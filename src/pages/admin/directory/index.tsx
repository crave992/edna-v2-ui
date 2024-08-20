import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import Pagination from "@/components/common/Pagination";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import useBreadcrumb from "@/hooks/useBreadcrumb";

import PaginationParams from "@/params/PaginationParams";
import { faCheckCircle, faInfoCircle, faTimesCircle, faUser } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, Fragment, useEffect, useReducer } from "react";
import { Col, Container, FloatingLabel, Form, Image, Row, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import {InPageActionType, InPageState, reducer,} from "@/reducers/InPageAction";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import DirectoryListResponseDto from "@/dtos/DirectoryListResponseDto";

import Link from "next/link";
import { DirectoryListParams } from "@/params/DirectoryListParams";


const initialPageState: InPageState<DirectoryListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};


const DirectoryPage: NextPage<DirectoryListParams> = (props) => {
    useBreadcrumb({
        pageName: "Directory",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Directory",
                link: "/admin/directory",
            },
        ],
    });

    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<DirectoryListResponseDto>, initialPageState);
    const { formState, handleSubmit, register, setValue, getValues } =
        useForm<DirectoryListParams>({
            defaultValues: {
                q: props.q,
                page: props.page,
                recordPerPage: props.recordPerPage,
                sortBy: props.sortBy,
                sortDirection: props.sortDirection,
                category:props.category,
            },
        });
    const { errors } = formState;

    async function actionFunction(p: DirectoryListParams) {
        const qs = require("qs");
        await fetchDirectory(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

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



    const fetchDirectory = async (p?: DirectoryListParams) => {
        if (!p) {
            p = props;
        }
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });
        const response = await unitOfService.DirectoryService.getAll(p);
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
            fetchDirectory();
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
        if (e.target.name === "category") {
            setValue("category", e.target.value);
        } else if (e.target.name === "recordPerPage") {
            setValue("recordPerPage", +e.target.value);
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
                <title>Directory - Noorana</title>
            </Head>

            <div className="home_page">
                <Container fluid>
                    <Row>
                        <Col md={12}>
                            <div className="db_heading_block">
                                <h1 className="db_heading">Directory</h1>
                            </div>
                            <Form
                                method="get"
                                autoComplete="off"
                                //onSubmit={handleSubmit(submitData)}
                            >
                                <Row>
                                    <Col lg xl={3}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Select Category">
                                                <Form.Select
                                                    {...register("category")}
                                                    onChange={formSelectChange}>
                                                    <option value="">Select Category</option>
                                                    <option value="Staff">Staffs</option>
                                                    <option value="Student">Students</option>
                                                    <option value="Parent">Prents</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col lg xl={3}>
                                        <Form.Group className="mb-3">
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
                                    <Col lg xl={3}>
                                        <div className="searchSortBlock">
                                            <div className="searchBlock">
                                                <FloatingLabel
                                                    controlId="floatingInput"
                                                    label="Search..."
                                                    className="mb-3"
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Search..."
                                                        {...register("q")}
                                                        onChange={formInputChange}
                                                    />
                                                </FloatingLabel>
                                            </div>
                                        </div>
                                    </Col>
                                    </Row>
                                </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            {!states.showLoader && (
                                <Pagination
                                    className="pagination-bar"
                                    currentPage={states.currentPage}
                                    totalCount={states.data?.totalRecord}
                                    pageSize={getValues().recordPerPage}
                                    onPageChange={(page: number) => changePage(page)}
                                />
                            )}
                            <div className="tableListItems">
                                {states.data?.staff ? (
                                    <>
                                        {/* {states.data &&
                                            states.data?.staff?.map((sta) => {
                                                return (
                                                    <div className="renderStaff" key={sta.id}>
                                                        <div className="userDetailsMain" style={{ justifyContent: "flex-start" }}>
                                                            <div className="userAvatar">
                                                                {sta.profilePicture ? (
                                                                    <Image
                                                                        fluid
                                                                        alt={sta.name}
                                                                        src={sta.profilePicture}
                                                                        style={{ maxWidth: "70px" }}
                                                                    />
                                                                ) : (
                                                                    <FontAwesomeIcon icon={faUser} size="2x" />
                                                                )}

                                                            </div>
                                                            <div className="userDetails">
                                                                <h2>
                                                                    <Link href={`/admin/staff/info/${sta.id}`}>
                                                                        {sta.name}&nbsp;
                                                                    </Link>
                                                                </h2>
                                                                <p>Job Title: {sta.jobTitle}</p>
                                                                <p>Hired Date:&nbsp;
                                                                    {unitOfService.DateTimeService.convertToLocalDate(
                                                                        sta.hiredDate
                                                                    )}
                                                                    |&nbsp;
                                                                    {sta.isActive === true ? (
                                                                        <span>
                                                                            <FontAwesomeIcon
                                                                                icon={faCheckCircle}
                                                                                size="1x"
                                                                                className="text-success"
                                                                            />{" "}
                                                                            Active
                                                                        </span>
                                                                    ) : (
                                                                        <span>
                                                                            <FontAwesomeIcon
                                                                                icon={faTimesCircle}
                                                                                size="1x"
                                                                                className="text-danger"
                                                                            />{" "}
                                                                            Inactive
                                                                        </span>
                                                                    )}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })} */}
                                    </>
                                    ) : states.data?.student ? (
                                        <>
                                            {states.data &&
                                                states.data?.student?.map((stu) => {
                                                    return (
                                                        <div className="renderStaff" key={stu.id}>
                                                            <div className="userDetailsMain" style={{ justifyContent: "flex-start" }}>
                                                                <div className="userAvatar">
                                                                    {stu.profilePicture ? (
                                                                        <Image
                                                                            fluid
                                                                            alt={stu.name}
                                                                            src={stu.profilePicture}
                                                                            style={{ maxWidth: "70px" }}
                                                                        />
                                                                    ) : (
                                                                        <FontAwesomeIcon icon={faUser} size="2x" />
                                                                    )}

                                                                </div>
                                                                <div className="userDetails">
                                                                    <h2>
                                                                        <Link href={`/student/info/${stu.id}`}>
                                                                            {stu.name}&nbsp;
                                                                        </Link>
                                                                    </h2>
                                                                    <p>
                                                                        {stu.classes &&
                                                                            stu.classes.map((cla) => {
                                                                                return (
                                                                                    <span
                                                                                        key={cla.id}
                                                                                        className="badge badge-primary"
                                                                                        style={{ backgroundColor: "#5d8eb5", marginRight: "5px" }}
                                                                                    >
                                                                                        {cla.name}
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                    </p>
                                                                    <p>{stu.age}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </>
                                        ) : states.data?.parent ?(
                                            <>
                                                <Table striped hover className="custom_design_table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Parents/ Guardians</th>
                                                            <th>Children</th>
                                                            <th className="text-center">Status</th>
                                                            <th className="text-center">Registration Status</th>
                                                            
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {states.data?.parent.map((parent) => {
                                                            return (
                                                                <tr key={parent.id}>
                                                                    <td>
                                                                        <span className="d-flex justify-content-between">
                                                                            <span>{parent.name}</span>
                                                                            <Link
                                                                                className="me-5"
                                                                                href={`/admin/parents/info/${parent.id}`}
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    icon={faInfoCircle}
                                                                                    className="orange_color"
                                                                                    size="1x"
                                                                                />
                                                                            </Link>
                                                                        </span>

                                                                        {parent.secondParent &&
                                                                            parent.secondParent.map((sec) => {
                                                                                return (
                                                                                    <span className="d-flex justify-content-between" key={sec.id}>
                                                                                        <span>{sec.name}</span>
                                                                                        <Link
                                                                                            className="me-5"
                                                                                            href={`/admin/parents/info/${sec.id}`}
                                                                                            title="View Details"
                                                                                        >
                                                                                            <FontAwesomeIcon
                                                                                                icon={faInfoCircle}
                                                                                                className="orange_color"
                                                                                                size="1x"
                                                                                            />
                                                                                        </Link>
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                    </td>
                                                                    <td className="align-middle">
                                                                        
                                                                        {parent.students &&
                                                                            parent.students.map((stud) => {
                                                                                return (
                                                                                    <span className="d-flex justify-content-between" key={stud.id}>
                                                                                        <span>{stud.name} {!stud.active && "(Inactive)"}</span>
                                                                                        <Link
                                                                                            className="me-5"
                                                                                            href={`/students/info/${stud.id}`}
                                                                                            title="View Details"
                                                                                        >
                                                                                            <FontAwesomeIcon
                                                                                                icon={faInfoCircle}
                                                                                                className="orange_color"
                                                                                                size="1x"
                                                                                            />
                                                                                        </Link>
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                    </td>
                                                                    <td className="text-center align-middle">
                                                                        {parent.isActive === true ? (
                                                                            <span>
                                                                                <FontAwesomeIcon
                                                                                    icon={faCheckCircle}
                                                                                    size="1x"
                                                                                    className="text-success"
                                                                                />{" "}
                                                                                Active
                                                                            </span>
                                                                        ) : (
                                                                            <span>
                                                                                <FontAwesomeIcon
                                                                                    icon={faTimesCircle}
                                                                                    size="1x"
                                                                                    className="text-danger"
                                                                                />{" "}
                                                                                Inactive
                                                                            </span>
                                                                        )}
                                                                    </td>

                                                                    <td className="align-middle text-center">
                                                                        {parent.registrationStatus}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </>
                                        ) : (
                                                <p>Select the category to show</p>
                                    )}
                                
                            </div>
                            {!states.showLoader && (
                                <Pagination
                                    className="pagination-bar"
                                    currentPage={states.currentPage}
                                    totalCount={states.data?.totalRecord}
                                    pageSize={getValues().recordPerPage}
                                    onPageChange={(page: number) => changePage(page)}
                                />
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default DirectoryPage;