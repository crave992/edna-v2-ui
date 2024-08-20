import { NextPage } from "next";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";

import {
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
import AreaListParams, { MasterAreaListParams } from "@/params/AreaListParams";
import { useForm } from "react-hook-form";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import { useRouter } from "next/router";
import Pagination from "@/components/common/Pagination";
import Sorting from "@/components/common/Sorting";
import Loader from "@/components/common/Loader";
import ConfirmBox from "@/components/common/ConfirmBox";
import { toast } from "react-toastify";

import { useDebounce } from "use-debounce";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import LevelListParams from "@/params/LevelListParams";
import AddMasterArea from "./AddMasterArea";
import BulkUploadMasterArea from "./BulkUploadMasterArea";
import LevelDto from "@/dtos/LevelDto";
import { AreaListResponseDto } from "@/dtos/AreaDto";

const initialPageState: InPageState<AreaListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const MasterAreaPage: NextPage<AreaListParams> = (props) => {
  const router = useRouter();
  initialPageState.currentPage = props.page;
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<AreaListResponseDto>, initialPageState);

  const { formState, handleSubmit, register, setValue, getValues } =
    useForm<AreaListParams>({
      defaultValues: {
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

  const deleteArea = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.AreaService.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Area deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const submitData = async (formData: AreaListParams) => {
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

  async function actionFunction(p: AreaListParams) {
    const qs = require("qs");
    await fetchArea(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchArea = async (p?: AreaListParams) => {
    if (!p) {
      p = props;
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.AreaService.getAll(p);
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

  

  useEffect(() => {
    (async () => {
      fetchArea();      
    })();
  }, [states.refreshRequired]);


  useEffect(() => {
    (async () => {
      fetchLevel();
      fetchArea();      
    })();
  }, []);

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

  const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.name === "levelId") {
      setValue("levelId", +e.target.value);
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
                <Form.Control type="hidden" {...register("sortBy")} />
                <Form.Control type="hidden" {...register("page")} />
                <Form.Control type="hidden" {...register("sortDirection")} />

                <Row className="align-items-center">
                  <Col md={3}>
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
                  <Col md={3}>
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

                  <Col md={3}>
                    <div className="searchSortBlock">
                      <div className="searchBlock">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Search..."
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search..."
                            {...register("q")}
                            onChange={formInputChange}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </Col>
                  <Col className="text-end">
                    <Button
                      className="btn_main size_small mx-2"
                      type="button"
                      onClick={() => openAddUpdateModal(0)}
                    >
                      <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Area
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
                      <th>
                        Area Name
                        <Sorting
                          sortingColumn="name"
                          currentSortingColumn={getValues().sortBy}
                          currentSortDirection={getValues().sortDirection}
                          sortData={sortData}
                        />
                      </th>

                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {states.data &&
                      states.data?.areas.map((area) => {
                        return (
                          <tr key={area.id}>
                            <td>{area.level.name}</td>
                            <td>{area.name}</td>
                            <td className="text-center">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>Edit</Tooltip>}
                              >
                                <span
                                  className="btn_main small anchor-span"
                                  onClick={() => openAddUpdateModal(area.id)}
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
                                    openDeleteModal(area.id);
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
        <AddMasterArea
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}
      {bulkUpload && (
          <BulkUploadMasterArea
            isOpen={bulkUpload}
            onClose={closeAddUpdateModal}
          />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteArea}
          bodyText="Are you sure want to delete this area?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default MasterAreaPage;
