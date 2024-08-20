import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import { StudentInvoiceDto } from '@/dtos/StudentInvoiceDto';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { faCircleCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from 'react-bootstrap';

interface AdmissionPaymentDetailProps {
  studentId: number;
}

const AdmissionPaymentDetail: NextPage<AdmissionPaymentDetailProps> = ({ studentId }) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [paidDetails, setPaidDetails] = useState<StudentInvoiceDto>();
  const fetchStudentAdmissionPaymentDetails = async (studentId: number) => {
    const response = await unitOfService.InvoiceService.getStudentPaymentDetailsByStudentId(studentId);
    if (response && response.status == 200 && response.data.data) {
      setPaidDetails(response.data.data);
    }
  };

  useEffect(() => {
    fetchStudentAdmissionPaymentDetails(studentId);
  }, [studentId]);

  const applicationFee = paidDetails?.student.applicationFee || 0;
  const registrationFee = paidDetails?.student.registrationFee || 0;
  const taxPercent = paidDetails?.student.taxPercentage || 0;
  const taxAmount = paidDetails?.tax || 0;
  const totalAmount = paidDetails?.invoiceTotal || 0;

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <div className="formBlock custom_design_table">
          <div className="text-center">
            <p className=" mb-1">
              <FontAwesomeIcon icon={faCircleCheck} className="text-success" style={{ fontSize: '50px' }} />
            </p>
            <p>Payment Successful</p>
          </div>
          <Table bordered size="sm">
            <thead>
              <tr>
                <th colSpan={2} className="text-center">
                  Invoice Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Parent Name</td>
                <td>{paidDetails?.parentName}</td>
              </tr>
              <tr>
                <td>Student Name</td>
                <td>{paidDetails?.student.fullName}</td>
              </tr>
              <tr>
                <td>Payment Status</td>
                <td>{paidDetails?.paymentStatus}</td>
              </tr>
              <tr>
                <td>Payment Reference Id</td>
                <td>{paidDetails?.paymentReferenceId}</td>
              </tr>
              <tr>
                <td>Payment Method</td>
                <td>{paidDetails?.paymentMethod}</td>
              </tr>
              <tr>
                <td>Payment Date</td>
                <td>
                  {paidDetails?.invoiceDate
                    ? unitOfService.DateTimeService.convertToLocalDate(paidDetails?.invoiceDate)
                    : '-'}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="text-center bg-gray">
                  <strong>Amount Details</strong>
                </td>
              </tr>
              <tr>
                <td>Application Fee</td>
                <td>{unitOfService.CurrencyCodeService.convertToCurrency(applicationFee)}</td>
              </tr>
              <tr>
                <td>Registration Fee</td>
                <td>{unitOfService.CurrencyCodeService.convertToCurrency(registrationFee)}</td>
              </tr>
              <tr>
                <td>Tax ({taxPercent}%)</td>
                <td>{unitOfService.CurrencyCodeService.convertToCurrency(taxAmount)}</td>
              </tr>
              <tr>
                <td>Card Processing Fee</td>
                <td>
                  {paidDetails?.cardProcessingFee
                    ? unitOfService.CurrencyCodeService.convertToCurrency(paidDetails?.cardProcessingFee)
                    : 0}
                </td>
              </tr>
              <tr>
                <td>Total Amount</td>
                <td>
                  <strong>{unitOfService.CurrencyCodeService.convertToCurrency(totalAmount)}</strong>
                </td>
              </tr>
              <tr>
                <td>Paid Amount</td>
                <td>
                  <strong>{unitOfService.CurrencyCodeService.convertToCurrency(totalAmount)}</strong>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Col>
    </Row>
  );
};

export default AdmissionPaymentDetail;
