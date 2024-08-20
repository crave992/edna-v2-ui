import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import ClassAttendanceOverViewDto from "@/dtos/ClassAttendanceOverViewDto";
import { ClassBasicDto } from "@/dtos/ClassDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import AttendanceModal from "@/models/AttendanceModal";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import {
  faChartSimple,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { useForm } from "react-hook-form";

interface AttendanceLisParams {
  classId: number;
  attendanceDate: string;
}

const AttendanceOverviewPage: NextPage<AttendanceLisParams> = (props) => {
  useBreadcrumb({
    pageName: "Attendance",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/admin/dashboard",
      },
      {
        label: "Attendance",
        link: "/students/attendance",
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { handleSubmit, setValue, getValues, control, register } =
    useForm<AttendanceModal>({
      defaultValues: {
        classId: props.classId,
        attendanceDate: props.attendanceDate
          ? new Date(
              unitOfService.DateTimeService.convertToLocalDate(
                new Date(props.attendanceDate)
              )
            )
          : new Date(),
      },
    });

  const submitData = async (formData: AttendanceModal) => {
    await actionFunction(formData);
  };

  const [classAttendance, setClassAttendance] = useState<
    ClassAttendanceOverViewDto[]
  >([]);

  const fetchClassAttendance = async (p?: AttendanceModal) => {
    if (!p) {
      p = props as unknown as AttendanceModal;
    }

    const response = await unitOfService.ClassAttendanceService.getAttendanceOverView(p);
    if (response && response.status === 200 && response.data.data) {
      setClassAttendance(response.data.data);
    }
  };

  const [classes, setClass] = useState<ClassBasicDto[]>([]);
  const fetchClass = async (levelId: number) => {
    const response = await unitOfService.ClassService.getClassByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setClass(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchClass(0);
      await fetchClassAttendance();
    })();
  }, []);

  async function actionFunction(p: AttendanceModal) {
    const qs = require("qs");
    await fetchClassAttendance(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const [attandanceDate, setAttandanceDate] = useState<string>("");
  const [classId, setClassId] = useState<number>(0);

  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [classId, attandanceDate]);

  return (
    <>
      <Head>
        <title>Attendance - Noorana</title>
      </Head>
      <div className="attaendance_overview">
        <Container fluid>
          <Row>
            <Col md={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">Attendance Overview</h1>
              </div>
              <Form
                method="get"
                autoComplete="off"
                onSubmit={handleSubmit(submitData)}
              >
                <Row>
                  <Col md={6} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Class</Form.Label>
                      <CustomSelect
                        name="classId"
                        control={control}
                        placeholder="All"
                        isSearchable={true}
                        options={classes}
                        textField="name"
                        valueField="id"
                        onChange={(value) => {
                          setClassId(+(value?.[0] || 0));
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Attendance Date</Form.Label>
                      <CustomInput
                        control={control}
                        type="datepicker"
                        name={"attendanceDate"}
                        onDateSelect={(selectedDate: string) => {
                          setAttandanceDate(selectedDate);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <div className="tableListItems">
                <div className="formBlock table-responsive">
                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th className="text-center">Present Student</th>
                        <th className="text-center">Absent Student</th>
                        <th className="text-center">Total Student</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classAttendance &&
                        classAttendance.map((classname) => {
                          return (
                            <tr key={classname.classId}>
                              <td>{classname.className}</td>
                              <td className="text-center">
                                {classname.totalPresent}
                              </td>
                              <td className="text-center">
                                {classname.totalAbsent}
                              </td>
                              <td className="text-center">
                                {classname.totalStudent}
                              </td>
                              <td className="text-center">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>View Details</Tooltip>}
                                >
                                  <Link
                                    href={`/students/attendance/byclass/${classname.classId}`}
                                    className="btn_main small"
                                  >
                                    <FontAwesomeIcon
                                      icon={faChartSimple}
                                      size="1x"
                                    />
                                  </Link>
                                </OverlayTrigger>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default AttendanceOverviewPage;

export const getServerSideProps: GetServerSideProps<
  AttendanceLisParams
> = async (context) => {
  let initialParamas: AttendanceLisParams = {
    classId: +(context.query.classId || 0),
    attendanceDate: `${context.query.attendanceDate || ""}`,
  };

  return {
    props: initialParamas,
  };
};
