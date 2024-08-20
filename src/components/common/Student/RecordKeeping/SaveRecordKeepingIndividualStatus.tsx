import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { RecordKeepingDto } from "@/dtos/RecordKeepingDto";
import RecordKeepingModel from "@/models/RecordKeepingModel";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import RecordKeepingValidationSchema from "@/validation/RecordKeepingValidationSchema";
import { faMinus, faPlus, faSquare } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { components } from "react-select";
import Select from "react-select";
import CustomInput from "../../CustomFormControls/CustomInput";
import { toast } from "react-toastify";
import { AssignStudentInLessonModel } from "@/models/LessonModel";

interface Option {
  value: string;
  label: string;
  icon: JSX.Element;
}
const options = [
  {
    value: "planned",
    icon: <FontAwesomeIcon icon={faSquare} className="opacity-25" />,
    label: "Planned",
  },
  {
    value: "presented",
    icon: <FontAwesomeIcon icon={faSquare} className="opacity-50" />,
    label: "Presented",
  },
  {
    value: "practicing",
    icon: <FontAwesomeIcon icon={faSquare} className="opacity-75" />,
    label: "Practicing",
  },
  {
    value: "acquired",
    icon: <FontAwesomeIcon icon={faSquare} className="opacity-100" />,
    label: "Acquired",
  },
];

const customOption = (props: any) => {
  return (
    <components.Option {...props}>
      {props.data.icon} {props.data.label}
    </components.Option>
  );
};

const customSingleValue = (props: any) => (
  <components.SingleValue {...props}>
    {props.data.icon} {props.data.label}
  </components.SingleValue>
);

interface SaveRecordKeepingProps {
  studentId: number;
  classId: number;
  lessonId: number;
  isLessonAssigned: boolean;
  recordKeeping?: RecordKeepingDto;
  status: "planned" | "presented" | "practicing" | "acquired";
}

const SaveRecordKeepingIndividualStatus: NextPage<SaveRecordKeepingProps> = ({
  studentId,
  classId,
  lessonId,
  isLessonAssigned,
  recordKeeping,
  status,
}) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [form, setForm] = useState<boolean>(
    isLessonAssigned && recordKeeping ? true : false
  );

  const plannedDate = recordKeeping?.plannedDate
    ? new Date(
        unitOfService.DateTimeService.convertToLocalDate(
          recordKeeping?.plannedDate
        )
      )
    : new Date();
  const presentedDate = recordKeeping?.presentedDate
    ? new Date(
        unitOfService.DateTimeService.convertToLocalDate(
          recordKeeping?.presentedDate
        )
      )
    : new Date();
  const practicingDate = recordKeeping?.practicingDate
    ? new Date(
        unitOfService.DateTimeService.convertToLocalDate(
          recordKeeping?.practicingDate
        )
      )
    : new Date();
  const acquiredDate = recordKeeping?.acquiredDate
    ? new Date(
        unitOfService.DateTimeService.convertToLocalDate(
          recordKeeping?.acquiredDate
        )
      )
    : new Date();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
  } = useForm<RecordKeepingModel>({
    resolver: yupResolver(RecordKeepingValidationSchema),
    defaultValues: {
      count: 0,
      status: status,
    },
  });

  const [acquiredCount, setAcquiredCount] = useState<number>(
    recordKeeping?.acquiredCount || 0
  );

  const handleAcquiredTimes = () => {
    setAcquiredCount(acquiredCount + 1);
    setValue("count", acquiredCount + 1);
    submitData(getValues());
  };

  const [practicingCount, setPracticingCount] = useState<number>(
    recordKeeping?.practiceCount || 0
  );

  const handlePracticingIncrement = () => {
    setPracticingCount(practicingCount + 1);
    setValue("count", practicingCount + 1);
    submitData(getValues());
  };

  const handlePracticingDecrement = () => {
    if (practicingCount > 0) {
      setPracticingCount(practicingCount - 1);
      setValue("count", practicingCount - 1);
      submitData(getValues());
    }
  };

  const dateChanged = (selectedDate: string) => {
    setValue("actionDate", new Date(selectedDate));
    submitData(getValues());
  };

  const submitData = async (formData: RecordKeepingModel) => {
    if (!formData.actionDate) {
      formData.actionDate = new Date();
    }

    const response = await unitOfService.RecordKeepingService.save(
      studentId,
      classId,
      lessonId,
      formData
    );
    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const assignStudentToLesson = async (
    classId: number,
    studentId: number,
    lessonId: number
  ) => {
    const assignment: AssignStudentInLessonModel = {
      classId: classId,
      studentId: studentId,
      lessonId: lessonId,
    };
    const response = await unitOfService.LessonService.assignStudentInLesson(
      assignment
    );
    if (response && (response.status === 201 || response.status === 208)) {
      toast.success("Lesson assigned successfully");
      setForm(true);
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      {isLessonAssigned === false && form === false ? (
        <span
          className="btn_main size_small anchor-span"
          onClick={() => assignStudentToLesson(classId, studentId, lessonId)}
        >
          <FontAwesomeIcon icon={faPlus} /> Add
        </span>
      ) : isLessonAssigned === true && form === false ? (
        <span
          className="btn_main size_small anchor-span"
          onClick={() => setForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Plan
        </span>
      ) : null}

      {form && (
        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
          <div>
            {status === "acquired" ? (
              <div className="lesson_state">
                <div className="lesson_state_selected_val d-flex">
                  <CustomInput
                    control={control}
                    name="actionDate"
                    type="datepicker"
                    onDateSelect={dateChanged}
                    defaultValue={acquiredDate}
                  />
                  <div className="count_number">
                    <span>{acquiredCount}</span>
                    <span className="count_btn" onClick={handleAcquiredTimes}>
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                  </div>
                </div>
              </div>
            ) : status === "practicing" ? (
              <>
                
                <div className="lesson_state_selected_val d-flex justify-content-center">
                  <div className="count_number">
                    <span
                      className="count_btn"
                      onClick={handlePracticingDecrement}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </span>
                      <span className="mx-1" style={{ color: (practicingCount ?? 0) > 5 ? 'red' : 'black' }}>{practicingCount}</span>
                    <span
                      className="count_btn"
                      onClick={handlePracticingIncrement}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                  </div>
                </div>
                {recordKeeping?.practicingDate && (
                  <div className="justify-content-center">
                    Last Practice:{" "}
                    {unitOfService.DateTimeService.convertToLocalDate(
                      recordKeeping?.practicingDate
                    )}
                  </div>
                )}
              </>
            ) : status === "presented" ? (
              <div className="lesson_state">
                <div className="lesson_state_selected_val d-flex">
                  <CustomInput
                    control={control}
                    name="actionDate"
                    type="datepicker"
                    onDateSelect={dateChanged}
                    defaultValue={presentedDate}
                  />
                </div>
              </div>
            ) : status === "planned" ? (
              <div className="lesson_state">
                <div className="lesson_state_selected_val d-flex">
                  <CustomInput
                    control={control}
                    name="actionDate"
                    type="datepicker"
                    onDateSelect={dateChanged}
                    defaultValue={plannedDate}
                  />
                </div>
              </div>
            ) : (
              <div className="lesson_state">
                <div className="lesson_state_selected_val">
                  Select Lesson State
                </div>
              </div>
            )}
          </div>
        </Form>
      )}
    </>
  );
};

export default SaveRecordKeepingIndividualStatus;
