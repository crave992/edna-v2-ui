import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import Loader from "@/components/common/Loader";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { DiaperingDto } from "@/dtos/ParentBabyLogDto";
import Response from "@/dtos/Response";
import CommonProps from "@/models/CommonProps";
import { DiaperingModel } from "@/models/ParentBabyLogModel";
import { InModalActionType, InModalState, modalReducer } from "@/reducers/InModalAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import BabyLogDiaperingValidationSchema from "@/validation/ParentBabyLogValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";
import { NextPage } from "next";
import { useReducer } from "react";
import { Button, FloatingLabel, Form, FormLabel, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const initialState: InModalState = {
    modalHeading: "Add Diapering",
    isUpdate: false,
    refreshRequired: false,
    showLoader: false,
};

interface AddDiaperingProps extends CommonProps {
    studentId: number;
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}


const AddDiapering: NextPage<AddDiaperingProps> = (props) => { 

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(modalReducer, initialState);

    const { formState: { errors }, handleSubmit, register, setValue, control } = useForm<DiaperingModel>({
        resolver: yupResolver(BabyLogDiaperingValidationSchema),
            defaultValues: {
                studentId: props.studentId,
                diaperChangedTime: "",
                isDiaperRashCreamApplied: false,
                type: "",
                message:"",
                
            },
        }
    );

    const submitData = async (data: DiaperingModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof DiaperingModel];
            if (key === "document") {
                formData.append(key, data?.[key][0]);
            } else {
                formData.append(key, value as string);
            }
        });

        let response: AxiosResponse<Response<DiaperingDto>>;
        response = await unitOfService.ParentBabyLogService.addDiapering(formData);
       
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        if (response && (response.status === 200 || response.status === 201) && response.data.data) {
            dispatch({
                type: InModalActionType.SHOW_LOADER,
                payload: true,
            });
            toast.success("Diapering saved successfully");
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
                            <FloatingLabel label="From">
                                <CustomInput control={control} name="diaperChangedTime" type="time" placeholder="From" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel
                                label="Daiper Content"
                                className="mb-3"
                            >
                                <Form.Select {...register("type")}>
                                    <option value={""}>Type</option>
                                    <option value="Wet">Wet</option>
                                    <option value="Dry">Dry</option>
                                    <option value="Both">Both</option>
                                    <option value="Bowel Movement">Bowel Movement</option>
                                </Form.Select>
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

                        <Form.Label>Was diaper rash cream applied?</Form.Label>
                        <Form.Group>
                            <Form.Check
                                className="mb-3"
                                inline
                                label="Yes"
                                type="radio"
                                value="true"
                                id="diaperRashCreamYes"
                                {...register("isDiaperRashCreamApplied")}
                            />
                            <Form.Check
                                className="mb-3"
                                inline
                                label="No"
                                type="radio"
                                value="false"
                                id="diaperRashCreamNo"
                                {...register("isDiaperRashCreamApplied")}
                            />
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
export default AddDiapering;