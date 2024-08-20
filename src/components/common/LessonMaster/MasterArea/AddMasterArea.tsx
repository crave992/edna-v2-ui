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
import AreaValidationSchema from "@/validation/AreaValidationSchema";
import {
    InModalActionType,
    InModalState,
    modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import LevelListParams from "@/params/LevelListParams";
import LevelDto from "@/dtos/LevelDto";
import AreaDto from "@/dtos/AreaDto";
import AreaModel from "@/models/AreaModel";

const initialState: InModalState = {
    modalHeading: "Add Area",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddMasterAreaProps extends CommonProps {
    levels?: LevelDto[];
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddMasterArea: NextPage<AddMasterAreaProps> = (props) => {
    
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [areas, dispatch] = useReducer(modalReducer, initialState);

    const fetchArea = async (id: number) => {
        const response = await unitOfService.AreaService.getById(id);
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            
            let area = response.data.data;
            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Area",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", area.id);
            setValue("name", area.name);
            setValue("levelId", area.level.id);
        }
    };

    

    const { formState, handleSubmit, register, setValue, control } = useForm<AreaModel>({
        resolver: yupResolver(AreaValidationSchema),
        defaultValues: {
            id: 0,
            name: "",
        },
    });

    const { errors } = formState;

    const submitData = async (formData: AreaModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<AreaDto>>;
        if (areas.isUpdate) {
            response = await unitOfService.AreaService.update(formData.id, formData);
        } else {
            response = await unitOfService.AreaService.add(formData);
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
            toast.success("Area saved successfully");

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
                fetchArea(props.id);
                fetchLevel();
            }
        })();
    }, []);


    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(areas.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{areas.modalHeading}</Modal.Title>
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
                            <FloatingLabel label="Area Name*">                                
                                <CustomInput control={control} name="name" placeholder="Area Name*"/>
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(areas.refreshRequired);
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

            {areas.showLoader && <Loader />}
        </>
    );
};

export default AddMasterArea;
