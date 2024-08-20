import UpdateBasicDetail from "@/components/common/Staff/BasicDetails/UpdateBasicDetail";
import HRForm from "@/components/common/Staff/HRForm";
import ProfessionalDevelopmentPage from "@/components/common/Staff/ProfessionalDevelopment";
import DegreeCertificates from "@/components/common/Staff/DegreeCertificates";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import StaffDto from "@/dtos/StaffDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import EmergencyContactAndInfo from "@/components/common/Staff/EmergencyContactAndInfo";
import StaffPerformanceEvaluation from "@/components/common/PerformanceEvaluation/StaffPerformanceEvaluation";
import PaginationParams from "@/params/PaginationParams";
import { UserContext } from "@/context/UserContext";
import ImageCropperModal from "@/components/common/ImageCropper";
import Avatar from "@/components/common/Avatar";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface StaffInfoProps extends PaginationParams {}

const StaffInfo: NextPage<StaffInfoProps> = (props) => {
  useBreadcrumb({
    pageName: "My Profile",
    breadcrumbs: [
      {
        label: "Dashboard",
        link: "/staff/dashboard",
      },
      {
        label: "Staff",
        link: "/staff/info/",
      },
    ],
  });

  const { update } = useSession();
  const [imageSource, setImageSource] = useState("");
  const { register: reg, setValue: setVal } = useForm();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [staffDetails, setStaffDetails] = useState<StaffDto>();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const { user } = useContext(UserContext);
  const fetchStaff = async () => {
    let response =
      await unitOfService.StaffService.getCurrentStaffBasicDetail();

    if (response && response.status === 200 && response.data.data) {
      setStaffDetails(response.data.data);
      setImageSource(response.data.data.profilePicture);
      return response.data.data;
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      await fetchStaff();
    })();
  }, []);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [tempProfilePicture, setTempProfilePicture] = useState<string>('');
  const [maxFileError, setMaxFileError] = useState<boolean>(false);

  const handleImageSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setMaxFileError(true);
        setTempProfilePicture('');
        if (inputFileRef.current) {
          inputFileRef.current.value = '';
        }

        return;
      }
      setMaxFileError(false);
  
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (reader.result) {
          setProfilePicture(reader.result?.toString() || '');
        }
      });
      reader.readAsDataURL(file);
      setIsEditingProfilePicture(true);
    }
  };

  const onSavePicture = async (image: string) => {
    setVal("croppedImage", image);

    if (inputFileRef.current) {
        inputFileRef.current.value = '';
    }

    const formData = new FormData();
    formData.append("id", staffDetails?.id as unknown as string);
    formData.append("croppedImage", image as string);

    // new Response(formData).text().then(console.log)
    let response = await unitOfService.StaffService.updatePicture(formData);
    setShowLoader(false);
    if (response && response.status === 200 && response.data.data) {
      toast.success("Profile picture updated successfully");

      update({
        profilePicture: response.data.data.profilePicture,
      });
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }

    setImageSource(image);
    setIsEditingProfilePicture(false);
  };

  const onClosePictureModal = (_: unknown) => {
    setImageSource('');
    setIsEditingProfilePicture(false);

    if (inputFileRef.current) {
        inputFileRef.current.value = '';
    }
  };

  return (
    <>
      <Head>
        <title>My Profile - Noorana</title>
      </Head>
      <div className="staff_info_page tw-mt-[10px]">
        <Container>
          <Row>
            <Col xl={12} xxl={12}>
              <div className="db_heading_block">
                <h1 className="db_heading">My Profile</h1>
              </div>
              <div className="staff_short_profile">
                <div className="staff_profile_details">
                  <div className="tw-flex tw-items-center tw-mr-[15px]">
                    <Form method="PUT">
                      <Form.Control type="hidden" {...reg("id")} />
                      <Avatar imageSrc={imageSource || ''} size={100} name="croppedImage" edit={true}/>
                      <Form.Control
                        type="file"
                        accept=".jpg, .jpeg, .png, .heic, .bmp"
                        {...reg("croppedImage")}
                        id="croppedImage"
                        onChange={handleImageSelected}
                        style={{
                            display: 'none'
                        }}
                      />
                    </Form>
                  </div>
                  <div className="staff_details">
                    <h2>
                      {user?.fullName}
                    </h2>
                    <p>Job Title: {staffDetails?.jobTitle.name}</p>
                    <p>Role: {staffDetails?.role.name}</p>
                    <p>
                      Hired Date:&nbsp;
                      {staffDetails?.employmentStartDate
                        ? unitOfService.DateTimeService.convertToLocalDate(
                          staffDetails?.employmentStartDate
                          )
                        : ""}
                    </p>
                    <p>Salary Type: {staffDetails?.salaryType.name}</p>
                    <p>Salary: ${staffDetails?.salaryAmount}</p>
                  </div>
                </div>
              </div>
              <div className="staff_profile_forms">
                {staffDetails && (
                  <Tabs>
                    <TabList>
                      <Tab>Basic</Tab>
                      <Tab>Degree/Certificates</Tab>
                      <Tab>HR Forms</Tab>
                      <Tab>Emergency Info</Tab>
                      <Tab>Professional Development</Tab>
                      <Tab>Performance Evaluation</Tab>
                    </TabList>

                    <TabPanel>
                      <UpdateBasicDetail />
                    </TabPanel>
                    <TabPanel>
                      <DegreeCertificates />
                    </TabPanel>
                    <TabPanel>
                      <HRForm />
                    </TabPanel>
                    <TabPanel>
                      <EmergencyContactAndInfo />
                    </TabPanel>
                    <TabPanel>
                      <ProfessionalDevelopmentPage />
                    </TabPanel>
                    <TabPanel>
                      <StaffPerformanceEvaluation
                        staffId={staffDetails.id}
                        page={props.page}
                        q={props.q}
                        recordPerPage={props.recordPerPage}
                        sortBy={props.sortBy}
                        sortDirection={props.sortDirection}
                      />
                    </TabPanel>
                  </Tabs>
                )}
              </div>
            </Col>
          </Row>
          <Modal
            show={isEditingProfilePicture}
            size="lg"
            dialogClassName="modal-60w"
            onHide={() => setIsEditingProfilePicture(false)}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
                <Modal.Title>Crop Profile Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ImageCropperModal
                picture={profilePicture}
                closeModal={onClosePictureModal}
                savePicture={onSavePicture}
              />
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </>
  );
};
export default StaffInfo;

export const getServerSideProps: GetServerSideProps<StaffInfoProps> = async (
  context
) => {
  let initialParamas: StaffInfoProps = {
    q: `${context.query.q || ""}`,
    page: +(context.query.page || 1),
    recordPerPage: +(
      context.query.recordPerPage ||
      +(process.env.NEXT_PUBLIC_DEFAULT_RECORD_PER_PAGE || 10)
    ),
    sortBy: `${context.query.sortBy || "ratingdate"}`,
    sortDirection: `${context.query.sortDirection || "desc"}`,
  };

  return {
    props: initialParamas,
  };
};
