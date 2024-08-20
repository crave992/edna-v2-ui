import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import IUnitOfService from "@/services/interfaces/IUnitOfService";

import { NextPage } from "next";
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
import { toast } from "react-toastify";

import ConfirmBox from "@/components/common/ConfirmBox";
import Loader from "@/components/common/Loader";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import StaffPerformanceEvaluationDto, {
  StaffPerformanceEvaluationListResponseDto,
} from "@/dtos/StaffPerformanceEvaluationDto";
import AddStaffPerformanceEvaluation from "./AddStaffPerformanceEvaluation";
import { useForm } from "react-hook-form";
import PaginationParams from "@/params/PaginationParams";
import router from "next/router";
import { useDebounce } from "use-debounce";
import CustomInput from "../../CustomFormControls/CustomInput";
import RecordPerPageOption from "../../RecordPerPageOption";
import Pagination from "../../Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlusCircle,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { useSession } from "next-auth/react";
import RoleDto from "@/dtos/RoleDto";
import { AdminRoles, Role } from "@/helpers/Roles";
import Sorting from "../../Sorting";
import StaffDto from "@/dtos/StaffDto";
import Chart from "react-google-charts";
const qs = require("qs");

interface StaffPerformanceEvaluationProps extends PaginationParams {
  staffId: number;
}

const initialPageState: InPageState<StaffPerformanceEvaluationListResponseDto> =
  {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
  };

export const options = {
  title: "Average Staff Rating",
  chartArea: { width: "80%" },
  isStacked: false,
  legend: { position: "bottom" },
  hAxis: {
    minValue: 0,
  },
};

