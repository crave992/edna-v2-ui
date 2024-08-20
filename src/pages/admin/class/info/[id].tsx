import {
  faBriefcaseMedical,
  faEdit,
  faInfo,
  faPlus,
  faQuestionCircle,
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
  Modal,
  Table,
} from "react-bootstrap";
import numeral from "numeral";

import { Chart } from "react-google-charts";
import Link from "next/link";
import CommonProps from "@/models/CommonProps";
import Head from "next/head";
import useBreadcrumb from "@/hooks/useBreadcrumb";

import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import ClassDto, { ClassBasicDto, StudentCountInClass } from "@/dtos/ClassDto";
import { GetServerSideProps, NextPage } from "next";
import { StaffBasicDto } from "@/dtos/StaffDto";
import { useRouter } from "next/router";
import { StaffClassAssignmentModel } from "@/models/ClassModel";

import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { StudentBasicDto } from "@/dtos/StudentDto";
import AssignStudentInClassModal from "@/models/AssignStudentInClassModal";
import ConfirmBox from "@/components/common/ConfirmBox";
import ProgramOptionParams from "@/params/ProgramOptionParams";
import ProgramOptionDto from "@/dtos/ProgramOptionDto";
import Loader from "@/components/common/Loader";

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
}

const ClassInfo: NextPage<ClassInfoProps> = (props) => {
  const router = useRouter();
  useBreadcrumb({
    pageName: "Class Details",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Class Details",
        link: `/admin/class/info/${props.id}`,
      },
    ],
  });

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [showRemoveStudentFromClassModal, setShowRemoveStudentFromClassModal] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentBasicDto>();
  const [studentLevelUpClass, setStudentLevelUpClass] = useState<ClassBasicDto>();
  const [programOptions, setProgramOptions] = useState<ProgramOptionDto[]>([]);
  const [studentLevelupOptionId, setStudentLevelupOptionId] = useState<number>(0);
  const [showStudentLevelupModal, setShowStudentLevelupModal] = useState<boolean>(false);
  const [showProgramOptionPricingPopUp, setShowProgramOptionPricingPopUp] = useState(false);
  
  const [classs, setClasss] = useState<ClassDto>();
  const [totalEnrollments, setTotalEnrollments] = useState<number>(0);
  const [countingByGender, setCountingByGender] = useState<StudentCountInClass[]>([]);
  const [students, setStudents] = useState<StudentBasicDto[]>([] || "");
  const [studentActiveButton, setStudentActiveButton] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [filteredStudent, setfilteredStudent] = useState<StudentBasicDto[]>([]);

  const fetchClass = async (classId: number, q?: string) => {
    const response = await unitOfService.ClassService.getClassBasicDetails(classId, q || "");
    if (response && response.status === 200 && response.data.data) {
      setClasss(response.data.data);
      localStorage.setItem('levelInfoId', response.data.data.level.id.toString());
      localStorage.setItem('classInfoId', classId.toString());
      
      const studentData = response.data.data?.students;
      setStudents(studentData);

      setfilteredStudent(studentData);
      setStudentCount(studentData.length);

      const assignedStudentFilter = studentData.filter(
        (e) => e.isMappedToClass === true
      );
      setfilteredStudent(assignedStudentFilter);

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

  const filterStudent = (type: string) => {
    if (type == "all") {
      setfilteredStudent(students);
      setStudentCount(students.length);
    } else if (type == "assigned") {
      const assignedStudentFilter = students.filter(
        (e) => e.isMappedToClass === true
      );
      setfilteredStudent(assignedStudentFilter);
      setStudentCount(assignedStudentFilter.length);
    }
  };


  const assignStudentToClass = async (classIds: number[], studentId: number) => {
    const assignment: AssignStudentInClassModal = {
      classIds: classIds,
      studentId: studentId,
    };
    const response = await unitOfService.ClassAssignmentService.assignStudentInClass(assignment);
    if (response && response.status === 201) {
      toast.success("Student assigned successfully");
      fetchClass(props.id, "");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const removeStudentFromClass = async (student: StudentBasicDto, classId: number) => {
    if(student.id == 0) return;

    if(student.classes.length == 2){
      //check if we are moving up
      var remainingClass = student.classes.filter((c) => { return c.id != classId});
      if(remainingClass && remainingClass.length > 0 && student.programOption.levelId < remainingClass[0].levelId){
        setStudentLevelUpClass(remainingClass[0]);
        setShowRemoveStudentFromClassModal(false);
        fetchProgramOption(remainingClass[0].levelId ?? 0);
        setShowStudentLevelupModal(true);
        return;
      }
    }
    
    setShowLoader(true);
    const response = await unitOfService.ClassAssignmentService.removeStudentFromClass(student.id, classId);
      if (response && response.status === 204) {
        toast.success("Student removed successfully");
        fetchClass(props.id, "");
      } else {
        const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
        toast.error(error);
      }

      setSelectedStudent(undefined);
      setShowRemoveStudentFromClassModal(false)
      setShowLoader(false);
  };

  const fetchProgramOption = async (levelId: number) => {
    const filterOption: ProgramOptionParams = {
      levelId: levelId,
      page: 1,
      q: "",
      recordPerPage: 1000,
      sortBy: "name",
      sortDirection: "asc",
    };
    const response = await unitOfService.ProgramOptionService.getAll(
      filterOption
    );
    if (response && response.status === 200 && response.data.data) {
      setProgramOptions(response.data.data?.programOptions || []);
    }
  };

  const studentMoveupAndDeleteFromClass = async () => {
    if(studentLevelupOptionId == 0){
      toast.error("Please select program option.")
    } else {
      setShowLoader(true);

      var studentId = selectedStudent ? selectedStudent.id : 0;
      var levelId = studentLevelUpClass?.levelId ?? 0;
      await unitOfService.StudentService.updateStudentLevel(studentId, levelId, studentLevelupOptionId );
      //remove class
      const response =
      await unitOfService.ClassAssignmentService.removeStudentFromClass(
        studentId,
        props.id
      );

      setShowLoader(false);
      closeStudentLevelupModal()
      fetchClass(props.id, "");
      if (response && response.status === 204) {
        toast.success("Successfully removed class and updated student level.");
      } else {
        const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
        toast.error(error);
      }

    }
  }

  const closeStudentLevelupModal = async () => {
    setSelectedStudent(undefined);
    setStudentLevelUpClass(undefined);
    setProgramOptions([]);
    setStudentLevelupOptionId(0);
    setShowStudentLevelupModal(false);
  }



  const [activeButton, setActiveButton] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [staffs, setStaff] = useState<StaffBasicDto[]>([]);
  const [filteredStaff, setfilteredStaff] = useState<StaffBasicDto[]>([]);
  const [assignedStaff, setAssignedStaff] = useState<StaffBasicDto[]>([]);

  const fetchStaff = async (id: number, q: string) => {
    const response = await unitOfService.StaffService.getStaffByClassId(id, q || "");
    if (response && response.status === 200 && response.data.data) {
      const staffData = response.data.data;
      setStaff(staffData);
      setAssignedStaff(staffData.filter(e => e.isMappedToClass));
      setStaffCount(staffData.length);
    }
  };

  const filterStaff = (type: string) => {
    if (type == "all") {
      setfilteredStaff(staffs);
      setStaffCount(staffs.length);
    } else if (type == "assigned") {
      const assignedStaffFilter = staffs.filter(
        (e) => e.isMappedToClass === true
      );
      setfilteredStaff(assignedStaffFilter);
      setStaffCount(assignedStaffFilter.length);
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
      fetchStaff(props.id, "");
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
      fetchStaff(props.id, "");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [searchedText, setSearchedText] = useState<string>("");
  const updateSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    let eneteredText = e.target.value || "";
    setSearchedText(eneteredText);
  };

  const [searchedValue] = useDebounce(searchedText, 1000);
  useEffect(() => {
    (async () => {
      await fetchStaff(props.id, searchedValue);
    })();
  }, [searchedValue]);

  const [searchedStudentText, setSearchedStudentText] = useState<string>("");
  const updateStudentSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    let eneteredText = e.target.value || "";
    setSearchedStudentText(eneteredText);
  };

  const [searchedStudentValue] = useDebounce(searchedStudentText, 1000);
  useEffect(() => {
    (async () => {
      await fetchClass(props.id, searchedStudentValue);
    })();
  }, [searchedStudentValue]);

  useEffect(() => {
    (async () => {
      await fetchClass(props.id, "");
      await fetchStaff(props.id, "");
    })();
  }, []);


  const [classPerformance, setClassPerformance] = useState<any>([]);
  const fetchClassPerformance = async (classId: number) => {
    const response = await unitOfService.LessonService.getByClassId(classId);
    if (response && response.status === 200 && response.data.data && response.data.data.length > 0) {
      const responseData = response.data.data;
      const transformedData = responseData.map((item) => [
        item.name,
        item.presented,
        item.practiced,
        item.acquired,
      ]);
      setClassPerformance([["Lesson", "Presented", "Practicing", "Acquired"], ...transformedData]);

    }
  };

  useEffect(() => {
    (async () => {
      await fetchClassPerformance(props.id);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Class Info - Noorana</title>
      </Head>
      <div className="class_info">
        <Container fluid>
          <Row>
            <Col lg={8}>
              <div className="db_heading_block">
                <h1 className="db_heading">Class: {classs?.name}</h1>
                <ButtonGroup aria-label="Basic example">
                  <span
                    className="btn_main size_small anchor-span"
                    onClick={() =>
                      router.push(`/admin/class/edit/${classs?.id}`)
                    }
                  >
                    <FontAwesomeIcon icon={faEdit} size="1x" /> Edit
                  </span>
                </ButtonGroup>
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
                      {/* {assignedStaff &&
                        assignedStaff.filter(classAssociates => (
                          classAssociates.id !== classs?.classStaff?.id
                        )).map((classAssociates) => {
                          return (
                            <p className="class_box_data" key={classAssociates.id}>
                              {classAssociates.name}
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
                  data={classPerformance}
                  options={options}
                />
              </div>
            </Col>
          </Row>
        </Container>

        <Container fluid>
          <Row>
            <Col lg={6}>
              <div className="formBlock">
                <div className="db_heading_block">
                  <h1 className="db_heading">Student List</h1>
                  <ButtonGroup aria-label="Basic example">
                    <Button
                      variant={studentActiveButton === 0 ? "sort active" : "sort"}
                      onClick={() => {
                        setStudentActiveButton(0);
                        filterStudent("all");
                      }}
                    >
                      All
                    </Button>
                    <Button
                      variant={studentActiveButton === props.id ? "sort active" : "sort"}
                      onClick={() => {
                        setStudentActiveButton(props.id);
                        filterStudent("assigned");
                      }}
                    >
                      Assigned
                    </Button>
                  </ButtonGroup>
                </div>
                <div className="searchSortBlock">
                  <div className="searchBlock">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Search Student"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Search Student"
                        onChange={updateStudentSearchText}
                      />
                    </FloatingLabel>
                  </div>
                </div>

                {studentActiveButton === 0 ?
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
                              <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Profile</Tooltip>}>
                                <Link href={`/students/info/${stud.id}`} className="btn_main small">
                                  <FontAwesomeIcon icon={faInfo} size="1x" />
                                </Link>
                              </OverlayTrigger>
                              {stud.isMappedToClass === true ? (
                                <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Remove from Class</Tooltip>}>
                                  <Button className="btn_main small orange_btn"
                                    onClick={() => { 
                                      setSelectedStudent(stud);
                                      setShowRemoveStudentFromClassModal(true);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTimes} size="1x" />
                                  </Button>
                                </OverlayTrigger>
                              ) : (
                                stud.classes.length < 2 && (<OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Add to Class</Tooltip>}>
                                <Button className="btn_main small"
                                  onClick={() => { assignStudentToClass([props.id], stud.id); }}
                                >
                                  <FontAwesomeIcon icon={faPlus} size="1x" />
                                </Button>
                              </OverlayTrigger>))}

                            </div>
                          </div>
                        );
                      })}
                  </div> : <div className="tableListItems h-200">
                    {filteredStudent &&
                      filteredStudent.map((stud) => {
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
                              <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Profile</Tooltip>}>
                                <Link href={`/students/info/${stud.id}`} className="btn_main small">
                                  <FontAwesomeIcon icon={faInfo} size="1x" />
                                </Link>
                              </OverlayTrigger>
                              {stud.isMappedToClass === true ? (
                                <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Remove from Class</Tooltip>}>
                                  <Button className="btn_main small orange_btn"
                                    onClick={() => {
                                      setSelectedStudent(stud);
                                      setShowRemoveStudentFromClassModal(true); 
                                    }}>
                                    <FontAwesomeIcon icon={faTimes} size="1x" />
                                  </Button>
                                </OverlayTrigger>
                              ) : (stud.classes.length < 2 && (
                                <OverlayTrigger placement="top" delay={{ show: 50, hide: 100 }} overlay={<Tooltip>Add to Class</Tooltip>}>
                                  <Button className="btn_main small"
                                    onClick={() => { assignStudentToClass([props.id], stud.id); }}
                                  >
                                    <FontAwesomeIcon icon={faPlus} size="1x" />
                                  </Button>
                                </OverlayTrigger>
                              ))}

                            </div>
                          </div>
                        );
                      })}
                  </div>}
                <div className="tablePagination">
                  <p className="tablePaginationDetails">
                    Total {studentCount} Student
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="formBlock">
                <div className="db_heading_block">
                  <h1 className="db_heading">Staff Member List</h1>
                  <ButtonGroup aria-label="Basic example">
                    <Button
                      variant={activeButton === 0 ? "sort active" : "sort"}
                      onClick={() => {
                        setActiveButton(0);
                        filterStaff("all");
                      }}
                    >
                      All
                    </Button>
                    <Button
                      variant={
                        activeButton === props.id ? "sort active" : "sort"
                      }
                      onClick={() => {
                        setActiveButton(props.id);
                        filterStaff("assigned");
                      }}
                    >
                      Assigned
                    </Button>
                  </ButtonGroup>
                </div>
                <div className="searchSortBlock">
                  <div className="searchBlock">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Search Staff"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Search Staff"
                        onChange={updateSearchText}
                      />
                    </FloatingLabel>
                  </div>
                </div>
                {activeButton === 0 ?
                  <div className="tableListItems h-200">
                    {staffs &&
                      staffs.map((staffList) => {
                        return (
                          <div className="renderStaff" key={staffList.id}>
                            <div className="userDetailsMain">
                              <div className="userAvatar">
                                {staffList.profilePicture ? (
                                  <Image
                                    fluid
                                    alt={staffList.name}
                                    src={staffList.profilePicture}
                                    style={{ maxWidth: "70px" }}
                                  />
                                ) : (
                                  <FontAwesomeIcon icon={faUser} size="2x" />
                                )}
                              </div>
                              <div className="userDetails">
                                <h2>{staffList.name}</h2>
                                <p>Job Title: {staffList.jobTitle}</p>
                                <p>
                                  Employment Date:&nbsp;
                                  {unitOfService.DateTimeService.convertToLocalDate(
                                    staffList.hiredDate
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="userActions">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>Profile</Tooltip>}
                              >
                                <Button
                                  className="btn_main small"
                                  onClick={() =>
                                    router.push(
                                      `/admin/staff/info/${staffList.id}`
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faInfo} size="1x" />
                                </Button>
                              </OverlayTrigger>

                              {staffList.isMappedToClass === true ? (
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Remove from Class</Tooltip>}
                                >
                                  <Button
                                    className="btn_main small orange_btn"
                                    onClick={() => {
                                      removeFromClass(staffList.id, props.id);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTimes} size="1x" />
                                  </Button>
                                </OverlayTrigger>
                              ) : (
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Add to Class</Tooltip>}
                                >
                                  <Button
                                    className="btn_main small"
                                    onClick={() => {
                                      assignToClass(staffList.id, props.id);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faPlus} size="1x" />
                                  </Button>
                                </OverlayTrigger>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  : <div className="tableListItems h-200">
                    {assignedStaff &&
                      assignedStaff.map((staffList) => {
                        return (
                          <div className="renderStaff" key={staffList.id}>
                            <div className="userDetailsMain">
                              <div className="userAvatar">
                                {staffList.profilePicture ? (
                                  <Image
                                    fluid
                                    alt={staffList.name}
                                    src={staffList.profilePicture}
                                    style={{ maxWidth: "70px" }}
                                  />
                                ) : (
                                  <FontAwesomeIcon icon={faUser} size="2x" />
                                )}
                              </div>
                              <div className="userDetails">
                                <h2>{staffList.name}</h2>
                                <p>Job Title: {staffList.jobTitle}</p>
                                <p>
                                  Employment Date:&nbsp;
                                  {unitOfService.DateTimeService.convertToLocalDate(
                                    staffList.hiredDate
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="userActions">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>Profile</Tooltip>}
                              >
                                <Button
                                  className="btn_main small"
                                  onClick={() =>
                                    router.push(
                                      `/admin/staff/info/${staffList.id}`
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faInfo} size="1x" />
                                </Button>
                              </OverlayTrigger>

                              {staffList.isMappedToClass === true ? (
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Remove from Class</Tooltip>}
                                >
                                  <Button
                                    className="btn_main small orange_btn"
                                    onClick={() => {
                                      removeFromClass(staffList.id, props.id);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTimes} size="1x" />
                                  </Button>
                                </OverlayTrigger>
                              ) : (
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Add to Class</Tooltip>}
                                >
                                  <Button
                                    className="btn_main small"
                                    onClick={() => {
                                      assignToClass(staffList.id, props.id);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faPlus} size="1x" />
                                  </Button>
                                </OverlayTrigger>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                }
                <div className="tablePagination">
                  <p className="tablePaginationDetails">
                    Total {staffCount} Staff
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <div className="db_heading_block">
                <h1 className="db_heading">Quick Actions</h1>
              </div>
            </Col>
          </Row>
          <Row xs={2} md={3} lg={4} xl={5} className="mb-4">
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
                <Link href={`/admin/class/lesson-overview/${props.id}`} className="dataPageUrl">
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
          </Row>
        </Container>
      </div>

      <Modal
        show={showStudentLevelupModal}
        onHide={closeStudentLevelupModal}
        backdrop="static"
        size="lg"
        centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Student Level</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}>
            <p>This child’s level will be changed to match the level of their new class, please select from the program option available at their new level</p>
            <p>Current Program Option: <b>{selectedStudent?.programOption.level.name} - {selectedStudent?.programOption.name}</b> </p>
            
            <div>
              <p>New Level: <b>{studentLevelUpClass?.levelName}</b></p>
            </div>

            Choose Program Options*{" "}
            <FontAwesomeIcon
              icon={faQuestionCircle}
              size="1x"
              onClick={() => setShowProgramOptionPricingPopUp(true)}
            />

            <div className="p-3 bg-gray mb-3">
              {programOptions &&
                programOptions.map((po) => {
                  return (
                    <Row key={po.id}>
                        <Col>
                            <Form.Check
                                inline
                                type="radio"
                                className="mb-3"
                                id={`programOption-${po.id}`}
                                name="programOption"
                                value={po.id}
                                onChange={() => {
                                  setStudentLevelupOptionId(po.id);
                                }}
                                label={`${po.name} ${po.timeSchedule}`}
                            />
                        </Col>
                    </Row>
                  );
                })}
            </div>
          </Modal.Body>
          <Modal.Footer>
          <Button className="btn_main orange_btn" onClick={closeStudentLevelupModal}>
            Cancel
          </Button>
          <Button className="btn_main" onClick={studentMoveupAndDeleteFromClass}>
            Update Level
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showProgramOptionPricingPopUp}
        onHide={() => setShowProgramOptionPricingPopUp(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Program Option Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped hover className="custom_design_table mb-0">
            <thead>
              <tr>
                <th>Program Option</th>
                <th>Description</th>
                <th className="text-center">Monthly Tuition Fee</th>
              </tr>
            </thead>
            <tbody>
              {programOptions &&
                programOptions.map((option) => {
                  return (
                    <tr key={option.id}>
                      <td>{option.name}</td>
                      <td>{option.timeSchedule}</td>
                      <td className="text-center">
                        {numeral(option.fees).format("$0,0.00")}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {showRemoveStudentFromClassModal && (
        <ConfirmBox
          isOpen={showRemoveStudentFromClassModal}
          onClose={() => {
            setSelectedStudent(undefined);
            setShowRemoveStudentFromClassModal(false)
          }}
          onSubmit={ () => {
            var student = selectedStudent ?? {id:0} as StudentBasicDto;
            removeStudentFromClass(student, props.id);
          }}
          bodyText="Are you sure want to remove student from this class?"
          noButtonText="No"
          yesButtonText="Yes"
        />
      )}
      
      {showLoader && <Loader />}
      
    </>
  );
};
export default ClassInfo;

export const getServerSideProps: GetServerSideProps<ClassInfoProps> = async (
  context
) => {
  let initialParamas: ClassInfoProps = {
    id: +(context.query.id || 0),
  };

  return {
    props: initialParamas,
  };
};
