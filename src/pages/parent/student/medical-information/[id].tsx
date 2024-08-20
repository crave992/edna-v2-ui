import StudentAllergy from "@/components/common/Student/MedicalInformation/Allergy";
import StudentDentist from "@/components/common/Student/MedicalInformation/Dentist";
import StudentImmunization from "@/components/common/Student/MedicalInformation/Immunization";
import StudentPhysician from "@/components/common/Student/MedicalInformation/Physician";
import VerifyPassword from "@/components/common/VerifyPassword";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StudentBasicDto } from "@/dtos/StudentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, SetStateAction } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

interface StudentMedicalInfoParams {
  id: number;
}

const StudentMedicalInfo: NextPage<StudentMedicalInfoParams> = ({ id }) => {
  useBreadcrumb({
    pageName: "Medical Information",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/parent/dashboard",
      },
      {
        label: "Students",
        link: `/parent/student/profile/${id}`,
      },
      {
        label: "Medical Info",
        link: `/parent/student/medical-information/${id}`,
      },
    ],
  });

  const router = useRouter();
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [student, setStudent] = useState<StudentBasicDto>();
  const fetchStudent = async (studentId: number) => {
    const response =
      await unitOfService.StudentService.getBasicStudentDetailsById(studentId);
    if (response && response.status === 200 && response.data.data) {
      setStudent(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStudent(id);
    })();
  }, []);

  const [nextIndexTab, setNextIndexTab] = useState<number>(0);
  useEffect(() => {
    const warningText = 'You have unsaved changes. Are you sure you want to leave this page?';

    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();

      return (e.returnValue = warningText);
    };

    const handleBrowseAway = () => {
      if (!isDirty) return;
      if (window.confirm(warningText)) {
        router.events.off('routeChangeStart', handleBrowseAway);
        return;
      }
      router.events.emit('routeChangeError');

      throw 'routeChange aborted.';
    };

    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [isDirty, nextIndexTab]);

  const handleSelectTab = (index: SetStateAction<number>, nextIndexTab: number) => {
    const warningText = 'You have unsaved changes. Are you sure you want to leave this page?';
    if (isDirty && (index !== nextIndexTab)){
      if (window.confirm(warningText)) {
        return;
      }
      router.events.emit('routeChangeError');

      throw 'routeChange aborted.';
    }
  }

  return (
    <>
      <Head>
        <title>Student Medical Information - Noorana</title>
      </Head>
      {
        isVerified ? (
        <div className="student_medical_info">
          <Container fluid>
            <Row>
              <Col md={12} lg={10} xl={8} xxl={6}>
                <div className="db_heading_block">
                  <h1 className="db_heading">{student?.name}</h1>
                </div>
                {student && (
                  <Tabs onSelect={index => handleSelectTab(index, nextIndexTab)}>
                    <TabList>
                      <Tab>Physician</Tab>
                      <Tab>Dentist</Tab>
                      <Tab>Allergies</Tab>
                      <Tab>Immunization Information</Tab>
                    </TabList>

                    <TabPanel>
                      <StudentPhysician studentId={id} isDirty={isDirty} setIsDirty={setIsDirty}/>
                    </TabPanel>
                    <TabPanel>
                      <StudentDentist studentId={id} isDirty={isDirty} setIsDirty={setIsDirty}/>
                    </TabPanel>
                    <TabPanel>
                      <StudentAllergy studentId={id} isDirty={isDirty} setIsDirty={setIsDirty}/>
                    </TabPanel>
                    <TabPanel>
                      <StudentImmunization studentId={id} isDirty={isDirty} setIsDirty={setIsDirty}/>
                    </TabPanel>
                  </Tabs>
                )}
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
    </>
  );
};
export default StudentMedicalInfo;

export const getServerSideProps: GetServerSideProps<
  StudentMedicalInfoParams
> = async (context) => {
  let initialParamas: StudentMedicalInfoParams = {
    id: +(context.query.id || 0),
  };

  return {
    props: initialParamas,
  };
};
