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
import HolidayTypeParams from "@/params/HolidayTypeParams";
import HolidayTypeDto from "@/dtos/HolidayTypeDto";
import ConfirmBox from "@/components/common/ConfirmBox";
import Loader from "@/components/common/Loader";
import AddHolidayType from "@/components/common/NotificationMaster/HolidayType/AddHolidayType";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";

interface HolidayTypeSetupPageProps extends CommonProps {
  q: string;
}

const initialPageState: InPageState<HolidayTypeDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const HolidayTypeSetupPage: NextPage<HolidayTypeSetupPageProps> = (props) => {
  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<HolidayTypeParams>({
    defaultValues: {
      q: props.q,
    },
  });

  const [states, dispatch] = useReducer(
    reducer<HolidayTypeDto[]>,
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

  const deleteHolidayType = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.HolidayTypeService.delete(
      states.id
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Holiday Type deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchHolidayType = async (q?: string) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.HolidayTypeService.getAll(q);
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
      fetchHolidayType(getValues("q"));
    })();
  }, [states.refreshRequired]);

  const searchHolidayType = async (formData: HolidayTypeParams) => {
    await actionFunction(formData);
  };

  async function actionFunction(p: HolidayTypeParams) {
    const qs = require("qs");
    await fetchHolidayType(p.q);
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
      <div className="holiday_type_page">
        <Row>
          <Col xl={12} xxl={8}>
            <div className="formBlock">
              <Row>
                <Col md={5}>
                  <Form
                    method="get"
                    autoComplete="off"
                    onSubmit={handleSubmit(searchHolidayType)}
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
                    Holiday Type
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
                      (holidaytype: HolidayTypeDto) => {
                        return (
                          <tr key={holidaytype.id}>
                            <td>{holidaytype.name}</td>
                            <td>
                              {unitOfService.DateTimeService.convertToLocalDate(
                                holidaytype.createdOn
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
                                    openAddUpdateModal(holidaytype.id)
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
                                    openDeleteModal(holidaytype.id);
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
        <AddHolidayType
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteHolidayType}
          bodyText="Are you sure want to delete this holiday type?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}
      {states.showLoader && <Loader />}
    </>
  );
};
export default HolidayTypeSetupPage;


