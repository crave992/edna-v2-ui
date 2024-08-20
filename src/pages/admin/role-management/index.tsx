import {
  Col,
  Container,
  FloatingLabel,
  Row,
  Form,
  Table,
  Button,
} from "react-bootstrap";
import Head from "next/head";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { ChangeEvent, useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { UserRoleDto } from "@/dtos/UserRoleDto";
import ModuleMappingWithUserRoleDto from "@/dtos/ModuleMappingWithUserRoleDto";
import { ModuleMappingWithUserRoleListModel } from "@/models/ModuleMappingWithUserRoleModel";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import { toast } from "react-toastify";

const RoleManagementPage = () => {
  useBreadcrumb({
    pageName: "Role Management",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Role Management",
        link: "/admin/role-management",
      },
    ],
  });

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [userRoleId, setUserRoleId] = useState<number>(0);
  const [userRoles, setUserRoles] = useState<UserRoleDto[]>([]);
  const fetchRoles = async () => {
    const response = await unitOfService.UserRoleService.getAll("");
    if (response && response.status === 200 && response.data.data) {
      setUserRoles(response.data.data);
    }
  };

  const [modules, setModules] = useState<ModuleMappingWithUserRoleDto[] | null>(
    null
  );
  const fetchModules = async (roleId: number) => {
    reset();
    setUserRoleId(roleId);
    setModules(null);
    setShowLoader(true);
    const response = await unitOfService.RoleManagementService.getByUserRoleId(
      roleId
    );
    setShowLoader(false);
    if (response && response.status === 200 && response.data.data) {
      setModules(response.data.data);
    } else {
      setModules([]);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchRoles();
    })();
  }, []);

  const { handleSubmit, setValue, getValues, control, register, reset } =
    useForm<ModuleMappingWithUserRoleListModel>({
      defaultValues: {
        roleId: 0,
        mapping: [],
      },
    });

  const submitData = async (formData: ModuleMappingWithUserRoleListModel) => {
    if (formData) {
      setShowLoader(true);
      const finalData = formData.mapping.filter((e) => e.accessType);
      const response = await unitOfService.RoleManagementService.save(
        userRoleId,
        finalData
      );
      setShowLoader(false);
      if (response && response.status === 200) {
        toast.success("Access updated successfully");
      } else {
        const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
        toast.error(error);
      }
    } else {
      toast.error("No data to save");
    }
  };

  return (
    <>
      <Head>
        <title>Role Management - Noorana</title>
      </Head>
      <div className="parent_list_page">
        <Container fluid>
          <Row>
            <Col md={12} lg={12}>
              <Form method="get" autoComplete="off">
                <div className="db_heading_block">
                  <h1 className="db_heading">Role Management</h1>
                </div>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <FloatingLabel label="Select Role">
                        <Form.Select
                          onChange={async (
                            e: ChangeEvent<HTMLSelectElement>
                          ) => {
                            const roleId = +(e.target.value || 0);
                            await fetchModules(roleId);
                          }}
                        >
                          <option value={0} key={0}>
                            Select Role
                          </option>
                          {userRoles &&
                            userRoles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                        </Form.Select>
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>

              {modules && modules.length > 0 && (
                <div className="tableListItems">
                  <div className="formBlock">
                    <Form
                      method="post"
                      autoComplete="off"
                      onSubmit={handleSubmit(submitData)}
                    >
                      <CustomInput
                        type="hidden"
                        control={control}
                        name={`roleId`}
                        defaultValue={userRoleId}
                      />
                      <Table striped hover className="custom_design_table mb-0">
                        <thead>
                          <tr>
                            <th className="align-middle" rowSpan={2}>Module Name</th>
                            <th colSpan={3} className="text-center bg-gray" >Access Type</th>
                            <th className="align-middle text-center" rowSpan={2}>Action</th>
                          </tr>
                          <tr>
                            <th className="text-center bg-gray">No Access</th>
                            <th className="text-center bg-gray">Full Access</th>
                            <th className="text-center bg-gray">Read Only</th>
                          </tr>
                          
                        </thead>
                        <tbody>
                          {modules.map((module, index) => (
                            <tr key={module.id}>
                              <td>
                                <CustomInput
                                  type="hidden"
                                  control={control}
                                  name={`mapping.${index}.moduleId`}
                                  defaultValue={module.id}
                                />
                                {module.name}
                              </td>
                              <td className="text-center">
                                <Form.Check
                                  inline
                                  type="radio"
                                  className="mb-3"
                                  id={`accessType-full`}
                                  value="No Access"
                                  {...register(
                                    `mapping.${index}.accessType`
                                  )}
                                  defaultChecked={
                                    module.accessType === "No Access"
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <Form.Check
                                  inline
                                  type="radio"
                                  className="mb-3"
                                  id={`accessType-full`}
                                  value="Full Access"
                                  {...register(
                                    `mapping.${index}.accessType`
                                  )}
                                  defaultChecked={
                                    module.accessType === "Full Access"
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <Form.Check
                                  inline
                                  type="radio"
                                  className="mb-3"
                                  id={`accessType-readonly`}
                                  value="Read Only"
                                  {...register(
                                    `mapping.${index}.accessType`
                                  )}
                                  defaultChecked={
                                    module.accessType === "Read Only"
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <span className="span-small-btn" onClick={() => {
                                  setValue(`mapping.${index}.accessType`, '');
                                }}>Reset</span>
                              </td>
                            </tr>
                          ))}

                          <tr>
                            <td colSpan={5} className="text-center">
                              <Button className="btn_main" type="submit">
                                Save
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Form>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {showLoader && <Loader />}
    </>
  );
};

export default RoleManagementPage;
