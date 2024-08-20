import StudentViewAttendance from "@/components/common/Student/ViewAttendance";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

interface StudentAttendanceProps extends CommonProps {
  id: number;
}

const StudentAttendancePage: NextPage<StudentAttendanceProps> = (props) => {
  useBreadcrumb({
    pageName: "Attendance Details",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Student Profile",
        link: `/students/info/${props.id}`,
      },
      {
        label: "Attendance Details",
        link: `/students/attendance/bystudent/${props.id}`,
      },
    ],
  });

  return (
    <>
      <Head>
        <title>Attendance - Noorana</title>
      </Head>
      <div className="attaendance_overview">
        <StudentViewAttendance studentId={props.id} />
      </div>
    </>
  );
};
export default StudentAttendancePage;

export const getServerSideProps: GetServerSideProps<
  StudentAttendanceProps
> = async (context) => {
  let initialParamas: StudentAttendanceProps = {
    id: +(context.query.id || 0),
  };

  return {
    props: initialParamas,
  };
};
