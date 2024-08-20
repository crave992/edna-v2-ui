import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { FeedingDto } from "@/dtos/ParentBabyLogDto";
import CommonProps from "@/models/CommonProps";
import { FeedingModel } from "@/models/ParentBabyLogModel";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faPlusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { Button, Col, FloatingLabel, Form, Row, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddFeeding from "./AddFeeding";

interface StudentFeedingProps extends CommonProps {
    id: number;
}
const initialPageState: InPageState<FeedingDto[]> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const StudentFeeding: NextPage<StudentFeedingProps> = (props) => { 
    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const { handleSubmit, register, setValue, getValues, formState: { errors }, } = useForm<FeedingModel>({
        defaultValues: {
            studentId: props.id,
        },
    });

    const [states, dispatch] = useReducer(reducer<FeedingDto[]>, initialPageState);

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


    const fetchFeedingList = async (studentId:number) => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.ParentBabyLogService.getFeedingByStudentId(studentId);
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
            fetchFeedingList(props.id);
        })();
    }, [states.refreshRequired]);

    
    return (
        <>
            <div className="level_page">
                <Row>
                    <Col xl={12} xxl={12}>
                        <div className="formBlock">
                            <Row>
                                <Col md={7} className="mb-3">
                                    <Button
                                        className="btn_main size_small"
                                        onClick={() => openAddUpdateModal(0)}
                                    >
                                        <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Feeding
                                    </Button>
                                </Col>
                            </Row>
                            <Table striped hover className="custom_design_table mb-0">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Notes</th>
                                        <th>File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {states.data &&
                                        states.data.map((feed) => {
                                            return (
                                                <tr key={feed.id}>
                                                    <td>
                                                        {unitOfService.DateTimeService.convertTimeToAmPm(
                                                            feed.feedingTime
                                                        )}
                                                    </td>
                                                    <td>{feed.message}</td>
                                                    <td>
                                                        {feed.url && (
                                                            <Link href={feed.url} target="_blank">
                                                                View Attachment
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </div>
            {states.showAddUpdateModal && (
                <AddFeeding
                    id={states.id}
                    studentId={props.id}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}
        </>
    )
}

export default StudentFeeding;