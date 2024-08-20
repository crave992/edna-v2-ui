import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { useEffect, useState } from "react";
import { BankAccountTypeDto } from "@/dtos/BankAccountTypeDto";
import { StaffBankAccountInfoModel } from "@/models/StaffModel";
import { StaffBankAccountInfoValidationSchema } from "@/validation/StaffValidationSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import CustomInput from "../../CustomFormControls/CustomInput";
import Loader from "../../Loader";

const BankAccountInfo = () => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { handleSubmit, setValue, control } =
    useForm<StaffBankAccountInfoModel>({
      resolver: yupResolver(StaffBankAccountInfoValidationSchema),
      defaultValues: {
        bankAccountTypeId: 0,
        bankName: "",
        accountNumber: "",
        confirmAccountNumber: "",
        routingNumber: "",
        confirmRoutingNumber: "",
        acceptTerms: false,
      },
    });

  const [bankAccountType, setBankAccountType] = useState<BankAccountTypeDto[]>(
    []
  );
  const fetchBankAccountType = async () => {
    const response = await unitOfService.BankAccountTypeService.getAll();
    if (response && response.status == 200 && response.data.data) {
      setBankAccountType(response.data.data);
    }
  };

  const fetchStaffBankAccountInfo = async () => {
    const response = await unitOfService.StaffService.getBankAccountInfo();
    if (response && response.status == 200 && response.data.data) {
      const bankAccountInfo = response.data.data;
      setValue("bankAccountTypeId", bankAccountInfo.bankAccountTypeId);
      setValue("bankName", bankAccountInfo.bankName);
      setValue("accountNumber", bankAccountInfo.accountNumber);
      setValue("confirmAccountNumber", bankAccountInfo.accountNumber);
      setValue("routingNumber", bankAccountInfo.routingNumber);
      setValue("confirmRoutingNumber", bankAccountInfo.routingNumber);
      setValue("acceptTerms", bankAccountInfo.acceptTerms);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchBankAccountType();
      await fetchStaffBankAccountInfo();
    })();
  }, []);

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const submitData = async (data: StaffBankAccountInfoModel) => {
    setShowLoader(true);
    const response = await unitOfService.StaffService.saveBankAccountInfo(data);
    setShowLoader(false);
    if (response && response.status === 200 && response.data.data) {
      toast.success("Account information saved successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      <h3 className="formBlock-heading">Direct Deposit</h3>

      <Form
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit(submitData)}
      >
        <Row>
          <Col md={6} lg={6}>
            <CustomSelect
              name="bankAccountTypeId"
              control={control}
              placeholder="Account Type*"
              isSearchable={true}
              options={bankAccountType}
              textField="name"
              valueField="id"
            />
          </Col>
          <Col md={6} lg={6}>
            <FloatingLabel
              controlId="bankName"
              label="Name of Financial Institution*"
              className="mb-3"
            >
              <CustomInput
                control={control}
                name="bankName"
                placeholder="Name of Financial Institution*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={6}>
            <FloatingLabel
              controlId="routingNumber"
              label="Routing Number"
              className="mb-3"
            >
              <CustomInput
                control={control}
                name="routingNumber"
                placeholder="Routing Number"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={6}>
            <FloatingLabel
              controlId="confirmRoutingNumber"
              label="Confirm Routing Number"
              className="mb-3"
            >
              <CustomInput
                control={control}
                name="confirmRoutingNumber"
                placeholder="Confirm Routing Number"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={6}>
            <FloatingLabel
              controlId="accountNumber"
              label="Account Number"
              className="mb-3"
            >
              <CustomInput
                control={control}
                name="accountNumber"
                placeholder="Account Number"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={6}>
            <FloatingLabel
              controlId="confirmAccountNumber"
              label="Confirm Account Number"
              className="mb-3"
            >
              <CustomInput
                control={control}
                name="confirmAccountNumber"
                placeholder="Confirm Account Number"
              />
            </FloatingLabel>
          </Col>
          <Col md={12} lg={12}>
            <Form.Group>
              <CustomInput
                type="checkbox"
                control={control}
                name="acceptTerms"
                placeholder="I hereby authorize direct deposit to my bank account"
                labelForCheckboxAndRadio="I hereby authorize direct deposit to my bank account"
              />
            </Form.Group>
          </Col>

          <Col className="my-3 mb-3">
            <Button type="submit" className="btn_main">
              Save
            </Button>
          </Col>
        </Row>
      </Form>

      {showLoader && <Loader />}
    </>
  );
};

export default BankAccountInfo;
