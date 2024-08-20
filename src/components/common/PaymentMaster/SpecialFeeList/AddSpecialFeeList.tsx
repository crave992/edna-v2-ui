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
import SpecialFeeListModel from "@/models/SpecialFeeListModel";
import SpecialFeeListValidationSchema from "@/validation/SpecialFeeListValidationSchema";
import SpecialFeeListDto from "@/dtos/SpecialFeeListDto";

const initialState: InModalState = {
    modalHeading: "Add Special Fee List",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddSpecialFeeListProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddSpecialFeeList: NextPage<AddSpecialFeeListProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [feeList, dispatch] = useReducer(modalReducer, initialState);

    const fetchSpecialFeeList = async (id: number) => {
        const response = await unitOfService.SpecialFeeListService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let specialFeeList = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Fee List",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", specialFeeList.id);
            setValue("name", specialFeeList.name);
            setValue("description", specialFeeList.description);
            setValue("pricePerUnit", specialFeeList.pricePerUnit.toString());
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchSpecialFeeList(props.id);
            }
        })();
    }, []);

    const { formState, handleSubmit, register, setValue, control } =
        useForm<SpecialFeeListModel>({
            resolver: yupResolver(SpecialFeeListValidationSchema),
            defaultValues: {
                id: 0,
                name: "",
                description: "",
                pricePerUnit: "",
            },
        });

    const { errors } = formState;

    const submitData = async (formData: SpecialFeeListModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<SpecialFeeListDto>>;
        if (feeList.isUpdate) {
            response = await unitOfService.SpecialFeeListService.update(
                formData.id,
                formData
            );
        } else {
            response = await unitOfService.SpecialFeeListService.add(formData);
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
            toast.success("Fee list saved successfully");

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
                    props.onClose(feeList.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{feeList.modalHeading}</Modal.Title>
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
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Price per unit*">
                                <CustomInput
                                    control={control}
                                    name="pricePerUnit"
                                    placeholder="Price per unit*"
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(feeList.refreshRequired);
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
            {feeList.showLoader && <Loader />}
        </>
    );
};

export default AddSpecialFeeList;
