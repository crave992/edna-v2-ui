import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
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
  Container,
  FloatingLabel,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import StateListParams from "@/params/StateListParams";
import { useForm } from "react-hook-form";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import { useRouter } from "next/router";
import Pagination from "@/components/common/Pagination";
import Sorting from "@/components/common/Sorting";
import Loader from "@/components/common/Loader";
import ConfirmBox from "@/components/common/ConfirmBox";
import { toast } from "react-toastify";
import AddState from "@/components/common/State/AddState";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { useDebounce } from "use-debounce";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { StateListResponseDto } from "@/dtos/StateDto";
import CountryDto from "@/dtos/CountryDto";

const initialPageState: InPageState<StateListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const StatePage: NextPage<StateListParams> = (props) => {
  useBreadcrumb({
    pageName: "State",
    breadcrumbs: [
      {
        label: "State List",
        link: "/superadmin/master/state",
      },
    ],
  });

  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(
    reducer<StateListResponseDto>,
    initialPageState
  );

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
  } = useForm<StateListParams>({
    defaultValues: {
      countryId: props.countryId,
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

  const deleteState = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StateService.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("State deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const submitData = async (formData: StateListParams) => {
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

  async function actionFunction(p: StateListParams) {
    const qs = require("qs");
    await fetchState(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchState = async (p?: StateListParams) => {
    if (!p) {
      p = props;
    }
    const response = await unitOfService.StateService.getAll(p);
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

  const [countries, setCountries] = useState<CountryDto[]>([]);
  const fetchCountry = async (q?: string) => {
    const response = await unitOfService.CountryService.getAll(q);
    if (response && response.status === 200 && response.data.data) {
      setCountries(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      fetchState();
    })();
  }, [states.refreshRequired]);

  useEffect(() => {
    (async () => {
      setValue("countryId", getValues().countryId);
    })();
  }, [countries]);

  useEffect(() => {
    (async () => {
      dispatch({
        type: InPageActionType.SET_CURRENT_PAGE,
        payload: props.page,
      });
      fetchState();
      fetchCountry("");
    })();
  }, []);

  const [searchText, setSearchText] = useState<string>("");
  const formInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || "";
    if (e.target.name === "q") {
      setValue("q", searchedText);
      setValue("page", 1);
      dispatch({
        type: InPageActionType.SET_CURRENT_PAGE,
        payload: 1,
      });
      setSearchText(searchedText);
    }
  };

  const formSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.name === "countryId") {
      setValue("countryId", +e.target.value);
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

  const [searchedValue] = useDebounce(searchText, 1000);

  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [searchedValue]);

  return (
    <>
      <Head>
        <title>State</title>
      </Head>

      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">State List</h1>
              </div>

              <Form
                method="get"
                autoComplete="off"
                onSubmit={handleSubmit(submitData)}
              >
                <Form.Control type="hidden" {...register("sortBy")} />
                <Form.Control type="hidden" {...register("sortDirection")} />

                <Row>
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
                      <FloatingLabel label="Country">
                        <Form.Select
                          {...register("countryId")}
                          onChange={formSelectChange}
                        >
                          <option value={0}>All</option>
                          {countries &&
                            countries.map((country) => {
                              return (
                                <option key={country.id} value={country.id}>
                                  {country.name}
                                </option>
                              );
                            })}
                        </Form.Select>
                        {errors.countryId && (
                          <ErrorLabel message={errors.countryId.message} />
                        )}
                      </FloatingLabel>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <div className="searchSortBlock">
                      <div className="searchBlock">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Search by code, name, country name..."
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search by code, name, country name..."
                            {...register("q")}
                            onChange={formInputChange}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </Col>

                  <Col md={3} className="text-end">
                    <Button
                      className="btn_main"
                      type="button"
                      onClick={() => openAddUpdateModal(0)}
                    >
                      <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add
                      State
                    </Button>
                  </Col>
                </Row>
              </Form>

              <div className="tableListItems">
                <div className="formBlock">
                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th className="align-middle">
                          Code
                          <Sorting
                            sortingColumn="code"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th>
                          Name
                          <Sorting
                            sortingColumn="name"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th>
                          Country
                          <Sorting
                            sortingColumn="countryName"
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
                        states.data.states.map((state) => {
                          return (
                            <tr key={state.id}>
                              <td>{state.code}</td>
                              <td>{state.name}</td>
                              <td>{state.country.name}</td>
                              <td className="text-center">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Edit</Tooltip>}
                                >
                                  <span
                                    className="btn_main small anchor-span"
                                    onClick={() => openAddUpdateModal(state.id)}
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
                                      openDeleteModal(state.id);
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
        </Container>
      </div>

      {states.showAddUpdateModal && (
        <AddState
          id={states.id}
          countries={countries}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteState}
          bodyText="Are you sure want to delete this state?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default StatePage;

export const getServerSideProps: GetServerSideProps<StateListParams> = async (
  context
) => {
  let initialParamas: StateListParams = {
    q: `${context.query.q || ""}`,
    countryId: +(context.query.countryId || 0),
    page: +(context.query.page || 1),
    recordPerPage: +(
      context.query.recordPerPage ||
      +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)
    ),
    sortBy: `${context.query.sortBy || "name"}`,
    sortDirection: `${context.query.sortDirection || "asc"}`,
  };

  return {
    props: initialParamas,
  };
};
