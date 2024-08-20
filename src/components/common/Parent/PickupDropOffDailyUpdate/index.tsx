import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { PickupDropoffParentDto } from "@/dtos/PickupDropoffParentDto";
import { StudentBasicDto } from "@/dtos/StudentDto";
import PickUpDropOffStudentWiseModel from "@/models/PickUpDropOffStudentWiseModel";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import PickUpDropOffStudentWiseValidationSchema from "@/validation/PickUpDropOffStudentWiseValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangeEvent, useEffect, useState } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CustomFormError from "../../CustomFormControls/CustomFormError";
import CustomInput from "../../CustomFormControls/CustomInput";
import Loader from "../../Loader";
import TodayPickupDropOff from "../../Student/TodayPickupDropOff";

const PickupDropOffDailyUpdate = () => {
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<PickUpDropOffStudentWiseModel>({
    resolver: yupResolver(PickUpDropOffStudentWiseValidationSchema),
    defaultValues: {
      action: "",
      contactPersonId: 0,
      date: new Date(),
      studentId: 0,
      time: "",
    },
  });

  const [refreshTodaysPickupDropOff, setRefreshTodaysPickupDropOff] =
    useState<boolean>(true);
  const submitData = async (data: PickUpDropOffStudentWiseModel) => {
    setShowLoader(true);
    setRefreshTodaysPickupDropOff(false);
    const response =
      await unitOfService.PickUpDropOffStudentWiseService.savePickUpDropOffStudentWise(
        data
      );

    setShowLoader(false);
    setRefreshTodaysPickupDropOff(true);
    if (response && response.status === 200 && response.data.data) {
      toast.success("Action saved successful");
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [students, setStudent] = useState<StudentBasicDto[]>();
  const fetchStudent = async () => {
    const response = await unitOfService.StudentService.getBasicListing();
    if (response && response.status === 200 && response.data.data) {
      setStudent(response.data.data);
    }
  };

  const [persons, setPersons] = useState<PickupDropoffParentDto[]>();
  const fetchPerson = async (studentId: number) => {
    setPersons([]);
    const response =
      await unitOfService.PickupDropoffParentService.getContactsByStudentId(
        studentId
      );
    if (response && response.status === 200 && response.data.data) {
      setPersons(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStudent();
    })();
  }, []);

  const fetchContactPerson = async (e: ChangeEvent<HTMLInputElement>) => {
    setValue("contactPersonId", 0);
    const selectedValue = +e.target.value;
    setValue("studentId", selectedValue);
    await fetchPerson(selectedValue);
  };

  const [actionLabel, setActionLabel] = useState<string>("");
  const setAction = async (e: ChangeEvent<HTMLInputElement>) => {
    setActionLabel("");
    setValue("action", e.target.value);
    if (e.target.value === "dropoff") {
      setActionLabel("Drop-Off");
    } else if (e.target.value === "pickup") {
      setActionLabel("Pick Up");
    }
  };

  return (
    <>
      <Container fluid>
        <div className="db_heading_block">
          <h1 className="db_heading">Pickup Drop-Off Daily Updates</h1>
        </div>
        <Row>
          <Col md={12}>
            <Form
              method="post"
              autoComplete="off"
              onSubmit={handleSubmit(submitData)}
            >
              <div className="">
                <Form.Group className="mb-4" {...register("studentId")}>
                  <h3 className="formBlock-heading">Select Student</h3>
                  {students &&
                    students.map((stud) => {
                      return (
                        <Form.Check
                          key={stud.id}
                          inline
                          label={stud.name}
                          value={stud.id.toString()}
                          type="radio"
                          id={`student-${stud.id}`}
                          name="studentId"
                          onChange={fetchContactPerson}
                        />
                      );
                    })}

                  {errors.studentId && (
                    <CustomFormError error={errors.studentId} />
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <h3 className="formBlock-heading">Select Action</h3>
                  <Form.Check
                    inline
                    type="radio"
                    value="dropoff"
                    id={`enable_yes`}
                    label="Drop-Off"
                    {...register("action")}
                    onChange={setAction}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    value="pickup"
                    id={`enable_yespickup`}
                    label="Pickup"
                    {...register("action")}
                    onChange={setAction}
                  />

                  {errors.action && <CustomFormError error={errors.action} />}
                </Form.Group>

                {persons && (
                  <Form.Group className="mb-4">
                    <h3 className="formBlock-heading">{actionLabel} By</h3>
                    {persons.map((person) => {
                      return (
                        <Form.Check
                          key={person.id}
                          inline
                          label={person.name}
                          value={person.id.toString()}
                          type="radio"
                          id={`person.id-${person.id}`}
                          {...register("contactPersonId")}
                        />
                      );
                    })}

                    {errors.contactPersonId && (
                      <CustomFormError error={errors.contactPersonId} />
                    )}
                  </Form.Group>
                )}
                {actionLabel && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <h3 className="formBlock-heading">
                          {actionLabel} Date
                        </h3>
                        <CustomInput
                          control={control}
                          name="date"
                          type="datepicker"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <h3 className="formBlock-heading">
                          {actionLabel} Time
                        </h3>
                        <CustomInput
                          control={control}
                          name="time"
                          type="time"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Button type="submit" className="btn_main">
                  Save
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xl={12}>
            <div className="db_heading_block">
              <h1 className="db_heading">Today Pickup/ Drop-off</h1>
            </div>
            <div className="formBlock">
              {refreshTodaysPickupDropOff && <TodayPickupDropOff />}
            </div>
          </Col>
        </Row>
      </Container>

      {showLoader && <Loader />}
    </>
  );
};

export default PickupDropOffDailyUpdate;
