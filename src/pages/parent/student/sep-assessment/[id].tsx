import ViewSEPAssessment from "@/components/common/Student/SEPAssessment/ViewSEPAssessment";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

interface SEPAssessmentProps extends CommonProps {
  id: number;
}

const SEPAssessmentPage: NextPage<SEPAssessmentProps> = (props) => {
  useBreadcrumb({
    pageName: "SEP Assessment",
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
        label: "SEP Assessment",
        link: `/parent/student/sep-assessment/${props.id}`,
      },
    ],
  });

  return (
    <>
      <Head>
        <title>SEP Assessment - Noorana</title>
      </Head>
      <div className="sep_assessment_page">
        <ViewSEPAssessment studentId={props.id} />
      </div>
    </>
  );
};
export default SEPAssessmentPage;

export const getServerSideProps: GetServerSideProps<
  SEPAssessmentProps
> = async (context) => {
  let initialParamas: SEPAssessmentProps = {
    id: +(context.query.id || 0),
  };

  return {
    props: initialParamas,
  };
};
