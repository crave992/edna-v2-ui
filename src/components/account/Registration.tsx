import { NextPage } from "next";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import CommonProps from "@/models/CommonProps";
import { useForm } from "react-hook-form";
import { OrganizationModel } from "@/models/OrganizationModel";
import OrganizationValidationSchema from "@/validation/OrganizationValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import OrganisationBasicDetails from "../common/Organisation/BasicDetails";
import OrganisationAddress from "../common/Organisation/Address";
import OrganisationPrimaryContact from "../common/Organisation/PrimaryContact";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CountryDto from "@/dtos/CountryDto";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loader from "../common/Loader";
import { toast } from "react-toastify";

interface RegisterationProps extends CommonProps {}

const Registeration: NextPage<RegisterationProps> = (props) => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
  } = useForm<OrganizationModel>({
    resolver: yupResolver(OrganizationValidationSchema),
  });

  const [countries, setCountry] = useState<CountryDto[]>();

  const fetchCountry = async () => {
    const response = await unitOfService.CountryService.getAll("");
    if (response && response.status === 200 && response.data.data) {
      setCountry(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCountry();
    })();
  }, []);

  const [showLoader, setShowLoader] = useState<boolean>(false);

  const submitData = async (formData: OrganizationModel) => {
    setShowLoader(true);
    let response = await unitOfService.OrganizationService.add(formData);
    if (response && response.status === 201 && response.data.data) {
      router.push("/account/thanks");
    } else {
      setShowLoader(false);
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      <Form
        method="post"
        autoComplete="off"
        className="register_form"
        onSubmit={handleSubmit(submitData)}
      >
        <OrganisationBasicDetails
          register={register}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
        />
        <OrganisationAddress
          register={register}
          errors={errors}
          countries={countries}
          setValue={setValue}
          getValues={getValues}
        />
        <OrganisationPrimaryContact
          register={register}
          errors={errors}
          countries={countries}
          setValue={setValue}
          getValues={getValues}
        />

        <span className="text-center">
          <Button type="submit" className="btn_main">
            Register
          </Button>
        </span>

        {showLoader && <Loader />}
      </Form>
    </>
  );
};

export default Registeration;
