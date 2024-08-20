import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CountryDto from "@/dtos/CountryDto";
import StateDto from "@/dtos/StateDto";
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
import { OrganizationPrimaryContactDto } from "@/dtos/OrganizationPrimaryContactDto";

interface OrganisationPrimaryContactUpdateProps {
  register: UseFormRegister<OrganizationUpdateModel>;
  errors: FieldErrors<OrganizationUpdateModel>;
  countries?: CountryDto[];
  setValue: UseFormSetValue<OrganizationUpdateModel>;
  getValues: UseFormGetValues<OrganizationUpdateModel>;
  control: Control<OrganizationUpdateModel>;
}

const OrganisationPrimaryContactUpdate: NextPage<
  OrganisationPrimaryContactUpdateProps
> = (props) => {
  const { register, errors, countries, setValue, getValues, control } = props;
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, setState] = useState<StateDto[]>();

  const fetchState = async (countryId: number) => {
    const response = await unitOfService.StateService.getByCountryId(countryId);
    if (response && response.status === 200 && response.data.data) {
      setState(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchState(getValues().primaryContact.countryId);
    })();
  }, []);

  return (
    <>
      <h3 className="formBlock-heading text-left mt-3">
        Primary Contact Person Details
      </h3>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Person Name*">
              <Form.Control
                type="text"
                placeholder="Person Name*"
                {...register(`primaryContact.name`)}
              />
            </FloatingLabel>
            {errors.primaryContact?.name && (
              <span className="text-danger">
                {errors.primaryContact.name.message}
              </span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Email*">
              <Form.Control
                type="text"
                placeholder="Email*"
                {...register(`primaryContact.email`)}
              />
            </FloatingLabel>
            {errors.primaryContact?.email && (
              <span className="text-danger">
                {errors.primaryContact.email.message}
              </span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Phone*">
              <Form.Control
                type="text"
                placeholder="Phone*"
                {...register(`primaryContact.phone`)}
              />
            </FloatingLabel>
            {errors.primaryContact?.phone && (
              <span className="text-danger">
                {errors.primaryContact.phone.message}
              </span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Address Line 1">
              <Form.Control
                type="text"
                placeholder="Address Line 1"
                {...register(`primaryContact.addressLine1`)}
              />
            </FloatingLabel>
            {errors.primaryContact?.addressLine1 && (
              <span className="text-danger">
                {errors.primaryContact.addressLine1.message}
              </span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Address Line 2">
              <Form.Control
                type="text"
                placeholder="Address Line 2"
                {...register(`primaryContact.addressLine2`)}
              />
            </FloatingLabel>
            {errors.primaryContact?.addressLine2 && (
              <span className="text-danger">
                {errors.primaryContact.addressLine2.message}
              </span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <CustomSelect
              name="primaryContact.countryId"
              control={control}
              placeholder="Country"
              options={countries}
              isSearchable={true}
              textField="name"
              valueField="id"
              onChange={async (option) => {
                const selectedCountryId = +(option?.[0] || 0);
                setValue("primaryContact.countryId", selectedCountryId);
                setValue("primaryContact.stateId", 0);
                await fetchState(selectedCountryId);
              }}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <CustomSelect
              name="primaryContact.stateId"
              control={control}
              placeholder="State"
              options={states}
              isSearchable={true}
              textField="name"
              valueField="id"
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="City">
              <Form.Control
                type="text"
                placeholder="City"
                {...register(`primaryContact.city`)}
              />
            </FloatingLabel>
            {errors.primaryContact?.city && (
              <span className="text-danger">
                {errors.primaryContact.city.message}
              </span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Zipcode">
              <Form.Control
                type="text"
                placeholder="Zipcode"
                {...register(`primaryContact.zipcode`)}
              />
            </FloatingLabel>
            {errors.primaryContact?.zipcode && (
              <span className="text-danger">
                {errors.primaryContact.zipcode.message}
              </span>
            )}
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default OrganisationPrimaryContactUpdate;
