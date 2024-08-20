import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import ClassAttendanceDto from "@/dtos/ClassAttendanceDto";
import { useForm } from "react-hook-form";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import CustomInput from "../../CustomFormControls/CustomInput";
import { useRouter } from "next/router";
import ClassAttendanceListParams from "@/params/ClassAttendanceListParams";
import ClassAttendanceAddUpdateModel from "@/models/ClassAttendanceModel";
import { ClassAttendanceMakeModel } from "@/models/AttendanceModal";
import { toast } from "react-toastify";

interface ClassAttendanceProps extends CommonProps {
  classId: number;
  q?: string;
}

const AddClassAttendance: NextPage<ClassAttendanceProps> = (props) => {
  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    formState,
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
    watch,
  } = useForm<ClassAttendanceAddUpdateModel>({
    defaultValues: {
      classId: props.classId,
      classAttendances: [],
      attendanceDate: new Date(),
    },
  });

  const [totalPresent, setTotalPresent] = useState<number>(0);
  const [totalExcuseAbsent, setTotalExcuseAbsent] = useState<number>(0);
  const [totalUnexcusedAbsent, setTotalUnexcusedAbsent] = useState<number>(0);
  const [totalTardy, setTotalTardy] = useState<number>(0);

  const [attendance, setAttendance] = useState<ClassAttendanceDto[] | null>([]);
  const fetchClassAttendance = async (
    classId: number,
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
      await unitOfService.ClassAttendanceService.getAttendanceByClassId(
        classId,
        p
      );
    if (response && response.status === 200 && response.data.data) {
      setAttendance(response.data.data);

      setTotalPresent(response.data.data.filter(e => e.presentOrAbsent === "Present")?.length);
      setTotalExcuseAbsent(response.data.data.filter(e => e.presentOrAbsent === "Excuse_Absent")?.length);
      setTotalUnexcusedAbsent(response.data.data.filter(e => e.presentOrAbsent === "Unexcused_Absent")?.length);
      setTotalTardy(response.data.data.filter(e => e.isTardy === true)?.length);
    }
  };

  useEffect(() => {
    (async () => {
      fetchClassAttendance(props.classId);
    })();
  }, []);

  const [attandanceDate, setAttandanceDate] = useState<string>(
    new Date().toString()
  );
  const dateChanged = (selectedDate: string) => {
    setAttandanceDate(selectedDate);
    fetchClassAttendance(props.classId, {
      q: "",
      attendanceDate: selectedDate,
    });
  };

  const makeSelection = async (e: ChangeEvent<HTMLInputElement>) => {
    let presenceType = e.target.name.split("_")[0];
    let studentId = e.target.name.split("_")[1];
    let value = "";
    let action = "present_absent";

    if (presenceType === "attendanceSelectionTardy") {
      action = "tardy";
      value = e.target.checked.toString();
    } else {
      value = e.target.value.split("~")[0];
    }

    const addModal: ClassAttendanceMakeModel = {
      action: action,
      attendanceDate: attandanceDate,
      classId: props.classId,
      isTardy:
        presenceType === "attendanceSelectionTardy" ? e.target.checked : false,
      presenceType: value,
      studentId: +studentId,
    };

    const response =
      await unitOfService.ClassAttendanceService.addStudentAttendance(addModal);
    if (response && response.status === 200 && response.data.data) {
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      <Form method="post" autoComplete="off">
        <Form.Control type="hidden" {...register("classId")} />

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
                  <th>Student</th>
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
                      <tr key={classAtten.studentId}>
                        <td>{classAtten.studentName} </td>
                        <td className="text-center">
                          <Form.Check
                            inline
                            type="radio"
                            id="present_switch"
                            name={`attendanceSelection_${classAtten.studentId}`}
                            value={`Present~${classAtten.studentId}`}
                            defaultChecked={
                              classAtten.presentOrAbsent === "Present" ? true : false
                            }
                            onChange={makeSelection}
                          />
                        </td>
                        <td className="text-center">
                          <Form.Check
                            inline
                            type="radio"
                            id="excuse_absent_switch"
                            name={`attendanceSelection_${classAtten.studentId}`}
                            value={`Excuse_Absent~${classAtten.studentId}`}
                            defaultChecked={
                              classAtten.presentOrAbsent === "Excuse_Absent"
                            }
                            onChange={makeSelection}
                          />
                        </td>
                        <td className="text-center">
                          <Form.Check
                            inline
                            type="radio"
                            id="unexcused_absent_switch"
                            name={`attendanceSelection_${classAtten.studentId}`}
                            value={`Unexcused_Absent~${classAtten.studentId}`}
                            defaultChecked={
                              classAtten.presentOrAbsent === "Unexcused_Absent"
                            }
                            onChange={makeSelection}
                          />
                        </td>
                        <td className="text-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            id="tardy_switch"
                            name={`attendanceSelectionTardy_${classAtten.studentId}`}
                            defaultChecked={classAtten.isTardy ? true : false}
                            onChange={makeSelection}
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
    </>
  );
};
export default AddClassAttendance;
