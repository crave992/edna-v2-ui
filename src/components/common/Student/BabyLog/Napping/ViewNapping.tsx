import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { NappingDto } from "@/dtos/ParentBabyLogDto";
import CommonProps from "@/models/CommonProps";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { Col, Row, Table } from "react-bootstrap";

interface StudentNappingProps extends CommonProps {
    id: number;
}
const initialPageState: InPageState<NappingDto[]> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const ViewStudentNapping: NextPage<StudentNappingProps> = (props) => {
    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<NappingDto[]>, initialPageState);
    const fetchNappingList = async (studentId: number) => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.ParentBabyLogService.getNappingByStudentId(studentId);
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
            fetchNappingList(props.id);
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
                                        <th>From Time</th>
                                        <th>To Time</th>
                                        <th>Message</th>
                                        <th>File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {states.data &&
                                        states.data.map((nap) => {
                                            return (
                                                <tr key={nap.id}>
                                                    <td>
                                                        {unitOfService.DateTimeService.convertTimeToAmPm(
                                                            nap.fromTime
                                                        )}
                                                    </td>
                                                    <td>
                                                        {unitOfService.DateTimeService.convertTimeToAmPm(
                                                            nap.toTime
                                                        )}
                                                    </td>
                                                    <td>{nap.message}</td>
                                                    <td>
                                                        {nap.url && (
                                                            <Link href={nap.url} target="_blank">
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

export default ViewStudentNapping;