import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faPlusCircle,
  faEye,
  faDollar,
  faRefresh,
  faTrash,
  faEdit,
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
import RecurringInvoiceItemParams from '@/params/RecurringInvoiceItemParams';
import { RecurringInvoiceItemDto } from '@/dtos/RecurringInvoiceItemDto';
import AddIndividualRecurringInvoiceItem from '@/components/common/Invoice/AddIndividualRecurringInvoiceItem';
import AddDiscountRecurringInvoiceItem from '@/components/common/Invoice/AddDiscountRecurringInvoiceItem';

const initialPageState: InPageState<ListResponseDto<RecurringInvoiceItemDto>> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const RecurringInvoiceItemPage: NextPage<RecurringInvoiceItemParams> = (props) => {
  useBreadcrumb({
    pageName: 'Recurring Invoice Items',
    breadcrumbs: [
      {
        label: 'Admin',
        link: '/admin/dashboard',
      },
      {
        label: 'Invoice',
        link: '/invoice/',
      },
      {
        label: 'Recurring Invoice Items',
        link: '/invoice/recurring-invoice-items',
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<ListResponseDto<RecurringInvoiceItemDto>>, initialPageState);
  const [openIndividualFeeModal, setOpenIndividualFeeModal] = useState<boolean>(false);
  const [openDiscountFeeModal, setOpenDiscountFeeModal] = useState<boolean>(false);
  const [isRefresh, isSetRefresh] = useState<boolean>(false);

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

  const { handleSubmit, setValue, getValues, control, register } = useForm<RecurringInvoiceItemParams>({
    defaultValues: {
      q: props.q,
      page: props.page,
      recordPerPage: props.recordPerPage,
      sortBy: props.sortBy,
      sortDirection: props.sortDirection,
    },
  });

  const submitData = async (formData: RecurringInvoiceItemParams) => {
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
    await fetchRecurringInvoiceItems(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchRecurringInvoiceItems = async (p?: RecurringInvoiceItemParams) => {
    if (!p) {
      p = props;
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.RecurringInvoiceItemService.getAll(p);
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
      await fetchRecurringInvoiceItems();
    })();
  }, [states.refreshRequired, isRefresh]);

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

  const [itemId, setItemId] = useState<number>(0);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<boolean>(false);
  const closeDeleteInvoiceItemModal = () => {
    setConfirmDeleteItem(false);
    setItemId(0);
  };

  const deleteItem = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.RecurringInvoiceItemService.delete(itemId);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteInvoiceItemModal();
      toast.success('Item deleted successfully');
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const showIndividualFeeModal = (itemId: number) => {
    setOpenIndividualFeeModal(true);
    setItemId(itemId);
  };

  const closeIndividualFeeModal = (_isRefresh: boolean) => {
    setOpenIndividualFeeModal(false);
    setItemId(0);
    if (_isRefresh) {
      isSetRefresh(!isRefresh);
    }
  };

  const showDiscountFeeModal = (itemId: number) => {
    setOpenDiscountFeeModal(true);
    setItemId(itemId);
  };

  const closeDiscountFeeModal = (_isRefresh: boolean) => {
    setOpenDiscountFeeModal(false);
    setItemId(0);
    if (_isRefresh) {
      isSetRefresh(!isRefresh);
    }
  };

  return (
    <>
      <Head>
        <title>Recurring Invoice Items - Noorana</title>
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
                        <FloatingLabel label="Search by fee type, fee name and student name..." className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Search by fee type, fee name and student name..."
                            {...register('q')}
                            onChange={formInputChange}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </Col>

                  <Col>
                    <Button className="btn_main" onClick={() => showIndividualFeeModal(0)}>
                      <FontAwesomeIcon icon={faPlusCircle} size="1x" />
                      <span>&nbsp;&nbsp;</span>
                      Add Individual/Special Fee
                    </Button>
                  </Col>

                  <Col>
                    <Button className="btn_main" onClick={() => showDiscountFeeModal(0)}>
                      <FontAwesomeIcon icon={faPlusCircle} size="1x" />
                      <span>&nbsp;&nbsp;</span>
                      Add Discount
                    </Button>
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
                          Student Name
                          <Sorting
                            sortingColumn="name"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th>
                          Fee Type
                          <Sorting
                            sortingColumn="feetype"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th>
                          Fee Name
                          <Sorting
                            sortingColumn="feename"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Quantity
                          <Sorting
                            sortingColumn="quantity"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Amount
                          <Sorting
                            sortingColumn="amount"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">
                          Created On{' '}
                          <Sorting
                            sortingColumn="createdon"
                            currentSortingColumn={getValues().sortBy}
                            currentSortDirection={getValues().sortDirection}
                            sortData={sortData}
                          />
                        </th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.data?.data.map((item, index) => {
                        return (
                          <tr key={`${item.id}-${index}`}>
                            <td>
                              <span className="d-flex justify-content-between">
                                <span>{item.student.name}</span>
                                <Link className="me-5" href={`/students/info/${item.student.id}`}>
                                  <FontAwesomeIcon icon={faInfoCircle} className="orange_color" size="1x" />
                                </Link>
                              </span>
                            </td>

                            <td className="align-middle">{item.feeType}</td>
                            <td className="align-middle">{item.feeName}</td>
                            <td className="align-middle text-center">{item.quantity}</td>
                            <td className="align-middle text-center">
                              {unitOfService.CurrencyCodeService.convertToCurrency(item.amount)}
                            </td>
                            <td className="align-middle text-center">{item.createdOnString}</td>

                            <td className="align-middle text-center">
                              {item.feeType === 'Discount' ? (
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Edit</Tooltip>}
                                >
                                  <span
                                    className="btn_main small anchor-span"
                                    onClick={() => {
                                      showDiscountFeeModal(item.id);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEdit} size="1x" />
                                  </span>
                                </OverlayTrigger>
                              ) : (
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Edit</Tooltip>}
                                >
                                  <span
                                    className="btn_main small anchor-span"
                                    onClick={() => {
                                      showIndividualFeeModal(item.id);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEdit} size="1x" />
                                  </span>
                                </OverlayTrigger>
                              )}

                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>Delete Item</Tooltip>}
                              >
                                <Button
                                  className="btn_main orange_btn small"
                                  onClick={() => {
                                    setConfirmDeleteItem(true);
                                    setItemId(item.id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} size="1x" />
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {states.showLoader && <Loader />}

      {confirmDeleteItem && (
        <ConfirmBox
          isOpen={confirmDeleteItem}
          onClose={closeDeleteInvoiceItemModal}
          onSubmit={deleteItem}
          bodyText="Are you sure want to delete this item?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {openIndividualFeeModal && (
        <AddIndividualRecurringInvoiceItem
          itemId={itemId}
          isOpen={openIndividualFeeModal}
          onClose={closeIndividualFeeModal}
        />
      )}

      {openDiscountFeeModal && (
        <AddDiscountRecurringInvoiceItem
          itemId={itemId}
          isOpen={openDiscountFeeModal}
          onClose={closeDiscountFeeModal}
        />
      )}
    </>
  );
};

export default RecurringInvoiceItemPage;

export const getServerSideProps: GetServerSideProps<InvoiceListParams> = async (context) => {
  let initialParamas: InvoiceListParams = {
    q: `${context.query.q || ''}`,
    page: +(context.query.page || 1),
    recordPerPage: +(context.query.recordPerPage || +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)),
    sortBy: `${context.query.sortBy || 'createdon'}`,
    sortDirection: `${context.query.sortDirection || 'desc'}`,
  };

  return {
    props: initialParamas,
  };
};
