import CommonProps from "@/models/CommonProps";
import {
  faPenToSquare,
  faPlusCircle,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import {
  Button,
  Col,
  FloatingLabel,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";

import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";

import LevelDto from "@/dtos/LevelDto";
import { useRouter } from "next/router";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import LevelListParams from "@/params/LevelListParams";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useReducer } from "react";
import AddLevel from "@/components/common/CommonMaster/Level/AddLevel";
import ConfirmBox from "@/components/common/ConfirmBox";
import { useDebounce } from "use-debounce";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";

interface LevelPageProps extends CommonProps {
  q: string;
}

const initialPageState: InPageState<LevelDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const LevelPage: NextPage<LevelPageProps> = (props) => {
  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LevelListParams>({
    defaultValues: {
      q: props.q,
    },
  });

  const [states, dispatch] = useReducer(reducer<LevelDto[]>, initialPageState);

  const openAddUpdateModal = (cid: number) => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: cid,
    });

    dispatch({
      type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
      payload: true,
    });
  };

  const closeAddUpdateModal = (isRefresh: boolean) => {
    if (isRefresh) {
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    }

    dispatch({
      type: InPageActionType.SET_ID,
      payload: 0,
    });

    dispatch({
      type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
      payload: false,
    });
  };

  const openDeleteModal = (cid: number) => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: cid,
    });

    dispatch({
      type: InPageActionType.SHOW_DELETE_MODAL,
      payload: true,
    });
  };

  const closeDeleteModal = () => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: 0,
    });

    dispatch({
      type: InPageActionType.SHOW_DELETE_MODAL,
      payload: false,
    });
  };

  const deleteLevel = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.LevelService.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Level deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchLevel = async (q?: LevelListParams) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.LevelService.getAll(q);
    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.SET_DATA,
        payload: response.data.data,
      });
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });
  };

  useEffect(() => {
    (async () => {
      fetchLevel(getValues());
    })();
  }, [states.refreshRequired]);

  const searchLevel = async (formData: LevelListParams) => {
    await actionFunction(formData);
  };

  async function actionFunction(p: LevelListParams) {
    const qs = require("qs");
    await fetchLevel(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const updateSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || "";
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });

    setValue("q", searchedText);
  };

  const [searchedValue] = useDebounce(getValues().q, 1000);

  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [searchedValue]);

  return (
    <>
      <div className="level_page">
        <Row>
          <Col xl={12} xxl={12}>
            <div className="formBlock">
              <Row>
                <Col md={5}>
                  <Form
                    method="get"
                    autoComplete="off"
                    onSubmit={handleSubmit(searchLevel)}
                  >
                    <div className="searchSortBlock">
                      <div className="searchBlock">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Search Level"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search Level"
                            {...register("q")}
                            onChange={updateSearchText}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </Form>
                </Col>
                <Col md={7} className="text-end">
                  <Button
                    className="btn_main"
                    onClick={() => openAddUpdateModal(0)}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Level
                  </Button>
                </Col>
              </Row>
              <Table striped hover className="custom_design_table mb-0">
                <thead>
                  <tr>
                    <th>Level Name</th>
                    <th>From Age</th>
                    <th>To Age</th>
                    <th>Added On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {states.data &&
                    states.data.map((level: LevelDto) => {
                      return (
                        <tr key={level.id}>
                          <td>{level.name}</td>
                          <td>{level.fromAge}</td>
                          <td>{level.toAge}</td>
                          <td>
                            {unitOfService.DateTimeService.convertToLocalDate(
                              level.createdOn
                            )}
                          </td>
                          <td>
                            {level.referenceId === -1 ? (
                              <span></span>
                            ) : (
                                <>
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 100 }}
                                    overlay={<Tooltip>Edit</Tooltip>}
                                  >
                                    <span
                                      className="btn_main small anchor-span"
                                      onClick={() => openAddUpdateModal(level.id)}>
                                      <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        size="1x"
                                      />
                                    </span>
                                  </OverlayTrigger>

                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 100 }}
                                    overlay={<Tooltip>Delete</Tooltip>}>
                                    <span
                                      className="btn_main orange_btn small anchor-span"
                                      onClick={() => {
                                        openDeleteModal(level.id);
                                      }}>
                                      <FontAwesomeIcon icon={faTrash} size="1x" />
                                    </span>
                                  </OverlayTrigger>
                                </>
                            )}
                            
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>

      {states.showAddUpdateModal && (
        <AddLevel
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteLevel}
          bodyText="Are you sure want to delete this level?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}
      {states.showLoader && <Loader />}
    </>
  );
};
export default LevelPage;
