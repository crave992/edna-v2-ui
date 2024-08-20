import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import StudentListParams from "@/params/StudentListParams";
import StudentList from "@/components/common/Student/List";
import siteMetadata from "@/constants/siteMetadata";

const StudentListPage: NextPage<StudentListParams> = (props) => {
  useBreadcrumb({
    pageName: "Student List",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/admin/dashboard",
      },
      {
        label: "Students",
        link: "/students",
      },
    ],
  });

  return (
    <>
      <Head>
        <title>{`Student List | ${siteMetadata.title}`}</title>
      </Head>
      <StudentList
        classId={props.classId}
        levelId={props.levelId}
        page={props.page}
        q={props.q}
        recordPerPage={props.recordPerPage}
        sortBy={props.sortBy}
        sortDirection={props.sortDirection}
        ageFilter={props.ageFilter}
        active={props.active}
      />
    </>
  );
};

export default StudentListPage;

export const getServerSideProps: GetServerSideProps<StudentListParams> = async (
  context
) => {
  let initialParamas: StudentListParams = {
    q: `${context.query.q || ""}`,
    active: `${context.query.active || ""}`,
    ageFilter: `${context.query.ageFilter || ""}`,
    levelId: +(context.query.levelId || 0),
    classId: +(context.query.classId || 0),
    page: +(context.query.page || 1),
    recordPerPage: +(
      context.query.recordPerPage ||
      +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)
    ),
    sortBy: `${context.query.sortBy || "name"}`,
    sortDirection: `${context.query.sortDirection || "asc"}`,
  };

  return {
    props: initialParamas,
  };
};
