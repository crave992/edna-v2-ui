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

interface OrganisationAddressProps {
  register: UseFormRegister<OrganizationModel>;
  errors: FieldErrors<OrganizationModel>;
  countries?: CountryDto[];
  setValue: UseFormSetValue<OrganizationModel>;
  getValues: UseFormGetValues<OrganizationModel>;
}

const OrganisationAddress: NextPage<OrganisationAddressProps> = (props) => {
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
      <h3 className="formBlock-heading text-left mt-3">Address</h3>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Address Line 1">
              <Form.Control
                type="text"
                placeholder="Address Line 1"
                {...register("addressLine1")}
              />
            </FloatingLabel>
            {errors.addressLine1 && (
              <span className="text-danger">{errors.addressLine1.message}</span>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Address Line 2">
              <Form.Control
                type="text"
                placeholder="Address Line 2"
                {...register("addressLine2")}
              />
            </FloatingLabel>
            {errors.addressLine2 && (
              <span className="text-danger">{errors.addressLine2.message}</span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Country">
              <Form.Select
                aria-label="Country"
                {...register("countryId")}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  fetchState(+e.target.value);
                }}
              >
                <option value={"0"}>Select Country</option>
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
            {errors.countryId && (
              <span className="text-danger">{errors.countryId.message}</span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="State">
              <Form.Select aria-label="State" {...register("stateId")}>
                <option value={"0"}>Select State</option>
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
            {errors.stateId && (
              <span className="text-danger">{errors.stateId.message}</span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="City">
              <Form.Control
                type="text"
                placeholder="City"
                {...register("city")}
              />
            </FloatingLabel>
            {errors.city && (
              <span className="text-danger">{errors.city.message}</span>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Zipcode">
              <Form.Control
                type="text"
                placeholder="Zipcode"
                {...register("zipcode")}
              />
            </FloatingLabel>
            {errors.zipcode && (
              <span className="text-danger">{errors.zipcode.message}</span>
            )}
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default OrganisationAddress;
