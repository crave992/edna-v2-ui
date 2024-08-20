import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import CommonProps from "@/models/CommonProps";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";

import {
  faCheckCircle,
  faInfo,
  faInfoCircle,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/pro-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import Loader from "@/components/common/Loader";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import CountryListParams from "@/params/CountryListParams";
import { useRouter } from "next/router";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { useDebounce } from "use-debounce";
import SchoolListParams from "@/params/SchoolListParams";
import { OrganizationDto } from "@/dtos/OrganizationDto";
import Link from "next/link";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { toast } from "react-toastify";
import ConfirmBox from "@/components/common/ConfirmBox";

interface SchoolPageProps extends CommonProps {
  q: string;
}

const initialPageState: InPageState<OrganizationDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const SchoolPage: NextPage<SchoolPageProps> = (props) => {
  useBreadcrumb({
    pageName: "School",
    breadcrumbs: [
      {
        label: "School List",
        link: "/superadmin/school",
      },
    ],
  });

  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SchoolListParams>({
    defaultValues: {
      q: props.q,
    },
  });

  const [states, dispatch] = useReducer(
    reducer<OrganizationDto[]>,
    initialPageState
  );

  const fetchSchool = async (q?: string) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.OrganizationService.getAll(q);
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
      fetchSchool(getValues("q"));
    })();
  }, [states.refreshRequired]);

  const searchCountry = async (formData: CountryListParams) => {
    await actionFunction(formData);
  };

  async function actionFunction(p: CountryListParams) {
    const qs = require("qs");
    await fetchSchool(p.q);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const [searchText, setSearchText] = useState<string>("");
  const updateSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || "";
    setSearchText(searchedText);
    setValue("q", searchedText);
  };

  const [searchedValue] = useDebounce(searchText, 1000);
  useEffect(() => {
    (async () => {
      await actionFunction({ q: getValues().q });
    })();
  }, [searchedValue]);

  const [organizationId, setOrganizationId] = useState<number>(0);
  const [activate, setActivate] = useState<boolean>(false);
  const [deactivate, setDeactivate] = useState<boolean>(false);

  const activateOrganization = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.OrganizationService.activate(
      organizationId
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
      setOrganizationId(0);
      setActivate(false);
      toast.success("Account activated successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const deactivateOrganization = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.OrganizationService.deactivate(
      organizationId
    );

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
      setOrganizationId(0);
      setDeactivate(false);
      toast.success("Account deactivated successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>School List</title>
      </Head>

      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">School List</h1>
              </div>
              <Row>
                <Col md={5}>
                  <Form
                    method="get"
                    autoComplete="off"
                    onSubmit={handleSubmit(searchCountry)}
                  >
                    <div className="searchSortBlock">
                      <div className="searchBlock">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Search by name, email, subdomain..."
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search by name, email, subdomain..."
                            {...register("q")}
                            onChange={updateSearchText}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </Form>
                </Col>
              </Row>

              <div className="tableListItems">
                <div className="formBlock">
                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Domain</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Register Date</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.data &&
                        states.data.map((school: OrganizationDto) => {
                          return (
                            <tr key={school.id}>
                              <td>{school.schoolName}</td>
                              <td>{school.schoolEmail}</td>
                              <td>{school.userName}</td>
                              <td>
                                <Link
                                  href={`https://${school.subDomain}.ednaapp.net`}
                                  target="_blank"
                                >{`https://${school.subDomain}.ednaapp.net`}</Link>
                              </td>
                              <td className="text-center">
                                {school.isActive ? (
                                  <FontAwesomeIcon
                                    title="Active"
                                    className="text-success"
                                    icon={faCheckCircle}
                                    size="1x"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    className="text-danger"
                                    icon={faInfoCircle}
                                    size="1x"
                                  />
                                )}
                              </td>
                              <td className="text-center">
                                {unitOfService.DateTimeService.convertToLocalDate(
                                  school.registerDate
                                )}
                              </td>
                              <td className="text-center">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>School Details</Tooltip>}
                                >
                                  <Link
                                    href={`/superadmin/school/${school.id}`}
                                    className="btn_main small"
                                  >
                                    <FontAwesomeIcon icon={faInfo} size="1x" />
                                  </Link>
                                </OverlayTrigger>

                                {school.isActive === true ? (
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 100 }}
                                    overlay={
                                      <Tooltip>Deactivate Account</Tooltip>
                                    }
                                  >
                                    <Button
                                      className="btn_main small"
                                      onClick={() => {
                                        setDeactivate(true);
                                        setOrganizationId(school.id);
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faUserMinus}
                                        size="1x"
                                      />
                                    </Button>
                                  </OverlayTrigger>
                                ) : (
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 100 }}
                                    overlay={
                                      <Tooltip>Activate Account</Tooltip>
                                    }
                                  >
                                    <Button
                                      className="btn_main small"
                                      onClick={() => {
                                        setActivate(true);
                                        setOrganizationId(school.id);
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faUserPlus}
                                        size="1x"
                                      />
                                    </Button>
                                  </OverlayTrigger>
                                )}
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

      {activate && (
        <ConfirmBox
          isOpen={activate}
          onClose={() => {
            setOrganizationId(0);
            setActivate(false);
          }}
          onSubmit={activateOrganization}
          bodyText="Are you sure to activate this account?"
          noButtonText="No"
          yesButtonText="Yes"
        />
      )}

      {deactivate && (
        <ConfirmBox
          isOpen={deactivate}
          onClose={() => {
            setOrganizationId(0);
            setDeactivate(false);
          }}
          onSubmit={deactivateOrganization}
          bodyText="Are you sure to deactivate this account?"
          noButtonText="No"
          yesButtonText="Yes"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default SchoolPage;

export const getServerSideProps: GetServerSideProps<SchoolListParams> = async (
  context
) => {
  let initialParamas: SchoolListParams = {
    q: `${context.query.q || ""}`,
  };

  return {
    props: initialParamas,
  };
};
