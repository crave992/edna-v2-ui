import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useReducer, useState } from "react";
import CommonProps from "@/models/CommonProps";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import Head from "next/head";
import {
    Button,
    Col,
    Container,
    FloatingLabel,
    Form,
    FormControl,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPenToSquare,
    faPlusCircle,
    faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import InvoiceConfigurationDto from "@/dtos/InvoiceConfigurationDto";
import InvoiceConfigurationParams from "@/params/InvoiceConfigurationParams";
import AddInvoiceConfiguration from "./AddInvoiceConfiguration";

interface InvoiceConfigurationPageProps extends CommonProps {
    q: string;
}

const initialPageState: InPageState<InvoiceConfigurationDto[]> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};
const InvoiceConfiguration: NextPage<
    InvoiceConfigurationPageProps
> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [orgorganizationId, setOrganizationId] = useState(-1);

    const router = useRouter();
    const {
        handleSubmit,
        register,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<InvoiceConfigurationParams>({
        defaultValues: {
            q: props.q,
        },
    });

    const [states, dispatch] = useReducer(
        reducer<InvoiceConfigurationDto[]>,
        initialPageState
    );

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

    const fetchInvoiceConfiguration = async () => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response =
            await unitOfService.InvoiceConfigurationService.getAll();
        if (response && response.status === 200 && response.data.data) {
            dispatch({
                type: InPageActionType.SET_DATA,
                payload: response.data.data,
            });
        }

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: false,
        });
    };

    useEffect(() => {
        (async () => {
            fetchInvoiceConfiguration();
            fetchOrganizationId();
            
        })();
    }, [states.refreshRequired]);

    const fetchOrganizationId = async () => {
        const response =
            await unitOfService.InvoiceConfigurationService.getOrganizationId();
        if (response && response.status === 200 && response.data.data) {
            setOrganizationId(response.data.data.organizationId);
        } else {
            setOrganizationId(0);
        }
    };

   

    return (
        <>
            <Head>
                <title>Invoice Configuration</title>
            </Head>
            <div className="parent_list_page">
                <Container fluid>
                    <Row>
                        <Col md={12} lg={12}>
                            <div className="db_heading_block">
                                <h1 className="db_heading">
                                    Invoice Configuration
                                </h1>
                            </div>
                            <Row>
                                <Col lg={9}><p>Configure how your monthly invoice&apos;s number to be sent to parents should look like. Eg: Start with <strong>ABCD00001</strong> and increment by 1. Generate the invoice on 3rd of every month. Invoice due by 10th of every month. Please enter numerical value in the said two fields.</p></Col>
                                <Col lg={3} className="text-end mb-2">
                                    {orgorganizationId === 0 ? (
                                        <Button
                                            className="btn_main"
                                            onClick={() => openAddUpdateModal(0)}
                                        >
                                            <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Invoice
                                        </Button>
                                    ) : (
                                        ""
                                    )}
                                </Col>
                            </Row>

                            <div className="tableListItems">
                                <div className="formBlock">
                                    <Table striped hover className="custom_design_table mb-0">
                                        <thead>
                                            <tr>
                                                <th>Start With</th>
                                                <th className="text-center">Increment By</th>
                                                <th className="text-center">Generate the Invoice on</th>
                                                <th className="text-center">Invoice due by</th>
                                                <th>Comments</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {states.data &&
                                                states.data.map(
                                                    (invoiceConfiguration: InvoiceConfigurationDto) => {
                                                        return (
                                                            <tr key={invoiceConfiguration.id}>
                                                                <td>{invoiceConfiguration.startWith}</td>
                                                                <td className="text-center">{invoiceConfiguration.incrementBy}</td>
                                                                <td className="text-center">{invoiceConfiguration.invoiceOn}</td>
                                                                <td className="text-center">{invoiceConfiguration.payBy}</td>
                                                                <td className="width35">{invoiceConfiguration.comments}</td>
                                                                <td className="text-center">
                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        delay={{ show: 50, hide: 100 }}
                                                                        overlay={<Tooltip>Edit</Tooltip>}
                                                                    >
                                                                        <span
                                                                            className="btn_main small anchor-span"
                                                                            onClick={() =>
                                                                                openAddUpdateModal(invoiceConfiguration.id)
                                                                            }
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faPenToSquare}
                                                                                size="1x"
                                                                            />
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            {states.showAddUpdateModal && (
                <AddInvoiceConfiguration
                    id={states.id}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}
        </>
    );
};

export default InvoiceConfiguration;

export const getServerSideProps: GetServerSideProps<
    InvoiceConfigurationParams
> = async (context) => {
    let initialParamas: InvoiceConfigurationParams = {
        q: `${context.query.q || ""}`,
    };

    return {
        props: initialParamas,
    };
};
