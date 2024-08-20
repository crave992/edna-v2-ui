import CustomSelect from '@/components/common/CustomFormControls/CustomSelect';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import { ClassBasicDto } from '@/dtos/ClassDto';
import LevelDto from '@/dtos/LevelDto';
import SepAreaDto from '@/dtos/SepAreaDto';
import SepLevelDto from '@/dtos/SepLevelDto';
import { SepTopicAssessmentDto } from '@/dtos/SepTopicDto';
import { StudentBasicDto } from '@/dtos/StudentDto';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { faFileLines } from '@fortawesome/pro-regular-svg-icons';
import { faHistory } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Col, Container, Form, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ViewHistory from '@/components/common/Student/SEPAssessment/ViewHistory';
import CommonProps from '@/models/CommonProps';
import CustomInput from '../../CustomFormControls/CustomInput';
import ViewComment from './ViewComment';
import { useSession } from 'next-auth/react';
import RoleDto from '@/dtos/RoleDto';
import { Role, StaffRoles } from '@/helpers/Roles';

interface ViewSEPAssessmentProps extends CommonProps {
  studentId: number;
}

const ViewSEPAssessment: NextPage<ViewSEPAssessmentProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { handleSubmit, setValue, getValues, control } = useForm({
    defaultValues: {
      studentId: props.studentId,
      levelId: 0,
      classId: 0,
      sepAreaId: 0,
      sepLevelId: 0,
    },
  });

  const [sepTopics, setSepTopic] = useState<SepTopicAssessmentDto[]>([]);
  const fetchTopics = async () => {
    setSepTopic([]);
    if (
      getValues().studentId > 0 &&
      getValues().classId > 0 &&
      getValues().levelId > 0 &&
      getValues().sepAreaId > 0 &&
      getValues().sepLevelId > 0
    ) {
      const response = await unitOfService.SEPAssessmentService.getSepTopicsForAssessment(
        getValues().studentId,
        getValues().classId,
        getValues().levelId,
        getValues().sepAreaId,
        getValues().sepLevelId
      );
      if (response && response.status === 200 && response.data.data) {
        setSepTopic(response.data.data);
      } else {
        setSepTopic([]);
      }
    }
  };

  const [studentDetail, setStudentDetail] = useState<StudentBasicDto>();
  const fetchStudentDetail = async (id: number) => {
    const response = await unitOfService.StudentService.getBasicStudentDetailsById(id);
    if (response && response.status === 200 && response.data.data) {
      setStudentDetail(response.data.data);
    }
  };

  const [levels, setLevel] = useState<LevelDto[]>([]);
  const fetchLevel = async () => {
    const response = await unitOfService.LevelService.getAll();
    if (response && response.status === 200 && response.data.data) {
      setLevel(response.data.data);
    }
  };

  const [classes, setClass] = useState<ClassBasicDto[]>([]);
  const fetchClass = async (levelId: number, studentId: number) => {
    const response = await unitOfService.ClassService.getClassByLevelIdAndStudentId(levelId, studentId);
    if (response && response.status === 200 && response.data.data) {
      setClass(response.data.data);
    }
  };

  const [sepAreas, setSepArea] = useState<SepAreaDto[]>([]);
  const fetchSepArea = async (levelId: number) => {
    const response = await unitOfService.SepAreaService.getAreaByLevel(levelId);
    if (response && response.status === 200 && response.data.data) {
      setSepArea(response.data.data);
    }
  };

  const [sepLevel, setSepLevel] = useState<SepLevelDto[]>([]);
  const fetchSepLevel = async (levelId: number, areaId: number) => {
    const response = await unitOfService.SepLevelService.getLevelByLevelAndArea(levelId, areaId);
    if (response && response.status === 200 && response.data.data) {
      setSepLevel(response.data.data);
    }
  };

  const formSelectChange = async (controlName: string, value: number) => {
    if (controlName == 'levelId') {
      setValue('levelId', value);
      if (value > 0) {
        await fetchClass(value, props.studentId);
        await fetchSepArea(value);
      } else {
        setClass([]);
        setSepArea([]);
      }

      setSepLevel([]);

      setValue('classId', 0);
      setValue('sepAreaId', 0);
      setValue('sepLevelId', 0);
    } else if (controlName == 'classId') {
      setValue('classId', value);
    } else if (controlName == 'sepAreaId') {
      setValue('sepAreaId', value);
      await fetchSepLevel(getValues().levelId, value);
    } else if (controlName == 'sepLevelId') {
      setValue('sepLevelId', value);
    }

    fetchTopics();
  };

  useEffect(() => {
    (async () => {
      await fetchLevel();
      await fetchStudentDetail(props.studentId);
    })();
  }, []);

  const marks = {
    0: 'Not Started',
    1: 'Never',
    2: 'Sometimes',
    3: 'Often',
    4: 'Frequently',
    5: 'Always',
  };

  const [viewHistory, setViewHistory] = useState<boolean>(false);
  const [sepTopicId, setSepTopicId] = useState<number>(0);
  const [sepAssessmentId, setSEPAssessmentId] = useState<number>(0);
  const openViewHistoryModal = (sepAssessmentId: number, sepTopicId: number) => {
    setSEPAssessmentId(sepAssessmentId);
    setSepTopicId(sepTopicId);
    setViewHistory(true);
  };

  const closeViewHistoryModal = () => {
    setSEPAssessmentId(0);
    setSepTopicId(0);
    setViewHistory(false);
  };

  const [saveComment, setSaveComment] = useState<boolean>(false);
  const openSaveCommentModal = (sepAssessmentId: number, sepTopicId: number) => {
    setSEPAssessmentId(sepAssessmentId);
    setSepTopicId(sepTopicId);
    setSaveComment(true);
  };

  const closeSaveCommentModal = () => {
    setSEPAssessmentId(0);
    setSepTopicId(0);
    setSaveComment(false);
  };

  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    if (session && session.user) {
      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);
      setRoles(roles);
    }
  }, [status]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <div className="db_heading_block">
              <h1 className="db_heading">Name: {studentDetail?.name}</h1>
            </div>
          </Col>
        </Row>
        <Row>
          <Form method="get" autoComplete="off" onSubmit={handleSubmit(fetchTopics)}>
            <Row className="mb-4">
              <CustomInput name="studentId" control={control} type="hidden" />
              <Col>
                <Form.Label>Select Level</Form.Label>
                <CustomSelect
                  name="levelId"
                  control={control}
                  placeholder="Select Level*"
                  options={levels}
                  isSearchable={true}
                  textField="name"
                  valueField="id"
                  onChange={async (option) => {
                    const selectedId = +(option?.[0] || 0);
                    await formSelectChange('levelId', selectedId);
                  }}
                />
              </Col>
              <Col>
                <Form.Label>Select Class</Form.Label>
                <CustomSelect
                  name="classId"
                  control={control}
                  placeholder="Select Class*"
                  options={classes}
                  isSearchable={true}
                  textField="name"
                  valueField="id"
                  onChange={async (option) => {
                    const selectedId = +(option?.[0] || 0);
                    await formSelectChange('classId', selectedId);
                  }}
                />
              </Col>
              <Col>
                <Form.Label>Select Area</Form.Label>
                <CustomSelect
                  name="sepAreaId"
                  control={control}
                  placeholder="Select Area*"
                  options={sepAreas}
                  isSearchable={true}
                  textField="name"
                  valueField="id"
                  onChange={async (option) => {
                    const selectedId = +(option?.[0] || 0);
                    await formSelectChange('sepAreaId', selectedId);
                  }}
                />
              </Col>
              <Col>
                <Form.Label>Select Level</Form.Label>
                <CustomSelect
                  name="sepLevelId"
                  control={control}
                  placeholder="Select Level*"
                  options={sepLevel}
                  isSearchable={true}
                  textField="name"
                  valueField="id"
                  onChange={async (option) => {
                    const selectedId = +(option?.[0] || 0);
                    await formSelectChange('sepLevelId', selectedId);
                  }}
                />
              </Col>
            </Row>
          </Form>
        </Row>
        <Row>
          <Col md={12}>
            <Table striped hover className="custom_design_table mb-0">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th colSpan={6}>
                    <span className="d-flex flex-1 justify-content-between">
                      <span>Not Started</span>
                      <span>Never</span>
                      <span>Sometimes</span>
                      <span>Often</span>
                      <span>Frequently</span>
                      <span>Always</span>
                    </span>
                  </th>
                  <th className="text-center">Last Update</th>

                  {roles && StaffRoles.some( role => roles.includes(role))  && (
                    <th className="text-center">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {sepTopics &&
                  sepTopics.map((topic) => {
                    let selecetdValue = +topic.status;

                    return (
                      <tr key={topic.sepTopicId}>
                        <td>{topic.sepTopicName}</td>

                        <td colSpan={6}>
                          <Slider
                            min={0}
                            max={5}
                            step={1}
                            marks={marks}
                            defaultValue={selecetdValue}
                            railStyle={{ backgroundColor: '#ccc' }}
                            trackStyle={{ backgroundColor: '#0084ff' }}
                            handleStyle={{
                              borderColor: '#0084ff',
                              backgroundColor: '#0084ff',
                            }}
                            dotStyle={{
                              borderColor: '#0084ff',
                              backgroundColor: '#0084ff',
                            }}
                            disabled={true}
                          />
                        </td>
                        <td className="text-center">
                          {topic.assessmentDate &&
                            unitOfService.DateTimeService.convertToLocalDate(topic.assessmentDate)}
                        </td>

                        {roles && StaffRoles.some( role => roles.includes(role))  && (
                          <td className="text-center">
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 100 }}
                              overlay={<Tooltip>Notes</Tooltip>}
                            >
                              <span
                                className="btn_main small anchor-span"
                                onClick={() => {
                                  openSaveCommentModal(topic.sepAssessmentId, topic.sepTopicId);
                                }}
                              >
                                <FontAwesomeIcon icon={faFileLines} size="1x" />
                              </span>
                            </OverlayTrigger>

                            {topic.sepAssessmentId > 0 && (
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>History</Tooltip>}
                              >
                                <span
                                  className="btn_main small anchor-span"
                                  onClick={() => {
                                    openViewHistoryModal(topic.sepAssessmentId, topic.sepTopicId);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faHistory} size="1x" />
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      {viewHistory && (
        <ViewHistory
          isOpen={viewHistory}
          onClose={closeViewHistoryModal}
          classId={getValues().classId}
          sepAssessmentId={sepAssessmentId}
          sepTopicId={sepTopicId}
          studentId={getValues().studentId}
        />
      )}

      {saveComment && (
        <ViewComment isOpen={saveComment} onClose={closeSaveCommentModal} sepAssessmentId={sepAssessmentId} />
      )}
    </>
  );
};
export default ViewSEPAssessment;
