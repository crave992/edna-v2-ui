import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import ClassAssignmentDto from "@/dtos/ClassAssignmentDto";
import RoleDto from "@/dtos/RoleDto";
import { Role } from "@/helpers/Roles";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import numeral from "numeral";

import {
  faArrowRightArrowLeft,
  faTrash,
  faPlusCircle,
  faQuestionCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Table,
  OverlayTrigger,
  Tooltip,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { ClassBasicDto } from "@/dtos/ClassDto";
import AssignClass from "./AssignClass";
import ConfirmBox from "../../ConfirmBox";
import { toast } from "react-toastify";
import Loader from "../../Loader";
import { StudentBasicDto } from "@/dtos/StudentDto";
import ProgramOptionDto from "@/dtos/ProgramOptionDto";
import ProgramOptionParams from "@/params/ProgramOptionParams";

interface ClassAssignmentProps extends CommonProps {
  student: StudentBasicDto | undefined;
  reload:boolean;
  updateStudentData: Function
}

const ClassAssignmentDetails: NextPage<ClassAssignmentProps> = ({
  student,
  reload,
  updateStudentData
}) => {
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<string[]>([]);
  const [canAssignStudentToClass, setCanAssignStudentToClass] = useState(false);
  const [programOptions, setProgramOptions] = useState<ProgramOptionDto[]>([]);
  const [programOptionId, setProgramOptionId] = useState<number>(0);
  const [showProgramOptionPopUp, setShowProgramOptionPopUp] = useState(false);

  const [remainingClass, setRemainingClass] = useState<ClassAssignmentDto>();

  useEffect(() => {
    if (session && session.user) {
      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);
      setRoles(roles);
    }
  }, [status]);

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [classDetails, setClassDetails] = useState<ClassAssignmentDto[]>([]);
  const fetchClassDetails = async (studentId: number) => {
    const response =
      await unitOfService.ClassAssignmentService.getClassByStudentId(studentId);
    if (response && response.status === 200 && response.data.data) {
      var classList = response.data.data;
      setClassDetails(classList);
      setCanAssignStudentToClass(classList.length < 2);
    }
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

  useEffect(() => {
    (async () => {
      var studentId = student ? student.id : 0;
      await fetchClassDetails(studentId);
    })();
  }, [reload]);

  const [showClassAssignmentModal, setShowClassAssignmentModal] =
    useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showConfirmMoveUpModal, setShowConfirmMoveUpModal] = useState<boolean>(false);

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [classId, setClassId] = useState<number>(0);

  const moveUpStudentAndDeleteClass = async () => {
    if(programOptionId == 0){
      toast.error("Please select program option.")
    } else {
      setShowLoader(true);

      var studentId = student ? student.id : 0;
      var levelId = remainingClass?.levelId ?? 0;
      await unitOfService.StudentService.updateStudentLevel(studentId, levelId, programOptionId );
      //remove class
      const response =
      await unitOfService.ClassAssignmentService.removeStudentFromClass(
        studentId,
        classId
      );

      setShowLoader(false);
      setShowConfirmMoveUpModal(false);
      setClassId(0);
      await fetchClassDetails(studentId);

      if (response && response.status === 204) {
        toast.success("Successfully removed class and updated student level.");
        if(updateStudentData){
          updateStudentData();
        }
      } else {
        const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
        toast.error(error);
      }

    }
  }

  const removeStudentFromClass = async () => {
    var remainingClass = classDetails.filter((c) => { return c.classId != classId});
    var studentLevelId = student?.programOption.levelId ?? 0;

    if(remainingClass && remainingClass.length > 0 && studentLevelId < remainingClass[0].levelId){
      setRemainingClass(remainingClass[0]);
      setShowDeleteModal(false);
      fetchProgramOption(remainingClass[0].levelId ?? 0);
      setShowConfirmMoveUpModal(true);
      return;
    }

    setShowLoader(true);
    var studentId = student ? student.id : 0;
    const response =
      await unitOfService.ClassAssignmentService.removeStudentFromClass(
        studentId,
        classId
      );

    setShowLoader(false);
    if (response && response.status === 204) {
      toast.success("Removed successfully from class");
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
    await closeDeleteModal();
  };

  const closeConfirmMoveUpModal = async () => {
    setClassId(0);
    setProgramOptionId(0);
    setRemainingClass(undefined);
    setShowConfirmMoveUpModal(false);
  }

  const closeDeleteModal = async () => {
    var studentId = student ? student.id : 0;
    setClassId(0);
    setShowDeleteModal(false);
    await fetchClassDetails(studentId);
  };

  return (
    <>
      <div className="db_heading_block">
        <h1 className="db_heading">Class Details</h1>
      </div>
      <div className="formBlock">
        {roles && (
          <>
            <Table striped hover className="custom_design_table mb-2">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>From</th>
                  <th>To</th>
                  {roles.indexOf(Role.Parent) < 0 && (
                    <th className="text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {classDetails &&
                  classDetails.map((cla) => {
                    return (
                      <tr key={cla.id}>
                        <td>{cla.className}</td>
                        <td>
                          {unitOfService.DateTimeService.convertToLocalDate(
                            cla.fromDate
                          )}
                        </td>
                        <td>
                          {cla.toDate
                            ? unitOfService.DateTimeService.convertToLocalDate(
                                cla.toDate
                              )
                            : "Present"}
                        </td>

                        {roles.indexOf(Role.Parent) < 0 && (
                          <td className="text-center">
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Remove From Class</Tooltip>}
                            >
                              <Button
                                className="btn_main small"
                                onClick={() => {
                                  setClassId(cla.classId);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} size="1x" />
                              </Button>
                            </OverlayTrigger>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>

            {roles.indexOf(Role.Parent) < 0 && canAssignStudentToClass && (
              <Button
                type="button"
                className="btn_main size_small"
                onClick={async () => {
                  setShowClassAssignmentModal(true);
                }}
              >
                <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Assign Class
              </Button>
            )}
          </>
        )}
      </div>

      <Modal
        show={showClassAssignmentModal}
        onHide={async () => {
          var studentId = student ? student.id : 0;
          setShowClassAssignmentModal(false);
          await fetchClassDetails(studentId);
        }}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Class</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
        >
          <AssignClass
            studentId={student ? student.id : 0}
            onClose={async () => {
              setShowClassAssignmentModal(false);
              await fetchClassDetails(student ? student.id : 0);
            }}
          />
        </Modal.Body>
      </Modal>

      {showDeleteModal && (
        <ConfirmBox
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={removeStudentFromClass}
          bodyText="Are you sure want to remove from this class?"
          noButtonText="No"
          yesButtonText="Yes"
        />
      )}
   
      <Modal
        show={showConfirmMoveUpModal}
        onHide={closeConfirmMoveUpModal}
        backdrop="static"
        size="lg"
        centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Student Level</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}>
            <p>This child’s level will be changed to match the level of their new class, please select from the program option available at their new level</p>
            <p>Current Program Option: <b>{student?.programOption.level.name} - {student?.programOption.name}</b> </p>
            
            <div>
              <p>New Level: <b>{remainingClass?.levelName}</b></p>
            </div>

            Choose Program Options*{" "}
            <FontAwesomeIcon
              icon={faQuestionCircle}
              size="1x"
              onClick={() => setShowProgramOptionPopUp(true)}
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
                                  setProgramOptionId(po.id);
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
          <Button className="btn_main orange_btn" onClick={closeConfirmMoveUpModal}>
            Cancel
          </Button>
          <Button className="btn_main" onClick={moveUpStudentAndDeleteClass}>
            Update Level
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showProgramOptionPopUp}
        onHide={() => setShowProgramOptionPopUp(false)}
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

      {showLoader && <Loader />}
    </>
  );
};

export default ClassAssignmentDetails;
