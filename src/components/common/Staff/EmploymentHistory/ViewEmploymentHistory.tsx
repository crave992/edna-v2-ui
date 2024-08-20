import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffEmploymentHistoryDto } from "@/dtos/StaffDto";
import {
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { useEffect, useReducer, useState } from "react";
import { Table } from "react-bootstrap";
import Loader from "../../Loader";
import { NextPage } from "next";

interface ViewEmploymentHistoryProps {
  staffId: number;
}

const initialPageState: InPageState<StaffEmploymentHistoryDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const ViewEmploymentHistory: NextPage<ViewEmploymentHistoryProps> = ({
  staffId,
}) => {
  const [states, dispatch] = useReducer(
    reducer<StaffEmploymentHistoryDto[]>,
    initialPageState
  );

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [employmentHistory, setEmploymentHistory] = useState<
    StaffEmploymentHistoryDto[]
  >([]);
  const fetchEmploymentHistory = async () => {
    const response = await unitOfService.StaffEmploymentHistoryService.getAllByStaffId(staffId);
    if (response && response.status == 200 && response.data.data) {
      setEmploymentHistory(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchEmploymentHistory();
    })();
  }, []);  

  return (
    <>
      <h3 className="formBlock-heading">Employment History</h3>
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
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}      

      {states.showLoader && <Loader />}
    </>
  );
};

export default ViewEmploymentHistory;
