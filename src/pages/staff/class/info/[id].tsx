import {
  faBriefcaseMedical,
  faEdit,
  faInfo,
  faPlus,
  faScreenUsers,
  faTimes,
  faUser,
  faUserCheck,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Row,
  Form,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
  Image,
} from "react-bootstrap";

import { Chart } from "react-google-charts";
import Link from "next/link";
import CommonProps from "@/models/CommonProps";
import Head from "next/head";
import useBreadcrumb from "@/hooks/useBreadcrumb";

import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import ClassDto, { StudentCountInClass } from "@/dtos/ClassDto";
import { GetServerSideProps, NextPage } from "next";
import { StaffBasicDto } from "@/dtos/StaffDto";
import { useRouter } from "next/router";
import { StaffClassAssignmentModel } from "@/models/ClassModel";

import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { StudentBasicDto } from "@/dtos/StudentDto";

export const data = [
  ["Subject", "Presented", "Practicing", "Acquired"],
  ["Art", 2, 0, 0],
  ["Biology", 2, 0, 0],
  ["Geography", 8, 24, 7],
  ["Geometry", 0, 0, 0],
  ["History", 0, 0, 0],
  ["Language", 11, 33, 6],
  ["Math", 0, 0, 0],
  ["Music", 0, 0, 0],
  ["Practical Life", 62, 157, 5],
  ["Extensions", 0, 0, 0],
];

export const options = {
  //title: "Population of Largest U.S. Cities",
  chartArea: { width: "70%" },
  isStacked: true,
  legend: { position: "top" },
  hAxis: {
    minValue: 0,
  },
};

interface ClassInfoProps extends CommonProps {
  id: number;
  classId: number;
  levelId: number;
}

