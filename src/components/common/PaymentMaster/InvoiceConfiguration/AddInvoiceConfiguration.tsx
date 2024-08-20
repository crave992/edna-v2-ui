import React, { useEffect, useReducer } from "react";
import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import {
    InModalActionType,
    InModalState,
    modalReducer,
} from "@/reducers/InModalAction";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import Loader from "../../Loader";
import CustomInput from "../../CustomFormControls/CustomInput";
import InvoiceConfigurationModel from "@/models/InvoiceConfigurationModel";
import InvoiceConfigurationDto from "@/dtos/InvoiceConfigurationDto";
import InvoiceConfigurationValidationSchema from "@/validation/InvoiceConfigurationValidationSchema";
const initialState: InModalState = {
    modalHeading: "Add Invoice configuration",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddInvoiceConfigurationProp extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddInvoiceConfiguration: NextPage<AddInvoiceConfigurationProp> = (
    props
) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const [invoiceConfiguration, dispatch] = useReducer(
        modalReducer,
        initialState
    );

    const fetchInvoiceConfiguration = async (id: number) => {
        const response =
            await unitOfService.InvoiceConfigurationService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let invoiceConfiguration = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Invoice configuration",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", invoiceConfiguration.id);
            setValue("startWith", invoiceConfiguration.startWith);
            setValue("incrementBy", invoiceConfiguration.incrementBy.toString());
            setValue("invoiceOn", invoiceConfiguration.invoiceOn.toString());
            setValue("payBy", invoiceConfiguration.payBy.toString());
            setValue("comments", invoiceConfiguration.comments.toString());
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchInvoiceConfiguration(props.id);
            }
        })();
    }, []);

    const { formState, handleSubmit, register, setValue, control } =
        useForm<InvoiceConfigurationModel>({
            resolver: yupResolver(InvoiceConfigurationValidationSchema),
            defaultValues: {
                id: 0,
                startWith: '',
                incrementBy: '',
                invoiceOn: '',
                payBy: '',
                comments: '',
            },
        });

    const { errors } = formState;
    const submitData = async (formData: InvoiceConfigurationModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<InvoiceConfigurationDto>>;
        if (invoiceConfiguration.isUpdate) {
            response = await unitOfService.InvoiceConfigurationService.update(
                formData.id,
                formData
            );
        } else {
            response = await unitOfService.InvoiceConfigurationService.add(
                formData
            );
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
            toast.success("Invoice configuration saved successfully");

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
                    props.onClose(invoiceConfiguration.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{invoiceConfiguration.modalHeading}</Modal.Title>
                </Modal.Header>
                <Form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit(submitData)}
                >
                    <Form.Control type="hidden" {...register("id")} />
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Start With*">
                                <CustomInput
                                    control={control}
                                    name="startWith"
                                    placeholder="Start With*"
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Increment By*">
                                <CustomInput
                                    control={control}
                                    name="incrementBy"
                                    placeholder="Increment By*"
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Generate the Invoice on*">
                                <CustomInput
                                    control={control}
                                    name="invoiceOn"
                                    placeholder="Generate the Invoice on*"
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Invoice due by*">
                                <CustomInput
                                    control={control}
                                    name="payBy"
                                    placeholder="Invoice due by*"
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Comments to be added in the body of the invoice email*">
                                <CustomInput
                                    type="textarea"
                                    textAreaRows={5}
                                    control={control}
                                    name="comments"
                                    placeholder="Comments to be added in the body of the invoice email*"
                                />
                            </FloatingLabel>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(invoiceConfiguration.refreshRequired);
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

            {invoiceConfiguration.showLoader && <Loader />}
        </>
    );
};

export default AddInvoiceConfiguration;
