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
import {
  Col,
  Container,
  Row,
} from "react-bootstrap";
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
const qs = require("qs");

interface PaymentConfigurationPageProps extends CommonProps {
  q: string;
}

const initialPageState: InPageState<PaymentConfigurationBasicDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const PaymentConfigurationPage: NextPage<PaymentConfigurationPageProps> = (
  props
) => {
  useBreadcrumb({
    pageName: "Payment Configuration",
    breadcrumbs: [
      {
        label: "Payment Configuration",
        link: "/admin/payment-configuration",
      },
    ],
  });

  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { handleSubmit, setValue, getValues, control } =
    useForm<PaymentConfigurationPageProps>({
      defaultValues: {
        q: props.q,
      },
    });

  const [states, dispatch] = useReducer(
    reducer<PaymentConfigurationBasicDto[]>,
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

  const deletePaymentConfiguration = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.PaymentConfigurationService.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Payment configuration deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchPaymentConfiguration = async (q?: string) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.PaymentConfigurationService.getAll(
      q || ""
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
    (async () => {
      fetchPaymentConfiguration(getValues("q"));
    })();
  }, [states.refreshRequired]);

  const searchPaymentConfiguration = async (formData: CountryListParams) => {
    await actionFunction(formData);
  };

  async function actionFunction(p: PaymentConfigurationPageProps) {
    await fetchPaymentConfiguration(p.q);
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
    (async () => {
        if(searchedValue !== null && searchedValue !== undefined){
            await actionFunction({ q: getValues().q });
        }
    })();
  }, [searchedValue]);

  return (
    <>
      <Head>
        <title>Payment Configuration</title>
      </Head>

      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">Payment Configuration List</h1>
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
                    label="Search by display name, provider name..."
                  />
                </Col>
                <Col md={7} className="text-end">
                  <AddNewButton
                    id={0}
                    onClick={openAddUpdateModal}
                    title="Add Payment Configuration"
                  />
                </Col>
              </Row>

              <div className="tableListItems">
                <div className="formBlock">
                  <TableWithColumns
                    data={states.data}
                    columns={[
                      {
                        key: "displayName",
                        header: "Display Name",
                        displayOrder: 1,
                      },
                      {
                        key: "paymentGatewayProviderName",
                        header: "Provider Name",
                        displayOrder: 2,
                      },
                      {
                        key: "mode",
                        header: "Mode",
                        displayOrder: 3,
                      },
                    ]}
                    idKey="id"
                    actionItems={[
                      {
                        name: "Edit",
                        displayOrder: 1,
                        onClick: openAddUpdateModal,
                        tooltipText: "Edit",
                        actionButtonType: ActionButtonTypes.Edit,
                      },
                      {
                        name: "Delete",
                        displayOrder: 2,
                        onClick: openDeleteModal,
                        tooltipText: "Delete",
                        actionButtonType: ActionButtonTypes.Delete,
                      },
                    ]}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {states.showAddUpdateModal && (
        <AddPaymentConfiguration
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deletePaymentConfiguration}
          bodyText="Are you sure want to delete this payment configuration?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default PaymentConfigurationPage;

export const getServerSideProps: GetServerSideProps<
  PaymentConfigurationPageProps
> = async (context) => {
  let initialParamas: PaymentConfigurationPageProps = {
    q: `${context.query.q || ""}`,
  };

  return {
    props: initialParamas,
  };
};
