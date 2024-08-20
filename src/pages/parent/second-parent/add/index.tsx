import AddSecondParent from "@/components/common/Parent/AddSecondParent";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { ParentDto } from "@/dtos/ParentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

interface AddSecondParentPageProps extends CommonProps {}

const AddSecondParentPage: NextPage<AddSecondParentPageProps> = (props) => {
  useBreadcrumb({
    pageName: "Dashboard",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/parent/dashboard",
      },
      {
        label: "Add Second Parent",
        link: "/parent/second-parent/add",
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [secondParentDetails, setSecondParentDetails] = useState<ParentDto>();
  const fetchSecondParentDetails = async () => {
    const response = await unitOfService.ParentService.getSecondParentDetails();
    if (response && response.status === 200 && response.data.data) {
      const secondParent = response.data.data;
      setSecondParentDetails(secondParent);
    }
  };

  const [mainParentId, setMainParentId] = useState<number>(0);
  const [currentUserDetails, setCurrentUserDetails] = useState<ParentDto>();
  const fetchCurrentUser = async () => {
    const response = await unitOfService.ParentService.getByCurrentUserId();
    if (response && response.status === 200 && response.data.data) {
      const secondParent = response.data.data;
      setCurrentUserDetails(secondParent);
      setMainParentId(secondParent.parentId ?? 0);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCurrentUser();
      await fetchSecondParentDetails();
    })();
  }, []);

  useEffect(() => {
    if (
      mainParentId > 0 ||
      (secondParentDetails && secondParentDetails.id > 0)
    ) {
      router.push("/parent/second-parent/list");
    }
  }, [mainParentId, secondParentDetails]);

  return (
    <>
      <Head>
        <title>Add Second Parent | EDNA</title>
      </Head>
      <div className="profile_page">
        <Container>{currentUserDetails && <AddSecondParent />}</Container>
      </div>
    </>
  );
};

export default AddSecondParentPage;
