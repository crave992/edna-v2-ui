import { NextPage } from "next";
import React, { useEffect, useReducer } from "react";
import CommonProps from "@/models/CommonProps";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import Head from "next/head";
import {
  Col,
  Container,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
} from "@fortawesome/pro-solid-svg-icons";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { EmailTemplateDto } from "@/dtos/EmailTemplateDto";
import Link from "next/link";

interface EmailTemplatePageProps extends CommonProps {}

const initialPageState: InPageState<EmailTemplateDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const EmailTemplatePage: NextPage<EmailTemplatePageProps> = () => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const router = useRouter();
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const [emailTemplateStates, dispatch] = useReducer(
    reducer<EmailTemplateDto[]>,
    initialPageState
  );

  const fetchEmailTemplate = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.EmailTemplateService.getAll();
    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.SET_DATA,
        payload: response.data.data,
      });
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });
  };

  useEffect(() => {
    (async () => {
      fetchEmailTemplate();
    })();
  }, [emailTemplateStates.refreshRequired]);

  useBreadcrumb({
    pageName: "Email Template",
    breadcrumbs: [
      {
        label: "Email Template",
        link: "/admin/email-template",
      },
    ],
  });

  return (
    <>
      <Head>
        <title>Email Template</title>
      </Head>
      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">Email Template</h1>
              </div>
              <Row>
                <Col lg={3} className="text-end mb-2"></Col>
              </Row>

              <div className="tableListItems">
                <div className="formBlock">
                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Type</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailTemplateStates.data &&
                        emailTemplateStates.data.map(
                          (emailTemplate: EmailTemplateDto) => {
                            return (
                              <tr key={emailTemplate.emailTemplateTypeId}>
                                <td>{emailTemplate.fromEmail}</td>
                                <td>{emailTemplate.subject}</td>
                                <td>{emailTemplate.emailTemplateTypeName}</td>
                                <td className="text-center">
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 100 }}
                                    overlay={<Tooltip>Edit</Tooltip>}
                                  >
                                    <span
                                      className="btn_main small anchor-span"
                                      onClick={() =>
                                        router.push(`/admin/email-template/update/${emailTemplate.emailTemplateTypeId}`)
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        size="1x"
                                      />
                                    </span>
                                  </OverlayTrigger>
                                </td>
                              </tr>
                            );
                          }
                        )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
    </>
  );
};

export default EmailTemplatePage;
