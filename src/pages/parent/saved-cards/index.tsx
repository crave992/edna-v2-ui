import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import CommonProps from "@/models/CommonProps";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";

import { ChangeEvent, useEffect, useReducer, useState } from "react";
import ConfirmBox from "@/components/common/ConfirmBox";
import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import CountryListParams from "@/params/CountryListParams";
import { useRouter } from "next/router";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { useDebounce } from "use-debounce";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { PaymentConfigurationBasicDto } from "@/dtos/PaymentConfigurationDto";
import FormWithSearchBox from "@/components/common/FormWithSearchBox";
import AddNewButton from "@/components/common/ButtonControls/AddNewButton";
import TableWithColumns from "@/components/common/TableWithColumns";
import { ActionButtonTypes } from "@/helpers/ActionButtonTypes";
import AddPaymentConfiguration from "@/components/common/PaymentConfiguration/AddPaymentConfiguration";
import { SavedCardOrAchDto } from "@/dtos/SavedCardOrAchDto";
import ActionButton from "@/components/common/ButtonControls/ActionButton";
import AddCard from "@/components/common/SavedCardOrAch/AddCard";
import AddAch from "@/components/common/SavedCardOrAch/AddAch";
import VerifyPassword from "@/components/common/VerifyPassword";
const qs = require("qs");

interface SavedCardPageProps extends CommonProps {
  q: string;
  paymentMethodId: number;
}

const initialPageState: InPageState<SavedCardOrAchDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const SavedCardPage: NextPage<SavedCardPageProps> = (props) => {
  useBreadcrumb({
    pageName: "Saved Cards",
    breadcrumbs: [
      {
        label: "Saved Cards",
        link: "/parent/saved-cards",
      },
    ],
  });

  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { handleSubmit, setValue, getValues, control } =
    useForm<SavedCardPageProps>({
      defaultValues: {
        q: props.q,
        paymentMethodId: props.paymentMethodId,
      },
    });

  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [states, dispatch] = useReducer(
    reducer<SavedCardOrAchDto[]>,
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

  const [openAchModal, setOpenAchModal] = useState<boolean>(false);
  const openAddUpdateAchModal = (cid: number) => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: cid,
    });

    setOpenAchModal(true);
  };

  const closeAddUpdateAchModal = (isRefresh: boolean) => {
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

    setOpenAchModal(false);
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

  const deletePaymentConfiguration = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.SavedCardOrAchSrvice.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Card/Ach deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchSavedCard = async (q?: string, paymentMethodId?: number) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.SavedCardOrAchSrvice.getAll(
      q || "",
      paymentMethodId || 0
    );
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
    let isCancelled = false;

    if (!isCancelled) {
      (async () => {
        fetchSavedCard(getValues("q"), getValues("paymentMethodId"));
      })();
    }

    return () => {
      isCancelled = true;
    };
  }, [states.refreshRequired]);

  const searchPaymentConfiguration = async (formData: SavedCardPageProps) => {
    await actionFunction(formData);
  };

  async function actionFunction(p: SavedCardPageProps) {
    await fetchSavedCard(p.q, p.paymentMethodId);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const [searchText, setSearchText] = useState<string | null>();
  const updateSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || "";
    setSearchText(searchedText);
    setValue("q", searchedText);
  };

  const [searchedValue] = useDebounce(searchText, 1000);

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled) {
      (async () => {
        if (searchedValue !== null && searchedValue !== undefined) {
          await actionFunction({
            q: getValues().q,
            paymentMethodId: getValues().paymentMethodId,
          });
        }
      })();
    }

    return () => {
      isCancelled = true;
    };
  }, [searchedValue]);

  return (
    <>
      <Head>
        <title>Saved Card</title>
      </Head>
      {
        isVerified ? (
          <div className="parent_list_page">
            <Container fluid>
              <Row>
                <Col md={12} lg={12}>
                  <div className="db_heading_block">
                    <h1 className="db_heading">Saved Cards</h1>
                  </div>
                  <Row>
                    <Col md={5}>
                      <FormWithSearchBox
                        control={control}
                        handleSubmit={handleSubmit}
                        search={searchPaymentConfiguration}
                        name="q"
                        defaultValue=""
                        onChange={updateSearchText}
                        label="Search by card holder's name, alias card name..."
                      />
                    </Col>
                    <Col md={7} className="text-end">
                      <AddNewButton
                        id={0}
                        onClick={openAddUpdateModal}
                        title="Add Card"
                      />
                      <span>&nbsp;&nbsp;</span>
                      <AddNewButton
                        id={0}
                        onClick={openAddUpdateAchModal}
                        title="Add Ach"
                      />
                    </Col>
                  </Row>

                  <div className="tableListItems">
                    <div className="formBlock">
                      <Table striped hover className="custom_design_table mb-0">
                        <thead>
                          <tr>
                            <th>Alias Name</th>
                            <th>Card/Routing Number</th>
                            <th className="text-center">Primary Card/Ach?</th>
                            <th className="text-center">Type</th>
                            <th className="text-center">Added On</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {states.data &&
                            states.data.map((cardOrAch: SavedCardOrAchDto) => {
                              return (
                                <tr key={cardOrAch.id}>
                                  <td>{cardOrAch.aliasCardOrAchName}</td>
                                  <td>
                                    {cardOrAch.paymentMethod.name.toLowerCase() ===
                                    "ach"
                                      ? cardOrAch.routingNumber
                                      : cardOrAch.cardNumber}
                                  </td>
                                  <td className="text-center">
                                    {cardOrAch.isPrimaryCard ? "Yes" : "No"}
                                  </td>
                                  <td className="text-center">
                                    {cardOrAch.paymentMethod.name}
                                  </td>
                                  <td className="text-center">
                                    {unitOfService.DateTimeService.convertToLocalDate(
                                      cardOrAch.createdOn
                                    )}
                                  </td>
                                  <td className="text-center">
                                    <ActionButton
                                      actionButtonType={ActionButtonTypes.Edit}
                                      tooltipText={"Edit"}
                                      id={cardOrAch.id}
                                      onClick={
                                        cardOrAch.paymentMethod.name.toLowerCase() ===
                                        "ach"
                                          ? openAddUpdateAchModal
                                          : openAddUpdateModal
                                      }
                                    />

                                    <ActionButton
                                      actionButtonType={ActionButtonTypes.Delete}
                                      tooltipText={"Delete"}
                                      id={cardOrAch.id}
                                      onClick={openDeleteModal}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        ) : (
          <VerifyPassword onCancel={() => {
            router.back();
          }} onSuccess={() => {
            setIsVerified(true);
          }}/>
        )
      }
      

      {states.showAddUpdateModal && (
        <AddCard
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {openAchModal && (
        <AddAch
          id={states.id}
          isOpen={openAchModal}
          onClose={closeAddUpdateAchModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deletePaymentConfiguration}
          bodyText="Are you sure want to delete this card/ach?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default SavedCardPage;

export const getServerSideProps: GetServerSideProps<
  SavedCardPageProps
> = async (context) => {
  let initialParamas: SavedCardPageProps = {
    q: `${context.query.q || ""}`,
    paymentMethodId: +(context.query.paymentMethodId || 0),
  };

  return {
    props: initialParamas,
  };
};
