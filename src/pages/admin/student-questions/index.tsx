import { GetServerSideProps, NextPage } from "next";
import React, { ChangeEvent, useEffect, useReducer, useState } from "react";
import CommonProps from "@/models/CommonProps";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import Head from "next/head";
import {
    Button,
    Col,
    Container,
    FloatingLabel,
    Form,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlusCircle, faTrash } from "@fortawesome/pro-solid-svg-icons";
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
import StudentQuestionDto from "@/dtos/StudentQuestionDto";
import AddStudentQuestion from "@/components/common/StudentQuestion";
import { toast } from "react-toastify";
import ConfirmBox from "@/components/common/ConfirmBox";
import { useDebounce } from "use-debounce";

interface StudentQuestionParams {
    q?: string;
}

interface StudentQuestionPageProps extends CommonProps {
    q?: string;
}

const initialPageState: InPageState<StudentQuestionDto[]> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};
const StudentQuestionPage: NextPage<StudentQuestionPageProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const router = useRouter();
    const { formState, handleSubmit, register, setValue, getValues } = useForm<StudentQuestionParams>({
        defaultValues: {
            q: props.q,
        },
    });

    const [states, dispatch] = useReducer(reducer<StudentQuestionDto[]>, initialPageState);

    const openAddUpdateModal = (cid: number) => {
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


    const openDeleteModal = (cid: number) => {
        dispatch({
            type: InPageActionType.SET_ID,
            payload: cid,
        });

        dispatch({
            type: InPageActionType.SHOW_DELETE_MODAL,
            payload: true,
        });
    };

    const closeDeleteModal = () => {
        dispatch({
            type: InPageActionType.SET_ID,
            payload: 0,
        });

        dispatch({
            type: InPageActionType.SHOW_DELETE_MODAL,
            payload: false,
        });
    };

    const deleteQuestion = async () => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.StudentQuestionService.delete(states.id);

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 204) {
            closeDeleteModal();

            toast.success("Question deleted successfully");

            dispatch({
                type: InPageActionType.IS_REFRESH_REQUIRED,
                payload: !states.refreshRequired,
            });
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };


    const fetchStudentQuestions = async (q?: string, levelId?: number) => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.StudentQuestionService.getAll(q || "", levelId || 0);
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
            fetchStudentQuestions();
        })();
    }, [states.refreshRequired]);

    useBreadcrumb({
        pageName: "Student Question",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Student Question",
                link: "/admin/student-questions",
            },
        ],
    });

    const [searchedText, setSearchedText] = useState<string>("");
    const updateSearchText = (e: ChangeEvent<HTMLInputElement>) => {
        let eneteredText = e.target.value || "";
        setSearchedText(eneteredText);
    };

    const [searchedValue] = useDebounce(searchedText, 1000);
    useEffect(() => {
        (async () => {
            await fetchStudentQuestions(searchedValue);
        })();
    }, [searchedValue]);

    return (
        <>
            <Head>
                <title>Student Questions</title>
            </Head>
            <div className="parent_list_page">
                <Container fluid>
                    <Row>
                        <Col md={12} lg={12}>
                            <div className="db_heading_block">
                                <h1 className="db_heading">Questions</h1>
                            </div>
                            <Row className="justify-content-between">
                                <Col md={8} lg={6} xl={4}>
                                    <div className="searchSortBlock">
                                        <div className="searchBlock">
                                            <FloatingLabel
                                                controlId="floatingInput"
                                                label="Search Question"
                                                className="mb-3"
                                            >
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Search Question"
                                                    {...register("q")}
                                                    onChange={updateSearchText}
                                                />
                                            </FloatingLabel>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4} lg={4} xl={3} className="text-end mb-2">
                                    <Button
                                        className="btn_main"
                                        onClick={() => openAddUpdateModal(0)}
                                    >
                                        <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Question
                                    </Button>
                                </Col>
                            </Row>

                            <div className="tableListItems">
                                <div className="formBlock">
                                    <Table striped hover className="custom_design_table mb-0">
                                        <thead>
                                            <tr>
                                                <th>Level</th>
                                                <th>Question</th>
                                                <th className="text-center">Question Type</th>
                                                <th className="text-center">Form Type</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {states.data &&
                                                states.data.map((form) => {
                                                    return (
                                                        <tr key={form.id}>
                                                            <td >
                                                                {form.level?.name || ""}
                                                            </td>
                                                            <td >
                                                                {form.question}
                                                            </td>
                                                            <td className="text-center">
                                                                {form.questionType}
                                                            </td>
                                                            <td className="text-center">
                                                                {form.formType}
                                                            </td>
                                                            <td className="text-center">
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    delay={{ show: 50, hide: 100 }}
                                                                    overlay={<Tooltip>Edit</Tooltip>}
                                                                >
                                                                    <span
                                                                        className="btn_main small anchor-span"
                                                                        onClick={() => openAddUpdateModal(form.id)}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faPenToSquare}
                                                                            size="1x"
                                                                        />
                                                                    </span>
                                                                </OverlayTrigger>
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    delay={{ show: 50, hide: 100 }}
                                                                    overlay={<Tooltip>Delete</Tooltip>}
                                                                >
                                                                    <span
                                                                        className="btn_main small anchor-span orange_btn"
                                                                        onClick={() => openDeleteModal(form.id)}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            size="1x"
                                                                        />
                                                                    </span>
                                                                </OverlayTrigger>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            {states.showAddUpdateModal && (
                <AddStudentQuestion
                    id={states.id}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}

            {states.showDeleteModal && (
                <ConfirmBox
                    isOpen={states.showDeleteModal}
                    onClose={closeDeleteModal}
                    onSubmit={deleteQuestion}
                    bodyText="Are you sure want to delete this question?"
                    noButtonText="Cancel"
                    yesButtonText="Confirm"
                />
            )}
        </>
    );
};

export default StudentQuestionPage;

export const getServerSideProps: GetServerSideProps<
    StudentQuestionParams
> = async (context) => {
    let initialParamas: StudentQuestionParams = {
        q: `${context.query.q || ""}`,
    };

    return {
        props: initialParamas,
    };
};
