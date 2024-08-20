import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer, useState } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { toast } from "react-toastify";


import { EmailTemplateDto } from "@/dtos/EmailTemplateDto";
import { EmailTemplateModel } from "@/models/EmailTemplateModel";
import EmailTemplateValidationSchema from "@/validation/EmailTemplateValidationSchema";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import Loader from "@/components/common/Loader";

import { InPageAddUpdateActionType, InPageAddUpdateState, reducer } from "@/reducers/InPageAddUpdateAction";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/pro-solid-svg-icons";


const initialPageState: InPageAddUpdateState<EmailTemplateDto[]> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
};

interface AddEmailTemplateProps extends CommonProps {
  id: number;
}

const AddEmailTemplate: NextPage<AddEmailTemplateProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [emailTemplete, dispatch] = useReducer(reducer<EmailTemplateDto[]>, initialPageState);

  const { formState, handleSubmit, register, setValue, control } =
    useForm<EmailTemplateModel>({
      resolver: yupResolver(EmailTemplateValidationSchema),
      defaultValues: {
        emailTemplateTypeId: 0,
        fromEmail: "",
        bccEmails: "",
        ccEmails: "",
        body: "",
        subject: "",
      },
    });

  const fetchEmailTemplate = async (templateTypeId: number) => {
    const response =
      await unitOfService.EmailTemplateService.getByTemplateTypeId(
        templateTypeId
      );

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let emailTemplate = response.data.data;

      setValue("emailTemplateTypeId", emailTemplate.emailTemplateTypeId);
      setValue("fromEmail", emailTemplate.fromEmail);
      setValue("bccEmails", emailTemplate.bccEmails);
      setValue("ccEmails", emailTemplate.ccEmails);
      setValue("body", emailTemplate.body);
      setValue("subject", emailTemplate.subject);
    }
  };

  const { errors } = formState;

  const submitData = async (formData: EmailTemplateModel) => {
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.EmailTemplateService.Add(formData);

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Email template updated successfully");
      dispatch({
        type: InPageAddUpdateActionType.IS_REFRESH_REQUIRED,
        payload: true,
      });

    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [emailTempleteTypes, setEmailTempleteTypes] = useState<
    EmailTemplateDto[]
  >([]);
  const fetchtEmailTempleteTypes = async (q?: string) => {
    const response =
      await unitOfService.EmailTemplateService.getEmailTemplateTypes();
    if (response && response.status === 200 && response.data.data) {
      setEmailTempleteTypes(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      fetchEmailTemplate(props.id);
      fetchtEmailTempleteTypes();
    })();
  }, []);

  return (
    <>
      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={10} xl={8} xxl={6}>
              <div className="db_heading_block">
                <h1 className="db_heading">Update Email Template</h1>
                <Link className="btn_main size_small" href={'/admin/email-template/'}><FontAwesomeIcon icon={faAngleLeft} /> Go Back</Link>
              </div>
              <div className="formBlock">
                <Form
                  method="post"
                  autoComplete="off"
                  onSubmit={handleSubmit(submitData)}
                >
                  <Form.Control type="hidden" {...register("emailTemplateTypeId")} />

                  <Form.Group className="mb-3">
                    <CustomSelect
                      name="emailTemplateTypeId"
                      control={control}
                      placeholder="Select Email  Template Type*"
                      isSearchable={true}
                      options={emailTempleteTypes}
                      textField="name"
                      valueField="id"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <FloatingLabel label="From Email*">
                      <CustomInput
                        control={control}
                        name="fromEmail"
                        placeholder="from Email*"
                      />
                    </FloatingLabel>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <FloatingLabel label="CC Email">
                      <CustomInput
                        control={control}
                        name="ccEmails"
                        placeholder="CC Email"
                      />
                    </FloatingLabel>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <FloatingLabel label="BCC Email">
                      <CustomInput
                        control={control}
                        name="bccEmails"
                        placeholder="BCC Email"
                      />
                    </FloatingLabel>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <FloatingLabel label="Email Subject*">
                      <CustomInput
                        control={control}
                        name="subject"
                        placeholder="Email Subject*"
                      />
                    </FloatingLabel>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Body*</Form.Label>
                    <CustomInput
                      control={control}
                      type="editor"
                      name="body"
                      placeholder="Body*"
                    />

                    <div className="email-variable-container mt-3">
                      <h6>Email Variables</h6>
                      <p>[FName] = First name</p>
                      <p>[LName] = Last name</p>
                      <p>[Email] = Email</p>
                      <p>[Username] = Username</p>
                      <p>[Password] = Password</p>
                    </div>
                  </Form.Group>
                  <Button className="btn_main" type="submit">
                    Save
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {emailTemplete.showLoader && <Loader />}
    </>
  );
};

export default AddEmailTemplate;

