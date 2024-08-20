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
import AreaDto from "@/dtos/AreaDto";
import {
    InModalActionType,
    InModalState,
    modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import CustomInput from "../../CustomFormControls/CustomInput";
import PaymentMethodModel from "@/models/PaymentMethodModel";
import PaymentMethodDto from "@/dtos/PaymentMethodDto";
import PaymentMethodValidationSchema from "@/validation/PaymentMethodValidationSchema";

const initialState: InModalState = {
    modalHeading: "Add Payment Method",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddPaymentMethodProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddPaymentMethod: NextPage<AddPaymentMethodProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [paymentMethods, dispatch] = useReducer(modalReducer, initialState);

    const fetchPaymentMethod = async (id: number) => {
        const response = await unitOfService.PaymentMethodService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let paymentMethod = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Payment Method",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", paymentMethod.id);
            setValue("name", paymentMethod.name);
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchPaymentMethod(props.id);
            }
        })();
    }, []);

    const { formState, handleSubmit, register, setValue, control } =
        useForm<PaymentMethodModel>({
            resolver: yupResolver(PaymentMethodValidationSchema),
            defaultValues: {
                id: 0,
                name: "",
            },
        });

    const { errors } = formState;

    const submitData = async (formData: PaymentMethodModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<PaymentMethodDto>>;
        if (paymentMethods.isUpdate) {
            response = await unitOfService.PaymentMethodService.update(
                formData.id,
                formData
            );
        } else {
            response = await unitOfService.PaymentMethodService.add(formData);
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
                    props.onClose(paymentMethods.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{paymentMethods.modalHeading}</Modal.Title>
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(paymentMethods.refreshRequired);
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
            {paymentMethods.showLoader && <Loader />}
        </>
    );
};

export default AddPaymentMethod;
