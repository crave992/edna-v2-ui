import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faPlusCircle,
  faEye,
  faFileInvoice,
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
import RecordPerPageOption from "@/components/common/RecordPerPageOption";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";
import InvoiceListParams from "@/params/InvoiceListParams";
import { InvoiceBasicDto } from "@/dtos/InvoiceDto";
import { ListResponseDto } from "@/dtos/ListResponseDto";
import Sorting from "@/components/common/Sorting";
import { Role } from "@/helpers/Roles";
import RoleDto from "@/dtos/RoleDto";
import { useSession } from "next-auth/react";
import PaymentListParams from "@/params/PaymentListParams";
import { InvoicePaymentDto } from "@/dtos/InvoicePaymentDto";
import { faUsd } from "@fortawesome/pro-regular-svg-icons";

const initialPageState: InPageState<ListResponseDto<InvoicePaymentDto>> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const InvoicePaymentPage: NextPage<PaymentListParams> = (props) => {
  useBreadcrumb({
    pageName: "Payments",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Payments",
        link: "/payments",
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(
    reducer<ListResponseDto<InvoicePaymentDto>>,
    initialPageState
  );

  const { data: session, status } = useSession();

  const [roleName, setRoleName] = useState<string>(Role.Parent);
  const [orgId, setOrgId] = useState<number>(0);
  useEffect(() => {
    if (session && session.user) {
      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);
      setOrgId(session.user.organizationId || 0)
      if (roles.indexOf(Role.Parent) >= 0) {
        setRoleName(Role.Parent);
      } else {
        setRoleName("otherrole");
      }
    }
  }, [status]);

  const { handleSubmit, setValue, getValues, control, register } =
    useForm<PaymentListParams>({
      defaultValues: {
        q: props.q,
        page: props.page,
        recordPerPage: props.recordPerPage,
        sortBy: props.sortBy,
        sortDirection: props.sortDirection,
      },
    });

  const submitData = async (formData: PaymentListParams) => {
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

  async function actionFunction(p: PaymentListParams) {
    const qs = require("qs");
    await fetchPayments(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchPayments = async (p?: PaymentListParams) => {
    if (!p) {
      p = props;
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.InvoiceService.getPayments(p);
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

  async function sortData(sortingColumn: string, sortDirection: string) {
    let values = getValues();
    values.sortBy = sortingColumn;
    values.sortDirection = sortDirection;
    setValue("sortBy", sortingColumn);
    setValue("sortDirection", sortDirection);

    await actionFunction(values);
  }

  useEffect(() => {
    (async () => {
      await fetchPayments();
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
  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [searchedValue]);

  return (
    <>
      <Head>
        <title>Payments - Noorana</title>
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
                <CustomInput type="hidden" name="page" control={control} />
                <CustomInput
                  type="hidden"
                  name="sortDirection"
                  control={control}
                />

                <div className="db_heading_block">
                  <h1 className="db_heading">Payments</h1>
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
                      <div className="searchBlock">
                        <FloatingLabel
                          label="Search by invoice number, name, payment method..."
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search by invoice number, name, payment method..."
                            {...register("q")}
                            onChange={formInputChange}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </Col>
                  <Col className="text-end mb-3">
                    {orgId === 1 ? (
                      <>
                        <Link href="/invoice/old-payments" className="btn_main size_small mb-2">
                          <FontAwesomeIcon icon={faUsd} size="1x" /> Payments Before 28 Aug, 2023
                        </Link>
                        <Link href="/invoice" className="btn_main size_small ms-2">
                          <FontAwesomeIcon icon={faFileInvoice} size="1x" /> Invoice
                        </Link>
                      </>
                    ) : (
                        <>
                          <Link href="/invoice" className="btn_main">
                            <FontAwesomeIcon icon={faFileInvoice} size="1x" /> Invoice
                          </Link>
                        </>
                    )}
                    
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
                        <th>
                          Invoice Number{" "}
                          <Sorting
                            sortingColumn="invoicenum"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th>
                          Payment Reference Id
                          <Sorting
                            sortingColumn="referencenum"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Payment Method
                          <Sorting
                            sortingColumn="paymentmethod"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Amount{" "}
                          <Sorting
                            sortingColumn="amount"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Payment Date{" "}
                          <Sorting
                            sortingColumn="paymentdate"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Paid By{" "}
                          <Sorting
                            sortingColumn="paidby"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Status{" "}
                          <Sorting
                            sortingColumn="paymentstatus"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.data?.data.map((payment) => {
                        return (
                          <tr key={payment.id}>
                            <td>
                              {payment.invoiceNumber}
                            </td>                        
                            <td>
                              {payment.paymentReferenceId}
                            </td>                        
                            <td className="text-center">
                              {payment.paymentMethod}
                            </td>                        
                            
                            <td className="text-center">
                              {unitOfService.CurrencyCodeService.convertToCurrency(
                                payment.amount
                              )}
                            </td>

                            <td className="text-center">
                              {payment.paymentDateString}
                            </td> 
                            <td className="text-center">
                              {payment.paidBy}
                            </td> 
                            <td className="text-center">
                              {payment.paymentStatus}
                            </td> 

                            <td className="text-center">
                              {payment.invoiceId > 0 && (
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>View Invoice</Tooltip>}
                                >
                                  <Button
                                    className="btn_main small"
                                    onClick={() => {
                                      router.push(
                                        `/invoice/details/${payment.invoiceId}`
                                      );
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEye} size="1x" />
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

      {states.showLoader && <Loader />}
    </>
  );
};

export default InvoicePaymentPage;

export const getServerSideProps: GetServerSideProps<PaymentListParams> = async (
  context
) => {
  let initialParamas: PaymentListParams = {
    q: `${context.query.q || ""}`,
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
