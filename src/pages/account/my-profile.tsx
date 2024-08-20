import OrganizationUpdate from "@/components/account/OrganizationUpdate";
import ParentUpdate from "@/components/account/ParentUpdate";
import RoleDto from "@/dtos/RoleDto";
import { AdminRoles, Role } from "@/helpers/Roles";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import { faUser, faCamera, faKey } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
  FloatingLabel,
  Button,
  Container,
} from "react-bootstrap";

interface MyProfilePageProps extends CommonProps {}

const MyProfilePage: NextPage<MyProfilePageProps> = (props) => {
  useBreadcrumb({
    pageName: "My Profile",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "My Profile",
        link: "/account/my-profile",
      },
    ],
  });

  const router = useRouter();
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    if (session && session.user) {
      let redirectUrl = "";

      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);
      setRoles(roles);

      if (roles.indexOf(Role.Staff) >= 0) {
        redirectUrl = "/staff/info";
      }

      router.push(`${redirectUrl}`);
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>My Profile | EDNA</title>
      </Head>
      <div className="profile_page">
        <Container>
          {AdminRoles.some( (role: string) => roles.includes(role)) && <OrganizationUpdate />}
          {roles.indexOf(Role.Parent) >= 0 && <ParentUpdate />}
        </Container>
      </div>
    </>
  );
};

export default MyProfilePage;
