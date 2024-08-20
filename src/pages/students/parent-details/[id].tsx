import ViewParent from "@/components/common/Student/ViewParent";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StudentBasicDto } from "@/dtos/StudentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

interface ParentDetailsPagePropsParams {
  id: number;
}

const ParentDetailsPage: NextPage<ParentDetailsPagePropsParams> = ({ id }) => {
  useBreadcrumb({
    pageName: "Parent Info",
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
        label: "Parent Info",
        link: `/students/parent-details/${id}`,
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
        <title>Student Parent Info - Noorana</title>
      </Head>
      <div className="student_parent_info">
        <Container fluid>
          <div className="db_heading_block">
            <h1 className="db_heading">Parent Info: {student?.name}</h1>
          </div>
          <ViewParent studentId={id} />
        </Container>
      </div>
    </>
  );
};
export default ParentDetailsPage;

export const getServerSideProps: GetServerSideProps<
  ParentDetailsPagePropsParams
> = async (context) => {
  let initialParamas: ParentDetailsPagePropsParams = {
    id: +(context.query.id || 0),
  };

  return {
    props: initialParamas,
  };
};
