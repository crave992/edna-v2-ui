
import AdmissionPayment from "@/components/common/Invoice/AdmissionPayment";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { ParentPaymentDto } from "@/dtos/ParentPaymentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import RegistrationFeesParams from "@/params/RegistrationFeesParams";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faDollar } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";


const AdmissionPaymentPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const studentId: number | null = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : null;

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [payDetails, setPayDetails] = useState<ParentPaymentDto>();
    const fetchAdmissionPaymentDetails = async (studentId: number) => {
        const response = await unitOfService.ParentService.getParentPaymentDetailsByStudentId(studentId);
        if (response && response.status == 200 && response.data.data) {
            setPayDetails(response.data.data);
        }
    };

    useEffect(() => {
        if (studentId !== null) {
            fetchAdmissionPaymentDetails(studentId);
        }
    }, [studentId]);

    const applicationFee = payDetails?.applicationFee || 0;
    const registrationFee = payDetails?.registrationFee || 0;
    const taxPercent = payDetails?.taxPercentage || 0;
    const taxAmount = payDetails?.taxAmount || 0;
    const totalAmount = payDetails?.totalAmount || 0;
    

    const [openPayNowModal, setOpenPayNowModal] = useState<boolean>(false);
    const [isRefresh, isSetRefresh] = useState<boolean>(false);
    const closePayNowModal = (_isRefresh: boolean) => {
        setOpenPayNowModal(false);
        if (_isRefresh) {
            isSetRefresh(!isRefresh);
        }
    };    

    useBreadcrumb({
        pageName: "Payment",
        breadcrumbs: [
            {
                label: "Dashboard",
                link: "/parent/dashboard",
            },
            {
                label: "Child",
                link: "/parent/student/add",
            },
            {
                label: "Payment",
                link: `/parent/student/payment/${studentId}`,
            },
        ],
    });
    return (
        
        <>
            <Head>
                <title>Admission Payment - Noorana</title>
            </Head>
            <div className="db_heading_block">
                <h1 className="db_heading">Admission Payment Details</h1>
            </div>
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <div className="formBlock custom_design_table">
                            <Table bordered size="sm">
                                <thead>
                                    <tr>
                                        <th>Fee Type</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td>Application Fee</td>
                                        <td>
                                            {unitOfService.CurrencyCodeService.convertToCurrency(applicationFee)}
                                        </td>
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
                                        <td><strong>Total</strong></td>
                                            <td><strong>{unitOfService.CurrencyCodeService.convertToCurrency(totalAmount)}</strong></td>
                                    </tr>
                                </tbody>
                                
                            </Table>
                            {}
                            <Button className="btn_main"
                                onClick={() =>
                                    setOpenPayNowModal(true)
                                }
                            >
                                <FontAwesomeIcon icon={faDollar} size="1x" />
                                Pay Now
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            {openPayNowModal && (
                <AdmissionPayment
                    //id={id}
                    studentId={studentId || 0}
                    isOpen={openPayNowModal}
                    onClose={closePayNowModal}
                />
            )}
        </>
    );
}

export default AdmissionPaymentPage;