import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer, useState } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import Loader from "../../Loader";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import {
  PickupDropoffParentDto,
  PickupDropoffStudentBasicDto,
} from "@/dtos/PickupDropoffParentDto";
import { PickupDropoffParentModel } from "@/models/PickupDropoffParentModel";
import { PickupDropoffParentValidationSchema } from "@/validation/PickupDropoffParentValidationSchema";
import CustomInput from "../../CustomFormControls/CustomInput";
import ErrorLabel from "../../CustomError/ErrorLabel";
import Link from "next/link";

const initialState: InModalState = {
  modalHeading: "Add Pickup/Drop Off Contact",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddPickupDropoffParentProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddPickupDropoffParent: NextPage<AddPickupDropoffParentProps> = (
  props
) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);
  const [identityProofUrl, setIdentityProofUrl] = useState<string>("");

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<PickupDropoffParentModel>({
    resolver: yupResolver(PickupDropoffParentValidationSchema),
    defaultValues: {
      id: 0,
      name: "",
      relation: "",
      phoneNumber: "",
      isEmergencyContact: "",
      identityProofUrl: "",
      priority: "",
      studentIds: [],

    },
  });

  const [students, setStudents] = useState<PickupDropoffStudentBasicDto[]>([]);
  const fetchPickupDropoffParent = async (id: number) => {
    const response = await unitOfService.PickupDropoffParentService.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      const pickupDropoffParent = response.data.data;
      setStudents(pickupDropoffParent.students || []);
      if (pickupDropoffParent.id > 0) {
        dispatch({
          type: InModalActionType.SET_MODAL_HEADING,
          payload: "Update Pickup/Drop Off Contact",
        });

        dispatch({
          type: InModalActionType.IS_UPDATE,
          payload: true,
        });
      }

      setValue("id", pickupDropoffParent.id);
      setValue("name", pickupDropoffParent.name || "");
      setValue("relation", pickupDropoffParent.relation || "");
      setValue("phoneNumber", pickupDropoffParent.phoneNumber || "");
      setValue("priority", pickupDropoffParent.priority || "");
      setValue("identityProofUrl", pickupDropoffParent.identityProof || "");
      setIdentityProofUrl(pickupDropoffParent.identityProof || "");
      setValue(
        "isEmergencyContact",
        pickupDropoffParent.isEmergencyContact === true ? "true" : "false"
      );
      setIsEmerContact(pickupDropoffParent.isEmergencyContact === true ? "true" : "false");

      
    }
  };

  const submitData = async (data: PickupDropoffParentModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof PickupDropoffParentModel];
      if (key === "identityProof") {
        formData.append(key, data?.[key][0]);
      }else if (key === "studentIds") {
        let finalValue = value;
        formData.append(key, JSON.stringify(finalValue));
      } else {
        formData.append(key, value as string);
      }
    });

    let response: AxiosResponse<Response<PickupDropoffParentDto>>;
    if (states.isUpdate) {
      response = await unitOfService.PickupDropoffParentService.update(
        data.id,
        formData
      );
    } else {
      response = await unitOfService.PickupDropoffParentService.add(formData);
    }

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Contact saved successfully");
      dispatch({
        type: InModalActionType.IS_REFRESH_REQUIRED,
        payload: true,
      });
      props.onClose(true);
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchPickupDropoffParent(props.id);
      }
    })();
  }, []);

  const [isEmerContact, setIsEmerContact] = useState('false');

  const handleisEmergencyContactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue("isEmergencyContact", event.target.value);
    setIsEmerContact(event.target.value);
  };

  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={() => {
          props.onClose(states.refreshRequired);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>{states.modalHeading}</Modal.Title>
        </Modal.Header>
        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
          <Form.Control type="hidden" {...register("id")} />
          <Form.Control type="hidden" {...register("identityProofUrl")} />
          <Modal.Body>
            <FloatingLabel label="Name*" className="mb-3">
              <CustomInput control={control} name="name" placeholder="Name*" />
            </FloatingLabel>

            <FloatingLabel label="Relation*" className="mb-3">
              <CustomInput
                control={control}
                name="relation"
                placeholder="Relation*"
              />
            </FloatingLabel>

            <FloatingLabel label="Phone Number*" className="mb-3">
              <CustomInput
                control={control}
                name="phoneNumber"
                placeholder="Phone Number*"
              />
            </FloatingLabel>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Attach Drivers Licence/ ID*</Form.Label>
              <Form.Control
                type="file"
                {...register("identityProof")}
                readOnly
              />
              {errors.identityProof && (
                <p>
                  <ErrorLabel message={errors.identityProof.message} />
                </p>
              )}

              {identityProofUrl && (
                <div className="mt-3 mb-3">
                  <Link href={identityProofUrl} target="_blank">
                    {
                      identityProofUrl.split("/")[
                        identityProofUrl.split("/").length - 1
                      ]
                    }
                  </Link>
                </div>
              )}

              <Form.Text className="text-muted">
                Please add only JPG/PNG or PDF file in the identity proof.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Make this person an emergency contact</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Yes"
                  {...register("isEmergencyContact")}
                  value="true"
                  type="radio"
                  id="isEmergencyContact-1"
                  onChange={handleisEmergencyContactChange}
                />
                <Form.Check
                  inline
                  label="No"
                  {...register("isEmergencyContact")}
                  value="false"
                  type="radio"
                  id="isEmergencyContact-2"
                  onChange={handleisEmergencyContactChange}
                />
                {errors.isEmergencyContact && (
                  <ErrorLabel message={errors.isEmergencyContact.message} />
                )}
              </div>
            </Form.Group>
            {isEmerContact === 'true' && (
              <Form.Group className="mb-3 select_priority">
                <FloatingLabel label="Select Priority" controlId="floatingInput">
                  <Form.Select
                    {...register("priority")}

                  >
                    <option value="">Select Priority</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Form.Select>
                </FloatingLabel>
              </Form.Group>
            )}
            
            <Row>
              <h5>Authorize Childs</h5>
              {students &&
                students.map((student) => {
                  return (
                    <Col md={12} key={student.id}>
                      <Form.Check
                        inline
                        label={student.name}
                        value={student.id.toString()}
                        defaultChecked={student.isMapped}
                        {...register("studentIds")}
                        type="checkbox"
                        id={`student-${student.id}`}
                      />
                    </Col>
                  );
                })}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_main orange_btn"
              onClick={() => {
                props.onClose(states.refreshRequired);
              }}
            >
              Close
            </Button>
            <Button className="btn_main" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {states.showLoader && <Loader />}
    </>
  );
};

export default AddPickupDropoffParent;
