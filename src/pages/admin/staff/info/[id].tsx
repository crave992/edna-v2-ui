import StaffPerformanceEvaluation from "@/components/common/PerformanceEvaluation/StaffPerformanceEvaluation";
import ViewBasicDetails from "@/components/common/Staff/BasicDetails/ViewBasicDetails";
import ViewDegreeCertificates from "@/components/common/Staff/DegreeCertificates/ViewDegreeCertificates";
import ViewEmergencyContactAndInfo from "@/components/common/Staff/EmergencyContactAndInfo/ViewEmergencyContactAndInfo";
import ViewHRForm from "@/components/common/Staff/HRForm/ViewHRForm";
import ViewProfessionalDevelopment from "@/components/common/Staff/ProfessionalDevelopment/ViewProfessionalDevelopment";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { ClassBasicDto } from "@/dtos/ClassDto";
import StaffDto from "@/dtos/StaffDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { StaffClassAssignmentModel } from "@/models/ClassModel";
import CommonProps from "@/models/CommonProps";
import PaginationParams from "@/params/PaginationParams";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import {
  faUser,
  faPlusCircle,
  faClockRotateLeft,
  faTrash,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { toast } from "react-toastify";

interface StaffInfoProps extends PaginationParams {
  id: number;
}

const StaffInfo: NextPage<StaffInfoProps> = (props) => {
  useBreadcrumb({
    pageName: "Staff Info",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Staff",
        link: "/admin/staff/",
      },
      {
        label: "Staff Info",
        link: `/admin/staff/info/${props.id}`,
      },
    ],
  });
  const [classAssignShow, setClassAssignShow] = useState(false);
  const [assignHistoryShow, setAssignHistoryShow] = useState(false);

  const [imageUrl, setImageUrl] = useState(
    `${process.env.NEXT_PUBLIC_CDN_PATH}/images/profile-picture.jpg`
  );
  const [staffDetails, setStaffDetails] = useState<StaffDto>();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const fetchStaff = async (staffId: number) => {
    let response = await unitOfService.StaffService.getBasicDetailById(staffId);
    if (response && response.status === 200 && response.data.data) {
      setStaffDetails(response.data.data);
    }
  };

  const [classes, setClasses] = useState<ClassBasicDto[]>([]);
  const fetchClass = async (staffId: number) => {
    const response = await unitOfService.ClassService.getClassByStaffId(
      staffId
    );
    if (response && response.status === 200 && response.data.data) {
      const classData = response.data.data;
      setClasses(response.data.data);
    }
  };

  const assignToClass = async (staffId: number, classId: number) => {
    const assignment: StaffClassAssignmentModel = {
      staffId: staffId,
      classId: classId,
    };
    const response = await unitOfService.ClassService.assignStaff(assignment);
    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Staff assigned successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const removeFromClass = async (staffId: number, classId: number) => {
    const assignment: StaffClassAssignmentModel = {
      staffId: staffId,
      classId: classId,
    };
    const response = await unitOfService.ClassService.removeStaff(assignment);
    if (response && response.status === 204) {
      toast.success("Staff removed successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };


  const [staffClassHistory, setStaffClassHistory] = useState<ClassBasicDto[]> ([]);
  const fetchClasshistory = async (staffId: number) => {
    const response = await unitOfService.ClassService.getClassByStaffId(staffId);
    if (response && (response.status === 200 || response.status === 201) && response.data.data) {
      const filteredData = response.data.data.filter(item => item.isMappedToClass == true);
      setStaffClassHistory(filteredData);
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      await fetchStaff(props.id);
      await fetchClass(props.id);
      await fetchClasshistory(props.id);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>
          {staffDetails?.firstName} {staffDetails?.lastName} Information -
          Noorana
        </title>
      </Head>
      <div className="staff_info_page">
        <Container fluid>
          <Row>
            <Col xl={12} xxl={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">Staff Information</h1>
              </div>
              <div className="staff_short_profile">
                <div className="staff_profile_details">
                  <div className="staff_photo">
                    {staffDetails?.profilePicture ? (
                      <Image
                        fluid
                        alt={staffDetails?.firstName}
                        src={staffDetails?.profilePicture}
                        style={{ maxWidth: "120px" }}
                      />
                    ) : (
                        <div className="staff_profile_icon">
                          <FontAwesomeIcon icon={faUser} size="2x" />
                        </div>
                    )}
                  </div>
                  <div className="staff_details">
                    <h2>
                      {staffDetails?.firstName} {staffDetails?.lastName} &nbsp;
                      {staffDetails?.isActive ? (
                        <span>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            size="1x"
                            className="text-success"
                          />
                        </span>
                      ) : (
                        <span>
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            size="1x"
                            className="text-danger"
                          />
                        </span>
                      )}
                    </h2>
                    <p>Job Title: {staffDetails?.jobTitle.name}</p>
                    <p>Role: {staffDetails?.role.name}</p>
                    <p>
                      Hired Date:&nbsp;
                      {staffDetails?.employmentStartDate
                        ? unitOfService.DateTimeService.convertToLocalDate(
                            staffDetails?.employmentStartDate
                          )
                        : ""}
                    </p>
                    <p>Salary Type: {staffDetails?.salaryType.name}</p>
                    <p>{
                      session?.user.roles.some(role => role.name === 'Administrator')
                          && `Salary: $${staffDetails?.salaryAmount}`
                    }</p>
                  </div>
                </div>
                <div className="staff_profile_actions">
                  <span
                    className="btn_main size_small mx-1 anchor-span"
                    onClick={() => setClassAssignShow(true)}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Assign
                    Class
                  </span>
                  <span
                    className="btn_main size_small mx-1 anchor-span"
                    onClick={() => setAssignHistoryShow(true)}
                  >
                    <FontAwesomeIcon icon={faClockRotateLeft} size="1x" />
                  </span>
                </div>
              </div>
              <div className="staff_profile_forms">
                <Tabs>
                  <TabList>
                    <Tab>Basic</Tab>
                    <Tab>Degree/Certificates</Tab>
                    <Tab>HR Forms</Tab>
                    <Tab>Emergency Info</Tab>
                    <Tab>Professional Development</Tab>
                    <Tab>Performance Evaluation</Tab>
                  </TabList>

                  <TabPanel>
                    <ViewBasicDetails staffId={props.id} />
                  </TabPanel>
                  <TabPanel>
                    <ViewDegreeCertificates staffId={props.id} />
                  </TabPanel>
                  <TabPanel>
                    <ViewHRForm staffId={props.id} />
                  </TabPanel>
                  <TabPanel>
                    <ViewEmergencyContactAndInfo staffId={props.id} />
                  </TabPanel>
                  <TabPanel>
                    <ViewProfessionalDevelopment staffId={props.id} />
                  </TabPanel>
                  <TabPanel>
                    <StaffPerformanceEvaluation staffId={props.id} page={props.page} q={props.q} recordPerPage={props.recordPerPage} sortBy={props.sortBy} sortDirection={props.sortDirection} />
                  </TabPanel>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Container>

        <Modal
          show={classAssignShow}
          onHide={() => setClassAssignShow(false)}
          backdrop="static"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Assign Class</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {classes &&
                classes.map((classname) => {
                  return (
                    <Form.Check
                      key={classname.id}
                      className="mb-2"
                      type="checkbox"
                      id={classname.name}
                      label={classname.name}
                      defaultChecked={classname.isMappedToClass}
                      onChange={(e) => {
                        if (e.target.checked) {
                          assignToClass(props.id, classname.id);
                        } else {
                          removeFromClass(props.id, classname.id);
                        }
                      }}
                    />
                  );
                })}
              <hr />
              <div className="text-end">
                <Button
                  onClick={() => setClassAssignShow(false)}
                  className="btn_border size_small mx-2"
                >
                  Close
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={assignHistoryShow}
          onHide={() => setAssignHistoryShow(false)}
          size="lg"
          backdrop="static"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Class Assignment History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Table bordered hover className="custom_design_table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffClassHistory &&
                    staffClassHistory.map((assignedClass) => {
                      return (
                        <tr key={assignedClass.id}>
                          <td>{assignedClass.name}</td>
                          <td>24-Jun-2022</td>
                          <td>Present</td>
                          <td>
                            <OverlayTrigger
                              placement="right"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Remove</Tooltip>}
                            >
                              <Button className="btn_main small"
                                onClick={() => removeFromClass(props.id, assignedClass.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} size="1x" />
                              </Button>
                            </OverlayTrigger>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </Table>
              <div className="text-end">
                <Button
                  onClick={() => setAssignHistoryShow(false)}
                  className="btn_main size_small mx-2"
                >
                  Close
                </Button>
                {/* <Button type="submit" className='btn_main'>Deactivate</Button> */}
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default StaffInfo;

export const getServerSideProps: GetServerSideProps<StaffInfoProps> = async (
  context
) => {
  let initialParamas: StaffInfoProps = {
    id: +(context.query.id || 0),
    q: `${context.query.q || ""}`,
    page: +(context.query.page || 1),
    recordPerPage: +(
      context.query.recordPerPage ||
      +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)
    ),
    sortBy: `${context.query.sortBy || "ratingdate"}`,
    sortDirection: `${context.query.sortDirection || "desc"}`,
  };

  return {
    props: initialParamas,
  };
};
