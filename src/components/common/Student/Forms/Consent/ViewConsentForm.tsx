import { NextPage } from "next";
import React, { useEffect, useReducer } from "react";
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
import { toast } from "react-toastify";

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
const ViewConsentFormPage: NextPage<StudentConsentFormProps> = (props) => {
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


    useEffect(() => {
        (async () => {
            fetchStudentConentForms(props.studentId);
        })();
    }, [states.refreshRequired]);


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
                                                        <Button
                                                            className="btn_main size_small"
                                                            onClick={() => {
                                                                getSignedDocument(form.studentFormId, props.studentId);
                                                            }}
                                                        >
                                                            Complete
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            className="btn_main size_small red_btn"
                                                        >
                                                            Incomplete
                                                        </Button>
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

        </>
    );
};

export default ViewConsentFormPage;
