import Avatar from "@/components/common/Avatar";
import ClassAssignmentDetails from "@/components/common/Student/ClassAssignment";
import PickupAuthorization from "@/components/common/Student/PickupAuthorization";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StudentBasicDto } from "@/dtos/StudentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import {
  faUser,
  faUsersClass,
  faUserCheck,
  faFileContract,
  faKitMedical,
  faSparkles,
  faCarSide,
  faFileLines,
  faBaby,
  faBarChart,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image, Modal } from "react-bootstrap";

interface StudentProfilePageParams {
  id: number;
}

const StudentProfilePage: NextPage<StudentProfilePageParams> = ({ id }) => {
  useBreadcrumb({
    pageName: "Student Profile",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/parent/dashboard",
      },
      {
        label: "Student Profile",
        link: `/parent/student/profile/${id}`,
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [reloadClassDetails, setReloadClassDetails] = useState<boolean>(false);
  const [student, setStudent] = useState<StudentBasicDto>();
  const fetchStudent = async (studentId: number) => {
    const response =
      await unitOfService.StudentService.getBasicStudentDetailsById(studentId);
    if (response && response.status === 200 && response.data.data) {
      setStudent(response.data.data);
    }
  };

  const [reloadComponent, setReloadComponent] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      setReloadComponent(false);

      await fetchStudent(id);
      
      setReloadComponent(true);
    })();
  }, [id]);

  const [showAuthorization, setShowAuthorization] = useState<boolean>(false);
  
  const updateStudentData = async () => {
    await fetchStudent(id);
  }
  return (
    <>
      <Head>
        <title>Student Profile - Noorana</title>
      </Head>
      <div className="student_profile">
        <Container fluid>
          <Row>
            <Col md={6} lg={6}>
              <div className="db_heading_block">
                <h1 className="db_heading">Basic Information</h1>
              </div>
              <div className="user_profile formBlock">
                <div className="tw-h-[120px] tw-flex tw-items-center tw-mr-[15px]">
                  <Avatar imageSrc={student?.profilePicture || ''} size={100} name="croppedImage" edit={false}/>
                  {/* {student?.profilePicture ? (
                    <Image
                      alt={student.name}
                      src={student.profilePicture}
                      className="img-fluid"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} size="2x" />
                  )} */}
                </div>
                <div className="user_detail">
                  <h2>{student?.name} {!student?.active && "(Inactive)"}</h2>
                  <p>Age: {student?.age}</p>
                  <p>Level: {student?.levelName}</p>
                  {student?.allergyName && (
                    <p>Allergies: {student.allergyName}</p>
                  )}
                </div>
              </div>
            </Col>
            <Col md={6} lg={6}>
              {reloadComponent && <ClassAssignmentDetails student={student} reload={reloadClassDetails} updateStudentData={updateStudentData} />}
            </Col>
          </Row>
          <Row xs={2} md={3} lg={4} xl={5} className="mb-5">
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Bio</span>
                </div>
                <Link
                  href={`/parent/student/bio/${id}`}
                  className="dataPageUrl"
                >
                  Student Information
                </Link>
                <FontAwesomeIcon icon={faFileContract} />
              </div>
            </Col>
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Medical Information</span>
                </div>
                <Link
                  href={`/parent/student/medical-information/${id}`}
                  className="dataPageUrl"
                >
                  View Details
                </Link>
                <FontAwesomeIcon icon={faKitMedical} />
              </div>
            </Col>
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Pickup Authorization</span>
                </div>
                <span
                  className="dataPageUrl anchor-span-underline"
                  onClick={() => {
                    setShowAuthorization(true);
                  }}
                >
                  View Details
                </span>
                <FontAwesomeIcon icon={faCarSide} />
              </div>
            </Col>            
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Academics</span>
                </div>
                <Link href={`/parent/student/academics/${id}`} className="dataPageUrl">
                  Academic Detail
                </Link>
                <FontAwesomeIcon icon={faUsersClass} />
              </div>
            </Col>
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Record Keeping</span>
                </div>
                <Link
                  href={`/parent/student/record-keeping/${id}`}
                  className="dataPageUrl"
                >
                  View Lessons
                </Link>
                <FontAwesomeIcon icon={faBarChart} />
              </div>
            </Col>
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>SEP Assessment</span>
                </div>
                <Link
                  href={`/parent/student/sep-assessment/${id}`}
                  className="dataPageUrl"
                >
                  Social, Emotional &amp; Physical
                </Link>
                <FontAwesomeIcon icon={faSparkles} />
              </div>
            </Col>            
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Forms</span>
                </div>
                <Link
                  href={`/parent/student/forms/${id}`}
                  className="dataPageUrl"
                >
                  View Forms
                </Link>
                <FontAwesomeIcon icon={faFileLines} />
              </div>
            </Col>
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Attendance</span>
                </div>
                <Link
                  href={`/parent/student/attendance/${id}`}
                  className="dataPageUrl"
                >
                  Attendance Details
                </Link>
                <FontAwesomeIcon icon={faUserCheck} />
              </div>
            </Col>
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Baby Log</span>
                </div>
                <Link
                  href={`/parent/student/baby-log/${id}`}
                  className="dataPageUrl"
                >
                  Add Baby Log
                </Link>
                <FontAwesomeIcon icon={faBaby} />
              </div>
            </Col>
          </Row>
          {student?.siblings && student?.siblings.length > 0 && (
            <>
              <Row>
                <Col>
                  <div className="db_heading_block">
                    <h1 className="db_heading">Siblings</h1>
                  </div>
                </Col>
              </Row>
              <Row>
                {student?.siblings?.map((sibling) => {
                  return (
                    <Col lg={6} xl={4} key={sibling.id}>
                      <div className="user_profile formBlock">
                        <div className="tw-h-[120px] tw-flex tw-items-center tw-mr-[15px]">
                          <Avatar imageSrc={sibling.profilePicture || ''} size={100} name="croppedImage" edit={false}/>
                        </div>
                        <div className="user_detail">
                          <h2>{sibling.name} {!sibling.active && "(Inactive)"}</h2>
                          <p>Age: {sibling.age}</p>
                          <Button
                            className="btn_main size_small mt-2"
                            onClick={() => {
                              router.push(
                                `/parent/student/profile/${sibling.id}`
                              );
                            }}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </>
          )}
        </Container>
      </div>

      <Modal
        show={showAuthorization}
        onHide={() => {
          setShowAuthorization(false);
        }}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Pickup/Dropoff Authorization</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
        >
          <PickupAuthorization parentId={0} studentId={id} />
        </Modal.Body>
      </Modal>
    </>
  );
};
export default StudentProfilePage;

export const getServerSideProps: GetServerSideProps<
  StudentProfilePageParams
> = async (context) => {
  let initialParamas: StudentProfilePageParams = {
    id: +(context.query.id || 0),
  };

  return {
    props: initialParamas,
  };
};
