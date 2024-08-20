import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faPlusCircle,
  faEye,
  faDollar,
  faRefresh,
  faTrash,
  faMoneyBill,
} from '@fortawesome/pro-solid-svg-icons';

import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Col, Container, FloatingLabel, OverlayTrigger, Row, Tooltip, Form, Table, Button } from 'react-bootstrap';
import Head from 'next/head';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import ParentListParams from '@/params/ParentListParams';
import { InPageActionType, InPageState, reducer } from '@/reducers/InPageAction';
import { useRouter } from 'next/router';
import { container } from '@/config/ioc';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { TYPES } from '@/config/types';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import CustomInput from '@/components/common/CustomFormControls/CustomInput';
import RecordPerPageOption from '@/components/common/RecordPerPageOption';
import Pagination from '@/components/common/Pagination';
import Loader from '@/components/common/Loader';
import InvoiceListParams from '@/params/InvoiceListParams';
import { InvoiceBasicDto } from '@/dtos/InvoiceDto';
import { ListResponseDto } from '@/dtos/ListResponseDto';
import Sorting from '@/components/common/Sorting';
import { Role } from '@/helpers/Roles';
import RoleDto from '@/dtos/RoleDto';
import { useSession } from 'next-auth/react';
import GenerateInvoice from '@/components/common/Invoice/GenerateInvoice';
import ConfirmBox from '@/components/common/ConfirmBox';
import { toast } from 'react-toastify';
import AddDirectPayment from '@/components/common/Invoice/DirectPayment';

