import useBreadcrumb from "@/hooks/useBreadcrumb";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Button, Col, Container, FloatingLabel, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { useForm } from "react-hook-form";
import LevelListParams, { MasterLevelListParams } from "@/params/LevelListParams";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlusCircle, faTrash } from "@fortawesome/pro-solid-svg-icons";


import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import ConfirmBox from "@/components/common/ConfirmBox";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import AddMasterLevel from "@/components/common/CommonMaster/Level/AddMasterLevel";
import CommonProps from "@/models/CommonProps";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import { OrganizationTypeDto } from "@/dtos/OrganizationDto";
import LevelDto from "@/dtos/LevelDto";


interface MasterLevelSetupPageProps extends CommonProps {
    q: string;
    organizationTypeId: number;
}

const initialPageState: InPageState<LevelDto[]> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const MasterLevelSetupPage: NextPage<MasterLevelSetupPageProps> = (props) => {
    useBreadcrumb({
        pageName: "Master Level",
        breadcrumbs: [
            {
                label: "Master Level",
                link: "/superadmin/master/level",
            },
        ],
    });
    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const { handleSubmit, register, setValue, getValues, formState: { errors }, } = useForm<LevelListParams>({
        defaultValues: {
            organizationTypeId: props.organizationTypeId,
            q: props.q,
        },
    });

    const [states, dispatch] = useReducer(reducer<LevelDto[]>, initialPageState);

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


    const deleteMasterLevel = async () => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.LevelService.delete(states.id);

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 204) {
            closeDeleteModal();

            toast.success("Level deleted successfully");

            dispatch({
                type: InPageActionType.IS_REFRESH_REQUIRED,
                payload: !states.refreshRequired,
            });
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };

    const fetchMasterLevel = async (q?: LevelListParams) => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.LevelService.getAll(q);
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
            fetchMasterLevel();
        })();
    }, [states.refreshRequired]);

    useEffect(() => {
        (async () => {
            fetchMasterLevel();
        })();
    }, []);

    const searchLevel = async (formData: LevelListParams) => {
        await actionFunction(formData);
    };

    async function actionFunction(p: LevelListParams) {
        const qs = require("qs");
        await fetchMasterLevel(p);
        router.push(
            {
                query: qs.stringify(p),
            },
            undefined,
            { shallow: true }
        );
    }

    const submitData = async (formData: LevelListParams) => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        dispatch({
            type: InPageActionType.SET_CURRENT_PAGE,
            payload: 1,
        });

        // formData.page = 1;
        // setValue("page", formData.page);

        await actionFunction(formData);
    };

    const updateSearchText = (e: ChangeEvent<HTMLInputElement>) => {
        let searchedText = e.target.value || "";
        dispatch({
            type: InPageActionType.SET_CURRENT_PAGE,
            payload: 1,
        });

        setValue("q", searchedText);
    };

    const [searchedValue] = useDebounce(getValues().q, 1000);

    useEffect(() => {
        (async () => {
            await actionFunction(getValues());
        })();
    }, [searchedValue]);


    const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.name === "organizationTypeId") {
            setValue("organizationTypeId", +e.target.value);
        } 
        //setValue("page", 1);
        dispatch({
            type: InPageActionType.SET_CURRENT_PAGE,
            payload: 1,
        });
        await actionFunction(getValues());
    };

    const [organizationType, setOrganizationType] = useState<OrganizationTypeDto[]>();

    const fetchOrganizationType = async () => {
        const response = await unitOfService.OrganizationService.getAllOrganizationType();
        if (response && response.status === 200 && response.data.data) {
            setOrganizationType(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchOrganizationType();
        })();
    }, []);

    return (
        <>
            <Head>
                <title>Master Level</title>
            </Head>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="db_heading_block">
                            <h1 className="db_heading">Setup - Master Level</h1>
                        </div>
                        <div className="formBlock">
                            <Form
                                method="get"
                                autoComplete="off"
                                onSubmit={handleSubmit(submitData)}
                            >
                                <Row>
                                    <Col md={3}>
                                        
                                            <div className="searchSortBlock">
                                                <div className="searchBlock">
                                                    <FloatingLabel
                                                        controlId="floatingInput"
                                                        label="Search Level"
                                                        className="mb-3"
                                                    >
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Search Level"
                                                            {...register("q")}
                                                            onChange={updateSearchText}
                                                        />
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Organization Type">
                                                <Form.Select
                                                    {...register("organizationTypeId")}
                                                    onChange={formSelectChange}
                                                >
                                                    <option value={0}>All</option>
                                                    {organizationType &&
                                                        organizationType.map((orgType) => {
                                                            return (
                                                                <option key={orgType.id} value={orgType.id}>
                                                                    {orgType.name}
                                                                </option>
                                                            );
                                                        })}
                                                </Form.Select>
                                                {errors.organizationTypeId && (
                                                    <ErrorLabel message={errors.organizationTypeId.message} />
                                                )}
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="text-end mb-3">
                                        <Button
                                            className="btn_main"
                                            onClick={() => openAddUpdateModal(0)}
                                        >
                                            <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Level
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>
                            <Table striped hover className="custom_design_table mb-0">
                                <thead>
                                    <tr>
                                        <th>Level Name</th>
                                        <th>Organization Type</th>
                                        <th>From Age</th>
                                        <th>To Age</th>
                                        <th>Added On</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {states.data &&
                                        states.data.map((level) => {
                                            return (
                                                <tr key={level.id}>
                                                    <td>{level.name}</td>
                                                    <td>{level.organizationType.name}</td>
                                                    <td>{level.fromAge}</td>
                                                    <td>{level.toAge}</td>
                                                    <td>
                                                        {unitOfService.DateTimeService.convertToLocalDate(
                                                            level.createdOn
                                                        )}
                                                    </td>
                                                    <td>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 50, hide: 100 }}
                                                            overlay={<Tooltip>Edit</Tooltip>}
                                                        >
                                                            <span
                                                                className="btn_main small anchor-span"
                                                                onClick={() => openAddUpdateModal(level.id)}
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
                                                                    openDeleteModal(level.id);
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
                        </div>
                    </Col>
                </Row>
            </Container>

            {states.showAddUpdateModal && (
                <AddMasterLevel
                    id={states.id}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}

            {states.showDeleteModal && (
                <ConfirmBox
                    isOpen={states.showDeleteModal}
                    onClose={closeDeleteModal}
                    onSubmit={deleteMasterLevel}
                    bodyText="Are you sure want to delete this level?"
                    noButtonText="Cancel"
                    yesButtonText="Confirm"
                />
            )}
            {states.showLoader && <Loader />}
        </>
    );
};
export default MasterLevelSetupPage;
