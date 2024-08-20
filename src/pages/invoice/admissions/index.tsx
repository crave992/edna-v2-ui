import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faPlusCircle,
  faEye,
  faDollar,
  faRefresh,
  faTrash,
  faInfo,
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
import { StudentInvoiceDto } from '@/dtos/StudentInvoiceDto';

const initialPageState: InPageState<ListResponseDto<StudentInvoiceDto>> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const AdmissionInvoiceList: NextPage<InvoiceListParams> = (props) => {
  useBreadcrumb({
    pageName: 'Student Admission Payment',
    breadcrumbs: [
      {
        label: 'Admin',
        link: '/admin/dashboard',
      },
      {
        label: 'Student Admission Payment',
        link: '/invoice/admissions',
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<ListResponseDto<StudentInvoiceDto>>, initialPageState);

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

    const response = await unitOfService.InvoiceService.getStudentAdmissionPaymentDetails(p);
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
                        <FloatingLabel label="Search by Payment reference id, parent or student name..." className="mb-3">
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
                          Payment Reference Id{' '}
                          <Sorting
                            sortingColumn="paymentreferenceid"
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
                          Payment Date{' '}
                          <Sorting
                            sortingColumn="createdon"
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
                        <th className="text-center">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.data?.data.map((invoice, index) => {
                        return (
                          <tr key={`${invoice.id}-${index}`}>
                            <td>
                              <span className="d-flex justify-content-between">
                              <span>{invoice.parentName}</span>

                                {roleName !== Role.Parent && (
                                  <Link className="me-5" href={`/admin/parents/info/${invoice.parentId}`}>
                                    <FontAwesomeIcon icon={faInfoCircle} className="orange_color" size="1x" />
                                  </Link>
                                )}
                              </span>

                              {invoice.secondParent &&
                                invoice.secondParent.map((sec) => {
                                  return (
                                    <span className="d-flex justify-content-between" key={sec.id}>
                                      <span>{sec.name}</span>
                                      {roleName !== Role.Parent && (
                                        <Link
                                          className="me-5"
                                          href={`/admin/parents/info/${sec.id}`}
                                          title="View Details"
                                        >
                                          <FontAwesomeIcon icon={faInfoCircle} className="orange_color" size="1x" />
                                        </Link>
                                      )}
                                    </span>
                                  );
                                })}
                            </td>

                            <td className="align-middle">{invoice.student.fullName}</td>
                            <td className="align-middle text-center">{invoice.paymentReferenceId}</td>
                            <td className="align-middle text-center">{invoice.paymentMethod}</td>
                            <td className="align-middle text-center">{invoice.createdOnString}</td>                        
                            <td className="align-middle text-center">
                              {unitOfService.CurrencyCodeService.convertToCurrency(invoice.paidAmount)}
                            </td>                            

                            <td className="align-middle text-center">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>View</Tooltip>}
                              >
                                <Link
                                  className="btn_main small anchor-span"
                                  href={roleName === Role.Parent ? `/parent/student/payment/details/${invoice.student.id}`: `/invoice/admissions/payment-details/${invoice.student.id}`}
                                >
                                  <FontAwesomeIcon icon={faInfo} size="1x" />
                                </Link>
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {states.showLoader && <Loader />}
    </>
  );
};

export default AdmissionInvoiceList;

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
