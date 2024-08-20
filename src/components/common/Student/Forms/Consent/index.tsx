import { NextPage } from "next";
import React, { useEffect, useReducer, useState } from "react";
import CommonProps from "@/models/CommonProps";
import Head from "next/head";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
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
import AddConsentForm from "./AddConsentForm";
import StudentConsentFormDto from "@/dtos/StudentConsentFormDto";
import { DocuSignStudentConsentFormModel } from "@/models/DocuSignModel";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";

interface StudentConsentFormParams {
  studentId: number;
}

interface StudentConsentFormProps extends CommonProps {
  studentId: number;
}

const initialPageState: InPageState<StudentConsentFormDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};
const StudentConsentFormPage: NextPage<StudentConsentFormProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const router = useRouter();
  const {
    formState: { errors },
  } = useForm<StudentConsentFormParams>({
    defaultValues: {
      studentId: props.studentId,
    },
  });



  const [states, dispatch] = useReducer(
    reducer<StudentConsentFormDto[]>,
    initialPageState
  );

  const openAddUpdateModal = (cid: number, templateId: string) => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: cid,

    });
    dispatch({
      type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
      payload: true,
    });
  };

  const closeAddUpdateModal = (isRefresh: boolean) => {
    if (isRefresh) {
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    }

    dispatch({
      type: InPageActionType.SET_ID,
      payload: 0,
    });

    dispatch({
      type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
      payload: false,
    });
  };

  const fetchStudentConentForms = async (studentId: number) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });
    const response =
      await unitOfService.StudentConsentAndQuestionForm.getStudentConsentAndQuestionFormById(
        studentId
      );
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




  const postDocuSign = async (id: number, templateId: string, studentId: number) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });
    const model: DocuSignStudentConsentFormModel = {
      id: id,
      templateId: templateId,
      studentId: studentId
    };

    const response = await unitOfService.DocuSignService.getParentDocumentForSigned(model);
    if (response && response.status === 200 && response.data.data) {
      const url = response.data.data.url;
      const envId = response.data.data.envelopeId;

      if (url) {
        // Store the necessary data in localStorage
        const signedDocumentData = JSON.stringify({
          id: id,
          newEnvId: envId,
          studId: studentId
        });
        localStorage.setItem('signedDocumentData', signedDocumentData);
        window.open(url, '_self');
        dispatch({
          type: InPageActionType.SHOW_LOADER,
          payload: false,
        });
        dispatch({
          type: InPageActionType.IS_REFRESH_REQUIRED,
          payload: !states.refreshRequired,
        });
      }
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }

  };

  const saveSignedDocument = async () => {

    // Retrieve the stored data from localStorage
    const storedData = localStorage.getItem('signedDocumentData');
    if (storedData) {
      const { id, newEnvId, studId } = JSON.parse(storedData);
      dispatch({
        type: InPageActionType.SHOW_LOADER,
        payload: true,
      });

      const response = await unitOfService.DocuSignService.saveParentSignedDocument(id, studId, newEnvId);

      if (response && response.status === 200) {
        dispatch({
          type: InPageActionType.SHOW_LOADER,
          payload: false,
        });
        dispatch({
          type: InPageActionType.IS_REFRESH_REQUIRED,
          payload: !states.refreshRequired,
        });

        // Your logic for handling the signed document goes here
      } else {
        let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
        toast.error(error);
      }
      // Clear the stored data after using it
      localStorage.removeItem('signedDocumentData');
    }

  };

  const getSignedDocument = async (formId: number, studentId: number) => {

    const response =
      await unitOfService.StudentConsentAndQuestionForm.getGetSignedDocumentByParent(formId, studentId);

    if (response && response.status === 200 && response.data.data) {
      const signDocumentUrl = response.data.data.docUrl;
      window.open(signDocumentUrl, '_blank');

      // Your logic for handling the signed document goes here
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };


  useEffect(() => {
    (async () => {
      await fetchStudentConentForms(props.studentId),
        await saveSignedDocument()

    })();
  }, [states.refreshRequired]);

  return (
    <>
      <Head>
        <title>Student Form</title>
      </Head>
      <div className="parent_list_page">
        <div className="tableListItems">
          <div className="formBlock">
            <Table striped hover className="custom_design_table mb-0">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Name</th>
                  <th className="text-center">Accepted Terms?</th>
                  <th className="text-center">Consent Date</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {states.data &&
                  states.data.map((form) => {
                    return (
                      <tr key={form.studentFormId}>
                        <td>{form.levelName}</td>
                        <td>{form.studentFormName}</td>
                        <td className="text-center">
                          {form.status && (form.acceptTerms ? "Yes" : "No")}
                        </td>
                        <td className="text-center">{form.uploadedDate && unitOfService.DateTimeService.convertToLocalDate(form.uploadedDate)}</td>
                        <td className="text-center">
                          {form.status == true ? (
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Update Consent</Tooltip>}
                            >
                              <Button
                                className="btn_main size_small"
                                onClick={() => {
                                  getSignedDocument(form.studentFormId, props.studentId);
                                }}
                              >
                                Complete
                              </Button>
                            </OverlayTrigger>
                          ) : (
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Update Consent</Tooltip>}
                            >
                              <Button
                                className="btn_main size_small red_btn"
                                onClick={() => {
                                  //openAddUpdateModal(form.studentFormId, form.templateId);
                                  postDocuSign(form.studentFormId, form.templateId, props.studentId)
                                }}
                              >
                                Incomplete
                              </Button>
                            </OverlayTrigger>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {states.showLoader && <Loader />}
      {/* {states.showAddUpdateModal && (
        <AddConsentForm
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
          studentId={props.studentId}
          templateId={templateId}
        />
      )} */}
    </>
  );
};

export default StudentConsentFormPage;
