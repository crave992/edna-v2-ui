import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
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
import ErrorLabel from "../../CustomError/ErrorLabel";
import Loader from "../../Loader";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import CustomInput from "../../CustomFormControls/CustomInput";
import LevelListParams from "@/params/LevelListParams";
import LevelDto from "@/dtos/LevelDto";
import AreaDto from "@/dtos/AreaDto";
import TopicDto from "@/dtos/TopicDto";
import LessonDto from "@/dtos/LessonDto";
import LessonModel from "@/models/LessonModel";
import LessonValidationSchema from "@/validation/LessonValidationSchema";

const initialState: InModalState = {
    modalHeading: "Add Lesson",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddMasterLessonProps extends CommonProps {
    areas?: AreaDto[];
    levels?: LevelDto[];
    topics?: TopicDto[];
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddMasterLesson: NextPage<AddMasterLessonProps> = (props) => {

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [lessons, dispatch] = useReducer(modalReducer, initialState);

    const fetchLesson = async (id: number) => {
        const response = await unitOfService.LessonService.getById(id);
       
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let lesson = response.data.data;
            
            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Lesson",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", lesson.id);
            setValue("name", lesson.name || '');
            setValue("sequenceName", lesson.sequenceName || '');
            setValue("description", lesson.description || '');
            setValue("materialUsed", lesson.materialUsed || '');
            setValue("sequenceNumber", lesson.sequenceNumber || 0);
            setValue("sequentialAssignment", lesson.sequentialAssignment.toLowerCase());
            setValue("areaId", lesson.area.id || 0);
            setValue("levelId", lesson.level.id || 0);
            setValue("topicId", lesson.topic.id || 0);
            fetchAreaByLevel(lesson.level.id);
            fetchTopicByLevelAndArea(lesson.level.id, lesson.area.id);
        }
    };


    const { formState, handleSubmit, register, setValue, getValues, control } = useForm<LessonModel>({
        resolver: yupResolver(LessonValidationSchema),
        defaultValues: {
            id: 0,
            name: "",
            sequenceName: "",
            description: "",
            materialUsed: "",
            sequentialAssignment: "",
            sequenceNumber: 0,
        },
    });

    const { errors } = formState;

    const submitData = async (formData: LessonModel) => {
        
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<LessonDto>>;
        if (lessons.isUpdate) {
            response = await unitOfService.LessonService.update(formData.id, formData);
        } else {
            response = await unitOfService.LessonService.add(formData);
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
            toast.success("Lesson saved successfully");

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

    const [areas, setArea] = useState<AreaDto[]>([]);
    const fetchAreaByLevel = async (levelId: number) => {
        const response = await unitOfService.AreaService.getAreaByLevel(levelId);
        if (response && response.status === 200 && response.data.data) {
            setArea(response.data.data);
        }
    };


    const [topics, setTopic] = useState<TopicDto[]>([]);
    const fetchTopicByLevelAndArea = async (levelId: number, areaId: number) => {
        const response = await unitOfService.TopicService.getTopicByLevelAndArea(levelId, areaId);
        if (response && response.status === 200 && response.data.data) {
            setTopic(response.data.data);
        }
    };


    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchLesson(props.id);
                fetchLevel();
            }   
        })();
    }, []);


    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(lessons.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                size="lg"
            >
                <Modal.Header>
                    <Modal.Title>{lessons.modalHeading}</Modal.Title>
                </Modal.Header>
                <Form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit(submitData)}
                >
                    <Form.Control type="hidden" {...register("id")} />
                    <Modal.Body>
                        <Row>
                            <Col lg="6">
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
                            </Col>
                            <Col lg="6">
                                <Form.Group className="mb-3">
                                    <CustomSelect
                                        name="areaId"
                                        control={control}
                                        placeholder="Select Area*"
                                        isSearchable={true}
                                        options={areas}
                                        textField="name"
                                        valueField="id"
                                        onChange={(option) => {
                                            fetchTopicByLevelAndArea(getValues().levelId, +(option?.[0] || 0));
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg="6">
                                <Form.Group className="mb-3">
                                    <CustomSelect
                                        name="topicId"
                                        control={control}
                                        placeholder="Select Topic*"
                                        isSearchable={true}
                                        options={topics}
                                        textField="name"
                                        valueField="id"
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg="6">
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Lesson Name*">
                                        <CustomInput control={control} name="name" placeholder="Lesson Name*" />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        
                        
                        <Row>
                            <Col lg={6}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Sequence Name">
                                        <CustomInput type="text" control={control} name="sequenceName" placeholder="Sequence Name" />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Sequence Number">
                                        <CustomInput type="text" control={control} name="sequenceNumber" placeholder="Sequence Number" />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <FloatingLabel label="Lesson Description*">
                                <CustomInput type="textarea" control={control} name="description" placeholder="Lesson Description*" />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Material Used*">
                                <CustomInput type="textarea" control={control} name="materialUsed" placeholder="Material Used*" />
                            </FloatingLabel>
                        </Form.Group>                        
                        <Col className="mb-3">
                            <Form.Label>Is the lesson to be assigned in sequential order?</Form.Label>
                            <Form.Group >
                                <Form.Check inline label="Yes" type="radio" value={"yes"} id="sequentialAssignmentYes" {...register("sequentialAssignment")} />
                                <Form.Check inline label="No" type="radio" value={"no"} id="sequentialAssignmentNo" {...register("sequentialAssignment")} />
                            </Form.Group>
                            {errors.sequentialAssignment && <ErrorLabel message={errors.sequentialAssignment.message} />}
                        </Col>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(lessons.refreshRequired);
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

            {lessons.showLoader && <Loader />}
        </>
    );
};

export default AddMasterLesson;