const initialPageState: InPageState<ListResponseDto<InvoiceBasicDto>> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const InvoicePage: NextPage<InvoiceListParams> = (props) => {
  useBreadcrumb({
    pageName: 'Invoice',
    breadcrumbs: [
      {
        label: 'Admin',
        link: '/admin/dashboard',
      },
      {
        label: 'Invoice',
        link: '/invoice',
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<ListResponseDto<InvoiceBasicDto>>, initialPageState);

  const { data: session, status } = useSession();

  const [roleName, setRoleName] = useState<string>(Role.Parent);
  useEffect(() => {
    if (session && session.user) {
      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);

      if (roles.indexOf(Role.Parent) >= 0) {
        setRoleName(Role.Parent);
      } else {
        setRoleName('otherrole');
      }
    }
  }, [status]);

  const { handleSubmit, setValue, getValues, control, register } = useForm<InvoiceListParams>({
    defaultValues: {
      q: props.q,
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
    setValue('page', formData.page);

    await actionFunction(formData);
  };

  async function changePage(pageNumber: number) {
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: pageNumber,
    });

    let values = getValues();
    values.page = pageNumber;
    setValue('page', pageNumber);

    await actionFunction(values);
  }

  async function actionFunction(p: ParentListParams) {
    const qs = require('qs');
    await fetchInvoice(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchInvoice = async (p?: InvoiceListParams) => {
    if (!p) {
      p = props;
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.InvoiceService.getAll(p);
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
    setValue('sortBy', sortingColumn);
    setValue('sortDirection', sortDirection);

    await actionFunction(values);
  }

  useEffect(() => {
    (async () => {
      await fetchInvoice();
    })();
  }, [states.refreshRequired]);

  const formSelectChange = async (name: string, value: number | string) => {
    if (name === 'recordPerPage') {
      setValue('recordPerPage', +value);
    }

    setValue('page', 1);
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });
    await actionFunction(getValues());
  };

  const [searchText, setSearchText] = useState<string>('');
  const formInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || '';
    if (e.target.name === 'q') {
      setSearchText(searchedText);
      setValue('q', searchedText);
      setValue('page', 1);
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

  const openGenerateInvoiceModal = (cid: number) => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: cid,
    });

    dispatch({
      type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
      payload: true,
    });
  };

  const closeGenerateInvoiceModal = (isRefresh: boolean) => {
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

  const [confirmResendEmail, setConfirmResendEmail] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<number>(0);
  const closeResendEmailModal = () => {
    setConfirmResendEmail(false);
    setInvoiceId(0);
  };

  const resendEmail = async () => {
    setConfirmResendEmail(false);
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });
    const response = await unitOfService.InvoiceService.resend(invoiceId);
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      if (response.data.data.count > 0) {
        toast.success(response.data.data.message);
      } else {
        toast.error(response.data.data.message);
      }
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [confirmDeleteInvoice, setConfirmDeleteInvoice] = useState<boolean>(false);
  const closeDeleteInvoiceModal = () => {
    setConfirmDeleteInvoice(false);
    setInvoiceId(0);
  };

  const deleteInvoice = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.InvoiceService.delete(invoiceId);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteInvoiceModal();
      toast.success('Invoice deleted successfully');
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [addDirectPayment, setAddDirectPayment] = useState<boolean>(false);
  const closeDirectPaymentModal = (isRefresh: boolean) => {
    if (isRefresh) {
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    }
    setAddDirectPayment(false);
    setInvoiceId(0);
  };

  return (
    <>
      <Head>
        <title>Invoice - Noorana</title>
      </Head>
      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12}>
              <Form method="get" autoComplete="off" onSubmit={handleSubmit(submitData)}>
                <CustomInput type="hidden" name="sortBy" control={control} />
                <CustomInput type="hidden" name="page" control={control} />
                <CustomInput type="hidden" name="sortDirection" control={control} />

                <div className="db_heading_block">
                  <h1 className="db_heading">Invoice</h1>
                </div>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <FloatingLabel label="Record Per Page">
                        <Form.Select
                          {...register('recordPerPage')}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            formSelectChange('recordPerPage', +e.target.value);
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
                        <FloatingLabel label="Search by invoice id, parent name..." className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Search by invoice id, parent name..."
                            {...register('q')}
                            onChange={formInputChange}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </Col>
                  <Col className="text-end">
                    <Link href="/invoice/payments" className="btn_main">
                      <FontAwesomeIcon icon={faDollar} size="1x" /> Payment History
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
                        <th>
                          Parent{' '}
                          <Sorting
                            sortingColumn="parentname"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th>Student</th>
                        <th className="text-center">
                          Invoice Id{' '}
                          <Sorting
                            sortingColumn="invoicenum"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        {/* <th className="text-center">
                          Invoice For{' '}
                          <Sorting
                            sortingColumn="invoicedate"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th> */}
                        <th className="text-center">
                          Created On{' '}
                          <Sorting
                            sortingColumn="createdon"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Sent Date{' '}
                          <Sorting
                            sortingColumn="resenddate"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Amount{' '}
                          <Sorting
                            sortingColumn="amount"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">Discount</th>
                        <th className="text-center">
                          Paid{' '}
                          <Sorting
                            sortingColumn="paidamount"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Open Balance{' '}
                          <Sorting
                            sortingColumn="balanceamount"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.data?.data.map((invoice, index) => {
                        return (
                          <tr key={`${invoice.parentId}-${invoice.id}-${index}`}>
                            <td>
                              <span className="d-flex justify-content-between">
                                <span>{invoice.parentName}</span>
                                <Link className="me-5" href={`/admin/parents/info/${invoice.parentId}`}>
                                  <FontAwesomeIcon icon={faInfoCircle} className="orange_color" size="1x" />
                                </Link>
                              </span>

                              {invoice.secondParent &&
                                invoice.secondParent.map((sec) => {
                                  return (
                                    <span className="d-flex justify-content-between" key={sec.id}>
                                      <span>{sec.name}</span>
                                      <Link
                                        className="me-5"
                                        href={`/admin/parents/info/${sec.id}`}
                                        title="View Details"
                                      >
                                        <FontAwesomeIcon icon={faInfoCircle} className="orange_color" size="1x" />
                                      </Link>
                                    </span>
                                  );
                                })}
                            </td>
                            <td className="align-middle">
                              {invoice.students && (
                                <Table className="custom_design_table mb-0">
                                  <thead>
                                    <tr>
                                      <th>Name</th>
                                      <th className="text-center">Level</th>
                                      <th className="text-center">Program Option</th>
                                      <th className="text-center">View</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {invoice.students.map((stud) => {
                                      return (
                                        <tr key={stud.id}>
                                          <td>{stud.name} {!stud.active && "(Inactive)"}</td>
                                          <td className="text-center">{stud.level?.name}</td>
                                          <td className="text-center">{stud.programOption.name}</td>
                                          <td className="text-center">
                                            <Link href={`/students/info/${stud.id}`} title="View Details">
                                              <FontAwesomeIcon icon={faInfoCircle} className="orange_color" size="1x" />
                                            </Link>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              )}
                            </td>

                            <td className="align-middle text-center">{invoice.invoiceNumber}</td>

                            {/* <td className="align-middle text-center">{invoice.invoiceDateString}</td> */}
                            <td className="align-middle text-center">{invoice.createdOnString}</td>
                            <td className="align-middle text-center">{invoice.resendDateString}</td>

                            <td className="align-middle text-center">
                              {unitOfService.CurrencyCodeService.convertToCurrency(
                                invoice.invoiceTotal - invoice.discount
                              )}
                            </td>

                            <td className="align-middle text-center">
                              {unitOfService.CurrencyCodeService.convertToCurrency(invoice.discount)}
                            </td>

                            <td className="align-middle text-center">
                              {unitOfService.CurrencyCodeService.convertToCurrency(invoice.paidAmount)}
                            </td>

                            <td className="align-middle text-center">
                              {unitOfService.CurrencyCodeService.convertToCurrency(invoice.balanceAmount)}
                            </td>

                            <td className="align-middle text-center">
                              {invoice.id > 0 && (
                                <>
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 100 }}
                                    overlay={<Tooltip>View Invoice</Tooltip>}
                                  >
                                    <Button
                                      className="btn_main small"
                                      onClick={() => {
                                        router.push(`/invoice/details/${invoice.id}`);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faEye} size="1x" />
                                    </Button>
                                  </OverlayTrigger>

                                  {roleName !== Role.Parent && invoice.isBalanceForwarded === false && invoice.balanceAmount > 0 && (
                                    <>
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 100 }}
                                        overlay={<Tooltip>Resend Invoice</Tooltip>}
                                      >
                                        <Button
                                          className="btn_main small"
                                          onClick={() => {
                                            setConfirmResendEmail(true);
                                            setInvoiceId(invoice.id);
                                          }}
                                        >
                                          <FontAwesomeIcon icon={faRefresh} size="1x" />
                                        </Button>
                                      </OverlayTrigger>

                                      {invoice && invoice.paymentReferenceId.length <= 0 && (
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 50, hide: 100 }}
                                          overlay={<Tooltip>Delete Invoice</Tooltip>}
                                        >
                                          <Button
                                            className="btn_main orange_btn small"
                                            onClick={() => {
                                              setConfirmDeleteInvoice(true);
                                              setInvoiceId(invoice.id);
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faTrash} size="1x" />
                                          </Button>
                                        </OverlayTrigger>
                                      )}

                                      {invoice.balanceAmount > 0 && (
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 50, hide: 100 }}
                                          overlay={<Tooltip>Add Direct Payment</Tooltip>}
                                        >
                                          <Button
                                            className="btn_main orange_btn small"
                                            onClick={() => {
                                              setAddDirectPayment(true);
                                              setInvoiceId(invoice.id);
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faDollar} size="1x" />
                                          </Button>
                                        </OverlayTrigger>
                                      )}
                                    </>
                                  )}
                                </>
                              )}

                              {roleName === Role.Parent ? (
                                <></>
                              ) : (
                                <>
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 100 }}
                                    overlay={<Tooltip>Generate Invoice</Tooltip>}
                                  >
                                    <Button
                                      className="btn_main small"
                                      onClick={() => openGenerateInvoiceModal(invoice.parentId)}
                                    >
                                      <FontAwesomeIcon icon={faPlusCircle} size="1x" />
                                    </Button>
                                  </OverlayTrigger>
                                </>
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

      {states.showAddUpdateModal && (
        <GenerateInvoice id={states.id} isOpen={states.showAddUpdateModal} onClose={closeGenerateInvoiceModal} />
      )}

      {confirmResendEmail && (
        <ConfirmBox
          isOpen={confirmResendEmail}
          onClose={closeResendEmailModal}
          onSubmit={resendEmail}
          bodyText="Are you sure want to send invoice in email to parent?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {confirmDeleteInvoice && (
        <ConfirmBox
          isOpen={confirmDeleteInvoice}
          onClose={closeDeleteInvoiceModal}
          onSubmit={deleteInvoice}
          bodyText="Are you sure want to delete this invoice?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {addDirectPayment && (
        <AddDirectPayment id={invoiceId} isOpen={addDirectPayment} onClose={closeDirectPaymentModal} />
      )}
    </>
  );
};

export default InvoicePage;

export const getServerSideProps: GetServerSideProps<InvoiceListParams> = async (context) => {
  let initialParamas: InvoiceListParams = {
    q: `${context.query.q || ''}`,
    page: +(context.query.page || 1),
    recordPerPage: +(context.query.recordPerPage || +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)),
    sortBy: `${context.query.sortBy || 'name'}`,
    sortDirection: `${context.query.sortDirection || 'asc'}`,
  };

  return {
    props: initialParamas,
  };
};
