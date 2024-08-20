import ViewParent from "@/components/common/Student/ViewParent";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
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
        link: "/parent/dashboard",
      },
      {
        label: "Student",
        link: `/parent/student/profile/${id}`,
      },
      {
        label: "Parent Info",
        link: `/parent/student/parent-details/${id}`,
      },
    ],
  });
  return (
    <>
      <Head>
        <title>Student Parent Info - Noorana</title>
      </Head>
      <div className="student_parent_info">
        <Container fluid>
          <div className="db_heading_block">
            <h1 className="db_heading">Parent Info - Student Name</h1>
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