const StaffPerformanceEvaluation: NextPage<StaffPerformanceEvaluationProps> = (
  props
) => {
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>();
  useEffect(() => {
    if (session && session.user) {
      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);
      setRoles(roles);
      setCurrentUserId(session.user.id.toLocaleLowerCase());
    }
  }, [status]);

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(
    reducer<StaffPerformanceEvaluationListResponseDto>,
    initialPageState
  );

  const { handleSubmit, setValue, getValues, control, register } =
    useForm<PaginationParams>({
      defaultValues: {
        q: props.q,
        page: props.page,
        recordPerPage: props.recordPerPage,
        sortBy: props.sortBy,
        sortDirection: props.sortDirection,
      },
    });

  const submitData = async (formData: PaginationParams) => {
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

  async function actionFunction(p: PaginationParams) {
    if (roles && roles.length > 0) {
      let pageUrl = AdminRoles.some( role => roles.includes(role)) 
          ? `/admin/staff/info/${props.staffId}`
          : `/staff/info`;
      await fetchStaffPerformanceEvaluation(props.staffId, p);
      router.push(
        {
          pathname: pageUrl,
          query: qs.stringify(p),
        },
        undefined,
        { shallow: true }
      );
    }
  }

  const formSelectChange = async (name: string, value: number | string) => {
    if (name === "recordPerPage") {
      setValue("recordPerPage", +value);
    }

    setValue("page", 1);
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });
    await actionFunction(getValues());
  };

  const [searchText, setSearchText] = useState<string>("");
  const formInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || "";
    if (e.target.name === "q") {
      setSearchText(searchedText);
      setValue("q", searchedText);
      setValue("page", 1);
      dispatch({
        type: InPageActionType.SET_CURRENT_PAGE,
        payload: 1,
      });
    }
  };

  const [searchedValue] = useDebounce(searchText, 1000);
  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [searchedValue]);

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

  const deleteStaffPerformanceEvaluation = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.StaffPerformanceEvaluationService.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Rating deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchStaffPerformanceEvaluation = async (
    staffId: number,
    p?: PaginationParams
  ) => {
    if (!p) {
      p = props;
    }
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.StaffPerformanceEvaluationService.getAllByStaffId(
        staffId,
        p
      );
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


  const [chartData, setChartData] = useState<any>([]);
  const fetchStaffPerformanceEvaluationByStaffId = async (staffId: number) => {
    const response = await unitOfService.StaffPerformanceEvaluationService.getByStaffId(staffId);
    if (response && response.status === 200 && response.data.data && response.data.data.length >0 ) {
      const responseData = response.data.data;
      const transformedData: any = responseData.map((item: any) => [
        (new Date(item.ratingDate)).toLocaleString('default', { month: 'long' }),
        parseFloat(item.averageRating),
      ]);
      setChartData([["Month", "Rating"], ...transformedData]);
     }
  }


  useEffect(() => {
    (async () => {
      await fetchStaffPerformanceEvaluation(props.staffId);
      await fetchStaffPerformanceEvaluationByStaffId(props.staffId)
    })();
  }, [states.refreshRequired]);

  const [staff, setStaff] = useState<StaffDto>();
  const fetchStaffBasicDetails = async () => {
    const response = await unitOfService.StaffService.getBasicDetailById(
      props.staffId
    );
    if (response && response.status === 200 && response.data.data) {
      setStaff(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStaffBasicDetails();
    })();
  }, []);

  return (
    <>
      <div className="staff_performance_evaluation">
        <Container fluid>
          <Row>
            <Col md={12} lg={12} xl={9} xxl={8}>
              <Form
                method="get"
                autoComplete="off"
                onSubmit={handleSubmit(submitData)}
              >
                <CustomInput type="hidden" name="sortBy" control={control} />
                <CustomInput
                  type="hidden"
                  name="sortDirection"
                  control={control}
                />

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <FloatingLabel label="Record Per Page">
                        <Form.Select
                          {...register("recordPerPage")}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            formSelectChange("recordPerPage", +e.target.value);
                          }}
                        >
                          <RecordPerPageOption />
                        </Form.Select>
                      </FloatingLabel>
                    </Form.Group>
                  </Col>

                  <Col>
                    <div className="searchSortBlock">
                      <div className="searchBlock">
                        <FloatingLabel
                          label="Search by notes or suggestion"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search by notes or suggestion"
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
                      onClick={() => openAddUpdateModal(0)}
                    >
                      <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add
                      Rating
                    </Button>
                  </Col>
                </Row>
              </Form>

              <div className="tableListItems">
                <div className="formBlock">
                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th className="text-center">
                          BasedOn
                          <Sorting
                            sortingColumn="basedon"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Average Rating
                          <Sorting
                            sortingColumn="avg_rating"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th>Questions</th>
                        <th className="text-center">
                          Notes
                          <Sorting
                            sortingColumn="notes"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Suggestion
                          <Sorting
                            sortingColumn="suggestion"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Rating Date
                          <Sorting
                            sortingColumn="ratingdate"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.data &&
                        states.data.staffPerformanceEvaluations?.map(
                          (staffPerformance: StaffPerformanceEvaluationDto) => {
                            return (
                              <tr key={staffPerformance.id}>
                                <td className="text-center">
                                  {staffPerformance.basedOn}
                                </td>
                                <td className="text-center">
                                  {staffPerformance.averageRating}
                                </td>
                                <td className="align-middle">
                                  {staffPerformance.staffPerformanceEvaluationRatingMapping &&
                                    staffPerformance.staffPerformanceEvaluationRatingMapping?.map(
                                      (mappedQuestion) => {
                                        return (
                                          <span
                                            className="d-flex justify-content-between"
                                            key={
                                              mappedQuestion.performanceEvaluationQuestionId
                                            }
                                          >
                                            <span>
                                              {
                                                mappedQuestion
                                                  .performanceEvaluationQuestion
                                                  ?.questions
                                              }
                                            </span>
                                            <span>{mappedQuestion.rating}</span>
                                          </span>
                                        );
                                      }
                                    )}
                                </td>
                                <td className="text-center">
                                  {staffPerformance.notes}
                                </td>
                                <td className="text-center">
                                  {staffPerformance.suggestion}
                                </td>
                                <td className="text-center">
                                  {unitOfService.DateTimeService.convertToLocalDate(
                                    staffPerformance.ratingDate
                                  )}
                                </td>

                                <td className="text-center">
                                  {roles &&
                                    (AdminRoles.some( role => roles.includes(role))  ||
                                      staffPerformance.addedBy?.toLowerCase() ===
                                        currentUserId) && (
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 100 }}
                                        overlay={<Tooltip>Edit</Tooltip>}
                                      >
                                        <span
                                          className="btn_main small anchor-span"
                                          onClick={() =>
                                            openAddUpdateModal(
                                              staffPerformance.id
                                            )
                                          }
                                        >
                                          <FontAwesomeIcon
                                            icon={faPenToSquare}
                                            size="1x"
                                          />
                                        </span>
                                      </OverlayTrigger>
                                    )}

                                  {roles &&
                                    (AdminRoles.some( role => roles.includes(role))  ||
                                      staffPerformance.addedBy?.toLowerCase() ===
                                        currentUserId) && (
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 100 }}
                                        overlay={<Tooltip>Delete</Tooltip>}
                                      >
                                        <span
                                          className="btn_main orange_btn small anchor-span"
                                          onClick={() => {
                                            openDeleteModal(
                                              staffPerformance.id
                                            );
                                          }}
                                        >
                                          <FontAwesomeIcon
                                            icon={faTrash}
                                            size="1x"
                                          />
                                        </span>
                                      </OverlayTrigger>
                                    )}
                                </td>
                              </tr>
                            );
                          }
                        )}
                    </tbody>
                  </Table>
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
            <Col md={12} lg={12} xl={3} xxl={4}>
              <div className="formBlock">
                <Chart
                  chartType="ColumnChart"
                  width="100%"
                  height="400px"
                  data={chartData}
                  options={options}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {states.showAddUpdateModal && (
        <AddStaffPerformanceEvaluation
          id={states.id}
          staffId={props.staffId}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteStaffPerformanceEvaluation}
          bodyText="Are you sure want to delete this rating?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}
      {states.showLoader && <Loader />}
    </>
  );
};
export default StaffPerformanceEvaluation;
