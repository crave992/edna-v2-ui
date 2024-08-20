import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { WorkingDaysMappedDto } from "@/dtos/StaffSchedulingDto";
import ListWorkingDaysScheduling from "@/components/common/Staff/WorkingDaysScheduling";

interface StaffScheduleProps extends CommonProps {}

const StaffSchedule: NextPage<StaffScheduleProps> = (props) => {
  useBreadcrumb({
    pageName: "My Schedule",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/staff/dashboard",
      },
      {
        label: "My Schedule",
        link: "/staff/schedule",
      },
    ],
  });

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [workingDays, setWorkingDays] = useState<WorkingDaysMappedDto[]>();
  const fetchStaffWorkingDays = async (staffId: number) => {
    const response =
      await unitOfService.StaffSchedulingService.getWorkingDaysByStaffId(
        staffId
      );
    if (response && response.status === 200 && response.data.data) {
      setWorkingDays(response.data.data.filter(e => e.isMapped));
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStaffWorkingDays(0);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>My Schedule - Noorana</title>
      </Head>
      <div className="staff_info_page">
        <Container fluid>
          <Row>
            <Col md={12}>
              <div className="">
                <Form.Group className="mb-4">
                  <div className="db_heading_block">
                    <h1 className="db_heading">My Working Days</h1>
                  </div>
                  {workingDays &&
                    workingDays.map((wd) => {
                      return (
                        <Form.Check
                          key={wd.dayId}
                          inline
                          label={wd.dayName}
                          value={wd.dayId.toString()}
                          type="checkbox"
                          id={`wd-${wd.dayId}`}
                          defaultChecked={wd.isMapped}
                        />
                      );
                    })}
                </Form.Group>
              </div>
            </Col>
            <Col md={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">My Schedule</h1>
              </div>
              <ListWorkingDaysScheduling staffId={0} />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default StaffSchedule;
