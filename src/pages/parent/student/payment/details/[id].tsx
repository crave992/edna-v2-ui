import AdmissionPaymentDetail from '@/components/common/Student/AdmissionPaymentDetail';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';

const AdmissionPaymentDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const studentId: number | null = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : null;

  useBreadcrumb({
    pageName: 'Payment',
    breadcrumbs: [
      {
        label: 'Dashboard',
        link: '/parent/dashboard',
      },
      {
        label: 'Student Admission Payment',
        link: '/invoice/admissions',
      },
      {
        label: 'Payment',
        link: `/parent/student/payment/${studentId || 0}`,
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

export default AdmissionPaymentDetails;
