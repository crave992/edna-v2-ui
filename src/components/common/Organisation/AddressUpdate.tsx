import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CountryDto from "@/dtos/CountryDto";
import StateDto from "@/dtos/StateDto";
import { OrganizationUpdateModel } from "@/models/OrganizationModel";
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
import CustomSelect from "../CustomFormControls/CustomSelect";

interface OrganisationAddressUpdateProps {
  register: UseFormRegister<OrganizationUpdateModel>;
  errors: FieldErrors<OrganizationUpdateModel>;
  countries?: CountryDto[];
  setValue: UseFormSetValue<OrganizationUpdateModel>;
  getValues: UseFormGetValues<OrganizationUpdateModel>;
  control: Control<OrganizationUpdateModel>;
}

const OrganisationAddressUpdate: NextPage<OrganisationAddressUpdateProps> = (
  props
) => {
  const { register, getValues, setValue, errors, countries, control } = props;
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
      await fetchState(getValues().countryId);
    })();
  }, []);

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
            <CustomSelect
              name="countryId"
              control={props.control}
              placeholder="Country"
              options={countries}
              isSearchable={true}
              textField="name"
              valueField="id"
              onChange={async (option) => {
                const selectedCountryId = +(option?.[0] || 0);
                setValue("countryId", selectedCountryId);
                setValue("stateId", 0);
                await fetchState(selectedCountryId);
              }}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <CustomSelect
              name="stateId"
              control={props.control}
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

export default OrganisationAddressUpdate;
