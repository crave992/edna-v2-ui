import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { ClassBasicDto } from "@/dtos/ClassDto";
import AssignStudentInClassModal from "@/models/AssignStudentInClassModal";
import AssignStudentInClassValidationSchema from "@/validation/AssignStudentInClassValidationSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../Loader";
import { toast } from "react-toastify";
import CustomFormError from "../../CustomFormControls/CustomFormError";

interface AssignmentClassProps extends CommonProps {
  studentId: number;
  onClose: () => void;
}

const AssignClass: NextPage<AssignmentClassProps> = ({ studentId, onClose }) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [unAssignedClasses, setUnAssignedClasses] = useState<ClassBasicDto[]>(
    []
  );
  const fetchNotAssignedClasses = async (studentId: number) => {
    const response =
      await unitOfService.ClassAssignmentService.getNotAssignedClassByStudentId(
        studentId
      );
    if (response && response.status === 200 && response.data.data) {
      setUnAssignedClasses(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchNotAssignedClasses(studentId);
    })();
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<AssignStudentInClassModal>({
    resolver: yupResolver(AssignStudentInClassValidationSchema),
    defaultValues: {
      classIds: [],
      studentId: studentId,
    },
  });

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const submitData = async (data: AssignStudentInClassModal) => {
    setShowLoader(true);
    const response =
      await unitOfService.ClassAssignmentService.assignStudentInClass(data);

    setShowLoader(false);
    if (response && response.status === 201) {
      toast.success("Class assigned successfully");
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
        <Form.Control type="hidden" {...register("studentId")} />

        {errors.studentId && <CustomFormError error={errors.studentId} />}
        {errors.classIds && (
          <span className="text-danger">{errors.classIds.message}</span>
        )}

        <Table striped hover className="custom_design_table mb-2">
          <thead>
            <tr>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {unAssignedClasses &&
              unAssignedClasses.map((cla) => {
                return (
                  <tr key={cla.id}>
                    <td>
                      <Form.Check
                        inline
                        label={cla.name}
                        value={cla.id.toString()}
                        type="checkbox"
                        id={`class-${cla.id}`}
                        {...register("classIds")}
                      />
                    </td>
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

export default AssignClass;
