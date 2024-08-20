import { NextPage } from 'next';
import Link from 'next/link';
import { Col, Container, FloatingLabel, OverlayTrigger, Row, Tooltip, Form, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faUser, faBriefcaseMedical, faTruckPickup, faPlusCircle } from '@fortawesome/pro-solid-svg-icons';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { container } from '@/config/ioc';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { TYPES } from '@/config/types';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import StudentListParams from '@/params/StudentListParams';
import { InPageActionType, InPageState, reducer } from '@/reducers/InPageAction';
import LevelDto from '@/dtos/LevelDto';
import { useDebounce } from 'use-debounce';
import CustomSelect from '@/components/common/CustomFormControls/CustomSelect';
import { ClassBasicDto } from '@/dtos/ClassDto';
import { StudentListResponseDto } from '@/dtos/StudentDto';
import CustomInput from '@/components/common/CustomFormControls/CustomInput';
import Pagination from '@/components/common/Pagination';
import RecordPerPageOption from '../../RecordPerPageOption';
import LevelListParams from '@/params/LevelListParams';

const initialPageState: InPageState<StudentListResponseDto> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const StudentList: NextPage<StudentListParams> = (props) => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<StudentListResponseDto>, initialPageState);

  const { handleSubmit, setValue, getValues, control, register } =
    useForm<StudentListParams>({
      defaultValues: {
        q: props.q,
        levelId: props.levelId,
        classId: props.classId,
        ageFilter: props.ageFilter,
        page: props.page,
        recordPerPage: props.recordPerPage,
        active: 'true',
      },
    });

  const submitData = async (formData: StudentListParams) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });

    formData.page = 1;
    setValue('page', formData.page);

    await actionFunction(formData);
  };

  async function changePage(pageNumber: number) {
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: pageNumber,
    });

    let values = getValues();
    values.page = pageNumber;
    setValue('page', pageNumber);

    await actionFunction(values);
  }

  async function actionFunction(p: StudentListParams) {
    const qs = require('qs');
    await fetchStudent(p);
    router.push(
      {
        query: qs.stringify(p),
      },
      undefined,
      { shallow: true }
    );
  }

  const fetchStudent = async (p?: StudentListParams) => {
    if (!p) {
      p = props;
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.StudentService.getStudents(p);
    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.SET_DATA,
        payload: response.data.data,
      });

      dispatch({
        type: InPageActionType.SHOW_LOADER,
        payload: false,
      });
    }
  };

  const [levels, setLevel] = useState<LevelDto[]>([]);
  const fetchLevel = async (q?: LevelListParams) => {
    const response = await unitOfService.LevelService.getAll(q);
    if (response && response.status === 200 && response.data.data) {
      setLevel(response.data.data);
    }
  };

  const [classes, setClass] = useState<ClassBasicDto[]>([]);
  const fetchClass = async (levelId: number) => {
    const response = await unitOfService.ClassService.getClassByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setClass(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchLevel();
      await fetchClass(props.levelId);
      await fetchStudent();
      await formSelectChange('active', 'true');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetchStudent();
    })();
  }, [states.refreshRequired]);

  const formSelectChange = async (name: string, value: number | string) => {
    if (name === 'levelId') {
      setValue('levelId', +value);
      setValue('classId', 0);
      await fetchClass(+value);
    } else if (name === "classId") {
      setValue("classId", +value);
    } else if (name === "recordPerPage") {
      setValue("recordPerPage", +value);
    } else if (name === "ageFilter") {
      setValue("ageFilter", value.toString());
    } else if (name === "active") {
      setValue("active", value.toString());
    }

    setValue('page', 1);
    dispatch({
      type: InPageActionType.SET_CURRENT_PAGE,
      payload: 1,
    });
    await actionFunction(getValues());
  };

  const [searchText, setSearchText] = useState<string>('');
  const formInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let searchedText = e.target.value || '';
    if (e.target.name === 'q') {
      setSearchText(searchedText);
      setValue('q', searchedText);
      setValue('page', 1);
      dispatch({
        type: InPageActionType.SET_CURRENT_PAGE,
        payload: 1,
      });
    }
  };

  const [searchedValue] = useDebounce(searchText, 1000);
  useEffect(() => {
    (async () => {
      await actionFunction(getValues());
    })();
  }, [searchedValue]);

  return (
    <>
      <div className="student_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12} xxl={9}>
              <Form method="get" autoComplete="off" onSubmit={handleSubmit(submitData)}>
                <CustomInput type="hidden" name="sortBy" control={control} />
                <CustomInput type="hidden" name="sortDirection" control={control} />
                <div className="db_heading_block">
                  <h1 className="db_heading">Student List</h1>
                  <Link href={"/students/add"} className="btn_main">
                    <FontAwesomeIcon icon={faPlusCircle} size="1x" /> Add Student
                  </Link>
                </div>
                <Row>
                  <Col md={12}>
                    <div className="searchSortBlock">
                      <div className="sortBlock">
                        <Row>
                          <Col md={6} lg={4}>
                            <Form.Group className="mb-3">
                              <FloatingLabel label="Record Per Page">
                                <Form.Select
                                  {...register('recordPerPage')}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                    formSelectChange('recordPerPage', +e.target.value);
                                  }}
                                >
                                  <RecordPerPageOption />
                                </Form.Select>
                              </FloatingLabel>
                            </Form.Group>
                          </Col>
                          <Col md={6} lg={4}>
                            <FloatingLabel controlId="floatingInput" label="Search by name..." className="mb-3">
                              <Form.Control
                                type="text"
                                placeholder="Search by name..."
                                {...register('q')}
                                onChange={formInputChange}
                              />
                            </FloatingLabel>
                          </Col>
                          <Col md={6} lg={4}>
                            <FloatingLabel label="Filter By Age" className="mb-3">
                              <Form.Select
                                aria-label="Filter By Age"
                                {...register('ageFilter')}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                  formSelectChange('ageFilter', e.target.value);
                                }}
                              >
                                <option value="">Select Age</option>
                                <option value="below_3_years">Below 3 Years</option>
                                <option value="3_to_6_years">3-6 Years</option>
                                <option value="more_than_6_years">More Than 6 Years</option>
                              </Form.Select>
                            </FloatingLabel>
                          </Col>
                          <Col md={6} lg={4}>
                            <FloatingLabel label="" className="mb-3">
                              <CustomSelect
                                name="levelId"
                                control={control}
                                placeholder="Level"
                                isSearchable={true}
                                options={levels}
                                textField="name"
                                valueField="id"
                                onChange={(value) => {
                                  formSelectChange('levelId', +(value?.[0] || 0));
                                }}
                              />
                            </FloatingLabel>
                          </Col>
                          <Col md={6} lg={4}>
                            <FloatingLabel label="" className="mb-3">
                              <CustomSelect
                                name="classId"
                                control={control}
                                placeholder="Class"
                                isSearchable={true}
                                options={classes}
                                textField="name"
                                valueField="id"
                                onChange={(value) => {
                                  formSelectChange('classId', +(value?.[0] || 0));
                                }}
                              />
                            </FloatingLabel>
                          </Col>
                          <Col md={6} lg={4}>
                            <FloatingLabel label="" className="mb-3">
                              <CustomSelect
                                name="active"
                                control={control}
                                placeholder="Status"
                                options={[
                                  { label: "All", value: "" },
                                  { label: "Active", value: "true" },
                                  { label: "Inactive", value: "false" },
                                ]}
                                textField="label"
                                valueField="value"
                                onChange={(value) => {
                                  formSelectChange("active", value?.[0] || "");
                                }}
                              />
                            </FloatingLabel>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="tableListItems">
                  {!states.showLoader && (
                    <Pagination
                      className="pagination-bar"
                      currentPage={states.currentPage}
                      totalCount={states.data?.totalRecord}
                      pageSize={getValues().recordPerPage}
                      onPageChange={(page: number) => changePage(page)}
                    />
                  )}
                  {states.data &&
                    states.data?.student.map((student) => {
                      return (
                        <div className="renderStaff" key={student.id}>
                          <div className="userDetailsMain">
                            <div className="userAvatar">
                              {student.profilePicture ? (
                                <Image
                                  fluid
                                  alt={student.name}
                                  src={student.profilePicture}
                                  style={{ maxWidth: '70px' }}
                                />
                              ) : (
                                <FontAwesomeIcon icon={faUser} size="2x" />
                              )}
                            </div>
                            <div className="userDetails">
                              <h2>
                                {student.name} {!student.active && "(Inactive)"}
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 100 }}
                                  overlay={<Tooltip>Medical Info</Tooltip>}
                                >
                                  <Link
                                    href={`/students/medical-information/${student.id}`}
                                    className="orange_color ms-2"
                                  >
                                    <FontAwesomeIcon icon={faBriefcaseMedical} size="1x" />
                                  </Link>
                                </OverlayTrigger>
                              </h2>
                              <p>
                                {student.classes &&
                                  student.classes.map((cla) => {
                                    return (
                                      <span
                                        key={cla.id}
                                        className="badge badge-primary"
                                        style={{ backgroundColor: '#5d8eb5', marginRight: '5px' }}
                                      >
                                        {cla.name}
                                      </span>
                                    );
                                  })}
                              </p>
                              <p>{student.age}</p>
                              <p>Level: {student.levelName}</p>
                              {!student.isPaid && (
                                <>
                                  <small>
                                    <span style={{ textDecoration: 'none', color: '#fd1111' }}>
                                      <i>Registration payment pending</i>
                                    </span>
                                  </small>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="userActions">
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Profile</Tooltip>}
                            >
                              <Link href={`/students/info/${student.id}`} className="btn_main small">
                                <FontAwesomeIcon icon={faInfo} size="1x" />
                              </Link>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Pickup/Dropoff History</Tooltip>}
                            >
                              <Link
                                href={`/students/pickup-dropoff-history?studentId=${student.id}`}
                                className="btn_main small"
                              >
                                <FontAwesomeIcon icon={faTruckPickup} size="1x" />
                              </Link>
                            </OverlayTrigger>
                          </div>
                        </div>
                      );
                    })}

                  {!states.showLoader && (
                    <Pagination
                      className="pagination-bar"
                      currentPage={states.currentPage}
                      totalCount={states.data?.totalRecord}
                      pageSize={getValues().recordPerPage}
                      onPageChange={(page: number) => changePage(page)}
                    />
                  )}
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default StudentList;
