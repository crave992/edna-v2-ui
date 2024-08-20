import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer, useState } from "react";
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
import RegistrationFeesModel from "@/models/RegistrationFeesModel";
import RegistrationFeesDto from "@/dtos/RegistrationFeesDto";
import RegistrationFeesValidationSchema from "@/validation/RegistrationFeesValidationSchema";

const initialState: InModalState = {
    modalHeading: "Add Late Fees",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddRegistrationFeesProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddRegistrationFees: NextPage<AddRegistrationFeesProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [registrationFees, dispatch] = useReducer(modalReducer, initialState);

    const fetchRegistrationFees = async (id: number) => {
        const response = await unitOfService.RegistrationFeesService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let registrationFee = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Fees",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", registrationFee.id);
            setValue("applicationFee", registrationFee.applicationFee.toString());
            setValue("registrationFee", registrationFee.registrationFee.toString());
            setValue("taxPercentage", registrationFee.taxPercentage.toString());
            setValue("creditCardCharges", registrationFee.creditCardCharges.toString());
        }
    };



    const { formState, handleSubmit, register, setValue, control } = useForm<RegistrationFeesModel>({
        resolver: yupResolver(RegistrationFeesValidationSchema),
        defaultValues: {
            id: 0,
            applicationFee: "",
            registrationFee: "",
            taxPercentage: "",
            creditCardCharges: "",
        },
    });

    const { errors } = formState;

    const submitData = async (formData: RegistrationFeesModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<RegistrationFeesDto>>;
        if (registrationFees.isUpdate) {
            response = await unitOfService.RegistrationFeesService.update(formData.id, formData);
        } else {
            response = await unitOfService.RegistrationFeesService.add(formData);
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
            toast.success("Fees saved successfully");

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

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchRegistrationFees(props.id);
            }
        })();
    }, []);


    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(registrationFees.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{registrationFees.modalHeading}</Modal.Title>
                </Modal.Header>
                <Form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit(submitData)}
                >
                    <Form.Control type="hidden" {...register("id")} />
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Application Fees*">
                                <CustomInput control={control} name="applicationFee" placeholder="Application Fees*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Annual Registration Fees*">
                                <CustomInput control={control} name="registrationFee" placeholder="Annual Registration Fees*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Tax %*">
                                <CustomInput control={control} name="taxPercentage" placeholder="Tax %*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Credit Card Processing Fee %*">
                                <CustomInput control={control} name="creditCardCharges" placeholder="Credit Card Processing Fee %*" />
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(registrationFees.refreshRequired);
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

            {registrationFees.showLoader && <Loader />}
        </>
    );
};

export default AddRegistrationFees;
