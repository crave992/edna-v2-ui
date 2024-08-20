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
import { ChangeEvent, useEffect, useReducer, useState } from "react";
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
import { useRouter } from "next/router";
import Loader from "@/components/common/Loader";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import RegistrationFeesDto from "@/dtos/RegistrationFeesDto";
import RegistrationFeesParams from "@/params/RegistrationFeesParams";
import AddRegistrationFees from "./AddRegistrationFees";




const initialPageState: InPageState<RegistrationFeesDto[]> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const RegistrationFeeSetupPage: NextPage<RegistrationFeesParams> = (props) => {
    const router = useRouter();
    initialPageState.currentPage = props.page;
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [orgorganizationId, setOrganizationId] = useState(-1);

    const [states, dispatch] = useReducer(reducer<RegistrationFeesDto[]>, initialPageState);

    const { formState, handleSubmit, register, setValue, getValues } =
        useForm<RegistrationFeesParams>({
            defaultValues: {
                q: props.q,
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

    
    const submitData = async (formData: RegistrationFeesParams) => {
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


    async function actionFunction(p: RegistrationFeesParams) {
        const qs = require("qs");
        await fetchRegistrationFees(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

    const fetchRegistrationFees = async (p?: RegistrationFeesParams) => {
        if (!p) {
            p = props;
        }

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.RegistrationFeesService.getAll(p);
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
            fetchRegistrationFees();
            fetchOrganizationId()
        })();
    }, [states.refreshRequired]);


    useEffect(() => {
        (async () => {
            fetchRegistrationFees();
            
        })();
    }, []);

    

    const fetchOrganizationId = async () => {
        const response =
            await unitOfService.RegistrationFeesService.getOrganizationId();
        if (response && response.status === 200 && response.data.data) {
            setOrganizationId(response.data.data.organizationId);
        } else {
            setOrganizationId(0);
        }
    };


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

                               
                                {orgorganizationId === 0 ? (
                                    <Row className="mb-3">
                                        <Col className="text-end">
                                            <Button
                                                className="btn_main"
                                                type="button"
                                                onClick={() => openAddUpdateModal(0)}
                                            >
                                                <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Registration Fees
                                            </Button>
                                        </Col>
                                    </Row>
                                    ): (
                                            ""
                                    )}
                                    
                              
                            </Form>

                            <div className="tableListItems">
                                <Table striped hover className="custom_design_table mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Application Fees</th>
                                            <th className="text-center">Annual Registration Fees</th>
                                            <th className="text-center">Tax %</th>
                                            <th className="text-center">Credit Card Processing Fees</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {states.data &&
                                            states.data.map((registrationFees) => {
                                                return (
                                                    <tr key={registrationFees.id}>
                                                        <td className="text-center">{unitOfService.CurrencyCodeService.convertToCurrency(registrationFees.applicationFee)}</td>
                                                        <td className="text-center">{unitOfService.CurrencyCodeService.convertToCurrency(registrationFees.registrationFee)}</td>
                                                        <td className="text-center">{registrationFees.taxPercentage}%</td>
                                                        <td className="text-center">{registrationFees.creditCardCharges}%</td>
                                                        <td className="text-center">
                                                            <OverlayTrigger
                                                                placement="top"
                                                                delay={{ show: 50, hide: 100 }}
                                                                overlay={<Tooltip>Edit</Tooltip>}
                                                            >
                                                                <span
                                                                    className="btn_main small anchor-span"
                                                                    onClick={() => openAddUpdateModal(registrationFees.id)}
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
                                            })}
                                    </tbody>
                                </Table>
                                
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {states.showAddUpdateModal && (
                <AddRegistrationFees
                    id={states.id}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}

            {states.showLoader && <Loader />}
        </>
    );
};

export default RegistrationFeeSetupPage;
