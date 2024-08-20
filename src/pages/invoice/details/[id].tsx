import { GetServerSideProps, NextPage } from 'next';
import { Button, Col, Container, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import Head from 'next/head';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import { useRouter } from 'next/router';
import { container } from '@/config/ioc';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { TYPES } from '@/config/types';
import { Fragment, useEffect, useState } from 'react';
import Loader from '@/components/common/Loader';
import { InvoiceDto } from '@/dtos/InvoiceDto';
import { Role } from '@/helpers/Roles';
import RoleDto from '@/dtos/RoleDto';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollar, faEdit, faEye, faInfoCircle, faPlusCircle, faTrash } from '@fortawesome/pro-solid-svg-icons';
import PayNowInvoice from '@/components/common/Invoice/PayNow';
import AddIndividualFee from '@/components/common/Invoice/AddIndividualFee';
import { toast } from 'react-toastify';
import ConfirmBox from '@/components/common/ConfirmBox';
import AddDiscount from '@/components/common/Invoice/AddDiscount';

interface InvoiceDetailsPageParams {
  id: number;
}

const InvoiceDetailsPage: NextPage<InvoiceDetailsPageParams> = (props) => {
  useBreadcrumb({
    pageName: 'Invoice Details',
    breadcrumbs: [
      {
        label: 'Admin',
        link: '/admin/dashboard',
      },
      {
        label: 'Invoice',
        link: `/invoice`,
      },
      {
        label: 'Invoice Details',
        link: `/invoice/details/${props.id}`,
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

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

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<InvoiceDto>();
  const fetchInvoice = async (id: number) => {
    setShowLoader(true);
    const response = await unitOfService.InvoiceService.details(id);
    setShowLoader(false);
    if (response && response.status === 200 && response.data.data) {
      setInvoice(response.data.data);
    }
  };

  const [openPayNowModal, setOpenPayNowModal] = useState<boolean>(false);
  const [openIndividualFeeModal, setOpenIndividualFeeModal] = useState<boolean>(false);
  const [openDiscountFeeModal, setOpenDiscountFeeModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemId, setItemId] = useState<number>(0);
  const [parentId, setParentId] = useState<number>(0);
  const [isRefresh, isSetRefresh] = useState<boolean>(false);

  const closePayNowModal = (_isRefresh: boolean) => {
    setOpenPayNowModal(false);
    if (_isRefresh) {
      isSetRefresh(!isRefresh);
    }
  };

  const showIndividualFeeModal = (parentId: number, itemId: number) => {
    setOpenIndividualFeeModal(true);
    setParentId(parentId);
    setItemId(itemId);
  };

  const closeIndividualFeeModal = (_isRefresh: boolean) => {
    setOpenIndividualFeeModal(false);
    setParentId(0);
    setItemId(0);
    if (_isRefresh) {
      isSetRefresh(!isRefresh);
    }
  };

  const showDiscountFeeModal = (parentId: number, itemId: number) => {
    setOpenDiscountFeeModal(true);
    setParentId(parentId);
    setItemId(itemId);
  };

  const closeDiscountFeeModal = (_isRefresh: boolean) => {
    setOpenDiscountFeeModal(false);
    setParentId(0);
    setItemId(0);
    if (_isRefresh) {
      isSetRefresh(!isRefresh);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchInvoice(props.id);
    })();
  }, [props.id, isRefresh]);

  const openDeleteModal = (itemId: number) => {
    setShowDeleteModal(true);
    setItemId(itemId);
  };
  const closeDeleteModal = (_isRefresh: boolean) => {
    setShowDeleteModal(false);
    setParentId(0);
    setItemId(0);
    if (_isRefresh) {
      isSetRefresh(!isRefresh);
    }
  };

  const deleteInvoiceItem = async () => {
    setShowLoader(true);
    const response = await unitOfService.InvoiceService.deleteInvoiceItemById(invoice?.id || 0, itemId);
    setShowLoader(false);

    if (response && response.status === 200) {
      closeDeleteModal(true);
      toast.success('Item deleted successfully');
      await fetchInvoice(props.id);
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Invoice Details - Noorana</title>
      </Head>
      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12}>
              <div className="tableListItems">
                <div className="formBlock">
                  <Table striped hover className="custom_design_table mb-0">
                    <tbody>
                      <tr>
                        <td colSpan={2}>
                          <Table>
                            <tbody>
                              <tr>
                                <th>Invoice Number</th>
                                <td>{invoice?.invoiceNumber}</td>
                              </tr>
                              {/* <tr>
                                <th>Invoice For Month</th>
                                <td>{invoice?.invoiceDateString}</td>
                              </tr> */}
                              <tr>
                                <th>Created On</th>
                                <td>{invoice?.createdOnString}</td>
                              </tr>
                              <tr>
                                <th>Sent Date</th>
                                <td>{invoice?.resendDateString}</td>
                              </tr>
                              <tr>
                                <th>Parent Name</th>
                                <td>
                                  {invoice?.parent.name}
                                  {roleName !== Role.Parent && (
                                    <>
                                      <span>&nbsp;&nbsp;&nbsp;</span>
                                      <Link
                                        className="me-5"
                                        href={`/admin/parents/info/${invoice?.parent.id}`}
                                        title="View Details"
                                        target="_blank"
                                      >
                                        <FontAwesomeIcon icon={faInfoCircle} className="orange_color" size="1x" />
                                      </Link>
                                    </>
                                  )}
                                </td>
                              </tr>
                              {invoice?.payment &&
                                invoice?.payment.map((payment) => (
                                  <Fragment key={payment.paymentReferenceId}>
                                    {/* <tr>
                                      <th>Payment Status</th>
                                      <td>{payment.paymentStatus}</td>
                                    </tr> */}
                                    <tr>
                                      <th>Payment Reference Id</th>
                                      <td>
                                        <Link
                                          className="me-5"
                                          href={`/invoice/payments?q=${payment.paymentReferenceId}`}
                                          title="View Details"
                                          target="_blank"
                                        >
                                          {payment.paymentReferenceId}
                                        </Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <th>Payment Method</th>
                                      <td>{payment.paymentMethod}</td>
                                    </tr>
                                    <tr>
                                      <th>Payment Date</th>
                                      <td>{payment.paymentDateString}</td>
                                    </tr>
                                  </Fragment>
                                ))}
                            </tbody>
                          </Table>
                        </td>
                        <td colSpan={2}>
                          <Table>
                            <thead>
                              <tr>
                                <th colSpan={2} className="text-center">
                                  Amount Details
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Subtotal</th>
                                <td>
                                  {unitOfService.CurrencyCodeService.convertToCurrency(
                                    invoice?.invoiceItems.reduce((acc, item) => {
                                      const amountToAdd = item.feeType === 'Discount' ? 0 : item.amount;
                                      return acc + amountToAdd;
                                    }, 0) || 0
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Discount</th>
                                <td>-{unitOfService.CurrencyCodeService.convertToCurrency(invoice?.discount || 0)}</td>
                              </tr>
                              {invoice && invoice.discount > 0 && (
                                <tr>
                                  <th>Subtotal After Discount</th>
                                  <td>
                                    {unitOfService.CurrencyCodeService.convertToCurrency(
                                      (invoice?.invoiceItems.reduce((acc, item) => {
                                        const amountToAdd = item.feeType === 'Discount' ? 0 : item.amount;
                                        return acc + amountToAdd;
                                      }, 0) || 0) - invoice.discount
                                    )}
                                  </td>
                                </tr>
                              )}
                              <tr>
                                <th>Tax</th>
                                <td>{unitOfService.CurrencyCodeService.convertToCurrency(invoice?.tax || 0)}</td>
                              </tr>
                              <tr>
                                <th>Card Processing Fee</th>
                                <td>
                                  {unitOfService.CurrencyCodeService.convertToCurrency(invoice?.cardProcessingFee || 0)}
                                </td>
                              </tr>
                              <tr>
                                <th>Invoice Total</th>
                                <td>
                                  {unitOfService.CurrencyCodeService.convertToCurrency(
                                    (invoice?.invoiceTotal || 0) - (invoice?.discount || 0) || 0
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Paid</th>
                                <td>{unitOfService.CurrencyCodeService.convertToCurrency(invoice?.paidAmount || 0)}</td>
                              </tr>
                              <tr>
                                <th>Balance</th>
                                <td>
                                  {unitOfService.CurrencyCodeService.convertToCurrency(invoice?.balanceAmount || 0)}
                                </td>
                              </tr>

                              {invoice && invoice.isBalanceForwarded === true && invoice.forwardToInvoice && (
                                <tr>
                                  <th colSpan={2}>
                                    <div className="text-center">
                                        
                                      <span>Balance forwarded to invoice </span>                                    
                                      <Link
                                        className="me-5"
                                        href={`/invoice/details/${invoice.forwardToInvoice?.id}`}
                                        title="View Details"
                                        target="_blank"
                                      >
                                        {invoice.forwardToInvoice.invoiceNumber}
                                      </Link>
                                    </div>
                                  </th>
                                </tr>
                              )}

                              {invoice &&
                              invoice.balanceAmount &&
                              invoice.balanceAmount > 0 &&
                              invoice.isBalanceForwarded === false &&
                              roleName === Role.Parent ? (
                                <>
                                  <tr>
                                    <td colSpan={2}>
                                      <div className="text-center">
                                        <Button className="btn_main" onClick={() => setOpenPayNowModal(true)}>
                                          <FontAwesomeIcon icon={faDollar} size="1x" />
                                          Pay Now
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                ''
                              )}

                              {roleName !== Role.Parent &&
                              invoice &&
                              invoice.isBalanceForwarded === false &&
                              (invoice.balanceAmount > 0 ||
                                !invoice.invoiceItems ||
                                invoice.invoiceItems.length <= 0) ? (
                                <>
                                  <tr>
                                    <td>
                                      <div className="text-center">
                                        <Button
                                          className="btn_main"
                                          onClick={() => showIndividualFeeModal(invoice?.parent.id || 0, 0)}
                                        >
                                          <FontAwesomeIcon icon={faPlusCircle} size="1x" />
                                          <span>&nbsp;&nbsp;</span>
                                          Add Individual/Special Fee
                                        </Button>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-center">
                                        <Button
                                          className="btn_main"
                                          onClick={() => showDiscountFeeModal(invoice?.parent.id || 0, 0)}
                                        >
                                          <FontAwesomeIcon icon={faPlusCircle} size="1x" />
                                          <span>&nbsp;&nbsp;</span>
                                          Add Discount
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                ''
                              )}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>

            <Col md={12} lg={12}>
              <div className="tableListItems">
                <div className="formBlock">
                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Amount</th>
                        {roleName !== Role.Parent &&
                        invoice &&
                        invoice.balanceAmount &&
                        invoice.balanceAmount > 0 &&
                        invoice.isBalanceForwarded === false ? (
                          <td className="text-center">Action</td>
                        ) : (
                          ''
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {invoice && invoice.invoiceItems && (
                        <>
                          {invoice?.invoiceItems?.map((item) => (
                            <tr key={item.id}>
                              <td>{item.feeType}</td>
                              <td>
                                <span>{item.feeName}</span>
                                {item.itemAddedOnString && item.feeType === 'Individual Fee' && (
                                  <span style={{ color: '#f3620f' }}> (On Date: {item.itemAddedOnString})</span>
                                )}
                              </td>
                              <td className="text-center">{item.quantity}</td>
                              <td className="text-center">
                                {item.feeType === 'Discount' ? (
                                  <span>-{unitOfService.CurrencyCodeService.convertToCurrency(item.amount)}</span>
                                ) : (
                                  <span>{unitOfService.CurrencyCodeService.convertToCurrency(item.amount)}</span>
                                )}
                              </td>
                              {roleName !== Role.Parent &&
                              invoice &&
                              invoice.isBalanceForwarded === false &&
                              invoice.balanceAmount &&
                              invoice.balanceAmount > 0 ? (
                                <>
                                  {item.feeType === 'Individual Fee' || item.feeType === 'Discount' ? (
                                    <td className="text-center">
                                      {item.feeType === 'Discount' ? (
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 50, hide: 100 }}
                                          overlay={<Tooltip>Edit</Tooltip>}
                                        >
                                          <span
                                            className="btn_main small anchor-span"
                                            onClick={() => {
                                              showDiscountFeeModal(invoice?.parent.id || 0, item.id);
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
                                              showIndividualFeeModal(invoice?.parent.id || 0, item.id);
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faEdit} size="1x" />
                                          </span>
                                        </OverlayTrigger>
                                      )}

                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 100 }}
                                        overlay={<Tooltip>Delete</Tooltip>}
                                      >
                                        <span
                                          className="btn_main orange_btn small anchor-span"
                                          onClick={() => {
                                            openDeleteModal(item.id);
                                          }}
                                        >
                                          <FontAwesomeIcon icon={faTrash} size="1x" />
                                        </span>
                                      </OverlayTrigger>
                                    </td>
                                  ) : (
                                    <td></td>
                                  )}
                                </>
                              ) : (
                                ''
                              )}
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {showLoader && <Loader />}

      {invoice && openPayNowModal && (
        <PayNowInvoice id={invoice.id} isOpen={openPayNowModal} onClose={closePayNowModal} />
      )}

      {showDeleteModal && (
        <ConfirmBox
          isOpen={showDeleteModal}
          onClose={() => closeDeleteModal(false)}
          onSubmit={deleteInvoiceItem}
          bodyText="Are you sure to delete this item?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {invoice && openIndividualFeeModal && (
        <AddIndividualFee
          invoiceId={invoice.id}
          itemId={itemId}
          parentId={parentId}
          isOpen={openIndividualFeeModal}
          onClose={closeIndividualFeeModal}
        />
      )}

      {invoice && openDiscountFeeModal && (
        <AddDiscount
          invoiceId={invoice.id}
          itemId={itemId}
          parentId={parentId}
          isOpen={openDiscountFeeModal}
          onClose={closeDiscountFeeModal}
        />
      )}
    </>
  );
};

export default InvoiceDetailsPage;

export const getServerSideProps: GetServerSideProps<InvoiceDetailsPageParams> = async (context) => {
  let initialParamas: InvoiceDetailsPageParams = {
    id: +(context.query.id || 0),
  };

  return {
    props: initialParamas,
  };
};
