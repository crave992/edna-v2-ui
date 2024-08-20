import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileInvoice, faInfo,
} from "@fortawesome/pro-solid-svg-icons";

import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import {
    Col,
    Container,
    FloatingLabel,
    Row,
    Form,
    Table,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import Head from "next/head";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import {
    InPageActionType,
    InPageState,
    reducer,
} from "@/reducers/InPageAction";
import { useRouter } from "next/router";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";
import { ListResponseDto } from "@/dtos/ListResponseDto";
import PaymentListParams from "@/params/PaymentListParams";
import { OldInvoicePaymentDto } from "@/dtos/InvoicePaymentDto";
import { faCircleCheck, faCircleExclamation } from "@fortawesome/pro-regular-svg-icons";
import ShowOldPaymentDetails from "./ShowOldPaymentDetails";

const initialPageState: InPageState<ListResponseDto<OldInvoicePaymentDto>> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const InvoicePaymentPage: NextPage<PaymentListParams> = (props) => {
    useBreadcrumb({
        pageName: "Payments",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Payments",
                link: "/payments",
            },
        ],
    });

    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(
        reducer<ListResponseDto<OldInvoicePaymentDto>>,
        initialPageState
    );

    const { handleSubmit, setValue, getValues, control, register } =
        useForm<PaymentListParams>({
            defaultValues: {
                q: props.q,
                page: props.page,
                recordPerPage: props.recordPerPage,
                sortBy: props.sortBy,
                sortDirection: props.sortDirection,
            },
        });
    
    const [refNum, setRefNum] = useState('')

    const openAddUpdateModal = (cid: number, referenceNumber:string) => {
        dispatch({
            type: InPageActionType.SET_ID,
            payload: cid,
        });

        dispatch({
            type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
            payload: true,
        });
        setRefNum(referenceNumber)
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


    const submitData = async (formData: PaymentListParams) => {
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

    async function actionFunction(p: PaymentListParams) {
        const qs = require("qs");
        await fetchOldPayments(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

    const fetchOldPayments = async (p?: PaymentListParams) => {
        if (!p) {
            p = props;
        }

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.InvoiceService.getOldPayments(p);
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
            await fetchOldPayments();
        })();
    }, [states.refreshRequired]);

    const formSelectChange = async (name: string, value: number | string) => {
        if (name === "recordPerPage") {
            setValue("recordPerPage", +value);
        }

        setValue("page", 1);
        dispatch({
            type: InPageActionType.SET_CURRENT_PAGE,
            payload: 1,
        });
        await actionFunction(getValues());
    };

    const [searchText, setSearchText] = useState<string>("");
    const formInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        let searchedText = e.target.value || "";
        if (e.target.name === "q") {
            setSearchText(searchedText);
            setValue("q", searchedText);
            setValue("page", 1);
            dispatch({
                type: InPageActionType.SET_CURRENT_PAGE,
                payload: 1,
            });
        }
    };

    const [searchedValue] = useDebounce(searchText, 1000);
    useEffect(() => {
        (async () => {
            await actionFunction(getValues());
        })();
    }, [searchedValue]);

    return (
        <>
            <Head>
                <title>Payments - Noorana</title>
            </Head>
            <div className="parent_list_page">
                <Container fluid>
                    <Row>
                        <Col md={12} lg={12}>
                            <Form
                                method="get"
                                autoComplete="off"
                                onSubmit={handleSubmit(submitData)}
                            >
                                <CustomInput type="hidden" name="sortBy" control={control} />
                                <CustomInput type="hidden" name="page" control={control} />
                                <CustomInput
                                    type="hidden"
                                    name="sortDirection"
                                    control={control}
                                />

                                <div className="db_heading_block">
                                    <h1 className="db_heading">Old Payments</h1>
                                </div>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Record Per Page">
                                                <Form.Select
                                                    {...register("recordPerPage")}
                                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                                        formSelectChange("recordPerPage", +e.target.value);
                                                    }}
                                                >
                                                    <RecordPerPageOption />
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <div className="searchSortBlock">
                                            <div className="searchBlock">
                                                <FloatingLabel
                                                    label="Search by parent, paid through and payment method"
                                                    className="mb-3"
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Search by parent, paid through and payment method"
                                                        {...register("q")}
                                                        onChange={formInputChange}
                                                    />
                                                </FloatingLabel>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="text-end mb-3">
                                        <Link href="/invoice" className="btn_main">
                                            <FontAwesomeIcon icon={faFileInvoice} size="1x" /> Invoice
                                        </Link>
                                    </Col>
                                </Row>
                            </Form>

                            <div className="tableListItems">
                                <div className="formBlock">
                                    {!states.showLoader && (
                                        <Pagination
                                            className="pagination-bar"
                                            currentPage={states.currentPage}
                                            totalCount={states.data?.totalRecord}
                                            pageSize={getValues().recordPerPage}
                                            onPageChange={(page: number) => changePage(page)}
                                        />
                                    )}
                                    <Table striped hover className="custom_design_table mb-0">
                                        <thead>
                                            <tr>
                                                <th>Transaction Date</th>
                                                <th>Paid By</th>
                                                <th className="text-center">Transaction Amount</th>
                                                <th className="text-center">Paid Through</th>
                                                <th className="text-center">Payment Method</th>
                                                <th className="text-center">Status</th>
                                                <th className="text-center">View Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {states.data?.data.map((payment) => {
                                                return (
                                                    <tr key={payment.id}>
                                                        <td>
                                                            {unitOfService.DateTimeService.convertToLocalDate(payment.transactionDate)}
                                                        </td>
                                                        <td>
                                                            {payment.paidBy}
                                                        </td>
                                                        <td className="text-center">
                                                            {payment.transactionAmount}
                                                        </td>
                                                        <td className="text-center">
                                                            {payment.modeOfPayment}
                                                        </td>
                                                        <td className="text-center">
                                                            {payment.methodOfPayment}
                                                        </td>
                                                        <td className="text-center">
                                                            {payment.status === 'Approved' ? (
                                                                <FontAwesomeIcon className="text-success" icon={faCircleCheck}/>
                                                            ) : (
                                                                <FontAwesomeIcon className="text-danger" icon={faCircleExclamation} />
                                                            )}
                                                        </td>

                                                        <td className="text-center">
                                                            <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>View</Tooltip>}>
                                                                <span className="btn_main small anchor-span"
                                                                    onClick={() => openAddUpdateModal(payment.id, payment.transactionNumber)}
                                                                >
                                                                    <FontAwesomeIcon icon={faInfo} size="1x" />
                                                                </span>
                                                            </OverlayTrigger>
                                                            
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
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
            {states.showAddUpdateModal && (
                <ShowOldPaymentDetails
                    id={states.id}
                    referenceNumber={refNum}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}
            {states.showLoader && <Loader />}
        </>
    );
};

export default InvoicePaymentPage;

export const getServerSideProps: GetServerSideProps<PaymentListParams> = async (
    context
) => {
    let initialParamas: PaymentListParams = {
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
