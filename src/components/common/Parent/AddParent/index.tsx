import { useEffect, useReducer, useState } from "react";
import { Button, Col, FloatingLabel, Form, FormControl, FormLabel, Row } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ErrorLabel from "../../CustomError/ErrorLabel";
import Loader from "../../Loader";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CustomInput from "../../CustomFormControls/CustomInput";
import {
  InPageAddUpdateActionType,
  InPageAddUpdateState,
  reducer,
} from "@/reducers/InPageAddUpdateAction";
import { ParentDto } from "@/dtos/ParentDto";
import ParentValidationSchema from "@/validation/ParentValidationSchema";
import { ParentModel } from "@/models/ParentModel";
import { NextPage } from "next";
import CommonProps from "@/models/CommonProps";

interface AddParentProps extends CommonProps {
  registrationCode: string;
}


const initialPageState: InPageAddUpdateState<ParentDto> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
};

const AddParent: NextPage<AddParentProps> = (props) => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<ParentDto>, initialPageState);
  const [inviteEmail, setInviteEmail] = useState("");
  
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<ParentModel>({
    resolver: yupResolver(ParentValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      //password: "",
      //confirmPassword: "",
      cellPhone: "",
      homePhone: "",
    },
  });


  const getRegistrationEmail = async () => {
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    var inviteCodeRes = await unitOfService.ParentInviteService.isValidInviteCode(props.registrationCode);
    var inviteDetails = inviteCodeRes.data.data;

    

    if(inviteDetails.isValid){
      setInviteEmail(inviteDetails.email);
      setValue("email", inviteDetails.email);
      setValue("chargeApplicationFee", false);
      setValue("chargeRegistrationFee", false);
    } else {
      toast.error(`Code ${props.registrationCode} is not valid.`);
    }

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });
  }

  const submitData = async (data: ParentModel) => {
    data.userName = data.email;
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.ParentService.add(data);

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 201 && response.data.data) {
      toast.success("Parent added successfully and email sent with an instruction to complete the registration");

      if(inviteEmail.length == 0){
        router.push("/admin/parents");
      }

    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      if(props.registrationCode && props.registrationCode != null &&  props.registrationCode.length > 0){
        await getRegistrationEmail();
      }
    })();
  }, []);

  return (
    <>
      <Form
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit(submitData)}
      >
        <Row>
          <Col md={6} lg={6}>
            <FloatingLabel label="First Name*" className="mb-3">
              <CustomInput
                control={control}
                name="firstName"
                placeholder="First Name*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={6}>
            <FloatingLabel label="Last Name*" className="mb-3">
              <CustomInput
                control={control}
                name="lastName"
                placeholder="Last Name*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={6}>
            <FloatingLabel label="Email*" className="mb-3">
              <CustomInput
                disabled={inviteEmail.length > 0}
                control={control}
                name="email"
                placeholder="Email*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={6}>
            <FloatingLabel label="Cell Phone*" className="mb-3">
              <CustomInput
                control={control}
                name="cellPhone"
                placeholder="Cell Phone*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={6}>
            <FloatingLabel label="Home Phone" className="mb-3">
              <CustomInput
                control={control}
                name="homePhone"
                placeholder="Home Phone"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={6}>
            
          </Col>
          {
            inviteEmail.length > 0 && (
              <>
                <Form.Group controlId="chargeApplicationFee">
                  <FormControl type="hidden" value="false" style={{ display: 'none' }} />
                </Form.Group>
                
                <Form.Group controlId="chargeRegistrationFee">
                  {/* Add a hidden input with a value of 1 */}
                  <FormControl type="hidden" value="false" style={{ display: 'none' }} />
                </Form.Group>
              </>
            )
          }
          
          {
            inviteEmail.length == 0 && (
              <Col md={6} lg={6}>
                <FormLabel>Charge application fee</FormLabel>
                <Form.Group className="mb-4">
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      id="chargeApplicationFee-1"
                      value="true"
                      {...register("chargeApplicationFee")}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      value="false"
                      id="chargeApplicationFee-2"
                      {...register("chargeApplicationFee")}
                    />
                  </div>
                  {errors.chargeApplicationFee && (
                    <ErrorLabel message={errors.chargeApplicationFee.message} />
                  )}
                </Form.Group>
              </Col>)
          }
          { 
            inviteEmail.length == 0 && (
            <Col md={6} lg={6}>
              <FormLabel>Charge registration fee</FormLabel>
              <Form.Group className="mb-4">
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Yes"
                    value="true"
                    id="chargeRegistrationFee-1"
                    {...register("chargeRegistrationFee")}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="No"
                    value="false"
                    id="chargeRegistrationFee-2"
                    {...register("chargeRegistrationFee")}
                  />
                </div>
                {errors.chargeRegistrationFee && (
                  <ErrorLabel message={errors.chargeRegistrationFee.message} />
                )}
              </Form.Group>
            </Col>)
          }
        </Row>
        <Button type="submit" className="btn_main mx-1">
          {
            inviteEmail.length > 0 ? "Register" : "Save"
          }
        </Button>

        {
          inviteEmail.length == 0 && (
            <Button
              type="button"
              className="btn_border mx-1"
              onClick={() => {
                router.push("/admin/parents");
              }}
            >
              Cancel
            </Button>
          )
        }
        
        
      </Form>
      {states.showLoader && <Loader />}
    </>
  );
};
export default AddParent;
