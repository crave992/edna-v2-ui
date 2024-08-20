import ConfirmBox from "@/components/common/ConfirmBox";
import Loader from "@/components/common/Loader";
import AddPickupDropoffParent from "@/components/common/Parent/AddPickupDropoffParent";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import PickupDropoffConfigDto from "@/dtos/PickupDropoffConfigDto";
import { PickupDropoffParentDto } from "@/dtos/PickupDropoffParentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { PickupAuthorizationEmergencyContactConsentModel } from "@/models/PickupAuthorizationEmergencyContactConsentModel";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import {
  faDownload,
  faEye,
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { toast } from "react-toastify";

const initialPageState: InPageState<PickupDropoffParentDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const PickupDropOffPage = () => {
  useBreadcrumb({
    pageName: "Pickup/Drop Off Authorization",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/parent/dashboard",
      },
      {
        label: "Pickup Authorization",
        link: "/parent/picup-dropoff",
      },
    ],
  });

  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(
    reducer<PickupDropoffParentDto[]>,
    initialPageState
  );

  const openAddUpdateModal = (id: number) => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: id,
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
  const openDeleteModal = (id: number) => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: id,
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

  const deleteContact = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.PickupDropoffParentService.delete(
      states.id
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Pick up/drop off deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchPickupDropoff = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.PickupDropoffParentService.getAllByParentId(0);
    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.SET_DATA,
        payload: response.data.data,
      });
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });
  };

  const [pickOffDropAdminConfig, setPickOffDropAdminConfig] =
    useState<PickupDropoffConfigDto>();
  const fetchPickupDropoffAdminConfig = async () => {
    const response =
      await unitOfService.PickupDropoffParentService.getDropOffConfig();
    if (response && response.status === 200 && response.data.data) {
      setPickOffDropAdminConfig(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchPickupDropoff();
    })();
  }, [states.refreshRequired]);

  const [consentTerms, setConsentTerms] = useState<boolean>(false);
  const saveConsent = async () => {
    const consent: PickupAuthorizationEmergencyContactConsentModel = {
      acceptTerms: consentTerms,
    };

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });
    const response = await unitOfService.PickupDropoffParentService.saveConsent(
      consent
    );
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200) {
      toast.success("Consent saved successfully");
    }
  };

  const fetchConsent = async () => {
    const response =
      await unitOfService.PickupDropoffParentService.getConsentByParentId(0);
    if (response && response.status === 200 && response.data.data) {
      setConsentTerms(response.data.data.acceptTerms || false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchPickupDropoffAdminConfig();
      await fetchConsent();
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Pickup/Drop Off Authorization</title>
      </Head>
      <div className="pickup_authorization_page">
        <Container fluid>
          <div className="db_heading_block">
            <h1 className="db_heading">Pickup/Drop Off Authorization List</h1>
          </div>
          <Row>
            <Col md={10}>
              <div className="formBlock">
                {pickOffDropAdminConfig &&
                  states.data &&
                  states.data.length < pickOffDropAdminConfig.minCount && (
                    <div>
                      <p className="text-danger mb-1">
                        Minimum number of Pickup Authorized person not added
                        yet. Minimum count is {pickOffDropAdminConfig.minCount}
                      </p>
                    </div>
                  )}

                <p className="text-muted">
                  Please list atleast 2 persons other than the parents as local
                  Emergency contacts.
                </p>

                <Table striped hover className="custom_design_table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Relation</th>
                      <th className="text-center">Priority</th>
                      <th>Phone Number</th>
                      <th className="text-center">Emergency Contact?</th>
                      <th className="text-center">Drivers Licence/ID</th>
                      <th>Authorized Child(s)</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {states.data &&
                      states.data.map((contact) => {
                        return (
                          <tr key={contact.id}>
                            <td>{contact.name}</td>
                            <td>{contact.relation}</td>
                            <td className="text-center">{contact.priority}</td>
                            <td>{contact.phoneNumber}</td>
                            <td className="text-center">
                              {contact.isEmergencyContact ? "Yes" : "No"}
                            </td>
                            <td className="text-center">
                              {contact.identityProof && (
                                <Link
                                  href={contact.identityProof}
                                  target="_blank"
                                >
                                  View
                                </Link>
                              )}
                            </td>
                            <td>
                              {contact.students &&
                                contact.students.map((student) => {
                                  return (
                                    <div key={student.id}>
                                      {student.name}
                                    </div>
                                  );
                                })}
                            </td>
                            <td className="text-center">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>Edit</Tooltip>}
                              >
                                <span
                                  className="btn_main small anchor-span"
                                  onClick={() => openAddUpdateModal(contact.id)}
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
                                    openDeleteModal(contact.id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} size="1x" />
                                </span>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <Button
                  className="btn_border size_small mb-3"
                  onClick={() => openAddUpdateModal(0)}
                >
                  <FontAwesomeIcon icon={faPlus} size="1x" /> Add More
                </Button>
                <Form.Group className="mb-3">
                  <Form.Check
                    inline
                    label="I certify that the emergency contacts listed above are local residents and can be contacted in time of emergency when primary contacts are not reachable."
                    type="checkbox"
                    id="acceptConsent"
                    checked={consentTerms}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setConsentTerms(event.target.checked);
                    }}
                  />
                </Form.Group>
                <Button
                  type="button"
                  className="btn_main"
                  onClick={saveConsent}
                >
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {states.showAddUpdateModal && (
        <AddPickupDropoffParent
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteContact}
          bodyText="Are you sure want to delete this contact?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default PickupDropOffPage;
