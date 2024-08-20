import Loader from "@/components/common/Loader";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffDegreeDto } from "@/dtos/StaffDto";
import CommonProps from "@/models/CommonProps";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import { Table } from "react-bootstrap";

interface ViewDegreeProps extends CommonProps {
  staffId: number;
}

const initialPageState: InPageState<StaffDegreeDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const ViewDegree: NextPage<ViewDegreeProps> = ({ staffId }) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(
    reducer<StaffDegreeDto[]>,
    initialPageState
  );

  const fetchStaffDegree = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffDegreeService.getAllByStaffId(staffId);
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
      fetchStaffDegree();
    })();
  }, []);

  return (
    <>
      <div className="db_heading_block">
        <h3 className="db_heading">Degree</h3>
      </div>
      <div className="table-responsive">
        <Table striped hover className="custom_design_table mb-0">
          <thead>
            <tr>
              <th>Degree</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {states.data &&
              states.data?.map((degree) => {
                return (
                  <tr key={degree.id}>
                    <td>{degree.degreeName}</td>
                    <td>{degree.name}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>

      {states.showLoader && <Loader />}
    </>
  );
};
export default ViewDegree;
