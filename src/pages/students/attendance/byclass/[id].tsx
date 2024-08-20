import AddClassAttendance from "@/components/common/Class/Attendance";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import ClassAttendanceDto from "@/dtos/ClassAttendanceDto";
import ClassDto from "@/dtos/ClassDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Table,
} from "react-bootstrap";

interface ClassAttendanceProps extends CommonProps {
  id: number;
}

const ClassAttendancePage: NextPage<ClassAttendanceProps> = (props) => {
  useBreadcrumb({
    pageName: "Attendance Details",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Attendance",
        link: "/students/attendance",
      },
      {
        label: "Attendance Details",
        link: `/students/attendance/byclass/${props.id}`,
      },
    ],
  });
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [classDetails, setClassDetails] = useState<ClassDto>();
  const fetchClassDetails = async (id: number) => {
    const response = await unitOfService.ClassService.getById(id);
    if (response && response.status === 200 && response.data.data) {
      setClassDetails(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      fetchClassDetails(props.id);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Attendance - Noorana</title>
      </Head>
      <div className="attaendance_overview">
        <Container fluid>
          <Row>
            <Col md={9} xl={9}>
              <div className="db_heading_block">
                <h1 className="db_heading">Class: {classDetails?.name}</h1>
              </div>
              <AddClassAttendance classId={props.id} />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default ClassAttendancePage;

export const getServerSideProps: GetServerSideProps<
  ClassAttendanceProps
> = async (context) => {
  let initialParamas: ClassAttendanceProps = {
    id: +(context.query.id || 0),
  };

  return {
    props: initialParamas,
  };
};
