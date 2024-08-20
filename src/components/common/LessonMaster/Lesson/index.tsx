import { NextPage } from "next";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";

import {
  faEye,
  faPenToSquare,
  faPlusCircle,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
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

import { useForm } from "react-hook-form";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import { useRouter } from "next/router";
import Loader from "@/components/common/Loader";
import ConfirmBox from "@/components/common/ConfirmBox";
import { toast } from "react-toastify";

import { useDebounce } from "use-debounce";

import LessonListParams from "@/params/LessonListParams";
import AddLesson from "@/components/common/LessonMaster/Lesson/AddLesson";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { LessonListResponseDto } from "@/dtos/LessonDto";
import LevelDto from "@/dtos/LevelDto";
import AreaDto from "@/dtos/AreaDto";
import TopicDto from "@/dtos/TopicDto";
import ViewLesson from "./ViewLesson";
import RecordPerPageOption from "../../RecordPerPageOption";
import Pagination from "../../Pagination";
import BulkUploadLesson from "./BulkUploadLesson";
import LevelListParams from "@/params/LevelListParams";

const initialPageState: InPageState<LessonListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const LessonPage: NextPage<LessonListParams> = (props) => {
  const router = useRouter();
  initialPageState.currentPage = props.page;
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<LessonListResponseDto>, initialPageState);

  const { formState, handleSubmit, register, setValue, getValues } =
    useForm<LessonListParams>({
      defaultValues: {
        areaId: props.areaId,
        levelId: props.levelId,
        topicId: props.topicId,
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

  const [viewLesson, setViewLesson] = useState<boolean>(false);
  const openViewLessonModal = (cid: number) => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: cid,
    });
    setViewLesson(true);
  };

  const closeViewLessonModal = () => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: 0,
    });
    setViewLesson(false);
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

  const deleteLesson = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.LessonService.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Lesson deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const submitData = async (formData: LessonListParams) => {
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

  async function sortData(sortingColumn: string, sortDirection: string) {
    let values = getValues();
    values.sortBy = sortingColumn;
    values.sortDirection = sortDirection;
    setValue("sortBy", sortingColumn);
    setValue("sortDirection", sortDirection);

    await actionFunction(values);
  }

  async function actionFunction(p: LessonListParams) {
    const qs = require("qs");
    await fetchLesson(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchLesson = async (p?: LessonListParams) => {
    if (!p) {
      p = props;
    }
    const response = await unitOfService.LessonService.getAll(p);
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

  const [areas, setArea] = useState<AreaDto[]>([]);
  const fetchAreaByLevel = async (levelId: number) => {
    const response = await unitOfService.AreaService.getAreaByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setArea(response.data.data);
    }
  };

  const [levels, setLevel] = useState<LevelDto[]>([]);
  const fetchLevel = async (q?: LevelListParams) => {
    const response = await unitOfService.LevelService.getAll(q);
    if (response && response.status === 200 && response.data.data) {
      setLevel(response.data.data);
    }
  };

  const [topics, setTopic] = useState<TopicDto[]>([]);
  const fetchTopicByLevelAndArea = async (levelId: number, areaId: number) => {
    const response = await unitOfService.TopicService.getTopicByLevelAndArea(
      levelId,
      areaId
    );
    if (response && response.status === 200 && response.data.data) {
      setTopic(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      fetchLesson();
      fetchLevel();
      fetchAreaByLevel(0);
      fetchTopicByLevelAndArea(0, 0);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      fetchLesson();
    })();
  }, [states.refreshRequired]);

  const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.name === "levelId") {
      let levelId = +(e.target.value || 0);
      setValue("levelId", levelId);
      setValue("areaId", 0);
      setValue("topicId", 0);
      await fetchAreaByLevel(levelId);
      await fetchTopicByLevelAndArea(levelId, getValues().areaId);
    } else if (e.target.name === "areaId") {
      let areaId = +(e.target.value || 0);
      setValue("areaId", areaId);
      setValue("topicId", 0);
      await fetchTopicByLevelAndArea(getValues().levelId, areaId);
    } else if (e.target.name === "topicId") {
      setValue("topicId", +e.target.value);
    } else if (e.target.name === "recordPerPage") {
      setValue("recordPerPage", +e.target.value);
    }
    setValue("page", 1);
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });
    await actionFunction(getValues());
  };

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
                  <Col md={4} lg={3} xl>
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
                  <Col md={4} lg={3} xl>
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
                  <Col md={4} lg={3} xl>
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
                  <Col md={4} lg={3} xl>
                    <Form.Group className="mb-3">
                      <FloatingLabel label="Topic">
                        <Form.Select
                          {...register("topicId")}
                          onChange={formSelectChange}
                        >
                          <option value={0}>All</option>
                          {topics &&
                            topics.map((topic) => {
                              return (
                                <option key={topic.id} value={topic.id}>
                                  {topic.name}
                                </option>
                              );
                            })}
                        </Form.Select>
                        {errors.topicId && (
                          <ErrorLabel message={errors.topicId.message} />
                        )}
                      </FloatingLabel>
                    </Form.Group>
                  </Col>

                  <Col md={4} lg={3} xl>
                    <div className="searchSortBlock">
                      <div className="searchBlock">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Search lesson"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search lesson"
                            {...register("q")}
                            onChange={formInputChange}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </Col>

                  <Col className="text-end mb-3">
                    <Button
                      className="btn_main size_small mx-1 my-1"
                      type="button"
                      onClick={() => openAddUpdateModal(0)}
                    >
                      <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add
                      Lesson
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
                      <th>Level</th>
                      <th>Area</th>
                      <th>Topic</th>
                      <th className="text-center">Seq Name</th>
                      <th className="text-center">Seq Assignment</th>
                      <th className="text-center">Seq Number</th>
                      <th>Lesson Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {states.data &&
                      states.data.lessons.map((lesson) => {
                        return (
                          <tr key={lesson.id}>
                            <td>{lesson.level.name}</td>
                            <td>{lesson.area.name}</td>
                            <td>{lesson.topic.name}</td>
                            <td className="text-center">{lesson.sequenceName}</td>
                            <td className="text-center text-capitalize">{lesson.sequentialAssignment}</td>
                            <td className="text-center">{lesson.sequenceNumber}</td>
                            <td>{lesson.name}</td>
                            <td>
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>View</Tooltip>}
                              >
                                <span
                                  className="btn_main small anchor-span"
                                  onClick={() => openViewLessonModal(lesson.id)}
                                >
                                  <FontAwesomeIcon icon={faEye} size="1x" />
                                </span>
                              </OverlayTrigger>
                              {lesson.referenceId === -1 ? (
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
                                        onClick={() => openAddUpdateModal(lesson.id)}
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
                                          openDeleteModal(lesson.id);
                                        }}
                                      >
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
        <AddLesson
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {viewLesson && (
        <ViewLesson
          id={states.id}
          isOpen={viewLesson}
          onClose={closeViewLessonModal}
        />
      )}

      {bulkUpload && (
        <BulkUploadLesson
          isOpen={bulkUpload}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteLesson}
          bodyText="Are you sure want to delete this lesson?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default LessonPage;
