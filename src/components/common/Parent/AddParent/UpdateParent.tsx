import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import { Button, Col, FloatingLabel, Form, FormLabel, Modal, Row } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Loader from "../../Loader";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CustomInput from "../../CustomFormControls/CustomInput";
import {
    InPageAddUpdateActionType,
    InPageAddUpdateState,
    reducer,
} from "@/reducers/InPageAddUpdateAction";
import { ParentDto } from "@/dtos/ParentDto";
import { ParentUpdateValidationSchema } from "@/validation/ParentValidationSchema";
import { ParentUpdateModel } from "@/models/ParentModel";
import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import CountryDto from "@/dtos/CountryDto";
import StateDto from "@/dtos/StateDto";
import Avatar from "@/components/common/Avatar";
import ImageCropperModal from "@/components/common/ImageCropper";

interface UpdateParentProps extends CommonProps {
    id: number;
}

const initialPageState: InPageAddUpdateState<ParentDto> = {
    id: 0,
    showLoader: false,
    refreshRequired: false,
    isUpdating:false,
};

const UpdateParent: NextPage<UpdateParentProps> = (props) => {
    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<ParentDto>, initialPageState);

    const [countries, setCountry] = useState<CountryDto[]>();
    const fetchCountry = async () => {
        const response = await unitOfService.CountryService.getAll("");
        if (response && response.status === 200 && response.data.data) {
            setCountry(response.data.data);
        }
    };

    const [statess, setState] = useState<StateDto[]>();
    const fetchState = async (countryId: number) => {
        const response = await unitOfService.StateService.getByCountryId(countryId);
        if (response && response.status === 200 && response.data.data) {
            setState(response.data.data);
        }
    };

    const [imageSource, setImageSource] = useState("");
    const [parent, setParent] = useState<ParentDto>();
    const fetchParnet = async (parentId: number) => {
        let response = await unitOfService.ParentService.getByParentId(parentId);
        dispatch({
            type: InPageAddUpdateActionType.SHOW_LOADER,
            payload: false,
        });
        if (response && response.status === 200 && response.data.data) {
            let parentDetails = response.data.data;
            dispatch({
                type: InPageAddUpdateActionType.IS_UPDATING,
                payload: true,
            });
            setParent(parentDetails);
            setImageSource(parentDetails.profilePicture || "");
            setValue("parentId", props.id);
            setValue("firstName", parentDetails.firstName);
            setValue("lastName", parentDetails.lastName);
            setValue("email", parentDetails.email);
            setValue("cellPhone", parentDetails.cellPhone || '');
            setValue("homePhone", parentDetails.homePhone || '');
            setValue("workEmail", parentDetails.workEmail || '');
            setValue("ssn", parentDetails.ssn || '');

            setValue("addressLine1", parentDetails.addressLine1 || "");
            setValue("addressLine2", parentDetails.addressLine2 || "");
            setValue("countryId", parentDetails.countryId || 0);
            setValue("stateId", parentDetails.stateId || 0);
            await fetchState(parentDetails.countryId || 0);

            setValue("city", parentDetails.city || "");
            setValue("zipcode", parentDetails.zipcode || "");
        }
        return null;
    };

    useEffect(() => {
        (async () => {
            await fetchCountry();
            await fetchParnet(props.id);
        })();
    }, []);

    const { formState: { errors }, handleSubmit, register, setValue, control, } = useForm<ParentUpdateModel>({
        resolver: yupResolver(ParentUpdateValidationSchema),
        defaultValues: {
            parentId: 0,
            firstName: "",
            lastName: "",
            email: "",
            cellPhone:"",
            homePhone:"",
            workEmail:"",
            ssn: "",
            addressLine1 :"",
            addressLine2:"",
            countryId:0,
            stateId:0,
            city: "",
            zipcode: "",
        },
    });

    const { register: reg, setValue: setVal } = useForm();
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const submitData = async (data: ParentUpdateModel) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof ParentUpdateModel];
            formData.append(key, value as string);
        });
        dispatch({
            type: InPageAddUpdateActionType.SHOW_LOADER,
            payload: true,
        });
        let response = await unitOfService.ParentService.update(formData);
        dispatch({
            type: InPageAddUpdateActionType.SHOW_LOADER,
            payload: false,
        });
        if (response && response.status === 200 && response.data.data) {
            toast.success("Parent updated successfully");
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };

    const inputFileRef = useRef<HTMLInputElement>(null);
    const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string>('');
    const [tempProfilePicture, setTempProfilePicture] = useState<string>('');
    const [maxFileError, setMaxFileError] = useState<boolean>(false);

    const handleImageSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            
        const file = e.target.files[0];
        if (file.size > 25 * 1024 * 1024) {
            setMaxFileError(true);
            setTempProfilePicture('');
            if (inputFileRef.current) {
            inputFileRef.current.value = '';
            }

            return;
        }
        setMaxFileError(false);
    
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            if (reader.result) {
            setProfilePicture(reader.result?.toString() || '');
            }
        });
        reader.readAsDataURL(file);
        setIsEditingProfilePicture(true);
        }
    };

    const onSavePicture = async (image: string) => {
        setVal("croppedImage", image);

        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }

        const formData = new FormData();
        formData.append("id", parent?.id as unknown as string);
        formData.append("croppedImage", image as string);

        // new Response(formData).text().then(console.log)
        let response = await unitOfService.ParentService.updatePicture(formData);
        setShowLoader(false);
        if (response && response.status === 200 && response.data.data) {
            toast.success("Profile picture updated successfully");
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }

        setImageSource(image);
        setIsEditingProfilePicture(false);
    };

    const onClosePictureModal = (_: unknown) => {
        setImageSource('');
        setIsEditingProfilePicture(false);

        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }
    };

    return (
        <>
            <Form method="PUT">
                <Row className="justify-content-center mb-2">
                    <Col md={12} lg={12} xl={12}>
                        <div className="userDetailsMain">
                            <div className="tw-flex tw-items-center tw-mr-[15px]">
                                <Avatar imageSrc={imageSource || ""} size={100} name="croppedImage" edit={true}/>
                                <Form.Control
                                    type="file"
                                    accept=".jpg, .jpeg, .png, .heic, .bmp"
                                    {...reg("croppedImage")}
                                    id="croppedImage"
                                    onChange={handleImageSelected}
                                    style={{
                                        display: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>
            <Form
                method="post"
                autoComplete="off"
                onSubmit={handleSubmit(submitData)}
            >
                <Form.Control type="hidden" {...register("parentId")} />
                <Row>
                    <Col md={12}>
                        <h3 className="formBlock-heading text-left mt-3">
                            Basic Details
                        </h3>
                        <Row>
                            <Col md={6} lg={6}>
                                <FloatingLabel label="First Name*" className="mb-3">
                                    <CustomInput
                                        control={control}
                                        name="firstName"
                                        placeholder="First Name*"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6} lg={6}>
                                <FloatingLabel label="Last Name*" className="mb-3">
                                    <CustomInput
                                        control={control}
                                        name="lastName"
                                        placeholder="Last Name*"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6} lg={6}>
                                <FloatingLabel label="Cell Phone*" className="mb-3">
                                    <CustomInput
                                        control={control}
                                        name="cellPhone"
                                        placeholder="Cell Phone*"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6} lg={6}>
                                <FloatingLabel label="Home Phone" className="mb-3">
                                    <CustomInput
                                        control={control}
                                        name="homePhone"
                                        placeholder="Home Phone"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6} lg={6}>
                                <FloatingLabel label="Email*" className="mb-3">
                                    <CustomInput
                                        control={control}
                                        name="email"
                                        placeholder="Email*"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={6} lg={6}>
                                <FloatingLabel label="Work Email" className="mb-3">
                                    <CustomInput
                                        control={control}
                                        name="workEmail"
                                        placeholder="Work Email"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={12} lg={12}>
                                <FloatingLabel label="SSN" className="mb-3">
                                    <CustomInput
                                        control={control}
                                        name="ssn"
                                        placeholder="SSN"
                                    />
                                </FloatingLabel>
                            </Col> 
                        </Row>
                    </Col>
                    

                    {/* <Col md={6} lg={6}>
                        <FormLabel>Charge application fee</FormLabel>
                        <Form.Group className="mb-4">
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    id="chargeApplicationFee-1"
                                    value="true"
                                    {...register("chargeApplicationFee")}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    value="false"
                                    id="chargeApplicationFee-2"
                                    {...register("chargeApplicationFee")}
                                />
                            </div>
                            {errors.chargeApplicationFee && (
                                <ErrorLabel message={errors.chargeApplicationFee.message} />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6} lg={6}>
                        <FormLabel>Charge registration fee</FormLabel>
                        <Form.Group className="mb-4">
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    value="true"
                                    id="chargeRegistrationFee-1"
                                    {...register("chargeRegistrationFee")}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    value="false"
                                    id="chargeRegistrationFee-2"
                                    {...register("chargeRegistrationFee")}
                                />
                            </div>
                            {errors.chargeRegistrationFee && (
                                <ErrorLabel message={errors.chargeRegistrationFee.message} />
                            )}
                        </Form.Group>
                    </Col> */}
                    <Col md={12}>
                        <h3 className="formBlock-heading text-left mt-3">
                            Contact Details
                        </h3>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Address Line 1*">
                                        <CustomInput
                                            control={control}
                                            name="addressLine1"
                                            placeholder="Address Line 1*"
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Address Line 2">
                                        <CustomInput
                                            control={control}
                                            name="addressLine2"
                                            placeholder="Address Line 2"
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <CustomSelect
                                        name="countryId"
                                        control={control}
                                        placeholder="Country"
                                        options={countries}
                                        isSearchable={true}
                                        textField="name"
                                        valueField="id"
                                        onChange={async (option) => {
                                            const selectedCountryId = +(option?.[0] || 0);
                                            setValue("countryId", selectedCountryId);
                                            setValue("stateId", 0);
                                            await fetchState(selectedCountryId);
                                        }}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <CustomSelect
                                        name="stateId"
                                        control={control}
                                        placeholder="State"
                                        options={statess}
                                        isSearchable={true}
                                        textField="name"
                                        valueField="id"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="City*">
                                        <CustomInput
                                            control={control}
                                            name="city"
                                            placeholder="City*"
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <FloatingLabel label="Zipcode*" className="mb-3">
                                    <CustomInput
                                        control={control}
                                        name="zipcode"
                                        placeholder="Zipcode*"
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Button type="submit" className="btn_main mx-1">Save</Button>
                <Button
                    type="button"
                    className="btn_border mx-1"
                    onClick={() => {
                        router.push("/admin/parents");
                    }}
                >
                    Cancel
                </Button>
            </Form>
            {states.showLoader && <Loader />}
            <Modal
                show={isEditingProfilePicture}
                size="lg"
                dialogClassName="modal-60w"
                onHide={() => setIsEditingProfilePicture(false)}
                backdrop="static"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Crop Profile Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ImageCropperModal
                        picture={profilePicture}
                        closeModal={onClosePictureModal}
                        savePicture={onSavePicture}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};
export default UpdateParent;
