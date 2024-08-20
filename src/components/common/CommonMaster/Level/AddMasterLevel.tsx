import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer, useState } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import Loader from "../../Loader";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import {InModalActionType, InModalState, modalReducer,} from "@/reducers/InModalAction";
import LevelValidationSchema from "@/validation/LevelValidationSchema";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import { OrganizationTypeDto } from "@/dtos/OrganizationDto";
import LevelModel from "@/models/LevelModel";
import LevelDto from "@/dtos/LevelDto";

const initialState: InModalState = {
    modalHeading: "Add Level",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddMasterLevelProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddMasterLevel: NextPage<AddMasterLevelProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const [states, dispatch] = useReducer(modalReducer, initialState);

    const fetchLevel = async (id: number) => {
        const response = await unitOfService.LevelService.getById(id);
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });
        if (response && response.status === 200 && response.data.data) {
            let level = response.data.data;
            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Level",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });
            setValue("id", level.id);
            setValue("name", level.name);
            setValue("organizationTypeId", level.organizationType?.id);
            setValue("fromAge", level.fromAge);
            setValue("toAge", level.toAge);
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchLevel(props.id);
            }
        })();
    }, []);

    const { formState, handleSubmit, register, setValue, control } = useForm<LevelModel>(
        {
            resolver: yupResolver(LevelValidationSchema),
            defaultValues: {
                id: 0,
                name: "",
                fromAge: "",
                toAge: "",
            },
        }
    );

    const { errors } = formState;

    const submitData = async (formData: LevelModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<LevelDto>>;
        if (states.isUpdate) {
            response = await unitOfService.LevelService.update(
                formData.id,
                formData
            );
        } else {
            response = await unitOfService.LevelService.add(formData);
        }

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (
            response &&
            (response.status === 200 || response.status === 201) &&
            response.data.data
        ) {
            toast.success("Level saved successfully");
            dispatch({
                type: InModalActionType.IS_REFRESH_REQUIRED,
                payload: true,
            });
            props.onClose(true);
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
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
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(states.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{states.modalHeading}</Modal.Title>
                </Modal.Header>
                <Form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit(submitData)}
                >
                    <Form.Control type="hidden" {...register("id")} />
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Level Name*">
                                <CustomInput control={control} name="name" placeholder="Level Name*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="" className="mb-3">
                                <CustomSelect
                                    name="organizationTypeId"
                                    control={control}
                                    placeholder="Organization Type*"
                                    isSearchable={true}
                                    options={organizationType}
                                    textField="name"
                                    valueField="id"
                                />
                            </FloatingLabel>
                        </Form.Group>
                        

                        <Form.Group className="mb-3">
                            <FloatingLabel label="From Age*">
                                <CustomInput control={control} name="fromAge" placeholder="From Age*" />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel label="To Age*">
                                <CustomInput control={control} name="toAge" placeholder="To Age*" />
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(states.refreshRequired);
                            }}
                        >
                            Close
                        </Button>
                        <Button className="btn_main" type="submit">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {states.showLoader && <Loader />}
        </>
    );
};

export default AddMasterLevel;
