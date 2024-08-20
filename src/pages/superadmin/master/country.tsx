import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import CommonProps from "@/models/CommonProps";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";

import {
  faPenToSquare,
  faPlusCircle,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import AddCountry from "@/components/common/Country/AddCountry";
import ConfirmBox from "@/components/common/ConfirmBox";
import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";
import CountryDto from "@/dtos/CountryDto";
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
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";

interface CountryPageProps extends CommonProps {
  q: string;
}

const initialPageState: InPageState<CountryDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const CountryPage: NextPage<CountryPageProps> = (props) => {
  useBreadcrumb({
    pageName: "Country",
    breadcrumbs: [
      {
        label: "Country List",
        link: "/superadmin/master/country",
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
  } = useForm<CountryListParams>({
    defaultValues: {
      q: props.q,
    },
  });

  const [states, dispatch] = useReducer(
    reducer<CountryDto[]>,
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

  const deleteCountry = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.CountryService.delete(states.id);

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 204) {
      closeDeleteModal();

      toast.success("Country deleted successfully");

      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const fetchCountry = async (q?: string) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.CountryService.getAll(q);
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
      fetchCountry(getValues("q"));
    })();
  }, [states.refreshRequired]);

  const searchCountry = async (formData: CountryListParams) => {
    await actionFunction(formData);
  };

  async function actionFunction(p: CountryListParams) {
    const qs = require("qs");
    await fetchCountry(p.q);
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

  return (
    <>
      <Head>
        <title>Country</title>
      </Head>

      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">Country List</h1>
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
                          label="Search by code, name..."
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search by code, name..."
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
                    Country
                  </Button>
                </Col>
              </Row>

              <div className="tableListItems">
                <div className="formBlock">
                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Locales</th>
                        <th className="text-center">Display Order</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.data &&
                        states.data.map((country: CountryDto) => {
                          return (
                            <tr key={country.id}>
                              <td>{country.code}</td>
                              <td>{country.name}</td>
                              <td>{country.locales}</td>
                              <td className="text-center">
                                {country.displayOrder}
                              </td>
                              <td className="text-center">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Edit</Tooltip>}
                                >
                                  <span
                                    className="btn_main small anchor-span"
                                    onClick={() =>
                                      openAddUpdateModal(country.id)
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
                                      openDeleteModal(country.id);
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
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {states.showAddUpdateModal && (
        <AddCountry
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}

      {states.showDeleteModal && (
        <ConfirmBox
          isOpen={states.showDeleteModal}
          onClose={closeDeleteModal}
          onSubmit={deleteCountry}
          bodyText="Are you sure want to delete this country?"
          noButtonText="Cancel"
          yesButtonText="Confirm"
        />
      )}

      {states.showLoader && <Loader />}
    </>
  );
};

export default CountryPage;

export const getServerSideProps: GetServerSideProps<CountryListParams> = async (
  context
) => {
  let initialParamas: CountryListParams = {
    q: `${context.query.q || ""}`,
  };

  return {
    props: initialParamas,
  };
};
