import { Button, Col, Form } from "react-bootstrap";
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
import Loader from "../../Loader";
import { toast } from "react-toastify";
import { StudentImmunizationDto } from "@/dtos/StudentImmunizationDto";
import { StudentImmunizationModel } from "@/models/StudentImmunizationModel";
import { StudentImmunizationValidationSchema } from "@/validation/StudentImmunizationValidationSchema";
import Link from "next/link";
import CustomFormError from "../../CustomFormControls/CustomFormError";

const initialPageState: InPageAddUpdateState<StudentImmunizationDto> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
  isUpdating: false,
};

interface StudentImmunizationProps extends CommonProps {
  studentId: number;
}

const ViewStudentImmunization: NextPage<StudentImmunizationProps> = ({
  studentId,
}) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [immunization, dispatch] = useReducer(
    reducer<StudentImmunizationDto>,
    initialPageState
  );

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<StudentImmunizationModel>({
    resolver: yupResolver(StudentImmunizationValidationSchema),
    defaultValues: {
      studentId: studentId,
      isChildImmunized: false,
      immunizationExemption: false,
      immunizationCertificateUrl: "",
      immunizationExemptionApprovalCertificateUrl: "",
    },
  });

  const [immunizationCertificate, setImmunizationCertificate] =
    useState<string>("");
  const [
    immunizationExemptionApprovalCertificate,
    setImmunizationExemptionApprovalCertificate,
  ] = useState<string>("");

  const [isChildImmunized, setIsChildImmunized] = useState<boolean>(false);
  const [isImmunizationExemption, setIsImmunizationExemption] =
    useState<boolean>(false);

  const fetchImmunizationDetails = async (studentId: number) => {
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.StudentImmunizationService.getByStudentId(studentId);

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let immunizationDetail = response.data.data;

      dispatch({
        type: InPageAddUpdateActionType.SHOW_LOADER,
        payload: false,
      });

      setValue("studentId", immunizationDetail.studentId);

      setValue("isChildImmunized", immunizationDetail.isChildImmunized);
      setValue(
        "immunizationCertificateUrl",
        immunizationDetail.immunizationCertificate || ""
      );
      setIsChildImmunized(immunizationDetail.isChildImmunized);
      setImmunizationCertificate(immunizationDetail.immunizationCertificate);

      setValue(
        "immunizationExemption",
        immunizationDetail.immunizationExemption
      );
      setValue(
        "immunizationExemptionApprovalCertificateUrl",
        immunizationDetail.immunizationExemptionApprovalCertificate || ""
      );
      setIsImmunizationExemption(immunizationDetail.immunizationExemption);
      setImmunizationExemptionApprovalCertificate(
        immunizationDetail.immunizationExemptionApprovalCertificate
      );
    }
  };  

  useEffect(() => {
    (async () => {
      await fetchImmunizationDetails(studentId);
    })();
  }, []);

  const handleisChildImmunizedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue("isChildImmunized", event.target.checked);
    setIsChildImmunized(event.target.checked);
  };

  const handleImmunizationExemptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue("immunizationExemption", event.target.checked);
    setIsImmunizationExemption(event.target.checked);
  };

  return (
    <>
    
        <Form.Control type="hidden" {...register("studentId")} />
        <Form.Control
          type="hidden"
          {...register("immunizationCertificateUrl")}
        />
        <Form.Control
          type="hidden"
          {...register("immunizationExemptionApprovalCertificateUrl")}
        />
        <div className="formBlock">
          <Col md={12} lg={12}>
            <Form.Group className="mb-3">
              <Form.Check
                inline
                label="My child is immunized"
                {...register("isChildImmunized")}
                type="checkbox"
                id="isChildImmunized"
                onChange={handleisChildImmunizedChange}
              />
            </Form.Group>

            {isChildImmunized && (
              <Form.Group className="mt-3 mb-3">
                <Form.Label>
                  Upload the latest Immunization chart/certificate
                </Form.Label>
                <Form.Control
                  type="file"
                  {...register("immunizationCertificate")}
                  id="immunizationCertificate"
                />

                {errors.immunizationCertificate && (
                  <CustomFormError error={errors.immunizationCertificate} />
                )}

                {immunizationCertificate && (
                  <div className="mt-3">
                    <Link href={immunizationCertificate} target="_blank">
                      {
                        immunizationCertificate.split("/")[
                          immunizationCertificate.split("/").length - 1
                        ]
                      }
                    </Link>
                  </div>
                )}
              </Form.Group>
            )}
            
            <Form.Group>
              <Form.Check
                inline
                label="Immunization Exemption"
                {...register("immunizationExemption")}
                type="checkbox"
                id="immunizationExemption"
                onChange={handleImmunizationExemptionChange}
              />
            </Form.Group>

            {isImmunizationExemption && (
              <Form.Group className="mt-3 mb-3">
                <Form.Label>Upload exemption approval certificate</Form.Label>
                <Form.Control
                  type="file"
                  {...register("immunizationExemptionApprovalCertificate")}
                  id="immunizationExemptionApprovalCertificate"
                />

                {errors.immunizationExemptionApprovalCertificate && (
                  <CustomFormError
                    error={errors.immunizationExemptionApprovalCertificate}
                  />
                )}

                {immunizationExemptionApprovalCertificate && (
                  <div className="mt-3">
                    <Link
                      href={immunizationExemptionApprovalCertificate}
                      target="_blank"
                    >
                      {
                        immunizationExemptionApprovalCertificate.split("/")[
                          immunizationExemptionApprovalCertificate.split("/")
                            .length - 1
                        ]
                      }
                    </Link>
                  </div>
                )}
              </Form.Group>
            )}

            <div className="mt-3">
              <Form.Text className="text-muted">
                **Department of Health Approval Required. Upload Exemption
                certificate.
              </Form.Text>
            </div>

            <div className="mt-3">
              
              <Link
                href={`/students/info/${studentId}`}
                className="btn_border mx-1"
              >
                Back
              </Link>
            </div>
          </Col>
        </div>
      {immunization.showLoader && <Loader />}
    </>
  );
};

export default ViewStudentImmunization;
