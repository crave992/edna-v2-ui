import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffReferenceDto } from "@/dtos/StaffDto";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { NextPage } from "next";

interface ViewStaffReferenceProps {
  staffId: number;
}

const ViewStaffReference: NextPage<ViewStaffReferenceProps> = ({ staffId }) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [staffReference, setStaffReference] = useState<StaffReferenceDto[]>([]);
  const fetchEmploymentHistory = async () => {
    const response = await unitOfService.StaffReferenceService.getAllByStaffId(
      staffId
    );
    if (response && response.status == 200 && response.data.data) {
      setStaffReference(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchEmploymentHistory();
    })();
  }, []);

  return (
    <>
      <h3 className="formBlock-heading">References</h3>
      {staffReference && staffReference.length > 0 && (
        <Table bordered className="custom_design_table mb-5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Relationship</th>
              <th>Years Known</th>
              <th>Phone</th>
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
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ViewStaffReference;
