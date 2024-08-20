import ViewConsentFormPage from '@/components/common/Student/Forms/Consent/ViewConsentForm';
import ViewInputForms from '@/components/common/Student/Forms/InputForm/ViewInputForms';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import { ParentDto } from '@/dtos/ParentDto';
import { StudentDto } from '@/dtos/StudentDto';
import { StudentInputFormTypes } from '@/helpers/StudentInputFormTypes';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import CommonProps from '@/models/CommonProps';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

interface StudentConsentInputFormsParams {
  id: number;
  levelId: number;
}
interface StudentConsentFormProps extends CommonProps {
  id: number;
  levelId: number;
}

const StudentConsentInputForms: NextPage<StudentConsentFormProps> = (props) => {
  useBreadcrumb({
    pageName: 'Student Forms',
    breadcrumbs: [
      {
        label: 'Dashboard',
        link: '/admin/dashboard',
      },
      {
        label: 'Student Profile',
        link: `/students/info/${props.id}`,
      },
      {
        label: 'Student Forms',
        link: `/students/forms/${props.id}`,
      },
    ],
  });

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [student, setStudent] = useState<StudentDto>();
  const fetchStudent = async (studentId: number) => {
    const response = await unitOfService.StudentService.getByStudentId(studentId);
    if (response && response.status === 200 && response.data.data) {
      setStudent(response.data.data);
    }
  };

  const [parents, setParents] = useState<ParentDto[]>();
  const fetchParents = async (studentId: number) => {
    const response = await unitOfService.ParentService.getAllParentsByStudentId(studentId);
    if (response && response.status === 200 && response.data.data) {
      setParents(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStudent(props.id);
      await fetchParents(props.id);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Student Forms - Noorana</title>
      </Head>
      <div className="student_forms_info">
        {student && (
          <Container fluid>
            <Row>
              <Col md={12} lg={12} xxl={10}>
                <div className="db_heading_block">
                  <h1 className="db_heading">
                    Forms: {student.firstName} {student.lastName}
                  </h1>
                </div>

                {parents && (
                  <>
                    <div>
                      <h4 style={{ fontSize: '18px', fontStyle: 'italic' }}>Parent Details</h4>
                      {parents.map((parent, index) => {
                        return (
                          <div key={`parent-${parent.id}- ${index}`}>
                            <p style={{ marginBottom: 0 }}>
                              <strong>Name: </strong> {parent.firstName} {parent.lastName}
                            </p>
                            {parent.email && (
                              <p>
                                <strong>Email: </strong> {parent.email}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                <Tabs>
                  <TabList>
                    <Tab>Consent Forms</Tab>
                    <Tab>Student Input Forms</Tab>
                    <Tab>General Permission</Tab>
                    <Tab>Going Out</Tab>
                  </TabList>

                  <TabPanel>
                    <ViewConsentFormPage studentId={props.id} />
                  </TabPanel>
                  <TabPanel>
                    <ViewInputForms studentId={props.id} formType={StudentInputFormTypes.StudentInputForm} />
                  </TabPanel>
                  <TabPanel>
                    <ViewInputForms studentId={props.id} formType={StudentInputFormTypes.GeneralPermissions} />
                  </TabPanel>
                  <TabPanel>
                    <ViewInputForms studentId={props.id} formType={StudentInputFormTypes.GoingOutForm} />
                  </TabPanel>
                </Tabs>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};
export default StudentConsentInputForms;

export const getServerSideProps: GetServerSideProps<StudentConsentInputFormsParams> = async (context) => {
  let initialParamas: StudentConsentInputFormsParams = {
    id: +(context.query.id || 0),
    levelId: +(context.query.levelId || 0),
  };

  return {
    props: initialParamas,
  };
};
