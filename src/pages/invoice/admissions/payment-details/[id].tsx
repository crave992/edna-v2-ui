import AdmissionPaymentDetail from '@/components/common/Student/AdmissionPaymentDetail';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';

const AdminAdmissionPaymentDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const studentId: number | null = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : null;

  useBreadcrumb({
    pageName: 'Student Admission Payment Details',
    breadcrumbs: [
      {
        label: 'Admin',
        link: '/admin/dashboard',
      },
      {
        label: 'Student Admission Payment',
        link: '/invoice/admissions',
      },
      {
        label: 'Payment',
        link: `/invoice/admissions/payment-details/${studentId || 0}`,
      },
    ],
  });

  return (
    <>
      <Head>
        <title>Admission Payment Invoice - Noorana</title>
      </Head>
      <div className="db_heading_block">
        <h1 className="db_heading">Payment Details</h1>
      </div>
      <Container fluid>
        <AdmissionPaymentDetail studentId={studentId || 0} />
      </Container>
    </>
  );
};

export default AdminAdmissionPaymentDetails;
