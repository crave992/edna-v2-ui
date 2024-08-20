import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { StaffTimeTrackingListParams } from "@/params/StaffTimeTrackingListParams";
import ListTimeTracking from "@/components/common/Staff/TimeTracking/ListTimeTracking";

const StaffTimeTrackingPage: NextPage<StaffTimeTrackingListParams> = (
  props
) => {
  useBreadcrumb({
    pageName: "Clock-In/Out",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/staff/dashboard",
      },
      {
        label: "Clock-In/Out Records",
        link: "/staff/clock-in-out",
      },
    ],
  });

  return (
    <>
      <Head>
        <title>Clock-In/Out Record - EDNA</title>
      </Head>

      <div className="parent_list_page">
        <ListTimeTracking
          staffId={props.staffId}
          fromDate={props.fromDate}
          page={props.page}
          q={props.q}
          recordPerPage={props.recordPerPage}
          sortBy={props.sortBy}
          sortDirection={props.sortDirection}
          toDate={props.toDate}
        />
      </div>
    </>
  );
};

export default StaffTimeTrackingPage;

export const getServerSideProps: GetServerSideProps<
  StaffTimeTrackingListParams
> = async (context) => {
  let initialParamas: StaffTimeTrackingListParams = {
    q: `${context.query.q || ""}`,
    fromDate: `${context.query.fromDate || ""}`,
    toDate: `${context.query.toDate || ""}`,
    page: +(context.query.page || 1),
    staffId: +(context.query.staffId || 0),
    recordPerPage: +(
      context.query.recordPerPage ||
      +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)
    ),
    sortBy: `${context.query.sortBy || "date"}`,
    sortDirection: `${context.query.sortDirection || "desc"}`,
  };

  return {
    props: initialParamas,
  };
};
