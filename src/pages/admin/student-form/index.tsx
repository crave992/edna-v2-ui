import { GetServerSideProps, NextPage } from "next";
import React, { Fragment, useEffect, useReducer } from "react";
import CommonProps from "@/models/CommonProps";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import Head from "next/head";
import {
  Badge,
  Button,
  ButtonGroup,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faPlusCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import AddEmploymentForm from "@/components/common/EmploymentForm";
import Link from "next/link";
import { StudentFormDto } from "@/dtos/StudentFormDto";
import AddStudentForm from "@/components/common/StudentForm";

interface StudentFormParams {
  q?: string;
}

interface StudentFormPageProps extends CommonProps {
  q?: string;
}

const initialPageState: InPageState<StudentFormDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};
const StudentFormPage: NextPage<StudentFormPageProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const router = useRouter();
  const {
    formState: { errors },
  } = useForm<StudentFormParams>({
    defaultValues: {
      q: props.q,
    },
  });

  const [states, dispatch] = useReducer(
    reducer<StudentFormDto[]>,
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

  const fetchStudentForms = async (q?: string) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StudentFormService.getAll(q || "");
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
      fetchStudentForms();
    })();
  }, [states.refreshRequired]);

  useBreadcrumb({
    pageName: "Student Form",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Student Form",
        link: "/admin/student-form",
      },
    ],
  });

  return (
    <>
      <Head>
        <title>Student Form</title>
      </Head>
      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">Student Form</h1>
              </div>
              <Row>
                <Col lg={9}>
                  <p>
                    Upload the documents which are required for all the student
                    to fill up under Admission Form section
                  </p>
                </Col>
                <Col lg={3} className="text-end mb-2">
                  <Button
                    className="btn_main"
                    onClick={() => openAddUpdateModal(0)}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Form
                  </Button>
                </Col>
              </Row>

              <div className="tableListItems">
                <div className="formBlock">
                  <Table striped hover className="custom_design_table mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Level(s)</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.data &&
                        states.data.map((form) => {
                          return (
                            <tr key={form.id}>
                              <td>{form.name}</td>
                              <td>
                                {form.levels &&
                                  form.levels.map((level) => {
                                    return (
                                      <Fragment key={level.levelId}>
                                        <Badge bg="secondary" className="me-1">
                                          {level.levelName}
                                        </Badge>
                                      </Fragment>
                                    );
                                  })}
                              </td>
                              <td className="text-center">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>View</Tooltip>}
                                >
                                  <Link
                                    href={form.docUrl}
                                    target="_blank"
                                    className="btn_main small anchor-span"
                                  >
                                    <FontAwesomeIcon icon={faEye} size="1x" />
                                  </Link>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Edit</Tooltip>}
                                >
                                  <span
                                    className="btn_main small anchor-span"
                                    onClick={() => openAddUpdateModal(form.id)}
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
        <AddStudentForm
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )}
    </>
  );
};

export default StudentFormPage;

export const getServerSideProps: GetServerSideProps<StudentFormParams> = async (
  context
) => {
  let initialParamas: StudentFormParams = {
    q: `${context.query.q || ""}`,
  };

  return {
    props: initialParamas,
  };
};
