import ViewRecordKeeping from "@/components/common/Student/RecordKeeping/ViewRecordKeeping";
import useBreadcrumb from "@/hooks/useBreadcrumb";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

interface RecordKeepingPageProps {
  levelId: number;
  classId: number;
  areaId: number;
  topicId: number;
  studentId: number;
  q: string;
}

const RecordKeepingPage: NextPage<RecordKeepingPageProps> = (props) => {
  useBreadcrumb({
    pageName: "Record Keeping",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/parent/dashboard",
      },
      {
        label: "Student Profile",
        link: `/parent/student/profile/${props.studentId}`,
      },
      {
        label: "Record Keeping",
        link: `/parent/student/record-keeping/${props.studentId}`,
      },
    ],
  });

  return (
    <>
      <Head>
        <title>Record Keeping</title>
      </Head>

      <ViewRecordKeeping
        areaId={props.areaId}
        classId={props.classId}
        levelId={props.levelId}
        studentId={props.studentId}
        topicId={props.topicId}
        q={props.q}
      />
    </>
  );
};
export default RecordKeepingPage;

export const getServerSideProps: GetServerSideProps<
  RecordKeepingPageProps
> = async (context) => {
  let initialParamas: RecordKeepingPageProps = {
    levelId: +(context.query.levelId || 0),
    classId: +(context.query.classId || 0),
    areaId: +(context.query.areaId || 0),
    topicId: +(context.query.topicId || 0),
    studentId: +(context.query.id || 0),
    q: `${context.query.q || ""}`,
  };

  return {
    props: initialParamas,
  };
};
