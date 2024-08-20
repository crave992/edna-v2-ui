import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import {
  faPenToSquare,
  faPlusCircle,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { toast } from "react-toastify";

import ConfirmBox from "@/components/common/ConfirmBox";
import Loader from "@/components/common/Loader";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { StaffEmergencyContactDto } from "@/dtos/StaffDto";
import ManageEmergencyContact from "./ManageEmergencyContact";

interface EmergencyContactProps extends CommonProps {}

const initialPageState: InPageState<StaffEmergencyContactDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const EmergencyContact: NextPage<EmergencyContactProps> = () => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(
    reducer<StaffEmergencyContactDto[]>,
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

  const deleteEmergencyContact = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffEmergencyContactService.delete(
      states.id
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Emergency contact deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchEmergencyContact = async (q?: string) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffEmergencyContactService.getAll();
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
      fetchEmergencyContact();
    })();
  }, [states.refreshRequired]);

  return (
    <>
      <div className="emergency-contact">
        <Row>
          <Col md={4}>
          <h3 className="formBlock-heading">Emergency Contact</h3>
          </Col>
          <Col md={8} className="text-end">
            <Button className="btn_main" onClick={() => openAddUpdateModal(0)}>
              <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Emergency Contact
            </Button>
          </Col>
        </Row>

        {states.data && states.data.length > 0 && (
          <>
            <Table striped hover className="custom_design_table mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Relation</th>
                  <th>Priority</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {states.data &&
                  states.data.map(
                    (emergencyContact: StaffEmergencyContactDto) => {
                      return (
                        <tr key={emergencyContact.id}>
                          <td>
                            {emergencyContact.firstName}{" "}
                            {emergencyContact.lastName}
                          </td>
                          <td>{emergencyContact.relationship}</td>
                          <td>{emergencyContact.priority}</td>
                          <td>{emergencyContact.email}</td>
                          <td>{emergencyContact.phone}</td>
                          <td>
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Edit</Tooltip>}
                            >
                              <span
                                className="btn_main small anchor-span"
                                onClick={() =>
                                  openAddUpdateModal(emergencyContact.id)
                                }
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
                                className="btn_main orange_btn small anchor-span"
                                onClick={() => {
                                  openDeleteModal(emergencyContact.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} size="1x" />
                              </span>
                            </OverlayTrigger>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </Table>
            <hr />
          </>
        )}
      </div>

      {states.showAddUpdateModal && (
        <ManageEmergencyContact
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteEmergencyContact}
          bodyText="Are you sure want to delete this emergency contact?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}
      {states.showLoader && <Loader />}
    </>
  );
};
export default EmergencyContact;
