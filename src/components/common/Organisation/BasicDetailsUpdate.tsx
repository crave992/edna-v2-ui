import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { OrganizationUpdateModel } from "@/models/OrganizationModel";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Row, Col, Form, FloatingLabel } from "react-bootstrap";
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import CustomSelect from "../CustomFormControls/CustomSelect";
import moment from "moment-timezone";
import { OrganizationTypeDto } from "@/dtos/OrganizationDto";
import { CurrencyCodeDto } from "@/dtos/CurrencyCodeDto";

interface OrganisationBasicDetailsUpdateProps {
  register: UseFormRegister<OrganizationUpdateModel>;
  errors: FieldErrors<OrganizationUpdateModel>;
  setValue: UseFormSetValue<OrganizationUpdateModel>;
  getValues: UseFormGetValues<OrganizationUpdateModel>;
  control: Control<OrganizationUpdateModel>;
}

const OrganisationBasicDetailsUpdate: NextPage<
  OrganisationBasicDetailsUpdateProps
> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { register, errors, setValue, getValues } = props;

  const [timezone, setTimeZone] = useState<{ label: string; value: string }[]>(
    []
  );

  useEffect(() => {
    const timezones = moment.tz.names();
    const formattedTimezones = timezones.map((timezone) => {
      return {
        label: timezone,
        value: timezone,
      };
    });
    setTimeZone(formattedTimezones);
  }, []);

  const [organizationType, setOrganizationType] =
    useState<OrganizationTypeDto[]>();

  const fetchOrganizationType = async () => {
    const response =
      await unitOfService.OrganizationService.getAllOrganizationType();
    if (response && response.status === 200 && response.data.data) {
      setOrganizationType(response.data.data);
    }
  };

  const [currencyCodes, setCurrencyCodes] = useState<CurrencyCodeDto[]>([]);
  const fetchCurrencyCode = async () => {
    const response = await unitOfService.CurrencyCodeService.getAll();
    if (response && response.status === 200 && response.data.data) {
      setCurrencyCodes(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchOrganizationType();
      await fetchCurrencyCode();
    })();
  }, []);

  return (
    <>
      <h3 className="formBlock-heading text-left">Basic Details</h3>
      <Row>
        <Col md={6}>
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
            <CustomSelect
              name="organizationTypeId"
              control={props.control}
              placeholder="Organization Type*"
              options={organizationType}
              isSearchable={true}
              textField="name"
              valueField="id"
              onChange={async (option) => {
                const selectedId = +(option?.[0] || 0);
                setValue("organizationTypeId", selectedId);
              }}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="School Email*">
              <Form.Control
                type="email"
                placeholder="School Email*"
                {...register("schoolEmail")}
              />
            </FloatingLabel>
            {errors.schoolEmail && (
              <span className="text-danger">{errors.schoolEmail.message}</span>
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

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Timezone</Form.Label>
            <CustomSelect
              name="timezoneId"
              control={props.control}
              placeholder="Timezone"
              options={timezone}
              isSearchable={true}
              textField="label"
              valueField="value"
              onChange={async (option) => {
                const selectedTimeZone = (option?.[0] || "").toString();
                setValue("timezoneId", selectedTimeZone);
              }}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Currency</Form.Label>
            <CustomSelect
              name="currencyCode"
              control={props.control}
              placeholder="Currency"
              options={currencyCodes.map((currencie) => { return {code: currencie.code, text: `${currencie.name} (${currencie.code})`} })}
              isSearchable={true}
              textField="text"
              valueField="code"
              onChange={async (option) => {
                const currencyCode = (option?.[0] || "").toString();
                setValue("currencyCode", currencyCode);
              }}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default OrganisationBasicDetailsUpdate;
