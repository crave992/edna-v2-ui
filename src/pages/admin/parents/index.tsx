import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMinus,
  faInfoCircle,
  faPlusCircle,
  faUserPlus,
  faRepeat,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/pro-solid-svg-icons";

import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import {
  Col,
  Container,
  FloatingLabel,
  OverlayTrigger,
  Row,
  Tooltip,
  Form,
  Table,
  Button,
} from "react-bootstrap";
import Head from "next/head";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import ParentListParams from "@/params/ParentListParams";
import { ParentListResponseDto } from "@/dtos/ParentDto";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { useRouter } from "next/router";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import Pagination from "@/components/common/Pagination";
import { toast } from "react-toastify";
import ConfirmBox from "@/components/common/ConfirmBox";
import Loader from "@/components/common/Loader";
import Avatar from "@/components/common/Avatar";

const initialPageState: InPageState<ParentListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const ParentList: NextPage<ParentListParams> = (props) => {
  useBreadcrumb({
    pageName: "Parents",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Parent List",
        link: "/admin/parents/parent-list",
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(
    reducer<ParentListResponseDto>,
    initialPageState
  );

  const { handleSubmit, setValue, getValues, control, register } =
    useForm<ParentListParams>({
      defaultValues: {
        q: props.q,
        status: props.status || "",
        page: props.page,
        recordPerPage: props.recordPerPage,
        sortBy: props.sortBy,
        sortDirection: props.sortDirection,
      },
    });

  const submitData = async (formData: ParentListParams) => {
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

  async function actionFunction(p: ParentListParams) {
    const qs = require("qs");
    await fetchParent(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchParent = async (p?: ParentListParams) => {
    if (!p) {
      p = props;
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.ParentService.getAll(p);
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
      await fetchParent();
    })();
  }, [states.refreshRequired]);

  const formSelectChange = async (name: string, value: number | string) => {
    if (name === "status") {
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

  const [parentId, setParentId] = useState<number>(0);
  const [activationEmailPopUp, setActivationEmailPopUp] =
    useState<boolean>(false);
  const resendActivationEmail = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.ParentService.resendActivationEmail(
      parentId
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
      setParentId(0);
      setActivationEmailPopUp(false);
      toast.success("Email sent successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [deactivate, setDeactivate] = useState<boolean>(false);
  const deactivateParent = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.ParentService.deactivate(parentId);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
      setParentId(0);
      setDeactivate(false);
      toast.success("Account deactivated successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [activate, setActivate] = useState<boolean>(false);
  const activateParent = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.ParentService.activate(parentId);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
      setParentId(0);
      setActivate(false);
      toast.success("Account activated successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Parent List - Noorana</title>
      </Head>
      <div className="parent_list_page">
        <Container fluid>
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

                <div className="db_heading_block">
                  <h1 className="db_heading">Parent List</h1>
                </div>
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
                      <div className="sortBlock">
                        <Row>
                          <Col>
                            <FloatingLabel label="">
                              <CustomSelect
                                name="status"
                                control={control}
                                placeholder="Status"
                                isSearchable={true}
                                options={[
                                  { label: "All", value: "" },
                                  { label: "Active", value: "active" },
                                  { label: "Inactive", value: "inactive" },
                                  {
                                    label: "Registration Pending",
                                    value: "pending",
                                  },
                                  {
                                    label: "Registration Completed",
                                    value: "completed",
                                  },
                                ]}
                                textField="label"
                                valueField="value"
                                onChange={(value) => {
                                  formSelectChange("status", value?.[0] || "");
                                }}
                              />
                            </FloatingLabel>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="searchSortBlock">
                      <div className="searchBlock">
                        <FloatingLabel
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
                      </div>
                    </div>
                  </Col>
                  <Col md={3} className="text-end">
                    <Link href={"/admin/parents/add"} className="btn_main">
                      <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add New Parent
                    </Link>
                  </Col>
                </Row>
              </Form>

              <div className="tableListItems">
                <div className="formBlock">
                  {!states.showLoader && (
                    <Pagination
                      className="pagination-bar"
                      currentPage={states.currentPage}
                      totalCount={states.data?.totalRecord}
                      pageSize={getValues().recordPerPage}
                      onPageChange={(page: number) => changePage(page)}
                    />
                  )}
                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th>Parents/ Guardians</th>
                        <th>Children</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Registration Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.data?.parent.map((parent) => {
                        return (
                          <tr key={parent.id}>
                            <td>
                              <div className="">
                                <Link
                                  href={`/admin/parents/info/${parent.id}`}
                                  className="tw-flex tw-flex-row tw-items-center tw-no-underline tw-text-current"
                                >
                                  <Avatar imageSrc={parent.profilePicture || ''} size={50} edit={false} /> 
                                  {parent.name}
                                </Link>
                              </div>

                              {parent.secondParent &&
                                parent.secondParent.map((sec) => {
                                  return (
                                    <div className="" key={sec.id}>
                                      <Link
                                        href={`/admin/parents/info/${sec.id}`}
                                        className="tw-mt-1 tw-flex tw-flex-row tw-items-center tw-no-underline tw-text-current"
                                      >
                                        <Avatar imageSrc={sec.profilePicture || ''} size={50} edit={false} /> 
                                        <span className="tw-content-center">{sec.name}</span>
                                      </Link>
                                    </div>
                                  );
                                })}
                            </td>
                            <td className="align-middle">
                              {parent.students &&
                                parent.students.map((stud) => {
                                  return (
                                    <div className="" key={stud.id}>
                                      <Link
                                        href={`/students/info/${stud.id}`}
                                        className="tw-flex tw-flex-row tw-items-center tw-no-underline tw-text-current"
                                      >
                                        <Avatar imageSrc={stud.profilePicture || ''} size={50} edit={false} /> 
                                        <span>{stud.name}  {!stud.active && "(Inactive)"}</span>
                                      </Link>
                                    </div>
                                  );
                                })}
                            </td>
                            <td className="text-center align-middle">
                              {parent.isActive === true ? (
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
                            </td>

                            <td className="align-middle text-center">
                              {parent.registrationStatus}
                            </td>

                            <td className="align-middle text-center">
                              {parent.isActive === true ? (
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={
                                    <Tooltip>Deactivate Account</Tooltip>
                                  }
                                >
                                  <Button
                                    className="btn_main small"
                                    onClick={() => {
                                      setDeactivate(true);
                                      setParentId(parent.id);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faUserMinus}
                                      size="1x"
                                    />
                                  </Button>
                                </OverlayTrigger>
                              ) : (
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Activate Account</Tooltip>}
                                >
                                  <Button
                                    className="btn_main small"
                                    onClick={() => {
                                      setActivate(true);
                                      setParentId(parent.id);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faUserPlus}
                                      size="1x"
                                    />
                                  </Button>
                                </OverlayTrigger>
                              )}

                              {parent.registrationStatus &&
                                parent.registrationStatus.toLocaleLowerCase() ===
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
                                        setParentId(parent.id);
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faRepeat}
                                        size="1x"
                                      />
                                    </Button>
                                  </OverlayTrigger>
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {activationEmailPopUp && (
        <ConfirmBox
          isOpen={activationEmailPopUp}
          onClose={() => {
            setParentId(0);
            setActivationEmailPopUp(false);
          }}
          onSubmit={resendActivationEmail}
          bodyText="Are you sure for this action?"
          noButtonText="No"
          yesButtonText="Yes"
        />
      )}

      {activate && (
        <ConfirmBox
          isOpen={activate}
          onClose={() => {
            setParentId(0);
            setActivate(false);
          }}
          onSubmit={activateParent}
          bodyText="Are you sure to activate this account?"
          noButtonText="No"
          yesButtonText="Yes"
        />
      )}

      {deactivate && (
        <ConfirmBox
          isOpen={deactivate}
          onClose={() => {
            setParentId(0);
            setDeactivate(false);
          }}
          onSubmit={deactivateParent}
          bodyText="Are you sure to deactivate this account?"
          noButtonText="No"
          yesButtonText="Yes"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default ParentList;

export const getServerSideProps: GetServerSideProps<ParentListParams> = async (
  context
) => {
  let initialParamas: ParentListParams = {
    q: `${context.query.q || ""}`,
    status: `${context.query.status || ""}`,
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
