import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useReducer, useState } from "react";
import CommonProps from "@/models/CommonProps";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import Head from "next/head";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  FormControl,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlusCircle,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import PickupDropOffConfigListParams from "@/params/PickupDropOffConfigListParams";
import { useForm } from "react-hook-form";
import PickupDropoffConfigDto from "@/dtos/PickupDropoffConfigDto";
import { useRouter } from "next/router";
import { useDebounce } from "use-debounce";
import AddPickupDropOffConfig from "@/components/common/PickupDropOffConfig/AddPickupDropOffConfig";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";

interface PickupDropOffConfigurationPageProps extends CommonProps {
  q: string;
}

const initialPageState: InPageState<PickupDropoffConfigDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};
const PickupDropOffConfiguration: NextPage<
  PickupDropOffConfigurationPageProps
> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [orgorganizationId, setOrganizationId] = useState(-1);

  const router = useRouter();
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PickupDropOffConfigListParams>({
    defaultValues: {
      q: props.q,
    },
  });

  const [states, dispatch] = useReducer(
    reducer<PickupDropoffConfigDto[]>,
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

  const fetchPickupDropOffConfig = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.PickupDropOffConfigurationService.getAll();
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
      fetchPickupDropOffConfig();
      fetchOrganizationId();
    })();
  }, [states.refreshRequired]);

  const fetchOrganizationId = async () => {
    const response =
      await unitOfService.PickupDropOffConfigurationService.getOrganizationId();
    if (response && response.status === 200 && response.data.data) {
      setOrganizationId(response.data.data.organizationId);
    } else {
      setOrganizationId(0);
    }
  };
  
  useBreadcrumb({
    pageName: "Pickup/ Drop-Off Configuration",
    breadcrumbs: [
      {
        label: "Pickup/ Drop-Off Configuration",
        link: "/admin/pickup-drop-off-configuration",
      },
    ],
  });

  return (
    <>
      <Head>
        <title>Pickup Drop-Off Configuration</title>
      </Head>
      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">
                  Pickup Drop-Off Configuration
                </h1>
              </div>
              <Row>
                <Col lg={9}><p>Set the Min. & Max. number of Authorized Pickup/Drop-off Person for a Child</p></Col>
                <Col lg={3} className="text-end mb-2">
                  {orgorganizationId === 0 ? (
                    <Button
                      className="btn_main"
                      onClick={() => openAddUpdateModal(0)}
                    >
                      <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add
                      Pickup/Drop Off Config
                    </Button>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
              
              <div className="tableListItems">
                <div className="formBlock">
                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th>Min Count</th>
                        <th>Max Count</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.data &&
                        states.data.map(
                          (pickupDropOffConfig: PickupDropoffConfigDto) => {
                            return (
                              <tr key={pickupDropOffConfig.id}>
                                <td>{pickupDropOffConfig.minCount}</td>
                                <td>{pickupDropOffConfig.maxCount}</td>
                                <td className="text-center">
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 100 }}
                                    overlay={<Tooltip>Edit</Tooltip>}
                                  >
                                    <span
                                      className="btn_main small anchor-span"
                                      onClick={() =>
                                        openAddUpdateModal(
                                          pickupDropOffConfig.id
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        size="1x"
                                      />
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {states.showAddUpdateModal && (
        <AddPickupDropOffConfig
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}
    </>
  );
};

export default PickupDropOffConfiguration;

export const getServerSideProps: GetServerSideProps<
  PickupDropOffConfigListParams
> = async (context) => {
  let initialParamas: PickupDropOffConfigListParams = {
    q: `${context.query.q || ""}`,
  };

  return {
    props: initialParamas,
  };
};
