import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { DiaperingDto } from "@/dtos/ParentBabyLogDto";
import CommonProps from "@/models/CommonProps";
import { DiaperingModel } from "@/models/ParentBabyLogModel";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faPlusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddDiapering from "./AddDiapering";

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

const StudentDiapering: NextPage<StudentDiaperingProps> = (props) => { 
    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const { handleSubmit, register, setValue, getValues, formState: { errors }, } = useForm<DiaperingModel>({
        defaultValues: {
            studentId: props.id,
        },
    });

    const [states, dispatch] = useReducer(reducer<DiaperingDto[]>, initialPageState);

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


    const fetchDiaperingList = async (studentId:number) => {
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
                        <div className="formBlock">
                            <Row>
                                <Col md={7} className="mb-3">
                                    <Button
                                        className="btn_main size_small"
                                        onClick={() => openAddUpdateModal(0)}
                                    >
                                        <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Diapering
                                    </Button>
                                </Col>
                            </Row>
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
                                                    <td>{diap.isDiaperRashCreamApplied? "Yes" : "No"}</td>
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
                <AddDiapering
                    id={states.id}
                    studentId={props.id}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}
        </>
    )
}

export default StudentDiapering;