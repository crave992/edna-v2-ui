import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import {
    Button,
    FloatingLabel,
    Form,
    Modal,
    Table,
} from "react-bootstrap";
import { useEffect, useReducer, useState } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import {
    InModalActionType,
    InModalState,
    modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import LessonDto from "@/dtos/LessonDto";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import CustomInput from "../../CustomFormControls/CustomInput";
import { RecordKeepingLessonNotesModel } from "@/models/RecordKeepingModel";
import { RecordKeepingDto } from "@/dtos/RecordKeepingDto";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import RecordKeepingNotesValidationSchema from "@/validation/RecordKeepingNotesValidationSchema";

const initialState: InModalState = {
    modalHeading: "Add Lesson Notes",
    isUpdate: false,
    refreshRequired: false,
    showLoader: false,
};

interface AddRecordKeepingNotesProps extends CommonProps {
    studentId: number;
    lessonId: number;
    classId: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddRecordKeepingNotes: NextPage<AddRecordKeepingNotesProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(modalReducer, initialState);

    const { formState, handleSubmit, register, setValue, control } = useForm({
        resolver: yupResolver(RecordKeepingNotesValidationSchema),
        defaultValues: {
            id: 0,
            notes: "",
        },
    });


    const submitData = async (formData: RecordKeepingLessonNotesModel) => {
        
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<RecordKeepingDto>>;
        response = await unitOfService.RecordKeepingService.updateRecordKeepingNotes(props.studentId, props.classId, props.lessonId, formData);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && (response.status === 200 || response.status === 201) && response.data.data) {
            toast.success("Notes saved successfully");
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
                            <FloatingLabel label="Notes*">
                                <CustomInput control={control} type="textarea" name="notes" placeholder="Notes*" />
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

export default AddRecordKeepingNotes;
