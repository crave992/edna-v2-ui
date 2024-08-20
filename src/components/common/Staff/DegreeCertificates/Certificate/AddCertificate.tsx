import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, Form, Modal } from "react-bootstrap";
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
import { StaffCertificationModel } from "@/models/StaffModel";
import { StaffCertificationValidationSchema } from "@/validation/StaffValidationSchema";
import { StaffCertificationDto } from "@/dtos/StaffDto";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import Loader from "@/components/common/Loader";
import { CertificateDto } from "@/dtos/CertificateDto";

const initialState: InModalState = {
    modalHeading: "Add Certificate",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface AddCertificateProps extends CommonProps {
    id: number;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const AddCertificate: NextPage<AddCertificateProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(modalReducer, initialState);

    const fetchCertificateCategory = async (id: number) => {
        const response = await unitOfService.StaffCertificationService.getById(id);

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let certificate = response.data.data;

            dispatch({
                type: InModalActionType.SET_MODAL_HEADING,
                payload: "Update Certificate",
            });

            dispatch({
                type: InModalActionType.IS_UPDATE,
                payload: true,
            });

            setValue("id", certificate.id);
            setValue("certificateId", certificate.certificateId);
            setValue("expiryDate", new Date(
                unitOfService.DateTimeService.convertToLocalDate(
                    certificate.expiryDate
                ))
            );
        }
    };



    const { formState, handleSubmit, register, setValue, control } = useForm<StaffCertificationModel>({
        resolver: yupResolver(StaffCertificationValidationSchema),
        defaultValues: {
            id: 0,
            certificateId: 0,
            expiryDate: new Date(),
        },
    });

    const { errors } = formState;

    const submitData = async (formData: StaffCertificationModel) => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        let response: AxiosResponse<Response<StaffCertificationDto>>;
        if (states.isUpdate) {
            response = await unitOfService.StaffCertificationService.update(formData.id, formData);
        } else {
            response = await unitOfService.StaffCertificationService.add(formData);
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
            toast.success("Certificate saved successfully");

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


    const [certificates, setCertificate] = useState<CertificateDto[]>([]);
    const fetchCertificate = async () => {
        const response = await unitOfService.CertificateService.getAll();
        if (response && response.status === 200 && response.data.data) {
            setCertificate(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchCertificateCategory(props.id);
                fetchCertificate();
            }
        })();
    }, []);


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
                            <CustomSelect
                                name="certificateId"
                                control={control}
                                placeholder="Select Cetificate*"
                                isSearchable={true}
                                options={certificates}
                                textField="name"
                                valueField="id"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <CustomInput control={control} type="datepicker" name="expiryDate" placeholder="Expiry Date*" />
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

export default AddCertificate;
