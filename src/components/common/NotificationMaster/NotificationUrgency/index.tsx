import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import {
  faPenToSquare,
  faPlusCircle,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useReducer } from "react";
import {
  Button,
  Col,
  FloatingLabel,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

import ConfirmBox from "@/components/common/ConfirmBox";
import Loader from "@/components/common/Loader";
import NotificationUrgencyParams from "@/params/NotificationUrgencyParams";
import AddNotificationUrgency from "@/components/common/NotificationMaster/NotificationUrgency/AddNotificationUrgency";
import { NotificationUrgencyDto } from "@/dtos/NotificationUrgencyDto";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";

interface NotificationUrgencyPageProps extends CommonProps {
  q: string;
}

const initialPageState: InPageState<NotificationUrgencyDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const NotificationUrgencyPage: NextPage<NotificationUrgencyPageProps> = (
  props
) => {
  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<NotificationUrgencyParams>({
    defaultValues: {
      q: props.q,
    },
  });

  const [states, dispatch] = useReducer(
    reducer<NotificationUrgencyDto[]>,
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

  const deleteNotificationUrgency = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.NotificationUrgencyService.delete(
      states.id
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Notification Urgency deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchNotificationUrgency = async (q?: string) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.NotificationUrgencyService.getAll(q);
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
      fetchNotificationUrgency(getValues("q"));
    })();
  }, [states.refreshRequired]);

  const searchNotificationUrgency = async (
    formData: NotificationUrgencyParams
  ) => {
    await actionFunction(formData);
  };

  async function actionFunction(p: NotificationUrgencyParams) {
    const qs = require("qs");
    await fetchNotificationUrgency(p.q);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const updateSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || "";
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });
    setValue("q", searchedText);
  };

  const [searchedValue] = useDebounce(getValues().q, 1000);

  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [searchedValue]);


  return (
    <>
      <div className="notification_urgency_page">
        <Row>
          <Col xl={12} xxl={8}>
            <div className="formBlock">
              <Row>
                <Col md={5}>
                  <Form
                    method="get"
                    autoComplete="off"
                    onSubmit={handleSubmit(searchNotificationUrgency)}
                  >
                    <div className="searchSortBlock">
                      <div className="searchBlock">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Search by name"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search by name"
                            {...register("q")}
                            onChange={updateSearchText}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </Form>
                </Col>
                <Col md={7} className="text-end">
                  <Button
                    className="btn_main"
                    onClick={() => openAddUpdateModal(0)}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add
                    Urgency Level
                  </Button>
                </Col>
              </Row>
              <Table striped hover className="custom_design_table mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Added On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {states.data &&
                    states.data.map(
                      (notificationurgency: NotificationUrgencyDto) => {
                        return (
                          <tr key={notificationurgency.id}>
                            <td>{notificationurgency.name}</td>
                            <td>
                              {unitOfService.DateTimeService.convertToLocalDate(
                                notificationurgency.createdOn
                              )}
                            </td>
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
                                      notificationurgency.id
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
                                      notificationurgency.id
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
        <AddNotificationUrgency
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteNotificationUrgency}
          bodyText="Are you sure want to delete this urgency type?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}
      {states.showLoader && <Loader />}
    </>
  );
};
export default NotificationUrgencyPage;

