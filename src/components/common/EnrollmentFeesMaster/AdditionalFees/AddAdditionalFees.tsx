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
import LevelListParams from "@/params/LevelListParams";

const initialState: InModalState = {
    modalHeading: "Add Additional Fees",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddAdditionalFeesProps extends CommonProps {
    //levels?: LevelDto[];
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddAdditionalFees: NextPage<AddAdditionalFeesProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [additionalFees, dispatch] = useReducer(modalReducer, initialState);

    const fetchAdditionalFees = async (id: number) => {
        const response = await unitOfService.AdditionalFeesService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let additionalFee = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Additional Fees",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", additionalFee.id);
            setValue("name", additionalFee.name);
            setValue("levelId", additionalFee.levelId);
            setValue("fees", additionalFee.fees.toString());
        }
    };



    const { formState, handleSubmit, register, setValue, control } = useForm<AdditionalFeesModel>({
        resolver: yupResolver(AdditionalFeesValidationSchema),
        defaultValues: {
            id: 0,
            name: "",
            fees: "",
        },
    });

    const { errors } = formState;

    const submitData = async (formData: AdditionalFeesModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<AdditionalFeeDto>>;
        if (additionalFees.isUpdate) {
            response = await unitOfService.AdditionalFeesService.update(formData.id, formData);
        } else {
            response = await unitOfService.AdditionalFeesService.add(formData);
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
            toast.success("Additional fees saved successfully");

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
                fetchAdditionalFees(props.id);
                fetchLevel();
            }
        })();
    }, []);


    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(additionalFees.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{additionalFees.modalHeading}</Modal.Title>
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
                            <FloatingLabel label="Monthly Tuition Fees*">
                                <CustomInput control={control} name="fees" placeholder="Monthly Tuition Fees*" />
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(additionalFees.refreshRequired);
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

            {additionalFees.showLoader && <Loader />}
        </>
    );
};

export default AddAdditionalFees;
