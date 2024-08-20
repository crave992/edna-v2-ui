import CommonProps from "@/models/CommonProps";
import SemesterModel from "@/models/SemesterModel";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ErrorLabel from "../../CustomError/ErrorLabel";
import { useEffect, useReducer } from "react";
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
import SemesterValidationSchema from "@/validation/SemesterValidationSchema";
import SemesterDto from "@/dtos/SemesterDto";
import CustomInput from "../../CustomFormControls/CustomInput";

const initialState: InModalState = {
  modalHeading: "Add Semester",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddSemesterProps extends CommonProps {
  semesteryear?: SemesterDto[];
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddSemester: NextPage<AddSemesterProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
  } = useForm<SemesterModel>({
    resolver: yupResolver(SemesterValidationSchema),
    defaultValues: {
      id: 0,
      name: "", 
      year: "",
      semStartDate: new Date(),
      semEndDate: new Date(),
    },
  });

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchSemester = async (id: number) => {
    const response = await unitOfService.SemesterService.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let semester = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Semester",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
      setValue("id", semester.id);
      setValue("name", semester.name);
      setValue("year", semester.year?.toString());

      if (semester.startDate) {
        setValue(
          "semStartDate",
          new Date(unitOfService.DateTimeService.convertToLocalDate(semester.startDate))
        );
      }

      if (semester.endDate) {
        setValue(
          "semEndDate",
          new Date(unitOfService.DateTimeService.convertToLocalDate(semester.endDate))
        );
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchSemester(props.id);
      }
    })();
  }, []);

  const submitData = async (formData: SemesterModel) => {
    
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<SemesterDto>>;
    if (states.isUpdate) {
      response = await unitOfService.SemesterService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.SemesterService.add(formData);
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
      toast.success("Semester saved successfully");
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
          <Modal.Body>
            <Form.Group className="mb-3">
              <FloatingLabel label="Name*">
                <CustomInput
                  control={control}
                  name="name"
                  placeholder="Name*"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="Year*">
                <CustomInput
                  control={control}
                  name="year"
                  placeholder="Year*"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date*</Form.Label>
              <CustomInput
                type="datepicker"
                control={control}
                name="semStartDate"
                placeholder="Start Date*"
                dateFormat="MM/dd/yyyy"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date*</Form.Label>
              <CustomInput
                type="datepicker"
                control={control}
                name="semEndDate"
                placeholder="End Date*"
                dateFormat="MM/dd/yyyy"
              />
            </Form.Group>
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

export default AddSemester;
