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
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import LevelListParams, { MasterLevelListParams } from "@/params/LevelListParams";
import LevelDto from "@/dtos/LevelDto";
import SepAreaDto from "@/dtos/SepAreaDto";
import SepLevelDto from "@/dtos/SepLevelDto";
import SepTopicModel from "@/models/SepTopicModel";
import SepTopicValidationSchema from "@/validation/SepTopicValidationSchema";
import SepTopicDto from "@/dtos/SepTopicDto";

const initialState: InModalState = {
  modalHeading: "Add SEP Level",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddSepTopicProps extends CommonProps {
  levels?: LevelDto[];
  sepAreass?: SepAreaDto[];
  sepLevel?: SepLevelDto[];
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddMasterSepTopic: NextPage<AddSepTopicProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [sepTopics, dispatch] = useReducer(modalReducer, initialState);

  const fetchSepTopic = async (id: number) => {
    const response = await unitOfService.SepTopicService.getById(id);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let sepTopic = response.data.data;

      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update SEP Topic",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", sepTopic.id);
      setValue("name", sepTopic.name);
      setValue("levelId", sepTopic.level.id);
      setValue("sepAreaId", sepTopic.sepArea.id);
      setValue("sepLevelId", sepTopic.sepLevel.id);
      fetchSepAreaByLevel(sepTopic.level.id);
      fetchSepLevelByAreaAndLevel(sepTopic.level.id, sepTopic.sepArea.id);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchSepTopic(props.id);
      }
    })();
  }, []);

  const { formState, handleSubmit, register, setValue, getValues, control } =
    useForm<SepTopicModel>({
      resolver: yupResolver(SepTopicValidationSchema),
      defaultValues: {
        id: 0,
        name: "",
      },
    });

  const { errors } = formState;

  const submitData = async (formData: SepTopicModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<SepTopicDto>>;
    if (sepTopics.isUpdate) {
      response = await unitOfService.SepTopicService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.SepTopicService.add(formData);
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
      toast.success("SEP topic saved successfully");

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


  const [sepAreas, setSepArea] = useState<SepAreaDto[]>([]);
  const fetchSepAreaByLevel = async (levelId: number) => {
    const response = await unitOfService.SepAreaService.getAreaByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setSepArea(response.data.data);
    }
  };


  const [sepLevels, setSepLevels] = useState<SepLevelDto[]>([]);
  const fetchSepLevelByAreaAndLevel = async (levelId: number, sepAreaId: number) => {
    const response = await unitOfService.SepLevelService.getLevelByLevelAndArea(levelId, sepAreaId);
    if (response && response.status === 200 && response.data.data) {
      setSepLevels(response.data.data)
    }
  };

  useEffect(() => {
    (async () => {
      fetchSepLevelByAreaAndLevel(0, 0);
      fetchLevel();
      fetchSepAreaByLevel(0);
    })();
  }, []);

  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={() => {
          props.onClose(sepTopics.refreshRequired);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>{sepTopics.modalHeading}</Modal.Title>
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
                onChange={(option) => {
                  fetchSepAreaByLevel(+(option?.[0] || 0));
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <CustomSelect
                name="sepAreaId"
                control={control}
                placeholder="SEP Area*"
                isSearchable={true}
                options={sepAreas}
                textField="name"
                valueField="id"
                onChange={(option) => {
                  fetchSepLevelByAreaAndLevel(getValues().levelId, +(option?.[0] || 0));
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <CustomSelect
                name="sepLevelId"
                control={control}
                placeholder="SEP Level*"
                isSearchable={true}
                options={sepLevels}
                textField="name"
                valueField="id"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="SEP Topic Name*">
                <CustomInput
                  control={control}
                  name="name"
                  placeholder="SEP Topic Name*"
                />
              </FloatingLabel>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_main orange_btn"
              onClick={() => {
                props.onClose(sepTopics.refreshRequired);
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

      {sepTopics.showLoader && <Loader />}
    </>
  );
};

export default AddMasterSepTopic;
