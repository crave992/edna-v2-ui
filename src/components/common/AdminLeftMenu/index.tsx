import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import {
  Image,
  Nav,
  Navbar,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOut,
} from "@fortawesome/pro-regular-svg-icons";
import Link from "next/link";
import Logout from "../Logout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LeftMenuItemDto from "@/dtos/LeftMenuItemDto";
import RoleDto from "@/dtos/RoleDto";
import { AdminLeftMenuItems } from "@/data/AdminLeftMenuItems";
import { AdminRoles, Role } from "@/helpers/Roles";
import UserDto from "@/dtos/UserDto";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import ModuleMappingWithUserRoleDto from "@/dtos/ModuleMappingWithUserRoleDto";
import Footer from "../Footer";

interface AdminLeftMenuProps extends CommonProps {
  isActive: boolean;
}

const AdminLeftMenu: NextPage<AdminLeftMenuProps> = (props) => {
  const router = useRouter();

  const { pathname: currentPath } = router;

  function activateLink(pageLink: string) {
    pageLink = pageLink || "";
    if (
      currentPath.toLowerCase() == pageLink.toLowerCase() ||
      currentPath.toLowerCase().startsWith(pageLink.toLowerCase())
    )
      return "active";

    return "";
  }

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<string[]>();
  const [updatedModules, setUpdatedModules] = useState<ModuleMappingWithUserRoleDto[]>();
  const [user, setUser] = useState<UserDto>();
  const [menuItems, setMenuItem] = useState<LeftMenuItemDto[]>();
  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
      const rolesObject = (session.user?.roles || []) as RoleDto[];
      setRoles(rolesObject.map((el) => el.name));
    }
  }, [status]);

  useEffect(() => {
    (async () => {

      if (roles && user) {
        if (roles.indexOf(Role.Staff) >= 0) {

          const response = await unitOfService.RoleManagementService.getByUserRoleId(user.staffRoleId || 0);
          if(response && response.status === 200 && response.data.data){
            setUpdatedModules(response.data.data);
            teacherLeftMenu(response.data.data);
          }else{
            setUpdatedModules([]);
            teacherLeftMenu([]);
          }          
  
        } else {
          let filterMenus = AdminLeftMenuItems.filter(
            (x) => roles.includes(x.role) || x.role === Role.All
          );
          setMenuItem(filterMenus);
        }
      }

    })();
  }, [roles]);  

  useEffect(() => {
    if(updatedModules){
      teacherLeftMenu(updatedModules);
    }
  }, [updatedModules]);

  const teacherLeftMenu = (modules: ModuleMappingWithUserRoleDto[]) => {
    
    let filterMenus = AdminLeftMenuItems.filter(
      (x) => x.role === Role.Staff || x.role === Role.All
    );
    
    let adminPage = AdminLeftMenuItems.filter(
      (x) => AdminRoles.some( role => role == x.role)
    );
    
    //remove any menus if denied
    filterMenus = filterMenus.filter(item => {
      return !modules.filter(e => e.accessType === "No Access").some(e => e.url === item.url);
    });

    adminPage = adminPage.filter(item => {
      return !modules.filter(e => e.accessType === "No Access").some(e => e.url === item.url);
    });

    //allow admin pages if any kind of access is given
    adminPage = adminPage.filter(item => {

      if (item.url === "" && item.children && item.children.length > 0) {
        item.children = item.children.filter(child => {
          return modules.filter(e => e.accessType != "").some(e => e.url === child.url)
        });
      }

      return modules.filter(e => e.accessType != "").some(e => e.url === item.url) || item.url === "";
    });

    //check for child pages now
    adminPage = adminPage.filter(e => {
      if(e.url !== "") return e;

      if(e.url === "" && e.children && e.children.length > 0){
        return e;
      }
    });
    
    const combinedMenus = [...filterMenus, ...adminPage];

    const urls = combinedMenus.filter(e => e.url !== "").map(({ url }) => url); 
    const filteredMenus = combinedMenus.filter(({ url }, index) => !urls.includes(url, index + 1));

    //setMenuItem(combinedMenus);
    setMenuItem(filteredMenus);
  }

  return (
    <>
      <div
        id="SideBar"
        className={
          props.isActive ? "sidebar_wrap small_sidebar" : "sidebar_wrap"
        }
      >
        <div className="site_logo">
          <Image
            fluid
            src={`${process.env.NEXT_PUBLIC_CDN_PATH}/images/logo-icon.png`}
            alt="Noorana"
            title="Noorana"
          />
        </div>
        <div className="sidebar_nav">
          <Navbar variant="light">
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                {menuItems &&
                  menuItems.map((item) => {
                    if (item.children) {
                      return (
                        <NavDropdown
                          key={item.id}
                          title={
                            <span>
                              <OverlayTrigger
                                placement="right"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>{item.tooltip}</Tooltip>}
                              >
                                <FontAwesomeIcon
                                  className="overlay_icon"
                                  icon={item.icon}
                                  size="1x"
                                />
                              </OverlayTrigger>
                              <FontAwesomeIcon
                                className="no_overlay_icon"
                                icon={item.icon}
                                size="1x"
                              />
                              <span className="nav_text">{item.title}</span>
                            </span>
                          }
                        >
                          {item.children.map((item) => (
                            <Link
                              href={`${item.url}`}
                              key={item.id}
                              className={`nav-item nav-link ${activateLink(
                                `${item.url}`
                              )}`}
                            >
                              <OverlayTrigger
                                placement="right"
                                delay={{ show: 50, hide: 100 }}
                                overlay={<Tooltip>{item.tooltip}</Tooltip>}
                              >
                                <FontAwesomeIcon
                                  className="overlay_icon"
                                  icon={item.icon}
                                  size="1x"
                                />
                              </OverlayTrigger>

                              <FontAwesomeIcon
                                className="no_overlay_icon"
                                icon={item.icon}
                                size="1x"
                              />
                              <span className="nav_text">{item.title}</span>
                            </Link>
                          ))}
                        </NavDropdown>
                      );
                    } else {
                      return (
                        <Link
                          key={item.id}
                          className={`nav-item nav-link ${activateLink(
                            `${item.url}`
                          )}`}
                          href={`${item.url}`}
                        >
                          <OverlayTrigger
                            placement="right"
                            delay={{ show: 50, hide: 100 }}
                            overlay={<Tooltip>{item.tooltip}</Tooltip>}
                          >
                            <FontAwesomeIcon
                              className="overlay_icon"
                              icon={item.icon}
                              size="1x"
                            />
                          </OverlayTrigger>

                          <FontAwesomeIcon
                            className="no_overlay_icon"
                            icon={item.icon}
                            size="1x"
                          />
                          <span className="nav_text">{item.title}</span>
                        </Link>
                      );
                    }
                  })}

                <Logout>
                  <span
                    className={"nav-item nav-link"}
                    style={{ cursor: "pointer" }}
                  >
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 50, hide: 100 }}
                      overlay={<Tooltip>Logout</Tooltip>}
                    >
                      <FontAwesomeIcon
                        className="overlay_icon"
                        icon={faSignOut}
                        size="1x"
                      />
                    </OverlayTrigger>
                    <FontAwesomeIcon
                      className="no_overlay_icon"
                      icon={faSignOut}
                      size="1x"
                    />{" "}
                    <span className="nav_text">Logout</span>
                  </span>
                </Logout>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div className="nav_footer">
              <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLeftMenu;
