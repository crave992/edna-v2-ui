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
  Container,
  FloatingLabel,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Pagination from "@/components/common/Pagination";
import Sorting from "@/components/common/Sorting";
import Loader from "@/components/common/Loader";
import ConfirmBox from "@/components/common/ConfirmBox";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { StaffTimeTrackingListResponseDto } from "@/dtos/StaffTimeTrackingDto";
import {
  StaffTimeTrackingListParams,
  StaffTimeTrackingListParamsModel,
} from "@/params/StaffTimeTrackingListParams";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import AddTimeTracking from "@/components/common/Staff/TimeTracking/AddTimeTracking";
import RoleDto from "@/dtos/RoleDto";
import { useSession } from "next-auth/react";
import { AdminRoles, Role } from "@/helpers/Roles";
import { StaffBasicDto } from "@/dtos/StaffDto";
import CustomSelect from "../../CustomFormControls/CustomSelect";

const qs = require("qs");

const initialPageState: InPageState<StaffTimeTrackingListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const ListTimeTracking: NextPage<StaffTimeTrackingListParams> = (props) => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    if (session && session.user) {
      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);
      setRoles(roles);
    }
  }, [status]);

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(
    reducer<StaffTimeTrackingListResponseDto>,
    initialPageState
  );

  const initialFromDate = new Date();
  initialFromDate.setDate(initialFromDate.getDate() - 30);

  const { handleSubmit, setValue, getValues, control, register } =
    useForm<StaffTimeTrackingListParamsModel>({
      defaultValues: {
        q: props.q,
        fromDate: props.fromDate
          ? new Date(
              unitOfService.DateTimeService.convertToLocalDate(
                new Date(props.fromDate)
              )
            )
          : initialFromDate,
        toDate: props.fromDate
          ? new Date(
              unitOfService.DateTimeService.convertToLocalDate(
                new Date(props.toDate)
              )
            )
          : new Date(),
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

  const deleteTime = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffTimeTrackingService.delete(
      states.id
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Record deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const submitData = async (formData: StaffTimeTrackingListParamsModel) => {
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

  async function actionFunction(p: StaffTimeTrackingListParamsModel) {
    const qs = require("qs");
    await fetchClockInOut(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchClockInOut = async (p?: StaffTimeTrackingListParamsModel) => {
    if (!p) {
      p = props as unknown as StaffTimeTrackingListParamsModel;
    }

    const params = p as unknown as StaffTimeTrackingListParams;

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffTimeTrackingService.get(params);

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

  useEffect(() => {
    (async () => {
      fetchClockInOut();
    })();
  }, [states.refreshRequired]);

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
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [staffs, setStaff] = useState<StaffBasicDto[]>([]);
  const fetchStaff = async () => {
    const response = await unitOfService.StaffService.getStaffListBasic();
    if (response && response.status === 200 && response.data.data) {
      setStaff(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [searchedValue, fromDate, toDate]);

  useEffect(() => {
    (async () => {
      if (roles && roles.length > 0 && AdminRoles.some( role => roles.includes(role)) ) {
        await fetchStaff();
      }
    })();
  }, [roles]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={9} lg={9}>
            <div className="db_heading_block">
              <h1 className="db_heading">Clock-In/Out Records</h1>
            </div>
          </Col>
          <Col md={3} lg={3} className="text-end">
            {roles && roles.length > 0 && roles.indexOf(Role.Staff) >= 0 && (
              <Button
                className="btn_main"
                type="button"
                onClick={() => openAddUpdateModal(0)}
              >
                <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Record
              </Button>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={12}>
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
                {roles &&
                  roles.length > 0 &&
                  AdminRoles.some( role => roles.includes(role))  && (
                    <Col>
                      <Form.Label>Select Staff</Form.Label>
                      <CustomSelect
                        name="staffId"
                        control={control}
                        placeholder="All"
                        isSearchable={true}
                        options={staffs}
                        textField="name"
                        valueField="id"
                        onChange={(value) => {
                          formSelectChange("staffId", +(value?.[0] || 0));
                        }}
                      />
                    </Col>
                  )}

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>From Date</Form.Label>
                    <CustomInput
                      control={control}
                      type="datepicker"
                      name={"fromDate"}
                      onDateSelect={(selectedDate: string) => {
                        setFromDate(selectedDate);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>To Date</Form.Label>
                    <CustomInput
                      control={control}
                      type="datepicker"
                      name={"toDate"}
                      onDateSelect={(selectedDate: string) => {
                        setFromDate(selectedDate);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
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
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Search by name..."
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Search by name..."
                      {...register("q")}
                      onChange={formInputChange}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Form>

            <div className="tableListItems">
              <div className="formBlock">
                <Table striped hover className="custom_design_table mb-0">
                  <thead>
                    <tr>
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
                        Date
                        <Sorting
                          sortingColumn="date"
                          currentSortingColumn={getValues().sortBy}
                          currentSortDirection={getValues().sortDirection}
                          sortData={sortData}
                        />
                      </th>

                      <th className="text-center">
                        Action
                        <Sorting
                          sortingColumn="action"
                          currentSortingColumn={getValues().sortBy}
                          currentSortDirection={getValues().sortDirection}
                          sortData={sortData}
                        />
                      </th>

                      <th className="text-center">
                        Time
                        <Sorting
                          sortingColumn="time"
                          currentSortingColumn={getValues().sortBy}
                          currentSortDirection={getValues().sortDirection}
                          sortData={sortData}
                        />
                      </th>
                      {roles &&
                        roles.length > 0 &&
                        roles.indexOf(Role.Staff) >= 0 && (
                          <th className="text-center">Action</th>
                        )}
                    </tr>
                  </thead>
                  <tbody>
                    {states.data &&
                      states.data.trackings.map((tracking) => {
                        return (
                          <tr key={tracking.id}>
                            <td>{tracking.staffName}</td>
                            <td>{tracking.trackingDateString}</td>
                            <td className="text-center">{tracking.action}</td>
                            <td className="text-center">
                              {unitOfService.DateTimeService.convertTimeToAmPm(
                                tracking.time
                              )}
                            </td>

                            {roles &&
                              roles.length > 0 &&
                              roles.indexOf(Role.Staff) >= 0 && (
                                <td className="text-center">
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 100 }}
                                    overlay={<Tooltip>Edit</Tooltip>}
                                  >
                                    <span
                                      className="btn_main small anchor-span"
                                      onClick={() =>
                                        openAddUpdateModal(tracking.id)
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
                                        openDeleteModal(tracking.id);
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faTrash}
                                        size="1x"
                                      />
                                    </span>
                                  </OverlayTrigger>
                                </td>
                              )}
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

      {states.showAddUpdateModal && (
        <AddTimeTracking
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteTime}
          bodyText="Are you sure want to delete this record?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default ListTimeTracking;