const ClassInfo: NextPage<ClassInfoProps> = (props) => {
  const router = useRouter();
  useBreadcrumb({
    pageName: "Class Details",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/staff/dashboard",
      },
      {
        label: "Class Details",
        link: `/staff/class/info/${props.id}`,
      },
    ],
  });

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  
  const [totalEnrollments, setTotalEnrollments] = useState<number>(0);
  const [countingByGender, setCountingByGender] = useState< StudentCountInClass[]>([]);
  const [students, setStudents] = useState<StudentBasicDto[]>([]);
  const [classs, setClasss] = useState<ClassDto>();
  const fetchClass = async (classId: number, q?: string) => {
    const response = await unitOfService.ClassService.getClassBasicDetails(classId, q || "");
    if (response && response.status === 200 && response.data.data) {
      setClasss(response.data.data);
      localStorage.setItem('levelInfoId', response.data.data.level.id.toString());
      localStorage.setItem('classInfoId', classId.toString());
      
      if (response.data.data?.genderWiseCount) {
        setCountingByGender(response.data.data?.genderWiseCount);
        const total = response.data.data?.genderWiseCount.reduce(
          (acc, obj) => acc + obj.total,
          0
        );
        setTotalEnrollments(total);
      }
    }
  };

  const fetchStudents = async (classId: number, q?: string) => {
    const response = await unitOfService.ClassService.getStudentForStaffByClassId(classId, q || "");
    if (response && response.status === 200 && response.data.data) { 
      setStudents(response.data.data);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchClass(props.id, "");
      await fetchStudents(props.id, "");
    })();
  }, []);
  
  return (
    <>
      <Head>
        <title>Class Info - Noorana</title>
      </Head>
      <div className="class_info">
        <Container className="tw-mt-2">
          <Row>
            <Col lg={8}>
              <div className="db_heading_block">
                <h1 className="db_heading">Class: {classs?.name}</h1>
              </div>
              <Row xs={2} md={3} lg={2} xl={3} xxl={4} className="mb-4">
                <Col>
                  <div className="db_data_overview_each class_box">
                    <div className="dataName">
                      <span>Level</span>
                      <p className="class_box_data">{classs?.level?.name}</p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="db_data_overview_each class_box">
                    <div className="dataName">
                      <span>Lead Guide</span>
                      <p className="class_box_data">
                        {/* {classs?.staff?.firstName}&nbsp;
                        {classs?.staff?.lastName} */}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="db_data_overview_each class_box">
                    <div className="dataName">
                      <span>Classroom Associates</span>
                      {/* {classs &&
                        classs.classStaff?.filter(classAssociates => (
                          classAssociates.id !== classs?.staff?.id
                        )).map((classAssociates, index, array) => {
                          return (
                            <p className="class_box_data" key={classAssociates.id}>
                              {classAssociates.firstName}&nbsp;
                              {classAssociates.lastName}
                              {index !== array.length - 1 && ','}
                            </p>
                          )
                        }
                      )} */}
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="db_data_overview_each class_box">
                    <div className="dataName">
                      <span>Class Capacity</span>
                      <p className="class_box_data">{classs?.capacity}</p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="db_data_overview_each class_box">
                    <div className="dataName">
                      <span>Enrollment</span>
                      <p className="class_box_data">{totalEnrollments}</p>
                    </div>
                  </div>
                </Col>
                {countingByGender &&
                  countingByGender.map((cntBygender) => {
                    return (
                      <Col key={cntBygender.gender}>
                        <div className="db_data_overview_each class_box">
                          <div className="dataName">
                            <span>
                              {cntBygender.gender == "Male"
                                ? "Boys"
                                : cntBygender.gender == "Female"
                                ? "Girls"
                                : cntBygender.gender}
                            </span>
                            <p className="class_box_data">
                              {cntBygender.total}
                            </p>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
              </Row>
            </Col>
            <Col lg={4}>
              <div className="db_heading_block">
                <h1 className="db_heading">Overall Academics</h1>
              </div>
              <div className="formBlock">
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="180px"
                  data={data}
                  options={options}
                />
              </div>
            </Col>
          </Row>
        </Container>

        <Container>
          <Row>
            <Col lg={6}>
              <div className="formBlock">
                <div className="db_heading_block">
                  <h1 className="db_heading">Student List</h1>
                </div>
                <div className="tableListItems h-200">
                  {students &&
                    students.map((stud) => {
                      return (
                        <div className="renderStaff" key={stud.id}>
                          <div className="userDetailsMain">
                            <div className="userAvatar">
                              {stud.profilePicture ? (
                                <Image
                                  fluid
                                  alt={stud.name}
                                  src={stud.profilePicture}
                                  style={{ maxWidth: "70px" }}
                                />
                              ) : (
                                <FontAwesomeIcon icon={faUser} size="2x" />
                              )}
                            </div>
                            <div className="userDetails">
                              <h2>
                                {stud.name} {!stud.active && "(Inactive)"}
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Allergies</Tooltip>}
                                >
                                  <Link
                                    href={`/students/medical-information/${stud.id}`}
                                    className="orange_color ms-2"
                                  >
                                    <FontAwesomeIcon
                                      icon={faBriefcaseMedical}
                                      size="1x"
                                    />
                                  </Link>
                                </OverlayTrigger>
                              </h2>
                              <p>Age: {stud.age}</p>
                            </div>
                          </div>
                          <div className="userActions">
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Profile</Tooltip>}
                            >
                              <Link
                                href={`/students/info/${stud.id}`}
                                className="btn_main small"
                              >
                                <FontAwesomeIcon icon={faInfo} size="1x" />
                              </Link>
                            </OverlayTrigger>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="formBlock">
                <div className="db_heading_block">
                  <h1 className="db_heading">Quick Actions</h1>
                </div>

                <Row xs={2} md={3} lg={2} xl={2} xxl={3}>
                  <Col>
                    <div className="db_data_overview_each small_box">
                      <div className="dataName">
                        <span>SEP Assessment</span>
                      </div>
                      <Link href={"/students/sep-assessment"} className="dataPageUrl">
                        SEP
                      </Link>
                      <FontAwesomeIcon icon={faScreenUsers} />
                    </div>
                  </Col>
                  <Col>
                    <div className="db_data_overview_each small_box">
                      <div className="dataName">
                        <span>Lesson Planning</span>
                      </div>
                      <Link href={`/staff/class/lesson-overview/${props.id}`} className="dataPageUrl">
                        Lessons
                      </Link>
                      <FontAwesomeIcon icon={faScreenUsers} />
                    </div>
                  </Col>
                  <Col>
                    <div className="db_data_overview_each small_box">
                      <div className="dataName">
                        <span>Attendance</span>
                      </div>
                      <Link href={`/students/attendance/byclass/${props.id}`} className="dataPageUrl">
                        View Attendance
                      </Link>
                      <FontAwesomeIcon icon={faUserCheck} />
                    </div>
                  </Col>
                  <Col>
                    <div className="db_data_overview_each small_box">
                      <div className="dataName">
                        <span>Record Keeping</span>
                      </div>
                      <Link href={`/students/record-keeping/?classId=${props.id}&levelId=${classs?.level.id}`} className="dataPageUrl">
                        Record Keeping
                      </Link>
                      <FontAwesomeIcon icon={faUserCheck} />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ClassInfo;

export const getServerSideProps: GetServerSideProps<ClassInfoProps> = async (
  context
) => {

  let initialParamas: ClassInfoProps = {
    id: +(context.query.id || 0),
    classId: +(context.query.classId || 0),
    levelId: +(context.query.levelId || 0),
  };

  return {
    props: initialParamas,
  };
};
