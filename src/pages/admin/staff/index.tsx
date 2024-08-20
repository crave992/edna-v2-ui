import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Image,
  ListGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClock,
  faInfo,
  faPenToSquare,
  faPlus,
  faRepeat,
  faTimesCircle,
  faUser,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/pro-solid-svg-icons";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import StaffListParams from "@/params/StaffListParams";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Pagination from "@/components/common/Pagination";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { StaffListResponseDto } from "@/dtos/StaffDto";
import { JobTitleDto } from "@/dtos/JobTitleDto";
import { UserRoleDto } from "@/dtos/UserRoleDto";
import SalaryTypeDto from "@/dtos/SalaryTypeDto";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import { useDebounce } from "use-debounce";
import Loader from "@/components/common/Loader";
import DeactivateStaff from "@/components/common/Staff/StaffStatus/DeactivateStaff";
import ActivateStaff from "@/components/common/Staff/StaffStatus/ActivateStaff";
import ConfirmBox from "@/components/common/ConfirmBox";
import { toast } from "react-toastify";

const initialPageState: InPageState<StaffListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const StaffList: NextPage<StaffListParams> = (props) => {
  useBreadcrumb({
    pageName: "Staff",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Staff",
        link: "/admin/staff/",
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(
    reducer<StaffListResponseDto>,
    initialPageState
  );

  const { handleSubmit, setValue, getValues, control, register } =
    useForm<StaffListParams>({
      defaultValues: {
        q: props.q,
        jobTitleId: props.jobTitleId,
        roleId: props.roleId,
        salaryTypeId: props.salaryTypeId,
        status: props.status || "",
        page: props.page,
        recordPerPage: props.recordPerPage,
        sortBy: props.sortBy,
        sortDirection: props.sortDirection,
      },
    });

  const submitData = async (formData: StaffListParams) => {
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

  async function actionFunction(p: StaffListParams) {
    const qs = require("qs");
    await fetchStaff(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchStaff = async (p?: StaffListParams) => {
    if (!p) {
      p = props;
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffService.getAll(p);
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

  const [jobTitles, setJobTitle] = useState<JobTitleDto[]>([]);
  const fetchJobTitle = async () => {
    const response = await unitOfService.JobTitleService.getAllForDropDown();
    if (response && response.status === 200 && response.data.data) {
      setJobTitle(response.data.data);
    }
  };

  const [roles, setRoles] = useState<UserRoleDto[]>([]);
  const fetchUserRole = async () => {
    const response = await unitOfService.UserRoleService.getAll("");
    if (response && response.status === 200 && response.data.data) {
      setRoles(response.data.data);
    }
  };

  const [salaryType, setSalaryType] = useState<SalaryTypeDto[]>([]);
  const fetchSalaryType = async () => {
    const response = await unitOfService.SalaryTypeService.getAll();
    if (response && response.status === 200 && response.data.data) {
      setSalaryType(response.data.data);
    }
  };  

  useEffect(() => {
    (async () => {
      await fetchJobTitle();
      await fetchUserRole();
      await fetchSalaryType();
      await fetchStaff();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetchStaff();
    })();
  }, [states.refreshRequired]);

  const formSelectChange = async (name: string, value: number | string) => {
    if (name === "jobTitleId") {
      setValue("jobTitleId", +value);
    } else if (name === "roleId") {
      setValue("roleId", +value);
    } else if (name === "salaryTypeId") {
      setValue("salaryTypeId", +value);
    } else if (name === "status") {
      setValue("status", value.toString());
    } else if (name === "recordPerPage") {
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

  const [staffId, setStaffId] = useState<number>(0);
  const [deactivate, setDeactivate] = useState<boolean>(false);
  const deactivateStaff = (staffId: number) => {
    setDeactivate(true);
    setStaffId(staffId);
  };

  const [activate, setActivate] = useState<boolean>(false);
  const [hiredDate, setHiredDate] = useState<Date>(new Date());
  const activateStaff = (staffId: number, hiredDate: Date) => {
    setActivate(true);
    setStaffId(staffId);
    setHiredDate(hiredDate);
  };

  const closeStatusModal = (isRefresh: boolean) => {
    if (isRefresh) {
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    }

    setDeactivate(false);
    setActivate(false);
    setStaffId(0);
  };

  const [activationEmailPopUp, setActivationEmailPopUp] =
    useState<boolean>(false);
  const resendActivationEmail = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StaffService.resendActivationEmail(
      staffId
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
      setStaffId(0);
      setActivationEmailPopUp(false);
      toast.success("Email sent successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const closeActivationEmailPopUp = () => {
    setStaffId(0);
    setActivationEmailPopUp(false);
  };

  return (
    <>
      <Head>
        <title>Staff List - Noorana</title>
      </Head>
      <div className="staff_page">
        <Container fluid>
          <Row>
            <Col lg={12} xl={9} className="mb-4">
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

                <div className="db_heading_block">
                  <h1 className="db_heading">Staff Member List</h1>
                </div>

                <div className="searchSortBlock">
                  <div className="searchBlock">
                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <FloatingLabel label="Record Per Page">
                            <Form.Select
                              {...register("recordPerPage")}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                formSelectChange(
                                  "recordPerPage",
                                  +e.target.value
                                );
                              }}
                            >
                              <RecordPerPageOption />
                            </Form.Select>
                          </FloatingLabel>
                        </Form.Group>
                      </Col>
                      <Col>
                        <FloatingLabel label="" className="mb-3">
                          <CustomSelect
                            name="roleId"
                            control={control}
                            placeholder="Role"
                            isSearchable={true}
                            options={roles}
                            textField="name"
                            valueField="id"
                            onChange={(value) => {
                              formSelectChange("roleId", +(value?.[0] || 0));
                            }}
                          />
                        </FloatingLabel>
                      </Col>
                      <Col>
                        <FloatingLabel label="" className="mb-3">
                          <CustomSelect
                            name="jobTitleId"
                            control={control}
                            placeholder="Job Title"
                            isSearchable={true}
                            options={jobTitles}
                            textField="name"
                            valueField="id"
                            onChange={(value) => {
                              formSelectChange(
                                "jobTitleId",
                                +(value?.[0] || 0)
                              );
                            }}
                          />
                        </FloatingLabel>
                      </Col>
                      <Col>
                        <FloatingLabel label="" className="mb-3">
                          <CustomSelect
                            name="salaryTypeId"
                            control={control}
                            placeholder="Salary Type"
                            isSearchable={true}
                            options={salaryType}
                            textField="name"
                            valueField="id"
                            onChange={(value) => {
                              formSelectChange(
                                "salaryTypeId",
                                +(value?.[0] || 0)
                              );
                            }}
                          />
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FloatingLabel label="" className="mb-3">
                          <CustomSelect
                            name="status"
                            control={control}
                            placeholder="Status"
                            isSearchable={true}
                            options={[
                              { label: "Active", value: "active" },
                              { label: "In Active", value: "inactive" },
                            ]}
                            textField="label"
                            valueField="value"
                            onChange={(value) => {
                              formSelectChange("status", value?.[0] || "");
                            }}
                          />
                        </FloatingLabel>
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
                  </div>
                  <div className="sortBlock"></div>
                </div>
              </Form>
              <div className="tableListItems">
                {!states.showLoader && (
                  <Pagination
                    className="pagination-bar"
                    currentPage={states.currentPage}
                    totalCount={states.data?.totalRecord}
                    pageSize={getValues().recordPerPage}
                    onPageChange={(page: number) => changePage(page)}
                  />
                )}
                {states.data &&
                  states.data?.staff.map((staffs) => {
                    return (
                      <div className="renderStaff" key={staffs.id}>
                        <div className="userDetailsMain">
                          <div className="userAvatar">
                            {staffs.profilePicture ? (
                              <Image
                                fluid
                                alt={staffs.name}
                                src={staffs.profilePicture}
                                style={{ maxWidth: "70px" }}
                              />
                            ) : (
                              <FontAwesomeIcon icon={faUser} size="2x" />
                            )}
                          </div>
                          <div className="userDetails">
                            <h2>{staffs.name}</h2>
                            <p>Job Title: {staffs.jobTitle}</p>
                            <p>Role: {staffs.role}</p>
                            <p>Salary Type: {staffs.salaryType}</p>
                            <p>
                              Hired Date:&nbsp;
                              {unitOfService.DateTimeService.convertToLocalDate(
                                staffs.hiredDate
                              )}
                              |&nbsp;
                              {staffs.isActive === true ? (
                                <span>
                                  <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    size="1x"
                                    className="text-success"
                                  />{" "}
                                  Active
                                </span>
                              ) : (
                                <span>
                                  <FontAwesomeIcon
                                    icon={faTimesCircle}
                                    size="1x"
                                    className="text-danger"
                                  />{" "}
                                  Inactive
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="userActions">
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 100 }}
                            overlay={<Tooltip>Profile</Tooltip>}
                          >
                            <Button
                              className="btn_main small"
                              onClick={() =>
                                router.push(`/admin/staff/info/${staffs.id}`)
                              }
                            >
                              <FontAwesomeIcon icon={faInfo} size="1x" />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 100 }}
                            overlay={<Tooltip>Edit</Tooltip>}
                          >
                            <Button
                              className="btn_main small"
                              onClick={() =>
                                router.push(`/admin/staff/edit/${staffs.id}`)
                              }
                            >
                              <FontAwesomeIcon icon={faPenToSquare} size="1x" />
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 100 }}
                            overlay={<Tooltip>Scheduling</Tooltip>}
                          >
                            <Button
                              className="btn_main small"
                              onClick={() =>
                                router.push(`/admin/staff/scheduling/${staffs.id}`)
                              }
                            >
                              <FontAwesomeIcon icon={faClock} size="1x" />
                            </Button>
                          </OverlayTrigger>

                          {staffs.isActive === true ? (
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Deactivate Staff</Tooltip>}
                            >
                              <Button
                                className="btn_main small"
                                onClick={() => {
                                  deactivateStaff(staffs.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faUserMinus} size="1x" />
                              </Button>
                            </OverlayTrigger>
                          ) : (
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Activate Staff</Tooltip>}
                            >
                              <Button
                                className="btn_main small"
                                onClick={() => {
                                  activateStaff(staffs.id, staffs.hiredDate);
                                }}
                              >
                                <FontAwesomeIcon icon={faUserPlus} size="1x" />
                              </Button>
                            </OverlayTrigger>
                          )}

                          {staffs.registrationStatus &&
                            staffs.registrationStatus.toLocaleLowerCase() ===
                              "pending" && (
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={
                                  <Tooltip>Resend Activation Email</Tooltip>
                                }
                              >
                                <Button
                                  className="btn_main small"
                                  onClick={() => {
                                    setActivationEmailPopUp(true);
                                    setStaffId(staffs.id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faRepeat} size="1x" />
                                </Button>
                              </OverlayTrigger>
                            )}
                        </div>
                      </div>
                    );
                  })}
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
            </Col>
            <Col lg={12} xl={3} className="mb-4">
              <div className="db_heading_block">
                <h1 className="db_heading">Quick Actions</h1>
              </div>
              <div className="db_sidebar_actions">
                <ListGroup>
                  <Link
                    className="sidebar_actions_link"
                    href={"/admin/staff/add/"}
                  >
                    <FontAwesomeIcon icon={faPlus} size="1x" /> Add Staff
                  </Link>
                </ListGroup>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {states.showLoader && <Loader />}

      {deactivate && (
        <DeactivateStaff
          id={staffId}
          isOpen={deactivate}
          onClose={closeStatusModal}
        />
      )}

      {activate && (
        <ActivateStaff
          id={staffId}
          isOpen={activate}
          onClose={closeStatusModal}
          hiredDate={hiredDate}
        />
      )}

      {activationEmailPopUp && (
        <ConfirmBox
          isOpen={activationEmailPopUp}
          onClose={closeActivationEmailPopUp}
          onSubmit={resendActivationEmail}
          bodyText="Are you sure for this action?"
          noButtonText="No"
          yesButtonText="Yes"
        />
      )}
    </>
  );
};
export default StaffList;

export const getServerSideProps: GetServerSideProps<StaffListParams> = async (
  context
) => {
  let initialParamas: StaffListParams = {
    q: `${context.query.q || ""}`,
    status: `${context.query.status || ""}`,
    jobTitleId: +(context.query.jobTitleId || 0),
    roleId: +(context.query.roleId || 0),
    salaryTypeId: +(context.query.salaryTypeId || 0),
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
