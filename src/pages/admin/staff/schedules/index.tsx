import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
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
  Table,
  Tooltip,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faDownload,
  faInfo,
  faPenToSquare,
  faUser,
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
import { StaffBasicDto } from "@/dtos/StaffDto";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import { useDebounce } from "use-debounce";
import Loader from "@/components/common/Loader";
import StaffSchedulesParams from "@/params/StaffSchedulesParams";
import { StaffSchedulingDisplayDto, StaffSchedulingDisplayListResponseDto } from "@/dtos/StaffSchedulingDto";
const qs = require("qs");
import { saveAs } from "file-saver";
const XLSX = require("xlsx");

const initialPageState: InPageState<StaffSchedulingDisplayListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const StaffSchedules: NextPage<StaffSchedulesParams> = (props) => {
  useBreadcrumb({
    pageName: "Staff Schedules",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Staff",
        link: "/admin/staff/",
      },
      {
        label: "Staff Schedules",
        link: "/admin/staff/schedules",
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(
    reducer<StaffSchedulingDisplayListResponseDto>,
    initialPageState
  );

  const { handleSubmit, setValue, getValues, control, register } =
    useForm<StaffSchedulesParams>({
      defaultValues: {
        q: props.q,
        staffId: props.staffId,
        page: props.page,
        recordPerPage: props.recordPerPage,
        sortBy: props.sortBy,
        sortDirection: props.sortDirection,
      },
    });

  const submitData = async (formData: StaffSchedulesParams) => {
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

  async function actionFunction(p: StaffSchedulesParams) {
    await fetchSchedules(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchSchedules = async (p?: StaffSchedulesParams) => {
    if (!p) {
      p = props;
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.StaffSchedulingService.getAllStaffScheduling(p);
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

  const [staffs, setStaff] = useState<StaffBasicDto[]>();
  const fetchStaff = async (p?: StaffListParams) => {
    const response = await unitOfService.StaffService.getStaffListBasic();
    if (response && response.status === 200 && response.data.data) {
      setStaff(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStaff();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetchSchedules();
    })();
  }, [states.refreshRequired]);

  const formSelectChange = async (name: string, value: number | string) => {
    if (name === "staffId") {
      setValue("staffId", +value);
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

  const downloadData = async () => {        

    let parameters = getValues();
    parameters.fetchAll = "yes";

    dispatch({
        type: InPageActionType.SHOW_LOADER,
        payload: true,
    });

    let downloadableData: StaffSchedulingDisplayDto[] = [];
    const response = await unitOfService.StaffSchedulingService.getAllStaffScheduling(parameters);
    if (response && response.status === 200 && response.data.data?.schedules) {  
        downloadableData = response.data.data.schedules;
    }

    dispatch({
        type: InPageActionType.SHOW_LOADER,
        payload: false,
    });

    const worksheet = XLSX.utils.json_to_sheet(transformData(downloadableData));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff Member Schedules');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelData, 'staff-member-schedules.xlsx');
  };

  const transformData = (data: StaffSchedulingDisplayDto[]) => {
    const transformedData: any[] = [];

    data.forEach((item) => {
      const workingDays = item.workingDays?.map((day) => {
        const schedules = day.workSchedule?.map((schedule) => {
          return `From ${schedule.fromTime} to ${schedule.toTime}\n`;
        });

        return `${day.name}\n${schedules?.join('\n')}`;
      });

      transformedData.push({
        Name: item.staffName,
        'Working Days': workingDays?.join('\n'),
      });
    });

    return transformedData;
  };

  return (
    <>
      <Head>
        <title>Staff Schedules - Noorana</title>
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
                  <h1 className="db_heading">Staff Member Schedules</h1>
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
                            name="staffId"
                            control={control}
                            placeholder="Select Staff"
                            isSearchable={true}
                            options={staffs}
                            textField="name"
                            valueField="id"
                            onChange={(value) => {
                              formSelectChange("staffId", +(value?.[0] || 0));
                            }}
                          />
                        </FloatingLabel>
                      </Col>
                      <Col>
                        <FloatingLabel
                          controlId="q"
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
                <Table striped hover className="custom_design_table mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="text-center">Work Schedules</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {states.data &&
                      states.data?.schedules.map((schedule) => {
                        return (
                          <tr key={schedule.staffId}>
                            <td>
                              <div
                                className="userDetailsMain"
                                style={{ justifyContent: "flex-start" }}
                              >
                                <div className="userAvatar">
                                  {schedule.profilePicture ? (
                                    <Image
                                      fluid
                                      alt={schedule.staffName}
                                      src={schedule.profilePicture}
                                      style={{ maxWidth: "70px" }}
                                    />
                                  ) : (
                                    <FontAwesomeIcon icon={faUser} size="2x" />
                                  )}
                                </div>
                                <div className="userDetails">
                                  <h2>{schedule.staffName}</h2>
                                </div>
                              </div>
                            </td>
                            <td>
                              {schedule.workingDays &&
                                schedule.workingDays.map((day) => {
                                  return (
                                    <div key={day.id}>
                                      <Table
                                        striped
                                        hover
                                        className="custom_design_table mb-1"
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className="text-center"
                                              colSpan={3}
                                            >
                                              {day.name}
                                            </th>
                                          </tr>
                                        </thead>
                                        {day.workSchedule && (
                                          <tbody>
                                            <tr>
                                              <td className="text-center">
                                                From Time
                                              </td>
                                              <td className="text-center">
                                                To Time
                                              </td>
                                              <td className="text-center">
                                                Notes
                                              </td>
                                            </tr>
                                            {day.workSchedule.map((sch) => {
                                              return (
                                                <tr
                                                  key={`${day.id}-${sch.fromTime}`}
                                                >
                                                  <td className="text-center">
                                                    {sch.fromTime}
                                                  </td>
                                                  <td className="text-center">
                                                    {sch.toTime}
                                                  </td>
                                                  <td className="text-center">
                                                    {sch.notes}
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        )}
                                      </Table>
                                    </div>
                                  );
                                })}
                            </td>
                            <td className="text-center">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>Profile</Tooltip>}
                              >
                                <Button
                                  className="btn_main small"
                                  onClick={() =>
                                    router.push(
                                      `/admin/staff/info/${schedule.staffId}`
                                    )
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
                                    router.push(
                                      `/admin/staff/edit/${schedule.staffId}`
                                    )
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faPenToSquare}
                                    size="1x"
                                  />
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
                                    router.push(
                                      `/admin/staff/scheduling/${schedule.staffId}`
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faClock} size="1x" />
                                </Button>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        );
                      })}
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
            </Col>
            <Col lg={12} xl={3} className="mb-4">
              <div className="db_heading_block">
                <h1 className="db_heading">Quick Actions</h1>
              </div>
              <div className="db_sidebar_actions">
                <ListGroup>
                  <Button
                    className="sidebar_actions_link"
                    onClick={downloadData}
                  >
                    <FontAwesomeIcon icon={faDownload} size="1x" /> Download
                  </Button>
                </ListGroup>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {states.showLoader && <Loader />}
    </>
  );
};
export default StaffSchedules;

export const getServerSideProps: GetServerSideProps<
  StaffSchedulesParams
> = async (context) => {
  let initialParamas: StaffSchedulesParams = {
    q: `${context.query.q || ""}`,
    staffId: +(context.query.staffId || 0),
    page: +(context.query.page || 1),
    fetchAll: "",
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
