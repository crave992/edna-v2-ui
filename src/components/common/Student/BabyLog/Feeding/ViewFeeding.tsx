import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { FeedingDto } from "@/dtos/ParentBabyLogDto";
import CommonProps from "@/models/CommonProps";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { Col, Row, Table } from "react-bootstrap";

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

const ViewStudentFeeding: NextPage<StudentFeedingProps> = (props) => {
    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<FeedingDto[]>, initialPageState);
    const fetchFeedingList = async (studentId: number) => {
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
                        <div className="">
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
        </>
    )
}

export default ViewStudentFeeding;