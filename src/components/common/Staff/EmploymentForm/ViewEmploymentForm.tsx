import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffEmploymentFormBasicDto } from "@/dtos/StaffDto";
import {
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faDownload } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import Loader from "../../Loader";
import Link from "next/link";
import { NextPage } from "next";

interface ViewEmploymentFormProps {
  staffId: number;
}

const initialPageState: InPageState<StaffEmploymentFormBasicDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const ViewEmploymentForm: NextPage<ViewEmploymentFormProps> = ({ staffId }) => {
  const [states, dispatch] = useReducer(
    reducer<StaffEmploymentFormBasicDto[]>,
    initialPageState
  );

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [staffEmploymentForm, setstaffEmploymentForm] = useState<
    StaffEmploymentFormBasicDto[]
  >([]);
  const fetchStaffEmploymentForm = async () => {
    const response = await unitOfService.StaffService.getEmploymentFormByStaffId(staffId);
    if (response && response.status == 200 && response.data.data) {
      setstaffEmploymentForm(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStaffEmploymentForm();
    })();
  }, []);  

  return (
    <>
      <hr />
      <h3 className="formBlock-heading">Employment Forms</h3>

      {staffEmploymentForm && staffEmploymentForm.length > 0 && (
        <Table bordered className="custom_design_table mb-5">
          <thead>
            <tr>
              <th>Form Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffEmploymentForm.map((form) => {
              return (
                <tr key={form.employmentFormId}>
                  <td>{form.employmentFormName}</td>
                  <td>{form.status}</td>
                  <td>                    

                    {form.employmentFormUrlByStaff && (
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 50, hide: 100 }}
                        overlay={<Tooltip>Download Uploaded Form</Tooltip>}
                      >
                        <Link
                          href={form.employmentFormUrlByStaff}
                          target="_blank"
                          download={true}
                          className="btn_main small"
                        >
                          <FontAwesomeIcon icon={faDownload} size="1x" />
                        </Link>
                      </OverlayTrigger>
                    )}

                  </td>
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

export default ViewEmploymentForm;
