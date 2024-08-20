import { NextPage } from "next";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { faPenToSquare, faPlusCircle, faTrash,} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { Button, Col, FloatingLabel, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import { useRouter } from "next/router";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";
import ConfirmBox from "@/components/common/ConfirmBox";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";

import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import TopicListParams from "@/params/TopicListParams";
import LevelListParams from "@/params/LevelListParams";
import AddMasterTopic from "./AddMasterTopic";
import BulkUploadMasterTopic from "./BulkUploadMasterTopic";
import LevelDto from "@/dtos/LevelDto";
import AreaDto from "@/dtos/AreaDto";
import { TopicListResponseDto } from "@/dtos/TopicDto";


const initialPageState: InPageState<TopicListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const MasterTopicPage: NextPage<TopicListParams> = (props) => {
  const router = useRouter();
  initialPageState.currentPage = props.page;
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<TopicListResponseDto>, initialPageState);

  const { formState, handleSubmit, register, setValue, getValues } =
    useForm<TopicListParams>({
      defaultValues: {
        areaId: props.areaId,
        levelId: props.levelId,
        q: props.q,
        page: props.page,
        recordPerPage: props.recordPerPage,
        sortBy: props.sortBy,
        sortDirection: props.sortDirection,
      },
    });

  const { errors } = formState;

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
    setBulkUpload(false);
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

  const deleteTopic = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.TopicService.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Topic deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const submitData = async (formData: TopicListParams) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });

    formData.page = 1;
    setValue("page", formData.page);

    await actionFunction(formData);
  };

  async function changePage(pageNumber: number) {
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: pageNumber,
    });

    let values = getValues();
    values.page = pageNumber;
    setValue("page", pageNumber);

    await actionFunction(values);
  }

  async function actionFunction(p: TopicListParams) {
    const qs = require("qs");
    await fetchTopic(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchTopic = async (p?: TopicListParams) => {
    if (!p) {
      p = props;
    }
    const response = await unitOfService.TopicService.getAll(p);
    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.SET_DATA,
        payload: response.data.data,
      });

      dispatch({
        type: InPageActionType.SHOW_LOADER,
        payload: false,
      });
    }
  };

  const [levels, setLevel] = useState<LevelDto[]>([]);
  const fetchLevel = async (q?: LevelListParams) => {
    const response = await unitOfService.LevelService.getAll(q);
    if (response && response.status === 200 && response.data.data) {
      setLevel(response.data.data);
    }
  };

  const [areas, setArea] = useState<AreaDto[]>([]);
  const fetchAreaByLevel = async (levelId: number) => {
    const response = await unitOfService.AreaService.getAreaByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setArea(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      fetchTopic();
    })();
  }, [states.refreshRequired]);

  useEffect(() => {
    (async () => {
      fetchTopic();
      fetchLevel();
      fetchAreaByLevel(0);
    })();
  }, []);

  const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.name === "levelId") {
      let levelId = +(e.target.value || 0);
      setValue("levelId", levelId);
      setValue("areaId", 0);
      await fetchAreaByLevel(levelId);
    } else if (e.target.name === "areaId") {
      setValue("areaId", +e.target.value);
    } else if (e.target.name === "recordPerPage") {
      setValue("recordPerPage", +e.target.value);
    }

    setValue("page", 1);
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });
    await actionFunction(getValues());
  }

  const formInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || "";
    setValue("q", searchedText);
    setValue("page", 1);
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });
  };

  const [searchedValue] = useDebounce(getValues().q, 1000);

  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [searchedValue]);


  const [bulkUpload, setBulkUpload] = useState<boolean>(false);
  const openBulkUpdateModal = (bulkUpd: boolean) => {
    setBulkUpload(bulkUpd);
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });
  };


  return (
    <>
      <div className="parent_list_page">
        <div className="formBlock">
          <Row>
            <Col md={12} lg={12}>
              <Form
                method="get"
                autoComplete="off"
                onSubmit={handleSubmit(submitData)}
              >
                <Row>
                  <Col sm={4} md>
                    <Form.Group className="mb-3">
                      <FloatingLabel label="Record Per Page">
                        <Form.Select
                          {...register("recordPerPage")}
                          onChange={formSelectChange}
                        >
                          <RecordPerPageOption />
                        </Form.Select>
                      </FloatingLabel>
                      {errors.recordPerPage && (
                        <ErrorLabel message={errors.recordPerPage.message} />
                      )}
                    </Form.Group>
                  </Col>
                  <Col sm={4} md>
                    <Form.Group className="mb-3">
                      <FloatingLabel label="Level">
                        <Form.Select
                          {...register("levelId")}
                          onChange={formSelectChange}
                        >
                          <option value={0}>All</option>
                          {levels &&
                            levels.map((level) => {
                              return (
                                <option key={level.id} value={level.id}>
                                  {level.name}
                                </option>
                              );
                            })}
                        </Form.Select>
                        {errors.levelId && (
                          <ErrorLabel message={errors.levelId.message} />
                        )}
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                  <Col sm={4} md>
                    <Form.Group className="mb-3">
                      <FloatingLabel label="Area">
                        <Form.Select
                          {...register("areaId")}
                          onChange={formSelectChange}
                        >
                          <option value={0}>All</option>
                          {areas &&
                            areas.map((area) => {
                              return (
                                <option key={area.id} value={area.id}>
                                  {area.name}
                                </option>
                              );
                            })}
                        </Form.Select>
                        {errors.areaId && (
                          <ErrorLabel message={errors.areaId.message} />
                        )}
                      </FloatingLabel>
                    </Form.Group>
                  </Col>

                  <Col sm={4} md>
                    <div className="searchSortBlock">
                      <div className="searchBlock">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Search topic"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search topic"
                            {...register("q")}
                            onChange={formInputChange}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </Col>

                  <Col className="text-end mb-3">
                    <Button
                      className="btn_main mx-1 size_small"
                      type="button"
                      onClick={() => openAddUpdateModal(0)}
                    >
                      <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add
                      Topic
                    </Button>
                    <Button
                      className="btn_main size_small"
                      type="button"
                      onClick={() => openBulkUpdateModal(true)}
                    >
                      <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Upload
                    </Button>
                  </Col>
                </Row>
              </Form>

              <div className="tableListItems">
                <div>
                  {!states.showLoader && (
                    <Pagination
                      className="pagination-bar"
                      currentPage={states.currentPage}
                      totalCount={states.data?.totalRecord}
                      pageSize={getValues().recordPerPage}
                      onPageChange={(page: number) => changePage(page)}
                    />
                  )}
                </div>
                <Table striped hover className="custom_design_table mb-0">
                  <thead>
                    <tr>
                      <th className="align-middle">Level</th>
                      <th className="align-middle">Area</th>
                      <th>Topic Name</th>

                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {states.data &&
                      states.data.topics.map((topic) => {
                        return (
                          <tr key={topic.id}>
                            <td>{topic.level.name}</td>
                            <td>{topic.area.name}</td>
                            <td>{topic.name}</td>
                            <td className="text-center">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>Edit</Tooltip>}
                              >
                                <span
                                  className="btn_main small anchor-span"
                                  onClick={() => openAddUpdateModal(topic.id)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPenToSquare}
                                    size="1x"
                                  />
                                </span>
                              </OverlayTrigger>

                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>Delete</Tooltip>}
                              >
                                <span
                                  className="btn_main orange_btn small anchor-span"
                                  onClick={() => {
                                    openDeleteModal(topic.id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} size="1x" />
                                </span>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <div>
                  {!states.showLoader && (
                    <Pagination
                      className="pagination-bar"
                      currentPage={states.currentPage}
                      totalCount={states.data?.totalRecord}
                      pageSize={getValues().recordPerPage}
                      onPageChange={(page: number) => changePage(page)}
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {states.showAddUpdateModal && (
        <AddMasterTopic
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {bulkUpload && (
        <BulkUploadMasterTopic
          isOpen={bulkUpload}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteTopic}
          bodyText="Are you sure want to delete this area?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default MasterTopicPage;
