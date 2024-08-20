import UpdateStudentByAdmin from "@/components/common/Student/UpdateByAdmin";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import siteMetadata from "@/constants/siteMetadata";
import { StudentDto } from "@/dtos/StudentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
} from "react-bootstrap";

interface StudentBioPageParams {
  id: number;
  parentId: number;
}

const StudentBioPage: NextPage<StudentBioPageParams> = ({ id, parentId }) => {
  useBreadcrumb({
    pageName: "Student Profile",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/admin/dashboard",
      },
      {
        label: "Student Profile",
        link: `/students/info/${id}`,
      },
      {
        label: "Bio",
        link: `/students/bio/${id}`,
      },
    ],
  });

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [student, setStudent] = useState<StudentDto>();
  const fetchStudent = async (studentId: number) => {
    const response = await unitOfService.StudentService.getByStudentId(
      studentId
    );
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
        <title>{`Student Bio | ${siteMetadata.title}`}</title>
      </Head>
      <div className="student_profile">
        <Container fluid>
          {student && (
            <>
              <Row>
                <Col md={6} lg={6}>
                  <div className="db_heading_block">
                    <h1 className="db_heading">
                      Bio: {student.firstName} {student.lastName}
                    </h1>
                  </div>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={12} lg={10} xl={8}>
                  <UpdateStudentByAdmin student={student} parentId={parentId} />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </>
  );
};
export default StudentBioPage;

export const getServerSideProps: GetServerSideProps<
  StudentBioPageParams
> = async (context) => {
  let initialParamas: StudentBioPageParams = {
    id: +(context.query.id || 0),
    parentId: +(context.query.parentId || 0),
  };

  return {
    props: initialParamas,
  };
};
