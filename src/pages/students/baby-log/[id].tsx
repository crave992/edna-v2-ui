import StudentDiapering from "@/components/common/Student/BabyLog/Diapering";
import StudentFeeding from "@/components/common/Student/BabyLog/Feeding";
import StudentNapping from "@/components/common/Student/BabyLog/Napping";
import StudentOtherBabyLog from "@/components/common/Student/BabyLog/Other";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import ParentBabyLogDto from "@/dtos/ParentBabyLogDto";
import { StudentBasicDto } from "@/dtos/StudentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

interface StudentMedicalInfoParams {
    id: number;
}

const StudentMedicalInfo: NextPage<StudentMedicalInfoParams> = ({ id }) => {
    useBreadcrumb({
        pageName: "Baby Log",
        breadcrumbs: [
            {
                label: "Dashboard",
                link: "/admin/dashboard",
            },
            {
                label: "Students",
                link: `/students`,
            },
            {
                label: "Baby Log",
                link: `/students/baby-log/${id}`,
            },
        ],
    });

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const [student, setStudent] = useState<StudentBasicDto>();
    const fetchStudent = async (studentId: number) => {
        const response =
            await unitOfService.StudentService.getBasicStudentDetailsById(studentId);
        if (response && response.status === 200 && response.data.data) {
            setStudent(response.data.data);
        }
    };


    const [todayBabyLog, setTodayBabyLog] = useState<ParentBabyLogDto>();
    const fetchTodayBabyLog = async (studentId: number) => {
        const response =
            await unitOfService.ParentBabyLogService.getBabyLogReportByStudentId(studentId);
        if (response && response.status === 200 && response.data.data) {
            setTodayBabyLog(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchStudent(id);
            await fetchTodayBabyLog(id)
        })();
    }, []);

    return (
        <>
            <Head>
                <title>Student Baby Log - Noorana</title>
            </Head>
            <div className="student_medical_info">
                <Container fluid>
                    <Row>
                        
                        <Col md={12} lg={12} xl={6} xxl={6}>
                            {student && (
                                <>
                                    <div className="db_heading_block">
                                        <h1 className="db_heading">Baby Log: {student?.name}</h1>
                                    </div>
                                    <Tabs>
                                        <TabList>
                                            <Tab>Feeding</Tab>
                                            <Tab>Napping</Tab>
                                            <Tab>Diapering</Tab>
                                            <Tab>Other</Tab>
                                        </TabList>

                                        <TabPanel>
                                            <StudentFeeding id={student?.id} />
                                        </TabPanel>
                                        <TabPanel>
                                            <StudentNapping id={student?.id} />
                                        </TabPanel>
                                        <TabPanel>
                                            <StudentDiapering id={student?.id} />
                                        </TabPanel>
                                        <TabPanel>
                                            <StudentOtherBabyLog id={student?.id} />
                                        </TabPanel>
                                    </Tabs>
                                </>
                            )}
                        </Col>
                        <Col md={12} lg={12} xl={6} xxl={6}>
                            <div className="db_heading_block">
                                <h1 className="db_heading">Today Parent Report</h1>
                                
                            </div>
                            <div className="formBlock">
                                <Table striped hover className="custom_design_table mb-0">
                                    <tbody>
                                        {todayBabyLog && (
                                            <>
                                                <tr>
                                                    <td>Bed Time</td>
                                                    <td>{todayBabyLog.bedTime}</td>
                                                </tr>
                                                <tr>
                                                    <td>Wake Time</td>
                                                    <td>{todayBabyLog.wakeTime}</td>
                                                </tr>
                                                <tr>
                                                    <td>Last slept</td>
                                                    <td>{todayBabyLog.lastSlept}</td>
                                                </tr>
                                                <tr>
                                                    <td>For</td>
                                                    <td>{todayBabyLog.hours} Hours, {todayBabyLog.minutes} Minutes</td>
                                                </tr>
                                                <tr>
                                                    <td>Last Diapered</td>
                                                    <td>{todayBabyLog.lastDiapered}</td>
                                                </tr>
                                                <tr>
                                                    <td>Mood</td>
                                                    <td>{todayBabyLog.mood}</td>
                                                </tr>
                                                <tr>
                                                    <td>Health Check</td>
                                                    <td>{todayBabyLog.healthCheck}</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                       
                    </Row>
                </Container>
            </div>
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
