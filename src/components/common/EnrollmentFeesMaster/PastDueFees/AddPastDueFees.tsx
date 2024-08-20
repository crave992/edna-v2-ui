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
import LevelDto from "@/dtos/LevelDto";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import AdditionalFeesModel from "@/models/AdditionalFeesModel";
import AdditionalFeeDto from "@/dtos/AdditionalFeeDto";
import AdditionalFeesValidationSchema from "@/validation/AdditionalFeesValidationSchema";
import PastDueFeesModel from "@/models/PastDueFeesModel";
import PastDueFeeDto from "@/dtos/PastDueFeeDto";
import PastDueFeeValidationSchema from "@/validation/PastDueFeeValidationSchema";

const initialState: InModalState = {
    modalHeading: "Add Late Fees",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddPastDueFeesProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddPastDueFees: NextPage<AddPastDueFeesProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [pastDueFees, dispatch] = useReducer(modalReducer, initialState);

    const fetchPastDueFees = async (id: number) => {
        const response = await unitOfService.PastDueFeesService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let pastDueFee = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Fees",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", pastDueFee.id);
            setValue("dueFrom", pastDueFee.dueFrom.toString());
            setValue("uptoDate", pastDueFee.uptoDate.toString());
            setValue("dueFee", pastDueFee.dueFee.toString());
            setValue("feeType", pastDueFee.feeType);
        }
    };



    const { formState, handleSubmit, register, setValue, control } = useForm<PastDueFeesModel>({
        resolver: yupResolver(PastDueFeeValidationSchema),
        defaultValues: {
            id: 0,
            dueFrom: "",
            uptoDate: "",
            dueFee: "",
            feeType: "",
        },
    });

    const { errors } = formState;

    const submitData = async (formData: PastDueFeesModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<PastDueFeeDto>>;
        if (pastDueFees.isUpdate) {
            response = await unitOfService.PastDueFeesService.update(formData.id, formData);
        } else {
            response = await unitOfService.PastDueFeesService.add(formData);
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
                fetchPastDueFees(props.id);
            }
        })();
    }, []);


    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(pastDueFees.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{pastDueFees.modalHeading}</Modal.Title>
                </Modal.Header>
                <Form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit(submitData)}
                >
                    <Form.Control type="hidden" {...register("id")} />
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Due From(day of month)*">
                                <CustomInput control={control} name="dueFrom" placeholder="Due From(day of month)*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Up to Day*">
                                <CustomInput control={control} name="uptoDate" placeholder="Up to Day*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Past Due Fee*">
                                <CustomInput control={control} name="dueFee" placeholder="Past Due Fee*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Fee Type*">
                                <CustomInput control={control} name="feeType" placeholder="Fee Type*" />
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(pastDueFees.refreshRequired);
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

            {pastDueFees.showLoader && <Loader />}
        </>
    );
};

export default AddPastDueFees;
