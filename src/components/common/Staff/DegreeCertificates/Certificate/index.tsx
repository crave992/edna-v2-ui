import ConfirmBox from "@/components/common/ConfirmBox";
import Loader from "@/components/common/Loader";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffCertificationDto } from "@/dtos/StaffDto";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faPenToSquare, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import AddCertificate from "./AddCertificate";

const initialPageState: InPageState<StaffCertificationDto[]> = {
    id: 0,
    currentPage: 1,
    showLoader: false,
    showDeleteModal: false,
    refreshRequired: false,
    showAddUpdateModal: false,
};

const Certificate = () => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [states, dispatch] = useReducer(reducer<StaffCertificationDto[]>, initialPageState);

    const openAddUpdateModal = (cid: number) => {
        dispatch({
            type: InPageActionType.SET_ID,
            payload: cid,
        });

        dispatch({
            type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
            payload: true,
        });
    };

    const closeAddUpdateModal = (isRefresh: boolean) => {
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

    const openDeleteModal = (cid: number) => {
        dispatch({
            type: InPageActionType.SET_ID,
            payload: cid,
        });

        dispatch({
            type: InPageActionType.SHOW_DELETE_MODAL,
            payload: true,
        });
    };

    const closeDeleteModal = () => {
        dispatch({
            type: InPageActionType.SET_ID,
            payload: 0,
        });

        dispatch({
            type: InPageActionType.SHOW_DELETE_MODAL,
            payload: false,
        });
    };


    const deleteCertificate = async () => {
        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.StaffCertificationService.delete(states.id);

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 204) {
            closeDeleteModal();

            toast.success("Certificate deleted successfully");

            dispatch({
                type: InPageActionType.IS_REFRESH_REQUIRED,
                payload: !states.refreshRequired,
            });
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };



    const fetchStaffCertificate = async () => {

        dispatch({
            type: InPageActionType.SHOW_LOADER,
            payload: true,
        });

        const response = await unitOfService.StaffCertificationService.getAll();
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

    useEffect(() => {
        (async () => {
            fetchStaffCertificate();
        })();
    }, [states.refreshRequired]);

    return (
        <>
            <div className='db_heading_block'>
                <h3 className="db_heading">Certificate</h3>
                <Button className="btn_main size_small" onClick={() => openAddUpdateModal(0)}>Add Certificate</Button>
            </div>
            <div className="table-responsive">
                <Table striped hover className="custom_design_table mb-0">
                    <thead>
                        <tr>
                            <th>Certificate</th>
                            <th>Expiry Date</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {states.data &&
                            states.data?.map((certificate) => {
                                return (
                                    <tr key={certificate.id}>
                                        <td>{certificate.certificateName}</td>
                                        <td>{certificate.expiryDate ? unitOfService.DateTimeService.convertToLocalDate(
                                                certificate.expiryDate
                                            ) : ""}
                                        </td>
                                        <td className="text-center">
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 50, hide: 100 }}
                                                overlay={<Tooltip>Edit</Tooltip>}
                                            >
                                                <span
                                                    className="btn_main small anchor-span"
                                                    onClick={() => openAddUpdateModal(certificate.id)}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPenToSquare}
                                                        size="1x"
                                                    />
                                                </span>
                                            </OverlayTrigger>

                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 50, hide: 100 }}
                                                overlay={<Tooltip>Delete</Tooltip>}
                                            >
                                                <span
                                                    className="btn_main orange_btn small anchor-span"
                                                    onClick={() => {
                                                        openDeleteModal(certificate.id);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} size="1x" />
                                                </span>
                                            </OverlayTrigger>
                                        </td>
                                    </tr>
                                )
                            })}

                    </tbody>
                </Table>
            </div>
            {states.showAddUpdateModal && (
                <AddCertificate
                    id={states.id}
                    isOpen={states.showAddUpdateModal}
                    onClose={closeAddUpdateModal}
                />
            )}

            {states.showDeleteModal && (
                <ConfirmBox
                    isOpen={states.showDeleteModal}
                    onClose={closeDeleteModal}
                    onSubmit={deleteCertificate}
                    bodyText="Are you sure want to delete this certificate?"
                    noButtonText="Cancel"
                    yesButtonText="Confirm"
                />
            )}

            {states.showLoader && <Loader />}
        </>
    )
}
export default Certificate;