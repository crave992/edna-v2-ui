import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import ParentBabyLogDto from "@/dtos/ParentBabyLogDto";
import CommonProps from "@/models/CommonProps";
import ParentBabyLogModel from "@/models/ParentBabyLogModel";
import { InPageAddUpdateActionType, InPageAddUpdateState, reducer } from "@/reducers/InPageAddUpdateAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CustomInput from "../../CustomFormControls/CustomInput";
import Loader from "../../Loader";

const initialPageState: InPageAddUpdateState<ParentBabyLogDto> = {
    id: 0,
    showLoader: false,
    refreshRequired: false,
    isUpdating: false,
};


interface StudentBabyLogProps extends CommonProps {
    id: number;
}


const StudentBabyLog: NextPage<StudentBabyLogProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [state, dispatch] = useReducer(reducer<ParentBabyLogDto>, initialPageState);

    const { handleSubmit, register, setValue, getValues, control, formState: { errors }, } = useForm<ParentBabyLogModel>({
        //resolver: yupResolver(StudentAllergyValidationSchema),
        defaultValues: {
            studentId: props.id,
            bedTime: "",
            wakeTime: "",
            lastSlept: "",
            hours: 0,
            minutes: 0,
            lastFed: "",
            quantity: 0,
            lastDiapered: "",
            diaperContent: "",
            healthCheck: [],
            mood: "",
        },
    });

    const fetchBabyLogDetails = async (studentId: number) => {
        dispatch({
            type: InPageAddUpdateActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.ParentBabyLogService.getBabyLogReportByStudentId(studentId);
        dispatch({
            type: InPageAddUpdateActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            let babyLog = response.data.data;

            dispatch({
                type: InPageAddUpdateActionType.SHOW_LOADER,
                payload: false,
            });

            setValue("studentId", props.id);
            setValue("bedTime", babyLog.bedTime);
            setValue("wakeTime", babyLog.wakeTime);
            setValue("lastSlept", babyLog.lastSlept);
            setValue("hours", babyLog.hours);
            setValue("minutes", babyLog.minutes);
            setValue("lastFed", babyLog.lastFed);
            setValue("quantity", babyLog.quantity);
            setValue("lastDiapered", babyLog.lastDiapered);
            setValue("diaperContent", babyLog.diaperContent);
            setValue("healthCheck", (babyLog.healthCheck || "").split(','));
            setValue("mood", babyLog.mood);
        }
    };

    const submitData = async (data: ParentBabyLogModel) => {

        dispatch({
            type: InPageAddUpdateActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.ParentBabyLogService.addParentBabyLog(data);

        dispatch({
            type: InPageAddUpdateActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && (response.status === 200 || response.status === 201) && response.data.data) {
            toast.success("Baby log added successfully");
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchBabyLogDetails(props.id);
        })();
    }, []);



    return (
        <>
            <Form
                method="post"
                autoComplete="off"
                onSubmit={handleSubmit(submitData)}
            >
                <Form.Control type="hidden" {...register("studentId")} />
                <div className="formBlock">
                    <h3 className="formBlock-heading">Napping</h3>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel
                                    label="Bed Time"
                                    className="mb-3"
                                >
                                    <CustomInput
                                        control={control}
                                        name="bedTime"
                                        placeholder="Bed Time"
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel
                                    label="Wake Up Time"
                                    className="mb-3"
                                >
                                    <CustomInput
                                        control={control}
                                        name="wakeTime"
                                        placeholder="Wake Up Time"
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <FloatingLabel
                                    label="Last Slept"
                                    className="mb-3"
                                >
                                    <CustomInput
                                        control={control}
                                        name="lastSlept"
                                        placeholder="Last Slept"
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Form.Label>How Long</Form.Label>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel
                                    label="Hours"
                                    className="mb-3"
                                >
                                    <CustomInput
                                        control={control}
                                        name="hours"
                                        placeholder="Hours"
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel
                                    label="Minutes"
                                    className="mb-3"
                                >
                                    <CustomInput
                                        control={control}
                                        name="minutes"
                                        placeholder="Minutes"
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <h3 className="formBlock-heading mt-3">Feeding</h3>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel
                                    label="Last Feed Time"
                                    className="mb-3"
                                >
                                    <CustomInput
                                        control={control}
                                        name="lastFed"
                                        placeholder="Last Feed Time"
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel
                                    label="Quantity(Oz)"
                                    className="mb-3"
                                >
                                    <CustomInput
                                        control={control}
                                        name="quantity"
                                        placeholder="Quantity(Oz)"
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <h3 className="formBlock-heading mt-3">Health</h3>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel
                                    label="Last Time Daipered"
                                    className="mb-3"
                                >
                                    <CustomInput
                                        control={control}
                                        name="lastDiapered"
                                        placeholder="Last Time Daipered"
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel
                                    label="Daiper Content"
                                    className="mb-3"
                                >
                                    <Form.Select {...register("diaperContent")}>
                                        <option value={""}>Select Daiper Content</option>
                                        <option value="Wet">Wet</option>
                                        <option value="Dry">Dry</option>
                                        <option value="Bowel Movement">Bowel Movement</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Form.Label>Health check</Form.Label>
                        <Col md={12}>


                            <Form.Group>
                                <Form.Check
                                    className="mb-3"
                                    inline
                                    label="Teething"
                                    type="checkbox"
                                    value="Teething"
                                    id="teething"
                                    defaultChecked={getValues().healthCheck?.includes("Teething") ? true : false}
                                    {...register("healthCheck")}
                                />
                                <Form.Check
                                    className="mb-3"
                                    inline
                                    label="Runny Nose"
                                    type="checkbox"
                                    value="Runny Nose"
                                    id="runnyNose"
                                    {...register("healthCheck")}
                                    defaultChecked={getValues().healthCheck?.includes("Runny Nose") ? true : false}
                                />
                                <Form.Check
                                    className="mb-3"
                                    inline
                                    label="Coughing/Sneezing"
                                    type="checkbox"
                                    value="Coughing/Sneezing"
                                    id="coughingSneezing"
                                    {...register("healthCheck")}
                                    defaultChecked={getValues().healthCheck?.includes("Coughing/Sneezing") ? true : false}
                                />
                                <Form.Check
                                    className="mb-3"
                                    inline
                                    label="Vomiting"
                                    type="checkbox"
                                    value="Vomiting"
                                    id="vomiting"
                                    {...register("healthCheck")}
                                    defaultChecked={getValues().healthCheck?.includes("Vomiting") ? true : false}
                                />
                                <Form.Check
                                    className="mb-3"
                                    inline
                                    label="Diarrhea"
                                    type="checkbox"
                                    value="Diarrhea"
                                    id="diarrhea"
                                    {...register("healthCheck")}
                                    defaultChecked={getValues().healthCheck?.includes("Diarrhea") ? true : false}
                                />
                                <Form.Check
                                    className="mb-3"
                                    inline
                                    label="Fever"
                                    type="checkbox"
                                    value="Fever"
                                    id="fever"
                                    {...register("healthCheck")}
                                    defaultChecked={getValues().healthCheck?.includes("Fever") ? true : false}
                                />
                                <Form.Check
                                    className="mb-3"
                                    inline
                                    label="Other"
                                    type="checkbox"
                                    value="Other"
                                    id="other"
                                    {...register("healthCheck")}
                                    defaultChecked={getValues().healthCheck?.includes("Other") ? true : false}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <p><strong>Note:</strong> Our Policy is that students with a fever of 100 degrees or higher should remain at home. Please talk to a staff member if you have any questions about your childs attendance.</p>
                        </Col>
                    </Row>
                    <h3 className="formBlock-heading mt-3">Mood</h3>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <FloatingLabel
                                    label="How has the child been doing today?"
                                    className="mb-3"
                                >
                                    <CustomInput
                                        control={control}
                                        name="mood"
                                        type="textarea"
                                        placeholder="How has the child been doing today?"
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button className="btn_main" type="submit">
                        Save
                    </Button>
                </div>
            </Form>
            {state.showLoader && <Loader />}
        </>
    )
}

export default StudentBabyLog;