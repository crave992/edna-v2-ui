import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import {
    Button,
    Row,
    Col,
    FloatingLabel,
    Form,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    InPageActionType,
    InPageState,
    reducer,
} from "@/reducers/InPageAction";
import { EmailSettingDto } from "@/dtos/EmailSettingDto";
import EmailSettingModel from "@/models/EmailSettingModel";
import CustomInput from "../CustomFormControls/CustomInput";
import Loader from "../Loader";
import EmailSettingValidatiinSchema from "@/validation/EmailSettingValidatiinSchema";
import CustomSelect from "../CustomFormControls/CustomSelect";
import ErrorLabel from "../CustomError/ErrorLabel";
import { boolean } from "yup";

const initialPageState: InPageState<EmailSettingDto> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

interface AddEmailSettingProps extends CommonProps { }

const AddEmailSetting: NextPage<AddEmailSettingProps> = () => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const [states, dispatch] = useReducer(
        reducer<EmailSettingDto>,
        initialPageState
    );

    const fetchEmailSetting = async () => {
        const response = await unitOfService.EmailSettingService.getEmailSetting();
        if (response && response.status === 200 && response.data.data) {
            let emailSetting = response.data.data;

            dispatch({
                type: InPageActionType.SET_DATA,
                payload: response.data.data,
            });

            setValue("provider", emailSetting.provider || "");
            setValue("userName", emailSetting.userName || "");
            setValue("password", emailSetting.password || "");
            setValue("host", emailSetting.host || "");
            setValue("port", emailSetting.port);
            setValue("enableSsl", emailSetting.enableSsl);
        }
    };

    useEffect(() => {
        (async () => {
            fetchEmailSetting();
        })();
    }, []);

    const { formState, handleSubmit, register, setValue, control } =
        useForm<EmailSettingModel>({
            resolver: yupResolver(EmailSettingValidatiinSchema),
            defaultValues: {
                provider: "",
                userName: "",
                password: "",
                host: "",
                port: 0,
            },
        });
    const { errors } = formState;


    const submitData = async (formData: EmailSettingModel) => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        let response = await unitOfService.EmailSettingService.saveEmailSetting(
            formData
        );
        if (
            response &&
            (response.status === 200 || response.status === 201) &&
            response.data.data
        ) {
            toast.success("Email setting saved successfully");
            dispatch({
                type: InPageActionType.SHOW_LOADER,
                payload: false,
            });
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };

    return (
        <>
            <div className="medical-condition">
                <Form
                    method="post"
                    autoComplete="off"
                    onSubmit={handleSubmit(submitData)}
                >
                    <Row className="mb-4">
                        <Col lg={12}>
                            <FloatingLabel
                                label="Provider Name*"
                                className="mb-3"
                            >
                                <CustomInput
                                    control={control}
                                    name="provider"
                                    placeholder="Provider Name"
                                />
                            
                            </FloatingLabel>
                        </Col>
                        <Col lg={12}>
                            <FloatingLabel
                                label="Username*"
                                className="mb-3"
                            >
                                <CustomInput
                                    control={control}
                                    name="userName"
                                    placeholder="Username"
                                />
                            </FloatingLabel>
                        </Col>
                        <Col lg={12}>
                            {/* <FloatingLabel
                                label="Password*"
                                className="mb-3"
                            >
                                <CustomInput
                                    type="password"
                                    control={control}
                                    name="password"
                                    placeholder="Password"
                                />
                            </FloatingLabel> */}
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Password*">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password*"
                                        {...register("password")}
                                    />
                                </FloatingLabel>
                                {errors.password && <ErrorLabel message={errors.password.message} />}
                            </Form.Group>
                        </Col>
                        <Col lg={12}>
                            <FloatingLabel
                                label="Host*"
                                className="mb-3"
                            >
                                <CustomInput
                                    control={control}
                                    name="host"
                                    placeholder="Host*"
                                />
                            </FloatingLabel>
                        </Col>
                        <Col lg={12}>
                            <FloatingLabel
                                label="Port Number*"
                                className="mb-3"
                            >
                                <CustomInput
                                    type="text"
                                    control={control}
                                    name="port"
                                    placeholder="Port Number"
                                />
                            </FloatingLabel>
                        </Col>
                        <Col lg={12}>

                            <Form.Label>
                                Enable SSL*:
                            </Form.Label>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    inline
                                    type="switch"
                                    id={`enable_yes`}
                                    defaultChecked={states.data?.enableSsl || false}
                                    {...register("enableSsl")}
                                />
                                
                                {errors.enableSsl && (
                                    <ErrorLabel message={errors.enableSsl.message} />
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button type="submit" className="btn_main">
                        Save
                    </Button>
                </Form>
            </div>
            {states.showLoader && <Loader />}
        </>
    );
};
export default AddEmailSetting;
