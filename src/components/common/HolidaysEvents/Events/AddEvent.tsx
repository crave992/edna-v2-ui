import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, FormLabel, Modal } from "react-bootstrap";
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
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import Loader from "@/components/common/Loader";
import ErrorLabel from "../../CustomError/ErrorLabel";
import Link from "next/link";
import EventDto, { EventTypeDto } from "@/dtos/EventDto";
import { EventModel } from "@/models/EventModel";
import EventValidationSchema from "@/validation/EventValidationSchema";

const initialState: InModalState = {
    modalHeading: "Add Event",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddEventProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddEvent: NextPage<AddEventProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [events, dispatch] = useReducer(modalReducer, initialState);
    const [attachmentURL, setAttachmentURL] = useState<string>("");
    const fetchEvent = async (id: number) => {
        const response = await unitOfService.EventService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let event = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Event",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", event.id);
            setValue("name", event.name);
            setValue("message", event.message);
            setValue("eventTypeId", event.eventTypeId);
            setValue("allowShare", event.allowShare);
            setValue("date", new Date(unitOfService.DateTimeService.convertToLocalDate(event.date).toString()));
            setValue("attachmentsURL", event.attachments);
            setAttachmentURL(event.attachments);
        }
    };



    const { formState, handleSubmit, register, setValue, control } = useForm<EventModel>({
        resolver: yupResolver(EventValidationSchema),
        defaultValues: {
            id: 0,
            name: "",
            allowShare: false,
        },
    });

    const { errors } = formState;

    const submitData = async (data: EventModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof EventModel];
            if (key === "attachments") {
                formData.append(key, data?.[key][0]);
            } else {
                formData.append(key, value as string);
            }
        });

        let response: AxiosResponse<Response<EventDto>>;
        if (events.isUpdate) {
            response = await unitOfService.EventService.update(data.id, formData);
        } else {
            response = await unitOfService.EventService.add(formData);
        }

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && (response.status === 200 || response.status === 201) && response.data.data) {
            toast.success("Holiday saved successfully");

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


    const [eventTypes, setEventTypes] = useState<EventTypeDto[]>([]);
    const fetchEventTypes = async (q?: string) => {
        const response = await unitOfService.EventService.getAllEventType();
        if (response && response.status === 200 && response.data.data) {
            setEventTypes(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            fetchEventTypes();
            if (props.isOpen) {
                await fetchEvent(props.id);
            }
        })();
    }, []);


    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(events.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{events.modalHeading}</Modal.Title>
                </Modal.Header>
                <Form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit(submitData)}
                >
                    <Form.Control type="hidden" {...register("id")} />
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Event Name*">
                                <CustomInput
                                    name="name"
                                    control={control}
                                    placeholder="Event Name*"
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="eventTypeId"
                                control={control}
                                placeholder="Select Event Type*"
                                isSearchable={true}
                                options={eventTypes}
                                textField="name"
                                valueField="id"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <CustomInput
                                type="datepicker"
                                name="date"
                                control={control}
                                placeholder="Date*"
                                dateFormat="MM/dd/yyyy"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Message">
                                <CustomInput
                                    name="message"
                                    type="textarea"
                                    control={control}
                                    placeholder="Message"
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>Add Attachments</FormLabel>
                            <Form.Control type="file" {...register("attachments")} />
                            {errors.attachments && (
                                <ErrorLabel message={errors.attachments.message} />
                            )}


                            {attachmentURL && (
                                <FormLabel className="mt-3">
                                    <Link href={attachmentURL} target="_blank">
                                        {attachmentURL.split('/')[attachmentURL.split('/').length - 1]}
                                    </Link>
                                </FormLabel>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                className="mb-3"
                                inline
                                label="Click to share this event as a notification to the parents."
                                type="checkbox"
                                id="allowShare"
                                {...register("allowShare")}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn_main orange_btn"
                            onClick={() => {
                                props.onClose(events.refreshRequired);
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

            {events.showLoader && <Loader />}
        </>
    );
};

export default AddEvent;
