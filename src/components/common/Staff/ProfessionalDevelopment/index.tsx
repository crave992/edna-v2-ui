import CommonProps from "@/models/CommonProps";
import {
  faPenToSquare,
  faPlusCircle,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";

import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";

import { useRouter } from "next/router";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import { useEffect, useReducer } from "react";
import ConfirmBox from "@/components/common/ConfirmBox";
import { useDebounce } from "use-debounce";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import AddProfessionalDevelopment from "./AddProfessionalDevelopment";
import { StaffProfessionalDevelopmentDto } from "@/dtos/StaffDto";

interface ProfessionalDevelopmentPageProps extends CommonProps {}

const initialPageState: InPageState<StaffProfessionalDevelopmentDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const ProfessionalDevelopmentPage: NextPage<
  ProfessionalDevelopmentPageProps
> = (props) => {
  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const [states, dispatch] = useReducer(
    reducer<StaffProfessionalDevelopmentDto[]>,
    initialPageState
  );

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

  const deleteProfessionalDevelopment = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.StaffProfessionalDevelopmentService.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Professional development deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchProfessionalDevelopment = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.StaffProfessionalDevelopmentService.getAll();
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

  useEffect(() => {
    (async () => {
      fetchProfessionalDevelopment();
    })();
  }, [states.refreshRequired]);

  const [searchedValue] = useDebounce(getValues().q, 1000);

  return (
    <>
      <div className="professional_development_page">
        <Row>
          <Col xl={12} xxl={12}>
            <div className="formBlock">
              <Row>
                <Col md={5}></Col>
                <Col md={7} className="text-end mb-3">
                  <Button
                    className="btn_main"
                    onClick={() => openAddUpdateModal(0)}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add
                    Professional Development
                  </Button>
                </Col>
              </Row>
              <Table striped hover className="custom_design_table mb-0">
                <thead>
                  <tr>
                    <th>Training Organization</th>
                    <th>Topic</th>
                    <th>Remaining Hours</th>
                    <th>Entry Date</th>
                    <th>Note</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {states.data &&
                    states.data.map(
                      (
                        staffProfessionalDevelopment: StaffProfessionalDevelopmentDto
                      ) => {
                        return (
                          <tr key={staffProfessionalDevelopment.id}>
                            <td>
                              {
                                staffProfessionalDevelopment.trainingOrganization
                              }
                            </td>
                            <td>
                              {
                                staffProfessionalDevelopment.topic
                              }
                            </td>
                            <td>
                              {staffProfessionalDevelopment.remainingHours}
                            </td>
                            <td>
                              {unitOfService.DateTimeService.convertToLocalDate(
                                staffProfessionalDevelopment.dateOfEntry
                              )}
                            </td>
                            <td>{staffProfessionalDevelopment.note}</td>
                            <td>
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>Edit</Tooltip>}
                              >
                                <span
                                  className="btn_main small anchor-span"
                                  onClick={() =>
                                    openAddUpdateModal(
                                      staffProfessionalDevelopment.id
                                    )
                                  }
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
                                    openDeleteModal(
                                      staffProfessionalDevelopment.id
                                    );
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} size="1x" />
                                </span>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        );
                      }
                    )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>

      {states.showAddUpdateModal && (
        <AddProfessionalDevelopment
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteProfessionalDevelopment}
          bodyText="Are you sure want to delete this professional development?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}
      {states.showLoader && <Loader />}
    </>
  );
};
export default ProfessionalDevelopmentPage;
