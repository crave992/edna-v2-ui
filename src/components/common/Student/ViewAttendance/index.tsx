import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Table } from "react-bootstrap";
import CustomInput from "../../CustomFormControls/CustomInput";
import ClassAttendanceListParams from "@/params/ClassAttendanceListParams";
import { StudentBasicDto } from "@/dtos/StudentDto";
import { StudentAttendanceDto } from "@/dtos/StudentAttendanceDto";

interface StudentViewAttendanceProps extends CommonProps {
  studentId: number;
  q?: string;
}

const StudentViewAttendance: NextPage<StudentViewAttendanceProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { control } = useForm({
    defaultValues: {
      studentId: props.studentId,
      classAttendances: [],
      attendanceDate: new Date(),
    },
  });

  const [totalPresent, setTotalPresent] = useState<number>(0);
  const [totalExcuseAbsent, setTotalExcuseAbsent] = useState<number>(0);
  const [totalUnexcusedAbsent, setTotalUnexcusedAbsent] = useState<number>(0);
  const [totalTardy, setTotalTardy] = useState<number>(0);

  const [attendance, setAttendance] = useState<StudentAttendanceDto[] | null>(
    []
  );
  const fetchStudentAttendance = async (
    studentId: number,
    p?: ClassAttendanceListParams
  ) => {
    if (!p) {
      p = {
        attendanceDate: new Date().toString(),
        q: "",
      };
    }

    setAttendance(null);
    const response =
      await unitOfService.ClassAttendanceService.getAttendanceByStudentId(
        studentId,
        p
      );
    if (response && response.status === 200 && response.data.data) {
      setAttendance(response.data.data);

      setTotalPresent(
        response.data.data.filter((e) => e.presentOrAbsent === "Present")
          ?.length
      );
      setTotalExcuseAbsent(
        response.data.data.filter((e) => e.presentOrAbsent === "Excuse_Absent")
          ?.length
      );
      setTotalUnexcusedAbsent(
        response.data.data.filter(
          (e) => e.presentOrAbsent === "Unexcused_Absent"
        )?.length
      );
      setTotalTardy(
        response.data.data.filter((e) => e.isTardy === true)?.length
      );
    }
  };

  const [studentDetail, setStudentDetail] = useState<StudentBasicDto>();
  const fetchStudentDetail = async (id: number) => {
    const response =
      await unitOfService.StudentService.getBasicStudentDetailsById(id);
    if (response && response.status === 200 && response.data.data) {
      setStudentDetail(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      fetchStudentAttendance(props.studentId);
      fetchStudentDetail(props.studentId);
    })();
  }, []);

  const dateChanged = (selectedDate: string) => {
    fetchStudentAttendance(props.studentId, {
      q: "",
      attendanceDate: selectedDate,
    });
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={9} xl={9}>
            <div className="db_heading_block">
              <h1 className="db_heading">Name: {studentDetail?.name}</h1>
            </div>
            <Form method="post" autoComplete="off">
              <Row>
                <Col md={12} lg={12} xl={10}>
                  <div className="searchSortBlock">
                    <div className="sortBlock">
                      <Row>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>Select Date</Form.Label>
                            <CustomInput
                              control={control}
                              type="datepicker"
                              name={"attendanceDate"}
                              onDateSelect={dateChanged}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="attendance_overview_bar p-2 mb-3">
                <span>Present : {totalPresent}</span>
                <span>Excused Absence : {totalExcuseAbsent}</span>
                <span>Unexcused Absence : {totalUnexcusedAbsent}</span>
                <span>Tardies : {totalTardy}</span>
              </div>
              <div className="tableListItems">
                <div className="formBlock table-responsive">
                  <Row></Row>

                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th className="text-center">Present</th>
                        <th className="text-center">Excuse Absent</th>
                        <th className="text-center">Unexcused Absent</th>
                        <th className="text-center">Tardy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance &&
                        attendance.map((classAtten) => {
                          return (
                            <tr key={classAtten.classId}>
                              <td>{classAtten.className} </td>
                              <td className="text-center">
                                <Form.Check
                                  inline
                                  type="radio"
                                  id="present_switch"
                                  name={`attendanceSelection_${classAtten.classId}`}
                                  value={`Present~${classAtten.classId}`}
                                  disabled={true}
                                  defaultChecked={
                                    classAtten.presentOrAbsent === "Present"
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <Form.Check
                                  inline
                                  type="radio"
                                  id="excuse_absent_switch"
                                  name={`attendanceSelection_${classAtten.classId}`}
                                  value={`Excuse_Absent~${classAtten.classId}`}
                                  disabled={true}
                                  defaultChecked={
                                    classAtten.presentOrAbsent ===
                                    "Excuse_Absent"
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <Form.Check
                                  inline
                                  type="radio"
                                  id="unexcused_absent_switch"
                                  name={`attendanceSelection_${classAtten.classId}`}
                                  value={`Unexcused_Absent~${classAtten.classId}`}
                                  disabled={true}
                                  defaultChecked={
                                    classAtten.presentOrAbsent ===
                                    "Unexcused_Absent"
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <Form.Check
                                  inline
                                  type="checkbox"
                                  id="tardy_switch"
                                  name={`attendanceSelectionTardy_${classAtten.classId}`}
                                  disabled={true}
                                  defaultChecked={
                                    classAtten.isTardy ? true : false
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default StudentViewAttendance;
