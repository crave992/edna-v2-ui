import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { PickUpDropOffStudentWiseBasicDto } from "@/dtos/PickUpDropOffStudentWiseDto";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

const TodayPickupDropOff = () => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [todaysPickupDropOff, setTodaysPickupDropOff] =
    useState<PickUpDropOffStudentWiseBasicDto[]>();
  const fetchTodaysPickupDropOff = async () => {
    const response =
      await unitOfService.PickUpDropOffStudentWiseService.getTodaysPickupDropOff();
    if (response && response.status === 200 && response.data.data) {
      setTodaysPickupDropOff(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchTodaysPickupDropOff();
    })();
  }, []);

  return (
    <>
      <Table striped hover className="custom_design_table mb-0">
        <thead>
          <tr>
            <th>Student</th>
            <th>Drop-Off By</th>
            <th className="text-center">Drop-Off Time</th>
            <th>Pickup By</th>
            <th className="text-center">Pickup Time</th>
          </tr>
        </thead>
        <tbody>
          {todaysPickupDropOff &&
            todaysPickupDropOff.map((picdrop) => {
              return (
                <tr key={picdrop.id}>
                  <td>{picdrop.studentName}</td>
                  <td>{picdrop.dropOffBy}</td>
                  <td className="text-center">
                    {unitOfService.DateTimeService.convertTimeToAmPm(
                      picdrop.dropOffTime
                    )}
                  </td>
                  <td>{picdrop.pickupBy}</td>
                  <td className="text-center">
                    {unitOfService.DateTimeService.convertTimeToAmPm(
                      picdrop.pickupTime
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


export default TodayPickupDropOff;