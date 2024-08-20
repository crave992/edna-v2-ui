import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";

import { NextPage } from "next";
import { container } from "@/config/ioc";
import { useForm } from "react-hook-form";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useEffect, useReducer, useState } from "react";

import CommonProps from "@/models/CommonProps";
import {
  InPageAddUpdateActionType,
  InPageAddUpdateState,
  reducer,
} from "@/reducers/InPageAddUpdateAction";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";
import { StudentAllergyDto } from "@/dtos/StudentAllergyDto";
import { StudentAllergyModel } from "@/models/StudentAllergyModel";
import { StudentAllergyValidationSchema } from "@/validation/StudentAllergyValidationSchema";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import Link from "next/link";

const initialPageState: InPageAddUpdateState<StudentAllergyDto> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
  isUpdating: false,
};

interface StudentAllergyProps extends CommonProps {
  studentId: number;
  isDirty: boolean;
  setIsDirty: (_isDirty: boolean) => void;
}

const StudentAllergy: NextPage<StudentAllergyProps> = ({ studentId, isDirty, setIsDirty }) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [allergy, dispatch] = useReducer(
    reducer<StudentAllergyDto>,
    initialPageState
  );

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
    formState: { errors, dirtyFields },
  } = useForm<StudentAllergyModel>({
    resolver: yupResolver(StudentAllergyValidationSchema),
    defaultValues: {
      studentId: studentId,
      allergyName: "",
      allergyIndication: "",
      actionTakenAgainstReaction: "",
      actionTakenAgainstSeriousReaction: "",
      contactPersonName1: "",
      contactPersonPhoneNumber1: "",
      contactPersonName2: "",
      contactPersonPhoneNumber2: "",
      callAnAmbulance: "",
    },    
  });

  const [medicalFormUrl, setMedicalFormUrl] = useState<string>("");
  const fetchAllergyDetails = async (studentId: number) => {
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StudentAllergyService.getByStudentId(
      studentId
    );

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let allergyDetail = response.data.data;

      dispatch({
        type: InPageAddUpdateActionType.SHOW_LOADER,
        payload: false,
      });

      setValue("studentId", allergyDetail.studentId);
      setValue("allergyName", allergyDetail.allergyName || "");
      setValue("allergyIndication", allergyDetail.allergyIndication || "");
      setValue(
        "actionTakenAgainstReaction",
        allergyDetail.actionTakenAgainstReaction || ""
      );
      setValue(
        "actionTakenAgainstSeriousReaction",
        allergyDetail.actionTakenAgainstSeriousReaction || ""
      );
      setValue("contactPersonName1", allergyDetail.contactPersonName1 || "");
      setValue(
        "contactPersonPhoneNumber1",
        allergyDetail.contactPersonPhoneNumber1 || ""
      );
      setValue("contactPersonName2", allergyDetail.contactPersonName2 || "");
      setValue(
        "contactPersonPhoneNumber2",
        allergyDetail.contactPersonPhoneNumber2 || ""
      );
      setValue(
        "callAnAmbulance",
        allergyDetail.callAnAmbulance === true ? "true" : "false"
      );

      setMedicalFormUrl(allergyDetail.medicalForm || "");
    }
  };

  const submitData = async (data: StudentAllergyModel) => {
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof StudentAllergyModel];
      if (key === "medicalForm") {
        formData.append(key, data?.[key][0]);
      } else {
        formData.append(key, value as string);
      }
    });

    const response = await unitOfService.StudentAllergyService.save(formData);

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Allergy information saved successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchAllergyDetails(studentId);
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(dirtyFields).length > 0) {
      setIsDirty(true);
    }
  }, [dirtyFields]);

  return (
    <>
      <Form
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit(submitData)}
      >
        <Form.Control type="hidden" {...register("studentId")} />
        <div className="formBlock">
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel
                  label="Allergies (If allergies are extensive, Please make a separate list)"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    type="textarea"
                    name="allergyName"
                    placeholder="Allergies (If allergies are extensive, Please make a separate list)"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel
                  label="Indications of onset of allergic reactions"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    type="textarea"
                    name="allergyIndication"
                    placeholder="Indications of onset of allergic reactions"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel
                 
                  label="Actions to be taken onset of reaction"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    type="textarea"
                    name="actionTakenAgainstReaction"
                    placeholder="Actions to be taken onset of reaction"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel
                 
                  label="Actions to be taken if reaction considered serious by staff"
                  className="mb-3"
                >
                  <CustomInput
                    control={control}
                    type="textarea"
                    name="actionTakenAgainstSeriousReaction"
                    placeholder="Actions to be taken if reaction considered serious by staff"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <p>
              <strong>
                Individuals to be contacted in the event of serious allergic
                reaction or a medical problem
              </strong>
            </p>
            <Col md={6}>
              <FloatingLabel
               
                label="Name"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="contactPersonName1"
                  placeholder="Name"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
               
                label="Phone"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="contactPersonPhoneNumber1"
                  placeholder="Phone"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
               
                label="Name"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="contactPersonName2"
                  placeholder="Name"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel
               
                label="Phone"
                className="mb-3"
              >
                <CustomInput
                  control={control}
                  name="contactPersonPhoneNumber2"
                  placeholder="Phone"
                />
              </FloatingLabel>
            </Col>
            <Col md={12}>
              <Form.Label>
                <strong>
                  Do we have permission to call an ambulance and take your child
                  to the nearest hospital if we consider the situation serious?
                </strong>
              </Form.Label>
              <Form.Group className="mb-3">
                <Form.Check
                  inline
                  label="Yes"
                  {...register("callAnAmbulance")}
                  value="true"
                  type="radio"
                  id="callAnAmbulance-1"
                />
                <Form.Check
                  inline
                  label="No"
                  {...register("callAnAmbulance")}
                  value="false"
                  type="radio"
                  id="callAnAmbulance-2"
                />
                {errors.callAnAmbulance && (
                  <ErrorLabel message={errors.callAnAmbulance.message} />
                )}
              </Form.Group>
            </Col>
            <p>
              <strong>Medical Forms: (if any) </strong>
            </p>

            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Control
                  type="file"
                  {...register("medicalForm")}
                  readOnly
                />
                {errors.medicalForm && (
                  <ErrorLabel message={errors.medicalForm.message} />
                )}

                {medicalFormUrl && (
                  <div className="mt-3">
                    <Link href={medicalFormUrl} target="_blank">
                      {
                        medicalFormUrl.split("/")[
                          medicalFormUrl.split("/").length - 1
                        ]
                      }
                    </Link>
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" className="btn_main mx-1">
            Save
          </Button>
          <Link
            href={`/students/info/${studentId}`}
            className="btn_border mx-1"
          >
            Cancel
          </Link>
        </div>
      </Form>
      {allergy.showLoader && <Loader />}
    </>
  );
};

export default StudentAllergy;
