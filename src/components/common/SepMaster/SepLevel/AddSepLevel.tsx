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
import SepAreaDto, { SepAreaListResponseDto } from "@/dtos/SepAreaDto";
import SepLevelModel from "@/models/SepLevelModel";
import SepLevelDto from "@/dtos/SepLevelDto";
import SepLevelValidationSchema from "@/validation/SepLevelValidationSchema";
import LevelListParams from "@/params/LevelListParams";

const initialState: InModalState = {
    modalHeading: "Add SEP Level",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddSepLevelProps extends CommonProps {
    levels?: LevelDto[];
    sepAreass?: SepAreaDto[]
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddSepLevel: NextPage<AddSepLevelProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [sepLevels, dispatch] = useReducer(modalReducer, initialState);

    const fetchSepLevel = async (id: number) => {
        const response = await unitOfService.SepLevelService.getById(id);
        
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let sepLevel = response.data.data;
            
            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update SEP Level",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", sepLevel.id);
            setValue("name", sepLevel.name);
            setValue("levelId", sepLevel.level.id);
            setValue("sepAreaId", sepLevel.sepArea.id);
            fetchSepAreaByLevel(sepLevel.level.id)
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchSepLevel(props.id);
            }
        })();
    }, []);

    const { formState, handleSubmit, register, setValue, control } = useForm<SepLevelModel>({
        resolver: yupResolver(SepLevelValidationSchema),
        defaultValues: {
            id: 0,
            name: "",
            
        },
    });

    const { errors } = formState;

    const submitData = async (formData: SepLevelModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<SepLevelDto>>;
        if (sepLevels.isUpdate) {
            response = await unitOfService.SepLevelService.update(formData.id, formData);
        } else {
            response = await unitOfService.SepLevelService.add(formData);
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
            toast.success("SEP level saved successfully");

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


    const [sepAreas, setSepArea] = useState<SepAreaDto[]>([]);
    const fetchSepAreaByLevel = async (levelId: number) => {
        const response = await unitOfService.SepAreaService.getAreaByLevel(levelId);
        if (response && response.status === 200 && response.data.data) {
            setSepArea(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchLevel();
                
            }
        })();
    }, []);

    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(sepLevels.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{sepLevels.modalHeading}</Modal.Title>
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
                                placeholder="Class Level*"
                                isSearchable={true}
                                options={levels}
                                textField="name"
                                valueField="id"
                                onChange={(option) => {
                                    fetchSepAreaByLevel(+(option?.[0] || 0));
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="sepAreaId"
                                control={control}
                                placeholder="SEP Area*"
                                isSearchable={true}
                                options={sepAreas}
                                textField="name"
                                valueField="id"
                            />
                            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="SEP Level Name*">
                                <CustomInput control={control} name="name" placeholder="SEP Level Name*" />
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(sepLevels.refreshRequired);
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

            {sepLevels.showLoader && <Loader />}
        </>
    );
};

export default AddSepLevel;
