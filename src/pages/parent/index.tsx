import useBreadcrumb from "@/hooks/useBreadcrumb";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ParentDashboardPage = () => {
  useBreadcrumb({
    pageName: "Dashboard",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/parent/dashboard",
      },
    ],
  });

  const router = useRouter();
  useEffect(() => {
    router.push(`/parent/dashboard`);
  }, []);

  return (
    <>
      <Head>
        <title>Admin | Admin List - Noorana</title>
      </Head>      
    </>
  );
};

export default ParentDashboardPage;