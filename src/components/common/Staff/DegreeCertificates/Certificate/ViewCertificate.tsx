import Loader from "@/components/common/Loader";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffCertificationDto } from "@/dtos/StaffDto";
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

interface ViewCertificateProps extends CommonProps {
  staffId: number;
}

const initialPageState: InPageState<StaffCertificationDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const ViewCertificate: NextPage<ViewCertificateProps> = ({ staffId }) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(
    reducer<StaffCertificationDto[]>,
    initialPageState
  );

  const fetchStaffCertificate = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.StaffCertificationService.getAllByStaffId(staffId);
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
      fetchStaffCertificate();
    })();
  }, []);

  return (
    <>
      <div className="db_heading_block">
        <h3 className="db_heading">Certificate</h3>
      </div>
      <div className="table-responsive">
        <Table striped hover className="custom_design_table mb-0">
          <thead>
            <tr>
              <th>Certificate</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {states.data &&
              states.data?.map((certificate) => {
                return (
                  <tr key={certificate.id}>
                    <td>{certificate.certificateName}</td>
                    <td>
                      {certificate.expiryDate
                        ? unitOfService.DateTimeService.convertToLocalDate(
                            certificate.expiryDate
                          )
                        : ""}
                    </td>
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
export default ViewCertificate;
