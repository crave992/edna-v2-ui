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
import { DegreeDto } from "@/dtos/DegreeDto";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import { StaffDegreeModel } from "@/models/StaffModel";
import { StaffDegreeValidationSchema } from "@/validation/StaffValidationSchema";
import { StaffDegreeDto } from "@/dtos/StaffDto";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import Loader from "@/components/common/Loader";

const initialState: InModalState = {
    modalHeading: "Add Degree",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddDegreeProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddDegree: NextPage<AddDegreeProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [staffDegrees, dispatch] = useReducer(modalReducer, initialState);

    const fetchDegreeCategory = async (id: number) => {
        const response = await unitOfService.StaffDegreeService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let degree = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Degree",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", degree.id);
            setValue("name", degree.name);
            setValue("degreeId", degree.degreeId);
        }
    };



    const { formState, handleSubmit, register, setValue, control } = useForm<StaffDegreeModel>({
        resolver: yupResolver(StaffDegreeValidationSchema),
        defaultValues: {
            id: 0,
            name: "",
        },
    });

    const { errors } = formState;

    const submitData = async (formData: StaffDegreeModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<StaffDegreeDto>>;
        if (staffDegrees.isUpdate) {
            response = await unitOfService.StaffDegreeService.update(formData.id, formData);
        } else {
            response = await unitOfService.StaffDegreeService.add(formData);
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
            toast.success("Degree saved successfully");

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


    const [degrees, setDegree] = useState<DegreeDto[]>([]);
    const fetchDegree = async () => {
        const response = await unitOfService.DegreeService.getAll();
        if (response && response.status === 200 && response.data.data) {
            setDegree(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchDegreeCategory(props.id);
                fetchDegree();
            }
        })();
    }, []);


    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(staffDegrees.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{staffDegrees.modalHeading}</Modal.Title>
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
                                name="degreeId"
                                control={control}
                                placeholder="Select Degree*"
                                isSearchable={true}
                                options={degrees}
                                textField="name"
                                valueField="id"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Name*">
                                <CustomInput control={control} name="name" placeholder="Name*" />
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(staffDegrees.refreshRequired);
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

            {staffDegrees.showLoader && <Loader />}
        </>
    );
};

export default AddDegree;
