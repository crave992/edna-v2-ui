import CommonProps from "@/models/CommonProps";
import HolidayTypeModel from "@/models/HolidayTypeModel";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import Loader from "../../Loader";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import {
    InModalActionType,
    InModalState,
    modalReducer,
} from "@/reducers/InModalAction";
import HolidayTypeValidationSchema from "@/validation/HolidayTypeValidationSchema";
import HolidayTypeDto from "@/dtos/HolidayTypeDto";
import CustomInput from "../../CustomFormControls/CustomInput";

const initialState: InModalState = {
    modalHeading: "Add Holiday Type",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddHolidayTypeProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddHolidayType: NextPage<AddHolidayTypeProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const [states, dispatch] = useReducer(modalReducer, initialState);

    const fetchHolidayType = async (id: number) => {
        const response = await unitOfService.HolidayTypeService.getById(id);
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });
        if (response && response.status === 200 && response.data.data) {
            let holidaytype = response.data.data;
            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Holiday Type",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });
            setValue("id", holidaytype.id);
            setValue("name", holidaytype.name);
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchHolidayType(props.id);
            }
        })();
    }, []);

    const { formState, handleSubmit, register, setValue, control } = useForm<HolidayTypeModel>(
        {
            resolver: yupResolver(HolidayTypeValidationSchema),
            defaultValues: {
                id: 0,
                name: "",
            },
        }
    );

    const { errors } = formState;

    const submitData = async (formData: HolidayTypeModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<HolidayTypeDto>>;
        if (states.isUpdate) {
            response = await unitOfService.HolidayTypeService.update(
                formData.id,
                formData
            );
        } else {
            response = await unitOfService.HolidayTypeService.add(formData);
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
            toast.success("Holiday Type saved successfully");
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
                            <FloatingLabel label="Name*">
                                <CustomInput control={control} name='name' placeholder="Name*"/>
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

export default AddHolidayType;
