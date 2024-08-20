import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBaby,
  faBarChart,
  faBookAlt,
  faCarSide,
  faFileContract,
  faFileLines,
  faKitMedical,
  faSparkles,
  faUser,
  faUserMinus,
  faUserPlus,
  faUserCheck,
  faUsersClass,
  faPlusCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { 
  Button, 
  Col, 
  Container,
  Modal, 
  Row, 
  OverlayTrigger,
  Tooltip, 
  Form
} from "react-bootstrap";
import { GetServerSideProps, NextPage } from "next";
import CommonProps from "@/models/CommonProps";
import Link from "next/link";
import Head from "next/head";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { StudentBasicDto } from "@/dtos/StudentDto";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useRouter } from "next/router";
import PickupAuthorization from "@/components/common/Student/PickupAuthorization";
import ClassAssignmentDetails from "@/components/common/Student/ClassAssignment";
import ConfirmBox from "@/components/common/ConfirmBox";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { TagsInput } from "react-tag-input-component";
import { ParentInviteParamsDto } from "@/dtos/ParentInviteDto";
import Loader from "@/components/common/Loader";
import { useSession } from "next-auth/react";
import siteMetadata from "@/constants/siteMetadata";
import Avatar from "@/components/common/Avatar";
import Image from "next/image";

interface StudentProfileProps extends CommonProps {
  id: number;
  parentId: number;
}

