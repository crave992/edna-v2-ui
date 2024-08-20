import Loader from "@/components/common/Loader";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { OldInvoicePaymentDto } from "@/dtos/InvoicePaymentDto";
import CommonProps from "@/models/CommonProps";
import { InModalActionType, InModalState, modalReducer } from "@/reducers/InModalAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import { useEffect, useReducer, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";

const initialState: InModalState = {
    modalHeading: "Transaction Details",
    isUpdate: false,
    refreshRequired: false,
    showLoader: true,
};

interface ShowOldPaymentDetailsProps extends CommonProps {
    id: number;
    referenceNumber: string;
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const ShowOldPaymentDetails: NextPage<ShowOldPaymentDetailsProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const [states, dispatch] = useReducer(modalReducer, initialState);

    const [paymDetails, setPaymDetails] = useState<OldInvoicePaymentDto>();
    const fetchOldPaymentDetails = async (referenceNumber: string) => {
        const response = await unitOfService.InvoiceService.getOldPaymentDetailsByReferenceNumber(referenceNumber);
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });
        if (response && response.status === 200 && response.data.data) {
            setPaymDetails(response.data.data)
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchOldPaymentDetails(props.referenceNumber);
            }
        })();
    }, []);
    return (
        <>
            <Modal
                show={props.isOpen}
                onHide={() => {
                    props.onClose(states.refreshRequired);
                }}
                backdrop="static"
                size="lg"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{states.modalHeading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="attendance_overview_bar p-2 mb-3">
                        <span>Date: {paymDetails?.transactionDate ? unitOfService.DateTimeService.convertToLocalDate(paymDetails.transactionDate).toString() : '-'}</span>
                        <span>Transaction #: {paymDetails?.transactionNumber}</span>
                        <span>Method of Payment: {paymDetails?.methodOfPayment}</span>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Qty</th>
                                <th>Amount</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymDetails?.items && paymDetails.items.map((item) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{item.type}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.total}</td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn_main orange_btn"
                        onClick={() => {
                            props.onClose(states.refreshRequired);
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {states.showLoader && <Loader />}
        </>
    );
}


export default ShowOldPaymentDetails;