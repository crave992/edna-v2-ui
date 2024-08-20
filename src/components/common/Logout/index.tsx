import CommonProps from "@/models/CommonProps";
import { useCheckUserStatus } from "@/services/service-hooks/useAccountService";
import { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { AxiosError } from "axios";

interface LogoutProps extends CommonProps {}
const Logout: NextPage<LogoutProps> = (props) => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const { data: userStatus, isSuccess } = useCheckUserStatus();

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled && userStatus && isSuccess) {
      if (userStatus instanceof AxiosError && userStatus?.response?.status === 401) {
        // logout();
      }

      if (userStatus?.data?.data) {
        const status = userStatus?.data?.data.isActive;
        if (!status) {
          logout();
        }

        localStorage.setItem('curCode', userStatus?.data?.data?.currencyCode || 'USD');
        localStorage.setItem('locales', userStatus?.data?.data?.locales || 'en-US');
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [isSuccess, userStatus, userStatus?.data?.data]);

  return (
    <>
      <span onClick={logout}>
        {props.children ? props.children : <button className="btn btn-primary">Logout</button>}
      </span>
    </>
  );
};

export async function logout() {
  localStorage.removeItem('at');
  localStorage.removeItem('utz');
  localStorage.removeItem('curCode');
  localStorage.removeItem('locales');
  localStorage.removeItem("rt");
  localStorage.removeItem("userEmail");


  var adminToken = localStorage.getItem('admin-token');
  if(adminToken){
    
    var adminUtz = localStorage.getItem("admin-utz") ?? "";
    var adminCurCode = localStorage.getItem("admin-curCode") ?? "";
    var adminLocales = localStorage.getItem("admin-locales") ?? "";

    localStorage.setItem('at', adminToken);
    localStorage.setItem("utz", adminUtz);
    localStorage.setItem("curCode", adminCurCode);
    localStorage.setItem("locales", adminLocales);

    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-utz');
    localStorage.removeItem('admin-curCode');
    localStorage.removeItem('admin-locales');
    
    const loginStatus = await signIn("credentials", {
      redirect: false,
      username: "impersonateuser",
      password: "impersonatepassword",
      rememberMe: false,
      callbackUrl: "/",
      isImpersonating:true,
      adminToken:adminToken
    });

    window.location.href = "/admin/dashboard";
  } else {
    await signOut({ callbackUrl: "/" });
  }
}

export default Logout;
