import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import Loader from "@/components/common/Loader";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { FeedingDto } from "@/dtos/ParentBabyLogDto";
import Response from "@/dtos/Response";
import CommonProps from "@/models/CommonProps";
import { FeedingModel } from "@/models/ParentBabyLogModel";
import { InModalActionType, InModalState, modalReducer } from "@/reducers/InModalAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { BabyLogFeedingValidationSchema } from "@/validation/ParentBabyLogValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";
import { NextPage } from "next";
import { useReducer } from "react";
import { Button, FloatingLabel, Form, FormLabel, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const initialState: InModalState = {
    modalHeading: "Add Feeding",
    isUpdate: false,
    refreshRequired: false,
    showLoader: false,
};

interface AddFeedingProps extends CommonProps {
    studentId: number;
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}


const AddFeeding: NextPage<AddFeedingProps> = (props) => { 

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(modalReducer, initialState);

    const { formState: { errors }, handleSubmit, register, setValue, control } = useForm<FeedingModel>({
            resolver: yupResolver(BabyLogFeedingValidationSchema),
            defaultValues: {
                studentId: props.studentId,
                feedingTime: "",
                quantity: 0,
                message: "",
            },
        }
    );

    const submitData = async (data: FeedingModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof FeedingModel];
            if (key === "document") {
                formData.append(key, data?.[key][0]);
            } else {
                formData.append(key, value as string);
            }
        });

        let response: AxiosResponse<Response<FeedingDto>>;
        response = await unitOfService.ParentBabyLogService.addFeeding(formData);
       
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        if (response && (response.status === 200 || response.status === 201) && response.data.data) {
            dispatch({
                type: InModalActionType.SHOW_LOADER,
                payload: true,
            });
            toast.success("Feeding saved successfully");
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
                <Form method="post" autoComplete="off" onSubmit={handleSubmit(submitData)}>
                    <Form.Control type="hidden" {...register("studentId")} />
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="When did Daisy Eat?">
                                <CustomInput control={control} name="feedingTime" type="time" placeholder="When did Daisy Eat?" />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel label="Quantity">
                                <CustomInput control={control} name="quantity" placeholder="Quantity" />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel label="Message">
                                <CustomInput control={control} type="textarea" name="message" placeholder="Message" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>Add Attachments</FormLabel>
                            <Form.Control type="file" {...register("document")} />
                            {errors.document && (
                                <ErrorLabel message={errors.document.message} />
                            )}
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
    )
}
export default AddFeeding;