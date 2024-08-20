import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { OrganizationModel } from "@/models/OrganizationModel";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import { Row, Col, Form, FloatingLabel } from "react-bootstrap";
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import CheckStatus from "../CheckStatus";
import Link from "next/link";
import { OrganizationTypeDto } from "@/dtos/OrganizationDto";

interface OrganisationBasicDetailsProps {
  register: UseFormRegister<OrganizationModel>;
  errors: FieldErrors<OrganizationModel>;
  setValue: UseFormSetValue<OrganizationModel>;
  getValues: UseFormGetValues<OrganizationModel>;
}

const OrganisationBasicDetails: NextPage<OrganisationBasicDetailsProps> = (
  props
) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { register, errors, setValue, getValues } = props;

  const [subdomainCheckStatus, setSubdomainCheckStatus] = useState<string>();
  const [uniqueSubdomain, setUniqueSubdomain] = useState<string>();
  const [subdomain] = useDebounce(uniqueSubdomain, 1000);

  const checkSubdomain = async () => {
    setSubdomainCheckStatus("0");
    const response = await unitOfService.OrganizationService.checkSubDomain(
      getValues().subDomain
    );
    if (response && (response.status === 200 || response.status === 208)) {
      if (response.status === 200) {
        //sub domain available
        setSubdomainCheckStatus("1");
      } else if (response.status === 208) {
        //sub domain not available
        setSubdomainCheckStatus("2");
      }
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  useEffect(() => {
    if (subdomain) {
      (async () => {
        checkSubdomain();
      })();
    }
  }, [subdomain]);

  const [usernameCheckStatus, setUsernameCheckStatus] = useState<string>();
  const [uniqueUsername, setUniqueUsername] = useState<string>();
  const [username] = useDebounce(uniqueUsername, 1000);

  const checkUserName = async () => {
    setUsernameCheckStatus("0");
    const response = await unitOfService.UserService.getByUserName(
      getValues().userName
    );
    if (response && response.status === 200) {
      if (!response.data.data) {
        //username available
        setUsernameCheckStatus("1");
      } else if (response.data.data) {
        //username not available
        setUsernameCheckStatus("2");
      }
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  useEffect(() => {
    if (username) {
      (async () => {
        checkUserName();
      })();
    }
  }, [username]);


  const [organizationType, setOrganizationType] = useState<OrganizationTypeDto[]>();

  const fetchOrganizationType = async () => {
    const response = await unitOfService.OrganizationService.getAllOrganizationType();
    if (response && response.status === 200 && response.data.data) {
      setOrganizationType(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchOrganizationType();
    })();
  }, []);


  return (
    <>
      <h3 className="formBlock-heading text-left">Basic Details</h3>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <FloatingLabel label="School Name*">
              <Form.Control
                type="text"
                placeholder="School Name*"
                {...register("schoolName")}
              />
            </FloatingLabel>
            {errors.schoolName && (
              <span className="text-danger">{errors.schoolName.message}</span>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Email*">
              <Form.Control
                type="email"
                placeholder="Email*"
                {...register("schoolEmail")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setUniqueUsername(e.target.value);
                  setValue("userName", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </FloatingLabel>
            {errors.schoolEmail && (
              <span className="text-danger">{errors.schoolEmail.message}</span>
            )}
            {username && (
              <CheckStatus
                status={usernameCheckStatus}
                checkingStatusMessage="Checking availability..."
                notAvailableMsg="Email taken"
              />
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="School Phone*">
              <Form.Control
                type="text"
                placeholder="School Phone*"
                {...register("phoneNumber")}
              />
            </FloatingLabel>
            {errors.phoneNumber && (
              <span className="text-danger">{errors.phoneNumber.message}</span>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Organization Type*">
              <Form.Select
                aria-label="Organization Type*"
                {...register("organizationTypeId")}
              >
                <option value={"0"}>Select Organization Type</option>
                {organizationType &&
                  organizationType.map((orgType) => {
                    return (
                      <option key={orgType.id} value={orgType.id}>
                        {orgType.name}
                      </option>
                    );
                  })}
              </Form.Select>
            </FloatingLabel>
            {errors.organizationTypeId && (
              <span className="text-danger">{errors.organizationTypeId.message}</span>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
              <Form.Control
                type="hidden"
                placeholder="Username*"
                {...register("userName")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  // setUniqueUsername(e.target.value);
                  // setValue("userName", e.target.value, {
                  //   shouldValidate: true,
                  // });
                }}
              />
              <FloatingLabel label="Unique URL*">
              <Form.Control
                type="text"
                placeholder="Unique URL*"
                {...register("subDomain")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setUniqueSubdomain(e.target.value);
                  setValue("subDomain", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
              </FloatingLabel>
              {errors.subDomain && (
                <span className="text-danger">{errors.subDomain.message}</span>
              )}
              {subdomain && (
                <CheckStatus
                  status={subdomainCheckStatus}
                  checkingStatusMessage="Checking availability..."
                />
              )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Password*">
              <Form.Control
                type="password"
                placeholder="Password*"
                {...register("password")}
              />
            </FloatingLabel>
            {errors.password && (
              <span className="text-danger">{errors.password.message}</span>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Confirm Password*">
              <Form.Control
                type="password"
                placeholder="Confirm Password*"
                {...register("confirmPassword")}
              />
            </FloatingLabel>
            {errors.confirmPassword && (
              <span className="text-danger">
                {errors.confirmPassword.message}
              </span>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <div>
            {subdomain && (
              <Link href={`https://{${uniqueSubdomain}}.ednaapp.net`}>
                https://{uniqueSubdomain}.ednaapp.net
              </Link>
            )}
          </div>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Website URL">
              <Form.Control
                type="text"
                placeholder="Website URL"
                {...register("websiteUrl")}
              />
            </FloatingLabel>
            {errors.websiteUrl && (
              <span className="text-danger">{errors.websiteUrl.message}</span>
            )}
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Description">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description"
                {...register("about")}
              />
            </FloatingLabel>
            {errors.about && (
              <span className="text-danger">{errors.about.message}</span>
            )}
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default OrganisationBasicDetails;
