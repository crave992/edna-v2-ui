import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffSchedulingDto } from "@/dtos/StaffSchedulingDto";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faPenToSquare, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useState, useEffect, useReducer } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmBox from "../../ConfirmBox";
import AddWorkingDaySchedule from "./AddWorkingDaySchedule";
import Loader from "../../Loader";
import { useSession } from "next-auth/react";
import RoleDto from "@/dtos/RoleDto";
import { AdminRoles, Role } from "@/helpers/Roles";

interface ListWorkingDaysSchedulingProps {
  staffId: number;
}

const initialPageState: InPageState<StaffSchedulingDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const ListWorkingDaysScheduling: NextPage<ListWorkingDaysSchedulingProps> = ({
  staffId,
}) => {
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    if (session && session.user) {
      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);
      setRoles(roles);
    }
  }, [status]);

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(
    reducer<StaffSchedulingDto[]>,
    initialPageState
  );

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

  const deleteSchdule = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffSchedulingService.delete(
      states.id,
      staffId
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Schedule deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchStaffSchedulingByStaffId = async (staffId: number) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.StaffSchedulingService.getStaffSchedulingByStaffId(
        staffId
      );
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
      await fetchStaffSchedulingByStaffId(staffId);
    })();
  }, [states.refreshRequired]);

  return (
    <>
      {roles && roles.length > 0 && AdminRoles.some( role => roles.includes(role))  && (
        <div className="mt-5 mb-3">
          <Button className="btn_main" onClick={() => openAddUpdateModal(0)}>
            Add Schedule
          </Button>
        </div>
      )}

      <Table striped hover className="custom_design_table mb-0">
        <thead>
          <tr>
            <th>Day</th>
            <th className="text-center">From Time</th>
            <th className="text-center">To Time</th>
            <th>Notes</th>
            {roles &&
              roles.length > 0 &&
              AdminRoles.some( role => roles.includes(role))  && (
                <th className="text-center">Action</th>
              )}
          </tr>
        </thead>
        <tbody>
          {states.data &&
            states.data.map((schedule) => {
              return (
                <tr key={schedule.id}>
                  <td>{schedule.dayName}</td>
                  <td className="text-center">
                    {unitOfService.DateTimeService.convertTimeToAmPm(
                      schedule.fromTime
                    )}
                  </td>
                  <td className="text-center">
                    {unitOfService.DateTimeService.convertTimeToAmPm(
                      schedule.toTime
                    )}
                  </td>
                  <td>{schedule.notes}</td>

                  {roles &&
                    roles.length > 0 &&
                    AdminRoles.some( role => roles.includes(role))  && (
                      <td className="text-center">
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 50, hide: 100 }}
                          overlay={<Tooltip>Edit</Tooltip>}
                        >
                          <span
                            className="btn_main small anchor-span"
                            onClick={() => openAddUpdateModal(schedule.id)}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} size="1x" />
                          </span>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 50, hide: 100 }}
                          overlay={<Tooltip>Delete</Tooltip>}
                        >
                          <span
                            className="btn_main orange_btn small anchor-span"
                            onClick={() => {
                              openDeleteModal(schedule.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} size="1x" />
                          </span>
                        </OverlayTrigger>
                      </td>
                    )}
                </tr>
              );
            })}
        </tbody>
      </Table>

      {states.showAddUpdateModal && (
        <AddWorkingDaySchedule
          staffId={staffId}
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteSchdule}
          bodyText="Are you sure want to delete this schdule?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default ListWorkingDaysScheduling;