const StudentProfile: NextPage<StudentProfileProps> = (props) => {
  useBreadcrumb({
    pageName: "Student Profile",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/admin/dashboard",
      },
      {
        label: "Students",
        link: "/students",
      },
      {
        label: "Student Profile",
        link: `/students/info/${props.id}`,
      },
    ],
  });

  const router = useRouter();
  const [deactivate, setDeactivate] = useState<boolean>(false);
  const [activate, setActivate] = useState<boolean>(false);
  const [reloadClassDetails, setReloadClassDetails] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [showAuthorization, setShowAuthorization] = useState<boolean>(false);
  const [showAddParentModal, setShowAddParentModal] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const [orgId, setOrgId] = useState<number>(0);
  const [reloadComponent, setReloadComponent] = useState<boolean>(false);
  const { handleSubmit, reset, control } = useForm();
  const [studentDetails, setStudentDetails] = useState<StudentBasicDto>();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const setStudenState = async (state:boolean) => {
    var id  = studentDetails ? studentDetails.id : 0;
    const response = await unitOfService.StudentService.updateStudentState(id, state);

    if (response && response.status === 200 && response.data.data) {
      toast.success(`Student ${state ? 'activated' : 'deactivated'}`);

      if(studentDetails){
         studentDetails.active = state;
         setStudentDetails(studentDetails);
         setReloadClassDetails(!reloadClassDetails);
      }
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
    setDeactivate(false);
    setActivate(false);
  };

  const updateStudentData = async () => {
    await fetchStudent(props.id);
  }

  const fetchStudent = async (studentId: number) => {
    let response =
      await unitOfService.StudentService.getBasicStudentDetailsById(studentId);
    if (response && response.status === 200 && response.data.data) {
      setStudentDetails(response.data.data);
      return response.data.data;
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      setReloadComponent(false);
      await fetchStudent(props.id);
      setReloadComponent(true);
    })();
  }, [props.id]);

  useEffect(() => {
    if (session && session.user) {
      setOrgId(session.user.organizationId || 0)
    }
  }, [status]);

  const onSubmit = async (data: any) => {
    const parentEmails = data && data.parentEmails.length === 1 ? data.parentEmails[0]
      : data.parentEmails.join(",");

    if(parentEmails && parentEmails.length > 0){
      setShowAddParentModal(false);
      setShowLoader(true);
      
      var inviteParam = {
        email: parentEmails,
        studentId: props.id,
        organizationId: orgId
      } as ParentInviteParamsDto;

      
      const inviteResult = await unitOfService.ParentInviteService.inviteParent(inviteParam);
      const results = inviteResult.data.data;

      setShowLoader(false);

      if(results.length > 0){
        results.forEach((result) => {
          if(result.success){
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        });      
      }
    } else {
      toast.error("No email set, please make sure you pressed space/enter after setting the email.");
    }
    
  };

  return (
    <>
      <Head>
        <title>{`Student Profile | ${siteMetadata.title}`}</title>
      </Head>
      <div className="student_profile">
        <Container fluid>
          <Row>
            <Col md={6} lg={6}>
              <div className="db_heading_block">
                <h1 className="db_heading">
                  {studentDetails?.name}&#39;s Basic Information
                </h1>
              </div>
              
              <div className="user_profile formBlock">
                <div className="tw-h-[120px] tw-flex tw-items-center tw-mr-[15px]">
                  <Avatar imageSrc={studentDetails?.profilePicture || ''} size={100} name="croppedImage" edit={false}/>
                  {/* <Form.Control
                    type="file"
                    id="croppedImage"
                    style={{
                        display: 'none'
                    }}
                  /> */}
                </div>
                <div className="user_detail">
                  <h2>{studentDetails?.name} {!studentDetails?.active && "(Inactive)"}</h2>
                  <p>Age: {studentDetails?.age}</p>
                  <p>Level: {studentDetails?.programOption.level.name}</p>
                  <p>{studentDetails?.allergyName ? `Allergies: ${studentDetails?.allergyName}` : ''}</p>
                </div>
                <div className="user_control">
                  <Button
                    type="button"
                    className="btn_main size_small"
                    onClick={async () => {
                      setShowAddParentModal(true);
                    }}
                  >
                    Add Parents <FontAwesomeIcon icon={faPlusCircle} size="1x" />
                  </Button>
                  {
                    studentDetails?.active ? 
                    (
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 50, hide: 100 }}
                        overlay={
                          <Tooltip>Deactivate Student</Tooltip>
                        }
                      >
                        <Button
                          className="btn_main small"
                          onClick={() => {
                            setDeactivate(true);
                          }}>
                          <FontAwesomeIcon
                            icon={faUserMinus}
                            size="1x"
                          />
                        </Button>
                      </OverlayTrigger>
                    ) : (
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 50, hide: 100 }}
                        overlay={<Tooltip>Activate Student</Tooltip>}
                      >
                        <Button
                          className="btn_main small"
                          onClick={() => {
                            setActivate(true);
                          }}>
                          <FontAwesomeIcon
                            icon={faUserPlus}
                            size="1x"
                          />
                        </Button>
                      </OverlayTrigger>
                    )
                  }
                </div>
              </div>
            </Col>
            <Col md={6} lg={6}>
              {reloadComponent && (
                <ClassAssignmentDetails updateStudentData={updateStudentData} student={studentDetails} reload={reloadClassDetails}/>
              )}
            </Col>
          </Row>
          <Row xs={1} sm={2} md={3} lg={3} xl={4} xxl={5} className="mb-5">
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Academics</span>
                </div>
                <Link href={`/students/academics/${studentDetails?.id}`} className="dataPageUrl">
                  Academic Detail
                </Link>
                <FontAwesomeIcon icon={faUsersClass} />
              </div>
            </Col>
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Parent/Guardian</span>
                </div>
                <Link
                  href={`/students/parent-details/${studentDetails?.id}`}
                  className="dataPageUrl"
                >
                  Contact Details
                </Link>
                <FontAwesomeIcon icon={faUserCheck} />
              </div>
            </Col>
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Bio</span>
                </div>
                <Link
                  href={`/students/bio/${studentDetails?.id}`}
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
                  href={`/students/medical-information/${studentDetails?.id}`}
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
                  <span>Assign a Lesson</span>
                </div>
                <Link
                  href={`/students/lesson-plan/${props.id}`}
                  className="dataPageUrl"
                >
                  View Lessons
                </Link>
                <FontAwesomeIcon icon={faBookAlt} />
              </div>
            </Col>
            <Col>
              <div className="db_data_overview_each small_box">
                <div className="dataName">
                  <span>Record Keeping</span>
                </div>
                <Link
                  href={`/students/lesson-overview/${props.id}`}
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
                  href={`/students/sep-assessment/${props.id}`}
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
                  <span>Forms</span>
                </div>
                <Link
                  href={`/students/forms/${studentDetails?.id}`}
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
                  href={`/students/attendance/bystudent/${studentDetails?.id}`}
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
                  href={`/students/baby-log/${studentDetails?.id}`}
                  className="dataPageUrl"
                >
                  View Baby Log
                </Link>
                <FontAwesomeIcon icon={faBaby} />
              </div>
            </Col>
          </Row>
          {studentDetails?.siblings && studentDetails?.siblings?.length > 0 && (
            <>
              <Row>
                <Col>
                  <div className="db_heading_block">
                    <h1 className="db_heading">Siblings</h1>
                  </div>
                </Col>
              </Row>
              <Row>
                {studentDetails?.siblings?.map((sibling) => {
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
                              router.push(`/students/info/${sibling.id}`);
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
          <PickupAuthorization parentId={0} studentId={props.id} />
          
        </Modal.Body>
      </Modal>

      <Modal
        show={showAddParentModal}
        onHide={() => {
          setShowAddParentModal(false);
          reset();
        }}
        backdrop="static"
        size="lg"
        centered
        width='300px'
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Parents/Guardians</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "calc(100vh - 210px)" }} >
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="parentEmails"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <TagsInput
                  value={field.value}
                  onChange={(tags) => {
                    field.onChange(tags);
                  }}
                  separators={["Enter", " "]}
                  name={field.name}
                  placeHolder='Parents/Guardians email addresses'
                />
              )}
            />
            <Controller
              name="studentId"
              control={control}
              defaultValue={props.id}
              render={({ field }) => (
                <input
                  type="hidden"
                  {...field}
                />
              )}
            />
            <p style={{ fontSize: "12px", margin: "5px 0px" }}>
              Press &quot;Enter&quot; or &quot;Space&quot; to add new parent/guardian email.
            </p>
            <Button type="submit" className="btn_main  my-3">
              Invite
            </Button>
            <Button
              type="button"
              className="btn_border mx-1"
              onClick={() => {
                setShowAddParentModal(false);
                reset();
              }}
            >
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {deactivate && (
        <ConfirmBox
          isOpen={deactivate}
          onClose={() => {
            setDeactivate(false);
          }}
          onSubmit={() => {
            setStudenState(false);
          }}
          bodyText="Are you sure you want to mark this child as inactive and unassign them from their class?"
          noButtonText="No"
          yesButtonText="Yes"
        />
      )}

      {activate && (
        <ConfirmBox
          isOpen={activate}
          onClose={() => {
            setActivate(false);
          }}
          onSubmit={() => {
            setStudenState(true);
          }}
          bodyText="Are you sure you want to reactivate this child? Please note they need to be reassigned to a class upon reactivation."
          noButtonText="No"
          yesButtonText="Yes"
        />
      )}

      {showLoader && <Loader />}

    </>
  );
};
export default StudentProfile;

export const getServerSideProps: GetServerSideProps<
  StudentProfileProps
> = async (context) => {
  let initialParamas: StudentProfileProps = {
    id: +(context.query.id || 0),
    parentId: +(context.query.parentId || 0),
  };

  return {
    props: initialParamas,
  };
};
