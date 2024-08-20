import CustomFormError from "@/components/common/CustomFormControls/CustomFormError";
import Loader from "@/components/common/Loader";
import ListWorkingDaysScheduling from "@/components/common/Staff/WorkingDaysScheduling";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import StaffDto from "@/dtos/StaffDto";
import { WorkingDaysMappedDto } from "@/dtos/StaffSchedulingDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import StaffWorkingDaysSchedulingModel from "@/models/StaffWorkingDaysSchedulingModel";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import StaffWorkingDaysSchedulingValidationSchema from "@/validation/StaffWorkingDaysSchedulingValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface StaffSchedulingProps {
  id: number;
}

const StaffScheduling: NextPage<StaffSchedulingProps> = ({ id }) => {
  useBreadcrumb({
    pageName: "Staff Info",
    breadcrumbs: [
      {
        label: "Admin",
        link: "/admin/dashboard",
      },
      {
        label: "Staff",
        link: "/admin/staff/",
      },
      {
        label: "Staff Scheduling",
        link: `/admin/staff/scheduling/${id}`,
      },
    ],
  });

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [staffDetails, setStaffDetails] = useState<StaffDto>();
  const fetchStaffDetails = async (staffId: number) => {
    let response = await unitOfService.StaffService.getBasicDetailById(staffId);
    if (response && response.status === 200 && response.data.data) {
      setStaffDetails(response.data.data);
    }
  };

  const [workingDays, setWorkingDays] = useState<WorkingDaysMappedDto[]>();
  const fetchStaffWorkingDays = async (staffId: number) => {
    const response =
      await unitOfService.StaffSchedulingService.getWorkingDaysByStaffId(
        staffId
      );
    if (response && response.status === 200 && response.data.data) {
      setWorkingDays(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStaffDetails(id);
      await fetchStaffWorkingDays(id);
    })();
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<StaffWorkingDaysSchedulingModel>({
    resolver: yupResolver(StaffWorkingDaysSchedulingValidationSchema),
    defaultValues: {
      dayIds: [],
      staffId: id,
    },
  });

  const [refreshSchedule, setRefreshSchedule] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const submitData = async (data: StaffWorkingDaysSchedulingModel) => {
    setShowLoader(true);
    setRefreshSchedule(false);
    const response =
      await unitOfService.StaffSchedulingService.saveStaffWorkingDays(data);

    setShowLoader(false);
    setRefreshSchedule(true);
    if (response && response.status === 200) {
      toast.success("Working days saved successfully");
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  return (
    <>
      {staffDetails && (
        <>
          <Head>
            <title>
              {staffDetails.firstName} {staffDetails.lastName} - Work Schedule -
              Noorana
            </title>
          </Head>

          <Container fluid>
            <div className="db_heading_block">
              <h1 className="db_heading">
                {staffDetails.firstName} {staffDetails.lastName} Work Schedule
              </h1>
            </div>
            <Row>
              <Col md={12}>
                <Form
                  method="post"
                  autoComplete="off"
                  onSubmit={handleSubmit(submitData)}
                >
                  <Form.Control type="hidden" {...register("staffId")} />

                  {errors.staffId && <CustomFormError error={errors.staffId} />}

                  <div className="">
                    <Form.Group className="mb-4">
                      <h3 className="formBlock-heading">Select Working Days</h3>
                      {workingDays &&
                        workingDays.map((wd) => {
                          return (
                            <Form.Check
                              key={wd.dayId}
                              inline
                              label={wd.dayName}
                              value={wd.dayId.toString()}
                              type="checkbox"
                              id={`wd-${wd.dayId}`}
                              defaultChecked={wd.isMapped}
                              {...register("dayIds")}
                            />
                          );
                        })}

                      {errors.dayIds && (
                        <p className="text-danger">{errors.dayIds.message}</p>
                      )}
                    </Form.Group>

                    <Button type="submit" className="btn_main">
                      Save
                    </Button>
                  </div>
                </Form>
              </Col>
              <Col md={12}>
                {refreshSchedule && <ListWorkingDaysScheduling staffId={id} />}
              </Col>
            </Row>
          </Container>
        </>
      )}

      {showLoader && <Loader />}
    </>
  );
};

export default StaffScheduling;

export const getServerSideProps: GetServerSideProps<
  StaffSchedulingProps
> = async (context) => {
  let initialParamas: StaffSchedulingProps = {
    id: +(context.query.id || 0),
  };

  return {
    props: initialParamas,
  };
};
