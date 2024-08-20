import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffEmploymentHistoryDto } from "@/dtos/StaffDto";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import {
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import AddEmploymentHistory from "./AddEmploymentHistory";
import Loader from "../../Loader";
import { toast } from "react-toastify";
import ConfirmBox from "../../ConfirmBox";

const initialPageState: InPageState<StaffEmploymentHistoryDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const EmploymentHistory = () => {
  const [states, dispatch] = useReducer(
    reducer<StaffEmploymentHistoryDto[]>,
    initialPageState
  );

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [employmentHistory, setEmploymentHistory] = useState<
    StaffEmploymentHistoryDto[]
  >([]);
  const fetchEmploymentHistory = async () => {
    const response = await unitOfService.StaffEmploymentHistoryService.getAll();
    if (response && response.status == 200 && response.data.data) {
      setEmploymentHistory(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchEmploymentHistory();
    })();
  }, [states.refreshRequired]);

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

  const deleteEmploymentHistory = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffEmploymentHistoryService.delete(
      states.id
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Employment history deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      <h3 className="formBlock-heading">Employment History</h3>
      <p>
        Last three years of employment history - Explain the gaps in the career
        (less than one month not needed)
      </p>
      <Button
        className="btn_border size_small mb-3"
        onClick={() => openAddUpdateModal(0)}
      >
        <FontAwesomeIcon icon={faPlus} size="1x" /> Add Employment History
      </Button>

      {employmentHistory && employmentHistory.length > 0 && (
        <Table bordered className="custom_design_table mb-5">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Place of Employemnt</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Name of Supervisor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employmentHistory.map((emp) => {
              return (
                <tr key={emp.id}>
                  <td>
                    {unitOfService.DateTimeService.convertToLocalDate(
                      emp.fromDate
                    )}
                  </td>
                  <td>
                    {emp.toDate
                      ? unitOfService.DateTimeService.convertToLocalDate(
                          emp.toDate
                        )
                      : ""}
                  </td>
                  <td>{emp.organisationName}</td>
                  <td>{emp.address}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.nameOfSupervisor}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 50, hide: 100 }}
                      overlay={<Tooltip>Edit</Tooltip>}
                    >
                      <span
                        className="btn_main small anchor-span"
                        onClick={() => openAddUpdateModal(emp.id)}
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
                          openDeleteModal(emp.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} size="1x" />
                      </span>
                    </OverlayTrigger>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {states.showAddUpdateModal && (
        <AddEmploymentHistory
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteEmploymentHistory}
          bodyText="Are you sure want to delete this?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default EmploymentHistory;
