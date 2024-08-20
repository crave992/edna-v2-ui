import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import {
    InModalActionType,
    InModalState,
    modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import CustomInput from "../../CustomFormControls/CustomInput";
import OutsidePaymentMethodModel from "@/models/OutsidePaymentMethodModel";
import OutsidePaymentMethodDto from "@/dtos/OutsidePaymentMethodListResponseDto";
import OutsidePaymentMethodValidationSchema from "@/validation/OutsidePaymentMethodValidationSchema";

const initialState: InModalState = {
    modalHeading: "Add Payment Method",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddOutsidePaymentMethodProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddOutsidePaymentMethod: NextPage<AddOutsidePaymentMethodProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [outsidePaymentMethods, dispatch] = useReducer(modalReducer, initialState);

    const fetchOutsidePaymentMethod = async (id: number) => {
        const response = await unitOfService.OutsidePaymentMethodService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let outsidePaymentMethod = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Payment Method",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", outsidePaymentMethod.id);
            setValue("name", outsidePaymentMethod.name);
            setValue("description", outsidePaymentMethod.description);
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchOutsidePaymentMethod(props.id);
            }
        })();
    }, []);

    const { formState, handleSubmit, register, setValue, control } =
        useForm<OutsidePaymentMethodModel>({
            resolver: yupResolver(OutsidePaymentMethodValidationSchema),
            defaultValues: {
                id: 0,
                name: "",
                description: "",
            },
        });

    const { errors } = formState;

    const submitData = async (formData: OutsidePaymentMethodModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<OutsidePaymentMethodDto>>;
        if (outsidePaymentMethods.isUpdate) {
            response = await unitOfService.OutsidePaymentMethodService.update(
                formData.id,
                formData
            );
        } else {
            response = await unitOfService.OutsidePaymentMethodService.add(formData);
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
            toast.success("Payment method saved successfully");

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

    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(outsidePaymentMethods.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{outsidePaymentMethods.modalHeading}</Modal.Title>
                </Modal.Header>
                <Form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit(submitData)}
                >
                    <Form.Control type="hidden" {...register("id")} />
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Name*">
                                <CustomInput
                                    control={control}
                                    name="name"
                                    placeholder="Name*"
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Description*">
                                <CustomInput
                                    control={control}
                                    name="description"
                                    placeholder="Description*"
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(outsidePaymentMethods.refreshRequired);
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
            {outsidePaymentMethods.showLoader && <Loader />}
        </>
    );
};

export default AddOutsidePaymentMethod;
