import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";

import {
    faPenToSquare,
    faPlusCircle,
    faTrash,
} from "@fortawesome/pro-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import {
    Button,
    Col,
    Container,
    FloatingLabel,
    Form,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";

import { useForm } from "react-hook-form";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import { useRouter } from "next/router";
import Pagination from "@/components/common/Pagination";
import Sorting from "@/components/common/Sorting";
import Loader from "@/components/common/Loader";
import ConfirmBox from "@/components/common/ConfirmBox";
import { toast } from "react-toastify";


import { useDebounce } from "use-debounce";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import PastDueFeeParams from "@/params/PastDueFeeParams";
import PastDueFeeDto from "@/dtos/PastDueFeeDto";
import AddPastDueFees from "./AddPastDueFees";



const initialPageState: InPageState<PastDueFeeDto[]> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const PastDueFeePage: NextPage<PastDueFeeParams> = (props) => {
    const router = useRouter();
    initialPageState.currentPage = props.page;
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<PastDueFeeDto[]>, initialPageState);

    const { formState, handleSubmit, register, setValue, getValues } =
        useForm<PastDueFeeParams>({
            defaultValues: {
                q: props.q,
                page: props.page,
                recordPerPage: props.recordPerPage,
                sortBy: props.sortBy,
                sortDirection: props.sortDirection,
            },
        });

    const { errors } = formState;

    const openAddUpdateModal = (cid: number) => {
        dispatch({
            type: InPageActionType.SET_ID,
            payload: cid,
        });

        dispatch({
            type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
            payload: true,
        });
    };

    const closeAddUpdateModal = (isRefresh: boolean) => {
        if (isRefresh) {
            dispatch({
                type: InPageActionType.IS_REFRESH_REQUIRED,
                payload: !states.refreshRequired,
            });
        }

        dispatch({
            type: InPageActionType.SET_ID,
            payload: 0,
        });

        dispatch({
            type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
            payload: false,
        });

    };

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

    const deletePastDueFees = async () => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.PastDueFeesService.delete(states.id);

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 204) {
            closeDeleteModal();

            toast.success("Past due fees deleted successfully");

            dispatch({
                type: InPageActionType.IS_REFRESH_REQUIRED,
                payload: !states.refreshRequired,
            });
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };

    const submitData = async (formData: PastDueFeeParams) => {
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

    async function actionFunction(p: PastDueFeeParams) {
        const qs = require("qs");
        await fetchPastDueFees(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

    const fetchPastDueFees = async (p?: PastDueFeeParams) => {
        if (!p) {
            p = props;
        }

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.PastDueFeesService.getAll(p);
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
            fetchPastDueFees();
        })();
    }, [states.refreshRequired]);


    useEffect(() => {
        (async () => {
            fetchPastDueFees();
        })();
    }, []);

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

 
    return (
        <>
            <div className="parent_list_page">
                <div className="formBlock">
                    <Row>
                        <Col md={12} lg={12}>
                            <Form
                                method="get"
                                autoComplete="off"
                                onSubmit={handleSubmit(submitData)}
                            >
                                <Form.Control type="hidden" {...register("sortBy")} />
                                <Form.Control type="hidden" {...register("page")} />
                                <Form.Control type="hidden" {...register("sortDirection")} />

                                <Row>
                                    <Col md={3}>
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

                                    <Col className="text-end">
                                        <Button
                                            className="btn_main"
                                            type="button"
                                            onClick={() => openAddUpdateModal(0)}
                                        >
                                            <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Due Fees
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>

                            <div className="tableListItems">
                                <Table striped hover className="custom_design_table mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Due From(day of month)</th>
                                            <th className="text-center">Up to Day</th>
                                            <th className="text-center">Past Due Fee</th>
                                            <th className="text-center">Fee Type</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {states.data &&
                                            states.data.map((pastduefees) => {
                                                return (
                                                    <tr key={pastduefees.id}>
                                                        <td className="text-center">{pastduefees.dueFrom}</td>
                                                        <td className="text-center">{pastduefees.uptoDate}</td>
                                                        <td className="text-center">{pastduefees.dueFee}</td>
                                                        <td className="text-center">{pastduefees.feeType}</td>
                                                        <td className="text-center">
                                                            <OverlayTrigger
                                                                placement="top"
                                                                delay={{ show: 50, hide: 100 }}
                                                                overlay={<Tooltip>Edit</Tooltip>}
                                                            >
                                                                <span
                                                                    className="btn_main small anchor-span"
                                                                    onClick={() => openAddUpdateModal(pastduefees.id)}
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faPenToSquare}
                                                                        size="1x"
                                                                    />
                                                                </span>
                                                            </OverlayTrigger>

                                                            <OverlayTrigger
                                                                placement="top"
                                                                delay={{ show: 50, hide: 100 }}
                                                                overlay={<Tooltip>Delete</Tooltip>}
                                                            >
                                                                <span
                                                                    className="btn_main orange_btn small anchor-span"
                                                                    onClick={() => {
                                                                        openDeleteModal(pastduefees.id);
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} size="1x" />
                                                                </span>
                                                            </OverlayTrigger>
                                                        </td>
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
                                            pageSize={getValues().recordPerPage}
                                            onPageChange={(page: number) => changePage(page)}
                                        />
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {states.showAddUpdateModal && (
                <AddPastDueFees
                    id={states.id}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}

            {states.showDeleteModal && (
                <ConfirmBox
                    isOpen={states.showDeleteModal}
                    onClose={closeDeleteModal}
                    onSubmit={deletePastDueFees}
                    bodyText="Are you sure want to delete this fees?"
                    noButtonText="Cancel"
                    yesButtonText="Confirm"
                />
            )}

            {states.showLoader && <Loader />}
        </>
    );
};

export default PastDueFeePage;
