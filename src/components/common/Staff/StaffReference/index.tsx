import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffReferenceDto } from "@/dtos/StaffDto";
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
import Loader from "../../Loader";
import { toast } from "react-toastify";
import ConfirmBox from "../../ConfirmBox";
import AddStaffReference from "./AddStaffReference";

const initialPageState: InPageState<StaffReferenceDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const StaffReference = () => {
  const [states, dispatch] = useReducer(
    reducer<StaffReferenceDto[]>,
    initialPageState
  );

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [staffReference, setStaffReference] = useState<StaffReferenceDto[]>([]);
  const fetchEmploymentHistory = async () => {
    const response = await unitOfService.StaffReferenceService.getAll();
    if (response && response.status == 200 && response.data.data) {
      setStaffReference(response.data.data);
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

  const deleteReference = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffReferenceService.delete(
      states.id
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Reference deleted successfully");

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
      <h3 className="formBlock-heading">References</h3>
      <p>
        Please list any 3 character references of individuals unrelated to you
        (other than those listed above).
      </p>
      <Button
        className="btn_border size_small mb-3"
        onClick={() => openAddUpdateModal(0)}
      >
        <FontAwesomeIcon icon={faPlus} size="1x" /> Add a Reference
      </Button>

      {staffReference && staffReference.length > 0 && (
        <Table bordered className="custom_design_table mb-5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Relationship</th>
              <th>Years Known</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffReference.map((ref) => {
              return (
                <tr key={ref.id}>
                  <td>{ref.name}</td>
                  <td>{ref.address}</td>
                  <td>{ref.relationship}</td>
                  <td>{ref.yearsKnown}</td>
                  <td>{ref.phone}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 50, hide: 100 }}
                      overlay={<Tooltip>Edit</Tooltip>}
                    >
                      <span
                        className="btn_main small anchor-span"
                        onClick={() => openAddUpdateModal(ref.id)}
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
                          openDeleteModal(ref.id);
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
        <AddStaffReference
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteReference}
          bodyText="Are you sure want to delete this?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default StaffReference;
