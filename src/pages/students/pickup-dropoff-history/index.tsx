import CustomFormLabel from "@/components/common/CustomFormControls/CustomFormLabel";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import Pagination from "@/components/common/Pagination";
import PickupDropOffDailyUpdate from "@/components/common/Parent/PickupDropOffDailyUpdate";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import Sorting from "@/components/common/Sorting";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import {
  PickUpDropOffStudentWiseBasicDto,
  PickUpDropOffStudentWiseListResponseDto,
} from "@/dtos/PickUpDropOffStudentWiseDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import PickUpDropOffStudentWiseListParams, {
  PickUpDropOffStudentWiseListParamsModel,
} from "@/params/PickUpDropOffStudentWiseListParams";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import {
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
const qs = require("qs");
import AsyncSelect from "react-select/async";
import CustomFormError from "@/components/common/CustomFormControls/CustomFormError";
import { StudentMostBasicDto } from "@/dtos/StudentDto";

const initialPageState: InPageState<PickUpDropOffStudentWiseListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const PickupDropOffHistoryPage: NextPage<PickUpDropOffStudentWiseListParams> = (
  props
) => {
  useBreadcrumb({
    pageName: "Student Profile",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/admin/dashboard",
      },
      {
        label: "Students",
        link: "/students",
      },
      {
        label: "Pickup/DropOff History",
        link: `/students/pickup-dropoff-history`,
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(
    reducer<PickUpDropOffStudentWiseListResponseDto>,
    initialPageState
  );

  const initialFromDate = new Date();
  initialFromDate.setDate(initialFromDate.getDate() - 30);

  const { handleSubmit, setValue, getValues, control, register } =
    useForm<PickUpDropOffStudentWiseListParamsModel>({
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
        studentId: props.studentId,
      },
    });

  const submitData = async (
    formData: PickUpDropOffStudentWiseListParamsModel
  ) => {
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

  async function actionFunction(p: PickUpDropOffStudentWiseListParamsModel) {
    await fetchPickupDropOffHistory(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchPickupDropOffHistory = async (
    p?: PickUpDropOffStudentWiseListParamsModel
  ) => {
    if (!p) {
      p = props as unknown as PickUpDropOffStudentWiseListParamsModel;
    }

    const params = p as unknown as PickUpDropOffStudentWiseListParams;

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.PickUpDropOffStudentWiseService.getAll(
      params
    );

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
      await fetchPickupDropOffHistory();
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
  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [searchedValue, fromDate, toDate]);

  const [students, setStudents] = useState<StudentMostBasicDto[]>([]);
  const fetchStudent = async (
    inputValue: string
  ): Promise<StudentMostBasicDto[]> => {
    if (!inputValue) inputValue = "";

    const response = await unitOfService.StudentService.getMostBasicListing(
      inputValue,
      props.studentId
    );
    if (response && response.status === 200 && response.data.data) {
      setStudents(response.data.data);
      return response.data.data;
    }

    return [];
  };

  useEffect(() => {
    (async () => {
      await fetchStudent("");
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Pickup Drop-Off</title>
      </Head>
      <div className="pickup_authorization_page">
        <Row>
          <Col md={12}>
            <Container fluid>
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
                  <h1 className="db_heading">Pickup Drop-Off History</h1>
                </div>

                <div className="searchSortBlock">
                  <div className="searchBlock">
                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <CustomFormLabel label="Select Student" />

                          <Controller
                            control={control}
                            name="studentId"
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <AsyncSelect
                                  instanceId="studentId"
                                  name={field.name}
                                  ref={field.ref}
                                  value={
                                    students.find(
                                      (stud) => stud.id === field.value
                                    ) || null
                                  }
                                  onChange={(option) => {
                                    field.onChange(option?.id || null);
                                    formSelectChange("studentId", option?.id || 0)
                                  }}
                                  cacheOptions
                                  defaultOptions
                                  loadOptions={fetchStudent}
                                  getOptionValue={(option) =>
                                    option.id.toString()
                                  }
                                  getOptionLabel={(option) => option.name}
                                  placeholder="All"
                                  isClearable={true}
                                  className="react-select-container"
                                  classNamePrefix="react-select"
                                />

                                <CustomFormError error={error} />
                              </>
                            )}
                          />
                        </Form.Group>
                      </Col>
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

              <div>
                <Table striped hover className="custom_design_table mb-0">
                  <thead>
                    <tr>
                      <th>
                        Date{" "}
                        <Sorting
                          sortingColumn="date"
                          currentSortingColumn={getValues().sortBy}
                          currentSortDirection={getValues().sortDirection}
                          sortData={sortData}
                        />
                      </th>
                      <th>
                        Student{" "}
                        <Sorting
                          sortingColumn="name"
                          currentSortingColumn={getValues().sortBy}
                          currentSortDirection={getValues().sortDirection}
                          sortData={sortData}
                        />{" "}
                      </th>
                      <th>
                        Drop-Off By{" "}
                        <Sorting
                          sortingColumn="dropby"
                          currentSortingColumn={getValues().sortBy}
                          currentSortDirection={getValues().sortDirection}
                          sortData={sortData}
                        />
                      </th>
                      <th className="text-center">Drop-Off Time</th>
                      <th>
                        Pickup By{" "}
                        <Sorting
                          sortingColumn="pickupby"
                          currentSortingColumn={getValues().sortBy}
                          currentSortDirection={getValues().sortDirection}
                          sortData={sortData}
                        />
                      </th>
                      <th className="text-center">Pickup Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {states.data &&
                      states.data.contacts.map((picdrop) => {
                        return (
                          <tr key={picdrop.id}>
                            <td>{picdrop.pickupDropOffDateString}</td>
                            <td>{picdrop.studentName}</td>
                            <td>{picdrop.dropOffBy}</td>
                            <td className="text-center">
                              {unitOfService.DateTimeService.convertTimeToAmPm(
                                picdrop.dropOffTime
                              )}
                            </td>
                            <td>{picdrop.pickupBy}</td>
                            <td className="text-center">
                              {unitOfService.DateTimeService.convertTimeToAmPm(
                                picdrop.pickupTime
                              )}
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
            </Container>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PickupDropOffHistoryPage;

export const getServerSideProps: GetServerSideProps<
  PickUpDropOffStudentWiseListParams
> = async (context) => {
  let initialParamas: PickUpDropOffStudentWiseListParams = {
    q: `${context.query.q || ""}`,
    fromDate: `${context.query.fromDate || ""}`,
    toDate: `${context.query.toDate || ""}`,
    page: +(context.query.page || 1),
    parentId: +(context.query.parentId || 0),
    studentId: +(context.query.studentId || 0),
    recordPerPage: +(
      context.query.recordPerPage ||
      +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)
    ),
    sortBy: `${context.query.sortBy || "date"}`,
    sortDirection: `${context.query.sortDirection || "desc"}`,
  };

  return {
    props: initialParamas,
  };
};
