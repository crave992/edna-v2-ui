import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { PickupDropoffParentDto } from "@/dtos/PickupDropoffParentDto";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

interface PickupAuthorizationProps {
  parentId: number;
  studentId: number;
}

const PickupAuthorization: NextPage<PickupAuthorizationProps> = ({
    parentId, studentId,
}) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [contacts, setContacts] = useState<PickupDropoffParentDto[]>([]);
  const fetchContacts = async (parentId: number, studentId: number) => {
    const response =
      await unitOfService.PickupDropoffParentService.getAllByParentIdAndStudnetId(
        parentId,
        studentId
      );
    if (response && response.status === 200 && response.data.data) {
      setContacts(response.data.data);
    }
  };

  useEffect(() => {
    (async() => {
        await fetchContacts(parentId, studentId);
    })();
  }, []);

  return (
    <>
      <Table striped hover className="custom_design_table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Relation</th>
            <th>Priority</th>
            <th>Phone Number</th>
            <th className="text-center">Medical Contact?</th>
            <th className="text-center">Drivers Licence/ID</th>
          </tr>
        </thead>
        <tbody>
          {contacts &&
            contacts.map((contact) => {
              return (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.relation}</td>
                  <td>{contact.priority}</td>
                  <td>{contact.phoneNumber}</td>
                  <td className="text-center">
                    {contact.isEmergencyContact ? "Yes" : "No"}
                  </td>
                  <td className="text-center">
                    {contact.identityProof && (
                      <Link href={contact.identityProof} target="_blank">
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
};

export default PickupAuthorization;
