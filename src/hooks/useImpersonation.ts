import { useState, ChangeEvent, useEffect, useReducer, useContext } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import UserDto, { UserBasicDto } from "@/dtos/UserDto";
import useCustomError from "./useCustomError";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { InPageActionType, InPageState, reducer } from "@/reducers/InPageAction";
import { UserContext } from "@/context/UserContext";

const initialPageState: InPageState<UserBasicDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

interface GroupedUser {
  [role: string]: UserBasicDto[];
}

const useImpersonation = () => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, setUser } = useContext(UserContext);
  const [userToAudit, setUserToAudit] = useState<string>();
  const [isImpersonatingUser, setIsImpersonatingUser] = useState<boolean>(false);

  const [users, dispatch] = useReducer(
    reducer<UserBasicDto[]>,
    initialPageState
  );
  const { setErrorMessage } = useCustomError();

  const [showLoader, setShowLoader] = useState(false);
  const [groupedUsers, setGroupedUsers] = useState<GroupedUser>();

  const impersonateUser = async (userToAudit: string, adminToken: string) => {
    const loginStatus = await signIn("credentials", {
      redirect: false,
      username: userToAudit,
      password: "impersonatepassword",
      rememberMe: false,
      callbackUrl: "/",
      isImpersonating: true,
      impersonatorToken: adminToken,
    });

    if (loginStatus && loginStatus.ok && loginStatus.status) {
      localStorage.setItem("admin-token", adminToken);
      router.reload();
    } else {
      setErrorMessage({
        message: loginStatus?.error || "",
        show: true,
        type: "danger",
      });
    }
  };

  const updateUserToAudit = async (e: ChangeEvent<HTMLSelectElement>) => {
    var userId = e.target.value;
    if(users.data && users.data.length > 0 ){
      var user = users.data.find(u => u.id == userId);
      var username = user?.userName;
      setUserToAudit(username);
    } 
  };

  useEffect(() => {
    if(session && session?.user)
      setUser(session?.user);

    var admintoken = localStorage.getItem("admin-token");
    if(admintoken){
      setIsImpersonatingUser(true);
    }
    fetchAllusers();      
  }, [status]);

  const fetchAllusers = async () =>  {
    dispatch({
      payload:true,
      type: InPageActionType.SHOW_LOADER
    });

    const response = await unitOfService.UserService.getAllUsers();
    if (response && response.status === 200 && response.data.data) {
      var gUsers:GroupedUser = response.data.data.reduce(function (r, a:UserBasicDto) {
        var role = a.roles[0];
        if(role.name != "SuperAdmin"){
          r[role.name] = r[role.name] || [];
          r[role.name].push(a);
        }
        return r;
      }, Object.create(null));
    
      for (const key in gUsers) {
        gUsers[key].sort((a:any, b:any) => a.fullName.localeCompare(a.fullName));
      }
    
      setGroupedUsers(gUsers);
      dispatch({
        type: InPageActionType.SET_DATA,
        payload: response.data.data,
      });
    }
  }

  const auditUser = async () => {
    setShowLoader(true);
    var admintoken = localStorage.getItem('at') ?? "";
    var adminUtz = localStorage.getItem("utz") ?? "";
    var adminCurCode = localStorage.getItem("curCode") ?? "";
    var adminLocales = localStorage.getItem("locales") ?? "";

    const loginStatus = await signIn("credentials", {
      redirect: false,
      username: userToAudit,
      password: "impersonatepassword",
      rememberMe: false,
      callbackUrl: "/",
      isImpersonating:true,
      impersonatorToken: admintoken
    });

    setShowLoader(false);
    if (loginStatus && loginStatus.ok && loginStatus.status) {
      localStorage.setItem('admin-token', admintoken);
      router.reload();
    } else {
      setErrorMessage({
        message: loginStatus?.error || "",
        show: true,
        type: "danger",
      });
    }
  }

  return {
    user,
    setUser,
    userToAudit,
    updateUserToAudit,
    isImpersonatingUser,
    setIsImpersonatingUser,
    impersonateUser,
    auditUser,
    users,
    dispatch,
    showLoader,
    setShowLoader,
    groupedUsers,
    setGroupedUsers,
  };
};

export default useImpersonation;

