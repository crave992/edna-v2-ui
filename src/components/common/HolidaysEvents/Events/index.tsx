import Loader from "@/components/common/Loader";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import EventDto from "@/dtos/EventDto";
import CommonProps from "@/models/CommonProps";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faPenToSquare } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import AddEvent from "./AddEvent";


interface EventsProps extends CommonProps {

}

const initialPageState: InPageState<EventDto[]> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const Events: NextPage<EventsProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<EventDto[]>, initialPageState);

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


    const fetchEvent = async () => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.EventService.getAll();
        if (response && response.status === 200 && response.data.data) {
            dispatch({
                type: InPageActionType.SET_DATA,
                payload: response.data.data,
            });

            dispatch({
                type: InPageActionType.SHOW_LOADER,
                payload: false,
            });
        }
    };

    useEffect(() => {
        (async () => {
            await fetchEvent();
        })();
    }, [states.refreshRequired]);

    return (
        <>
            <div className='db_heading_block'>
                <h3 className="db_heading">Events</h3>
                <Button className="btn_main size_small" onClick={() => openAddUpdateModal(0)}>Add Event</Button>
            </div>
            <div className="table-responsive">
                <Table striped hover className="custom_design_table mb-0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            {/* <th>Type</th> */}
                            <th>Date</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {states.data &&
                            states.data?.map((event) => {
                                return (
                                    <tr key={event.id}>
                                        <td>{event.name}</td>
                                        {/* <td>{holiday.holidayType.name}</td> */}
                                        <td>{unitOfService.DateTimeService.convertToLocalDate(event.date)}</td>
                                        <td className="text-center">
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 50, hide: 100 }}
                                                overlay={<Tooltip>Edit</Tooltip>}
                                            >
                                                <span
                                                    className="btn_main small anchor-span"
                                                    onClick={() => openAddUpdateModal(event.id)}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPenToSquare}
                                                        size="1x"
                                                    />
                                                </span>
                                            </OverlayTrigger>

                                        </td>
                                    </tr>
                                )
                            })}

                    </tbody>
                </Table>
            </div>
            {states.showAddUpdateModal && (
                <AddEvent
                    id={states.id}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}

            {states.showLoader && <Loader />}
        </>
    )
}
export default Events;