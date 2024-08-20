import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CountryDto from "@/dtos/CountryDto";
import StateDto from "@/dtos/StateDto";
import { OrganizationModel } from "@/models/OrganizationModel";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import { Row, Col, Form, FloatingLabel } from "react-bootstrap";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

interface OrganisationPrimaryContactProps {
  register: UseFormRegister<OrganizationModel>;
  errors: FieldErrors<OrganizationModel>;
  countries?: CountryDto[];
  setValue: UseFormSetValue<OrganizationModel>;
  getValues: UseFormGetValues<OrganizationModel>;
}

const OrganisationPrimaryContact: NextPage<OrganisationPrimaryContactProps> = (
  props
) => {
  const { register, errors, countries } = props;
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, setState] = useState<StateDto[]>();

  const fetchState = async (countryId: number) => {
    const response = await unitOfService.StateService.getByCountryId(countryId);
    if (response && response.status === 200 && response.data.data) {
      setState(response.data.data);
    }
  };

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
            <FloatingLabel label="Country">
              <Form.Select
                aria-label="Country"
                {...register(`primaryContact.countryId`)}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  fetchState(+e.target.value);
                }}
              >
                <option value="0">Select Country</option>
                {countries &&
                  countries.map((country) => {
                    return (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    );
                  })}
              </Form.Select>
            </FloatingLabel>
            {errors.primaryContact?.countryId && (
              <span className="text-danger">
                {errors.primaryContact.countryId.message}
              </span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="State">
              <Form.Select
                aria-label="State"
                {...register(`primaryContact.stateId`)}
              >
                <option value="0">Select State</option>
                {states &&
                  states.map((state) => {
                    return (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    );
                  })}
              </Form.Select>
            </FloatingLabel>
            {errors.primaryContact?.stateId && (
              <span className="text-danger">
                {errors.primaryContact.stateId.message}
              </span>
            )}
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

export default OrganisationPrimaryContact;
