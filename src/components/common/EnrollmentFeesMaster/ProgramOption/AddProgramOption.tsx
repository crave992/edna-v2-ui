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
import ProgramOptionModel from "@/models/ProgramOptionModel";
import ProgramOptionValidationSchema from "@/validation/ProgramOptionValidationSchema";
import ProgramOptionDto from "@/dtos/ProgramOptionDto";
import LevelListParams from "@/params/LevelListParams";

const initialState: InModalState = {
    modalHeading: "Add Program Option",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddProgramOptionProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddProgramOption: NextPage<AddProgramOptionProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [programOptions, dispatch] = useReducer(modalReducer, initialState);

    const fetchProgramOption = async (id: number) => {
        const response = await unitOfService.ProgramOptionService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let programOption = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Program Option",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", programOption.id);
            setValue("name", programOption.name);
            setValue("levelId", programOption.levelId);
            setValue("timeSchedule", programOption.timeSchedule);
            setValue("fees", programOption.fees.toString());
            setValue("order", programOption.order);

        }
    };



    const { formState, handleSubmit, register, setValue, control } = useForm<ProgramOptionModel>({
        resolver: yupResolver(ProgramOptionValidationSchema),
        defaultValues: {
            id: 0,
            name: "",
            timeSchedule: "",
            fees: "",
            order:0
        },
    });

    const { errors } = formState;

    const submitData = async (formData: ProgramOptionModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<ProgramOptionDto>>;
        if (programOptions.isUpdate) {
            response = await unitOfService.ProgramOptionService.update(formData.id, formData);
        } else {
            response = await unitOfService.ProgramOptionService.add(formData);
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
            toast.success("Program option saved successfully");

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


    const [levels, setLevel] = useState<LevelDto[]>([]);
    const fetchLevel = async (q?: LevelListParams) => {
        const response = await unitOfService.LevelService.getAll(q);
        if (response && response.status === 200 && response.data.data) {
            setLevel(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchProgramOption(props.id);
                fetchLevel();
            }
        })();
    }, []);


    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(programOptions.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{programOptions.modalHeading}</Modal.Title>
                </Modal.Header>
                <Form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit(submitData)}
                >
                    <Form.Control type="hidden" {...register("id")} />
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="levelId"
                                control={control}
                                placeholder="Select Level*"
                                isSearchable={true}
                                options={levels}
                                textField="name"
                                valueField="id"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Name*">
                                <CustomInput control={control} name="name" placeholder="Name*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Time/Schedule*">
                                <CustomInput control={control} name="timeSchedule" placeholder="Time/Schedule*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Monthly Tuition Fees*">
                                <CustomInput control={control} name="fees" placeholder="Monthly Tuition Fees*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Order*">
                                <CustomInput control={control} name="order" placeholder="Option order*" />
                            </FloatingLabel>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(programOptions.refreshRequired);
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

            {programOptions.showLoader && <Loader />}
        </>
    );
};

export default AddProgramOption;
