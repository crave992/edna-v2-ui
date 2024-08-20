import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer, useState } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import AreaDto from "@/dtos/AreaDto";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import LevelDto from "@/dtos/LevelDto";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import SepAreaModel from "@/models/SepAreaModel";
import SepAreaValidationSchema from "@/validation/SepAreaValidationSchema";
import ErrorLabel from "../../CustomError/ErrorLabel";
import LevelListParams from "@/params/LevelListParams";
import SepAreaDto from "@/dtos/SepAreaDto";

const initialState: InModalState = {
  modalHeading: "Add SEP Area",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddSepAreaProps extends CommonProps {
  levels?: LevelDto[];
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddSepArea: NextPage<AddSepAreaProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [sepAreas, dispatch] = useReducer(modalReducer, initialState);

  const fetchSepArea = async (id: number) => {
    const response = await unitOfService.SepAreaService.getById(id);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let sepArea = response.data.data;

      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update SEP Area",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", sepArea.id);
      setValue("name", sepArea.name);
      setValue("levelId", sepArea.levelId);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchSepArea(props.id);
      }
    })();
  }, []);

  const { formState, handleSubmit, register, setValue, control } =
    useForm<SepAreaModel>({
      resolver: yupResolver(SepAreaValidationSchema),
      defaultValues: {
        id: 0,
        name: "",
      },
    });

  const { errors } = formState;

  const submitData = async (formData: SepAreaModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<SepAreaDto>>;
    if (sepAreas.isUpdate) {
      response = await unitOfService.SepAreaService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.SepAreaService.add(formData);
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
      toast.success("Sep area saved successfully");

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


  const [levels, setLevel] = useState<LevelDto[]>([]);
  const fetchLevel = async (q?: LevelListParams) => {
    const response = await unitOfService.LevelService.getAll(q);
    if (response && response.status === 200 && response.data.data) {
      setLevel(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchLevel();
      }
    })();
  }, []);

  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={() => {
          props.onClose(sepAreas.refreshRequired);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>{sepAreas.modalHeading}</Modal.Title>
        </Modal.Header>
        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
          <Form.Control type="hidden" {...register("id")} />
          <Modal.Body>
            <Form.Group className="mb-3">
              <CustomSelect
                name="levelId"
                control={control}
                placeholder="Class Level*"
                isSearchable={true}
                options={levels}
                textField="name"
                valueField="id"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="SEP Area Name*">
                <CustomInput
                  control={control}
                  name="name"
                  placeholder="SEP Area Name*"
                />
              </FloatingLabel>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_main orange_btn"
              onClick={() => {
                props.onClose(sepAreas.refreshRequired);
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
      {sepAreas.showLoader && <Loader />}
    </>
  );
};

export default AddSepArea;
