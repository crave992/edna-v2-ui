import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import Loader from "../../Loader";
import ErrorLabel from "../../CustomError/ErrorLabel";
import PerformanceEvaluationSettingDto from "@/dtos/PerformanceEvaluationSettingDto";
import PerformanceEvaluationSettingValidationSchema from "@/validation/PerformanceEvaluationSettingValidationSchema";
import PerformanceEvaluationSettingModel from "@/models/PerformanceEvaluationSettingModel";

const initialPageState: InPageState<PerformanceEvaluationSettingDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

interface AddPerformanceEvaluationSettingProps extends CommonProps {}

const AddPerformanceEvaluationSetting: NextPage<
  AddPerformanceEvaluationSettingProps
> = () => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(
    reducer<PerformanceEvaluationSettingDto>,
    initialPageState
  );

  const fetchPerformanceEvaluationSetting = async () => {
    const response =
      await unitOfService.PerformanceEvaluationSettingService.get();
    if (response && response.status === 200 && response.data.data) {
      let performanceEvaluationSetting = response.data.data;

      dispatch({
        type: InPageActionType.SET_DATA,
        payload: response.data.data,
      });

      setValue("basedOn", performanceEvaluationSetting.basedOn.toString());
    }
  };

  useEffect(() => {
    (async () => {
      fetchPerformanceEvaluationSetting();
    })();
  }, []);

  const { formState, handleSubmit, register, setValue, control } =
    useForm<PerformanceEvaluationSettingModel>({
      resolver: yupResolver(PerformanceEvaluationSettingValidationSchema),
      defaultValues: {
        basedOn: "",
      },
    });
  const { errors } = formState;

  const submitData = async (formData: PerformanceEvaluationSettingModel) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    let response = await unitOfService.PerformanceEvaluationSettingService.save(
      formData
    );
    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Performance evaluation setting saved successfully");
      dispatch({
        type: InPageActionType.SHOW_LOADER,
        payload: false,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      <div className="medical-condition">
        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
          <Row className="mb-4">
            <Col lg={12}>
              <Form.Label>Based On*:</Form.Label>
              <Form.Group className="mb-3">
                <Form.Check
                  inline
                  label="5 Star"
                  type="radio"
                  id={`5_star`}
                  value={"5"}
                  {...register("basedOn")}
                />
                <Form.Check
                  inline
                  label="10 Star"
                  type="radio"
                  id={`10_star`}
                  value={"10"}
                  {...register("basedOn")}
                />
              </Form.Group>
              {errors.basedOn && (
                <ErrorLabel message={errors.basedOn.message} />
              )}
            </Col>
          </Row>
          <Button type="submit" className="btn_main">
            Save
          </Button>
        </Form>
      </div>
      {states.showLoader && <Loader />}
    </>
  );
};
export default AddPerformanceEvaluationSetting;
