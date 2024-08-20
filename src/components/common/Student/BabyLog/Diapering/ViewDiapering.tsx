import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { DiaperingDto } from "@/dtos/ParentBabyLogDto";
import CommonProps from "@/models/CommonProps";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { Col, Row, Table } from "react-bootstrap";

interface StudentDiaperingProps extends CommonProps {
    id: number;
}
const initialPageState: InPageState<DiaperingDto[]> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const ViewStudentDiapering: NextPage<StudentDiaperingProps> = (props) => {
    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<DiaperingDto[]>, initialPageState);
    
    const fetchDiaperingList = async (studentId: number) => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.ParentBabyLogService.getDiaperingByStudentId(studentId);
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
            fetchDiaperingList(props.id);
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
                                        <th>Type</th>
                                        <th>Message</th>
                                        <th>File</th>
                                        <th>Rash cream applied</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {states.data &&
                                        states.data.map((diap) => {
                                            return (
                                                <tr key={diap.id}>
                                                    <td>
                                                        {unitOfService.DateTimeService.convertTimeToAmPm(
                                                            diap.diaperChangedTime
                                                        )}
                                                    </td>
                                                    <td>
                                                        {diap.type}
                                                    </td>
                                                    <td>{diap.message}</td>
                                                    <td>
                                                        {diap.url && (
                                                            <Link href={diap.url} target="_blank">
                                                                View Attachment
                                                            </Link>
                                                        )}
                                                    </td>
                                                    <td>{diap.isDiaperRashCreamApplied ? "Yes" : "No"}</td>
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

export default ViewStudentDiapering;