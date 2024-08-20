import { GetServerSideProps, NextPage } from "next";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";

import {
    faPenToSquare,
    faPlusCircle,
    faTrash,
} from "@fortawesome/pro-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useReducer } from "react";
import {
    Button,
    Col,
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
import Loader from "@/components/common/Loader";
import ConfirmBox from "@/components/common/ConfirmBox";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import PaymentMethodListParams from "@/params/PaymentMethodListParams";
import AddPaymentMethod from "@/components/common/PaymentMaster/PaymentMethod/AddPaymentMethod";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import { PaymentMethodListResponseDto } from "@/dtos/PaymentMethodDto";

const initialPageState: InPageState<PaymentMethodListResponseDto> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const PaymentMethodPage: NextPage<PaymentMethodListParams> = (props) => {

    const router = useRouter();
    initialPageState.currentPage = props.page;
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<PaymentMethodListResponseDto>, initialPageState);

    const { formState, handleSubmit, register, setValue, getValues, control } =
        useForm<PaymentMethodListParams>({
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

    const deletePaymentMethod = async () => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.PaymentMethodService.delete(states.id);

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 204) {
            closeDeleteModal();

            toast.success("Payment method deleted successfully");

            dispatch({
                type: InPageActionType.IS_REFRESH_REQUIRED,
                payload: !states.refreshRequired,
            });
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };

    const submitData = async (formData: PaymentMethodListParams) => {
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

    async function actionFunction(p: PaymentMethodListParams) {
        const qs = require("qs");
        await fetchPaymentMethod(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

    const fetchPaymentMethod = async (p?: PaymentMethodListParams) => {
        if (!p) {
            p = props;
        }
        const response = await unitOfService.PaymentMethodService.getAll(p);
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
            fetchPaymentMethod();
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



    return (
        <>
            <div className="parent_list_page">
                <div className="formBlock">
                    <Row>
                        <Col md={12} lg={12}>
                            <p>This list should include the accepted payment methods for electronic transactions that happens within EDNA software (ex: Credit card, ACH etc.)</p>
                            <Form
                                method="get"
                                autoComplete="off"
                                onSubmit={handleSubmit(submitData)}
                            >
                                <Form.Control type="hidden" {...register("sortBy")} />
                                <Form.Control type="hidden" {...register("sortDirection")} />

                                <Row>
                                    <Col>
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
                                    <Col>
                                        <div className="searchSortBlock">
                                            <div className="searchBlock">
                                                <FloatingLabel
                                                    controlId="floatingInput"
                                                    label="Search Payment Method"
                                                    className="mb-3"
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Search Payment Method"
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
                                            <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Payment Method
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>

                            <div className="tableListItems">
                                <Table striped hover className="custom_design_table mb-0">
                                    <thead>
                                        <tr>
                                            <th className="align-middle">
                                                Payment Method
                                            </th>
                                            <th>
                                                Added On
                                            </th>

                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {states.data &&
                                            states.data?.paymentMethods.map((payMethod) => {

                                                return (
                                                    <tr key={payMethod.id}>
                                                        <td>{payMethod.name}</td>
                                                        <td>
                                                            {unitOfService.DateTimeService.convertToLocalDate(
                                                                payMethod.createdOn
                                                            )}
                                                        </td>
                                                        <td className="text-center">
                                                            <OverlayTrigger
                                                                placement="top"
                                                                delay={{ show: 50, hide: 100 }}
                                                                overlay={<Tooltip>Edit</Tooltip>}
                                                            >
                                                                <span
                                                                    className="btn_main small anchor-span"
                                                                    onClick={() => openAddUpdateModal(payMethod.id)}
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
                                                                        openDeleteModal(payMethod.id);
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
            </div>

            {states.showAddUpdateModal && (
                <AddPaymentMethod
                    id={states.id}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}

            {states.showDeleteModal && (
                <ConfirmBox
                    isOpen={states.showDeleteModal}
                    onClose={closeDeleteModal}
                    onSubmit={deletePaymentMethod}
                    bodyText="Are you sure want to delete this payment method?"
                    noButtonText="Cancel"
                    yesButtonText="Confirm"
                />
            )}

            {states.showLoader && <Loader />}
        </>
    );
};

export default PaymentMethodPage;

