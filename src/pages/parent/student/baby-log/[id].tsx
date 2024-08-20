import StudentBabyLog from "@/components/common/Student/BabyLog";
import ViewStudentDiapering from "@/components/common/Student/BabyLog/Diapering/ViewDiapering";
import ViewStudentFeeding from "@/components/common/Student/BabyLog/Feeding/ViewFeeding";
import StudentNapping from "@/components/common/Student/BabyLog/Napping";
import ViewStudentNapping from "@/components/common/Student/BabyLog/Napping/ViewNapping";
import ViewStudentOtherBabyLog from "@/components/common/Student/BabyLog/Other/ViewOtherBabyLog";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StudentBasicDto } from "@/dtos/StudentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

interface StudentMedicalInfoParams {
    id: number;
}

const StudentMedicalInfo: NextPage<StudentMedicalInfoParams> = ({ id }) => {
    useBreadcrumb({
        pageName: "Baby Log",
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
                label: "Baby Log",
                link: `/parent/student/baby-log/${id}`,
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

    useEffect(() => {
        (async () => {
            await fetchStudent(id);
        })();
    }, []);

    return (
        <>
            <Head>
                <title>Student Baby Log - Noorana</title>
            </Head>
            <div className="student_medical_info">
                <Container fluid>
                    {student && (
                        <>
                            <Row className="mb-2">
                                <Col md={12} lg={12} xl={6}>
                                    <div className="db_heading_block">
                                        <h1 className="db_heading">Baby Log: {student?.name}</h1>
                                    </div>
                                    <StudentBabyLog id={student.id}/>
                                </Col>
                                <Col md={12} lg={12} xl={6}>
                                    <div className="db_heading_block">
                                        <h1 className="db_heading">Todays School Log</h1>
                                    </div>
                                    <div className="formBlock">
                                        <h3 className="formBlock-heading">Napping</h3>
                                        <ViewStudentNapping id={student.id} />
                                        
                                        <h3 className="formBlock-heading mt-3">Feeding</h3>
                                        <ViewStudentFeeding id={student.id} />

                                        <h3 className="formBlock-heading mt-3">Diapering</h3>
                                        <ViewStudentDiapering id={student.id} />

                                        <h3 className="formBlock-heading mt-3">Others</h3>
                                        <ViewStudentOtherBabyLog id={student.id} />
                                    </div>
                                </Col>
                            </Row>
                        </>
                    )}
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
