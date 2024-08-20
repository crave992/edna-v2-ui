import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../Loader";
import { toast } from "react-toastify";
import CustomFormError from "../../CustomFormControls/CustomFormError";
import { StudentMostBasicDto } from "@/dtos/StudentDto";
import LessonAssignmentModel from "@/models/LessonAssignmentModel";
import LessonAssignmentValidationSchema from "@/validation/LessonAssignmentValidationSchema";

interface AssignLessonProps {
  classId: number;
  lessonId: number;
  onClose: () => void;
}

const AssignLesson: NextPage<AssignLessonProps> = ({classId, lessonId, onClose,}) => {
  
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [students, setStudent] = useState<StudentMostBasicDto[]>([]);
  const fetchStudents = async (classId: number, lessonId: number) => {
    const response = await unitOfService.LessonAssignmentService.getStudentsForLessonAssignment(classId, lessonId);
    if (response && response.status === 200 && response.data.data) {
      setStudent(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStudents(classId, lessonId);
    })();
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LessonAssignmentModel>({
    resolver: yupResolver(LessonAssignmentValidationSchema),
    defaultValues: {
      classId: classId,
      lessonId: lessonId,
      studentIds: [],
    },
  });

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const submitData = async (data: LessonAssignmentModel) => {
    setShowLoader(true);
    const response = await unitOfService.LessonAssignmentService.assign(data);

    setShowLoader(false);
    if (response && response.status === 200) {
      toast.success("Lesson assigned successfully");
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
    onClose();
  };

  return (
    <>
      <Form
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit(submitData)}
      >
        <Form.Control type="hidden" {...register("classId")} />
        <Form.Control type="hidden" {...register("lessonId")} />

        {errors.classId && <CustomFormError error={errors.classId} />}
        {errors.lessonId && <CustomFormError error={errors.lessonId} />}
        {errors.studentIds && (
          <span className="text-danger">{errors.studentIds.message}</span>
        )}

        <Table striped hover className="custom_design_table mb-2">
          <thead>
            <tr>
              <th>Class</th>
              <th>Status</th>
              <th>Count</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {students &&
              students.map((stud) => {
                return (
                  <tr key={stud.id}>
                    <td>
                      <Form.Check
                        inline
                        label={stud.name}
                        value={stud.id.toString()}
                        type="checkbox"
                        id={`student-${stud.id}`}
                        defaultChecked={stud.isSelected}
                        {...register("studentIds")}
                      />
                    </td>
                    {stud.recordKeeping && stud.recordKeeping.length > 0 ? (
                      stud.recordKeeping.map((studRecord) => (
                        <React.Fragment key={studRecord.id}>
                          <td style={{ textTransform: 'capitalize' }}>{studRecord.status}</td>
                          <td>
                            {studRecord.status === 'practicing' ? (
                              <>{studRecord.practiceCount}</>
                            ) : studRecord.status === 'acquired' ? (
                              <>{studRecord.acquiredCount}</>
                            ) : null}
                          </td>
                          <td>
                            {studRecord.status === 'presented' ? (
                              <>{studRecord.presentedDate && unitOfService.DateTimeService.convertToLocalDate(studRecord.presentedDate)}</>
                            ) : studRecord.status === 'practicing' ? (
                              <>{studRecord.practicingDate && unitOfService.DateTimeService.convertToLocalDate(studRecord.practicingDate)}</>
                            ) : studRecord.status === 'planned' ? (
                              <>{studRecord.plannedDate && unitOfService.DateTimeService.convertToLocalDate(studRecord.plannedDate)}</>
                            ) : studRecord.status === 'acquired' ? (
                              <>{studRecord.acquiredDate && unitOfService.DateTimeService.convertToLocalDate(studRecord.acquiredDate)}</>
                            ) : null}
                          </td>
                        </React.Fragment>
                      ))
                    ) : (
                      <>
                        <td></td>
                        <td></td>
                        <td></td>
                      </>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </Table>

        <Button type="submit" className="btn_main">
          Assign
        </Button>
      </Form>
      {showLoader && <Loader />}
    </>
  );
};

export default AssignLesson;
