import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import IUnitOfService from "@/services/interfaces/IUnitOfService";

import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import {
  Table,
} from "react-bootstrap";

import Loader from "@/components/common/Loader";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { StaffEmergencyContactDto } from "@/dtos/StaffDto";

interface ViewEmergencyContactProps {
  staffId: number;
}

const initialPageState: InPageState<StaffEmergencyContactDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const ViewEmergencyContact: NextPage<ViewEmergencyContactProps> = ({
  staffId,
}) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(
    reducer<StaffEmergencyContactDto[]>,
    initialPageState
  );

  const fetchEmergencyContact = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffEmergencyContactService.getAllByStaffId(staffId);
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
  }, []);

  return (
    <>
      <div className="emergency-contact">
        {states.data && states.data.length > 0 && (
          <>
            <h3 className="formBlock-heading">Emergency Contact</h3>
            <Table striped hover className="custom_design_table mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Relation</th>
                  <th>Priority</th>
                  <th>Email</th>
                  <th>Phone</th>
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

      {states.showLoader && <Loader />}
    </>
  );
};
export default ViewEmergencyContact;
