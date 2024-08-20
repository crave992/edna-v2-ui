import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { TermsAndPolicyParentRegistrationModel } from "@/models/TermsAndPolicyModel";
import { TermsAndPolicyParentRegistrationValidationSchema } from "@/validation/TermsAndPolicyLoginValidationSchema";
import CustomInput from "../CustomFormControls/CustomInput";
import Loader from "../Loader";


const ParentRegistration = () => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const { handleSubmit, setValue, control } =
        useForm<TermsAndPolicyParentRegistrationModel>({
            resolver: yupResolver(TermsAndPolicyParentRegistrationValidationSchema),
            defaultValues: {
                content: '',
            },
        });



    const fetchParentRegistrationInfo = async () => {
        const response = await unitOfService.TermsAndPolicyService.getAll();
        if (response && response.status == 200 && response.data.data) {
            const parentRegistrationContent = response.data.data;
            setValue("content", parentRegistrationContent.parentRegistration || '');
        }
    };

    useEffect(() => {
        (async () => {
            await fetchParentRegistrationInfo();
        })();
    }, []);

    const [showLoader, setShowLoader] = useState<boolean>(false);
    const submitData = async (data: TermsAndPolicyParentRegistrationModel) => {
        setShowLoader(true);
        const response = await unitOfService.TermsAndPolicyService.updateParentRegistration(data);
        setShowLoader(false);
        if (response && response.status === 200 && response.data.data) {
            toast.success("Parent registration information saved successfully");
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };

    return (
        <>
            <h3 className="formBlock-heading">Parent Registration</h3>

            <Form
                method="post"
                autoComplete="off"
                onSubmit={handleSubmit(submitData)}
            >
                <Row>
                    <Col md={12} lg={12}>
                        <CustomInput
                            control={control}
                            name="content"
                            type="editor"
                            placeholder="Parent Registration Content*"
                        />
                    </Col>


                    <Col className="my-3 mb-3">
                        <Button type="submit" className="btn_main">
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>

            {showLoader && <Loader />}
        </>
    );
};

export default ParentRegistration;
