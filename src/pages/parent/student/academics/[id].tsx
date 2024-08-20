import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StudentBasicDto } from "@/dtos/StudentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Chart from "react-google-charts";

interface StudentAcademicsProps extends CommonProps {
    id: number;
}

const StudentAcademics: NextPage<StudentAcademicsProps> = (props) => { 
    useBreadcrumb({
        pageName: "Academics",
        breadcrumbs: [
          {
            label: "Dashboard",
            link: "/parent/dashboard",
          },
          {
            label: "Student Profile",
            link: `/parent/student/profile/${props.id}`,
          },
          {
            label: "Academics",
            link: `/parent/student/academics/${props.id}`,
          },
        ],
      });

    const [studentDetails, setStudentDetails] = useState<StudentBasicDto>();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const fetchStudent = async (studentId: number) => {
        let response =
            await unitOfService.StudentService.getBasicStudentDetailsById(studentId);
        if (response && response.status === 200 && response.data.data) {
            setStudentDetails(response.data.data);
        }
    };


    const [studentPerformance, setStudentPerformance] = useState<any>([]);
    const fetchStudentPerformance = async (studentId: number) => {
        const response = await unitOfService.LessonService.getGraphByStudentId(studentId);
        if (response && response.status === 200 && response.data.data) {
            const responseData = response.data.data;
            const transformedData = responseData.map((item) => [
                item.name,
                item.presented,
                item.practiced,
                item.acquired,
            ]);
            setStudentPerformance([["Lesson", "Presented", "Practicing", "Acquired"], ...transformedData]);

        }
    };


    useEffect(() => {
        (async () => {
            await fetchStudent(props.id);
            await fetchStudentPerformance(props.id);
        })();
    }, [props.id]);

    const options = {
        //title: "Population of Largest U.S. Cities",
        chartArea: { width: "70%" },
        isStacked: true,
        legend: { position: "top" },
        hAxis: {
            minValue: 0,
        },
    };

    return (
        <>
            <Head>
                <title>Student Academics - Noorana</title>
            </Head>
            <div className="student_academics">
                <Container fluid>
                    <Row>
                        <Col md={12} lg={12}>
                            <div className="db_heading_block">
                                <h1 className="db_heading">
                                    Academics: {studentDetails?.name}
                                </h1>
                            </div>
                        </Col>
                        <Col md={12} lg={12} xl={12}>
                            <div className="formBlock">
                                <Chart
                                    chartType="BarChart"
                                    width="100%"
                                    height="500px"
                                    data={studentPerformance}
                                    options={options}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default StudentAcademics;

export const getServerSideProps: GetServerSideProps<StudentAcademicsProps> = async (context) => {
    let initialParamas: StudentAcademicsProps = {
        id: +(context.query.id || 0),
    };

    return {
        props: initialParamas,
    };
};