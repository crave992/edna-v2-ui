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
import AreaDto from "@/dtos/AreaDto";
import {
    InModalActionType,
    InModalState,
    modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import LevelDto from "@/dtos/LevelDto";
import TopicDto from "@/dtos/TopicDto";
import TopicModel from "@/models/TopicModel";
import TopicValidationSchema from "@/validation/TopicValidationSchema";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import CustomInput from "../../CustomFormControls/CustomInput";

const initialState: InModalState = {
    modalHeading: "Add Topic",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddTopicProps extends CommonProps {    
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddTopic: NextPage<AddTopicProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [topics, dispatch] = useReducer(modalReducer, initialState);
    const fetchTopic = async (id: number) => {
        const response = await unitOfService.TopicService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let topic = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Topic",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", topic.id);
            setValue("name", topic.name);
            setValue("areaId", topic.areaId);
            setValue("levelId", topic.levelId);
            fetchAreaByLevel(topic.levelId);
        }
    };    

    const { formState, handleSubmit, register, setValue, control } = useForm<TopicModel>({
        resolver: yupResolver(TopicValidationSchema),
        defaultValues: {
            id: 0,
            name: "",
        },
    });

    const { errors } = formState;

    const submitData = async (formData: TopicModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<TopicDto>>;
        if (topics.isUpdate) {
            response = await unitOfService.TopicService.update(formData.id, formData);
        } else {
            response = await unitOfService.TopicService.add(formData);
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
            toast.success("Topic saved successfully");

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

    const [levels, setLevels] = useState<LevelDto[]>([]);
    const fetchLevel = async () => {
        const response = await unitOfService.LevelService.getAll();
        if (response && response.status === 200 && response.data.data) {
            setLevels(response.data.data)
        }
    };

    const [areas, setAreas] = useState<AreaDto[]>([]);
    const fetchAreaByLevel = async (levelId: number) => {
        const response = await unitOfService.AreaService.getAreaByLevel(levelId);
        if (response && response.status === 200 && response.data.data) {
            setAreas(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchTopic(props.id);
                fetchLevel();                
            }            
        })();
    }, []);

    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(topics.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{topics.modalHeading}</Modal.Title>
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
                                onChange={(option) => {
                                    fetchAreaByLevel(+(option?.[0] || 0));
                                }}
                            />  
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="areaId"
                                control={control}
                                placeholder="Select Area*"
                                isSearchable={true}
                                options={areas}
                                textField="name"
                                valueField="id"
                            />  
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel label="Topic Name*">
                                <CustomInput control={control} name="name" placeholder="Topic Name*" />
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(topics.refreshRequired);
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

            {topics.showLoader && <Loader />}
        </>
    );
};

export default AddTopic;
