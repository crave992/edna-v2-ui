import SecondParentDetails from "@/components/common/Parent/SecondParentDetails";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import Head from "next/head";
import { Container } from "react-bootstrap";

const SecondParentDetailsPage = () => {
  useBreadcrumb({
    pageName: "Dashboard",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/parent/dashboard",
      },
      {
        label: "Second Parent",
        link: "/parent/second-parent/list",
      },
    ],
  });

  return (
    <>
      <Head>
        <title>Second Parent Details | EDNA</title>
      </Head>
      <div className="profile_page">
        <Container>
          <SecondParentDetails />
        </Container>
      </div>
    </>
  );
};

export default SecondParentDetailsPage;
