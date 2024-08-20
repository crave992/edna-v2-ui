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
import { StaffDegreeModel } from "@/models/StaffModel";
import { StaffDegreeValidationSchema } from "@/validation/StaffValidationSchema";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import Loader from "@/components/common/Loader";
import HolidayDto from "@/dtos/HolidayDto";
import HolidayModel from "@/models/HolidayModel";
import HolidayTypeDto from "@/dtos/HolidayTypeDto";
import ErrorLabel from "../../CustomError/ErrorLabel";
import Link from "next/link";
import HolidayValidationSchema from "@/validation/HolidayValidationSchema";

const initialState: InModalState = {
    modalHeading: "Add Holiday",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddHolidayProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddHoliday: NextPage<AddHolidayProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [holidays, dispatch] = useReducer(modalReducer, initialState);
    const [attachmentURL, setAttachmentURL] = useState<string>("");
    const fetchHoliday = async (id: number) => {
        const response = await unitOfService.HolidayService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let holiday = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Holiday",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", holiday.id);
            setValue("name", holiday.name);
            setValue("holidayTypeId", holiday.holidayTypeId);
            setValue("allowShare", holiday.allowShare);
            setValue("message", holiday.message);
            setValue("startDate", new Date(unitOfService.DateTimeService.convertToLocalDate(holiday.startDate).toString()));
            setValue("endDate", new Date(unitOfService.DateTimeService.convertToLocalDate(holiday.endDate).toString()));
            setValue("attachmentURL", holiday.attachments);
            setAttachmentURL(holiday.attachments);
        }
    };



    const { formState, handleSubmit, register, setValue, control } = useForm<HolidayModel>({
        resolver: yupResolver(HolidayValidationSchema),
        defaultValues: {
            id: 0,
            name: "",
            allowShare: false,
        },
    });

    const { errors } = formState;

    const submitData = async (data: HolidayModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof HolidayModel];
            if (key === "attachments") {
                formData.append(key, data?.[key][0]);
            } else {
                formData.append(key, value as string);
            }
        });

        let response: AxiosResponse<Response<HolidayDto>>;
        if (holidays.isUpdate) {
            response = await unitOfService.HolidayService.update(data.id, formData);
        } else {
            response = await unitOfService.HolidayService.add(formData);
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


    const [holidayTypes, setHolidayTypes] = useState<HolidayTypeDto[]>([]);
    const fetchHolidayType = async (q?: string) => {
        const response = await unitOfService.HolidayTypeService.getAll(q || '');
        if (response && response.status === 200 && response.data.data) {
            setHolidayTypes(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            fetchHolidayType();
            if (props.isOpen) {
                await fetchHoliday(props.id);
            }
        })();
    }, []);


    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(holidays.refreshRequired);
                }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{holidays.modalHeading}</Modal.Title>
                </Modal.Header>
                <Form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit(submitData)}
                >
                    <Form.Control type="hidden" {...register("id")} />
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Holiday Name*">
                                <CustomInput
                                    name="name"
                                    control={control}
                                    placeholder="Holiday Name*"
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="holidayTypeId"
                                control={control}
                                placeholder="Select Holiday Type*"
                                isSearchable={true}
                                options={holidayTypes}
                                textField="name"
                                valueField="id"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <CustomInput
                                type="datepicker"
                                name="startDate"
                                control={control}
                                placeholder="Start Date*"
                                dateFormat="MM/dd/yyyy"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <CustomInput
                                type="datepicker"
                                name="endDate"
                                control={control}
                                placeholder="End Date*"
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
                                props.onClose(holidays.refreshRequired);
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

            {holidays.showLoader && <Loader />}
        </>
    );
};

export default AddHoliday;
