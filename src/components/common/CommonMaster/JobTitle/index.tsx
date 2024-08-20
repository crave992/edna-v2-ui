import ConfirmBox from "@/components/common/ConfirmBox";
import AddJobTitle from "@/components/common/CommonMaster/JobTitle/AddJobTitle";
import Loader from "@/components/common/Loader";
import Pagination from "@/components/common/Pagination";
import Sorting from "@/components/common/Sorting";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { JobTitleDto, JobTitleListResponseDto } from "@/dtos/JobTitleDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import JobTitleListParams from "@/params/JobTitleListParams";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import {
  faPlusCircle,
  faPenToSquare,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useReducer } from "react";
import {
  Row,
  Col,
  Form,
  FloatingLabel,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

const initialPageState: InPageState<JobTitleListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const JobTitle: NextPage<JobTitleListParams> = (props) => {
  useBreadcrumb({
    pageName: "Job Title",
    breadcrumbs: [
      {
        label: "Job Title List",
        link: "/admim/jobTitle",
      },
    ],
  });

  const router = useRouter();

  const [states, dispatch] = useReducer(
    reducer<JobTitleListResponseDto>,
    initialPageState
  );

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<JobTitleListParams>({
    defaultValues: {
      q: props.q,
      page: props.page,
      recordPerPage: props.recordPerPage,
      sortBy: props.sortBy,
      sortDirection: props.sortDirection,
    },
  });

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

  const deleteJobTitle = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.JobTitleService.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Job Title deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
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

  async function actionFunction(p: JobTitleListParams) {
    const qs = require("qs");
    await fetchJobTitle(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchJobTitle = async (p?: JobTitleListParams) => {
    if (!p) {
      p = props;
    }
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.JobTitleService.getAll(p);
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
      fetchJobTitle();
    })();
  }, [states.refreshRequired]);

  const searchJobTitle = async (formData: JobTitleListParams) => {
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

  const updateSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || "";
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });
    setValue("page", 1);
    setValue("q", searchedText);
  };

  const [searchedValue] = useDebounce(getValues().q, 1000);

  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [searchedValue]);

  useEffect(() => {
    (async () => {
      fetchJobTitle();
    })();
  }, [states.refreshRequired]);

  return (
    <>
      <Head>
        <title>Job Title</title>
      </Head>

      <div className="parent_list_page">
        <Row>
          <Col md={12} lg={12}>
            <div className="formBlock">
              <Row>
                <Col md={5}>
                  <Form
                    method="get"
                    autoComplete="off"
                    onSubmit={handleSubmit(searchJobTitle)}
                  >
                    <Form.Control type="hidden" {...register("sortBy")} />
                    <Form.Control
                      type="hidden"
                      {...register("sortDirection")}
                    />
                    <div className="searchSortBlock">
                      <div className="searchBlock">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Search by Job Title..."
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search by Job Title..."
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
                    <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Job
                    Title
                  </Button>
                </Col>
              </Row>

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
                      <th>
                        Job Title
                        <Sorting
                          sortingColumn="name"
                          currentSortingColumn={getValues().sortBy}
                          currentSortDirection={getValues().sortDirection}
                          sortData={sortData}
                        />
                      </th>

                      <th>Added On</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {states.data &&
                      states.data.jobTitle.map((jobTitle: JobTitleDto) => {
                        return (
                          <tr key={jobTitle.id}>
                            <td>{jobTitle.name}</td>
                            <td>
                              {unitOfService.DateTimeService.convertToLocalDate(
                                jobTitle.createdOn
                              )}
                            </td>
                            <td className="text-center">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>Edit</Tooltip>}
                              >
                                <span
                                  className="btn_main small anchor-span"
                                  onClick={() =>
                                    openAddUpdateModal(jobTitle.id)
                                  }
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
                                    openDeleteModal(jobTitle.id);
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
            </div>
          </Col>
        </Row>
      </div>
      {states.showAddUpdateModal && (
        <AddJobTitle
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}
      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteJobTitle}
          bodyText="Are you sure want to delete this title?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}
      {states.showLoader && <Loader />}
    </>
  );
};

export default JobTitle;
