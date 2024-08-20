import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import { Button, Col, FloatingLabel, Form, Image, Modal, Row } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ErrorLabel from "../../CustomError/ErrorLabel";
import Loader from "../../Loader";
import { StaffUpdateModel } from "@/models/StaffModel";
import { StaffUpdateValidationSchema } from "@/validation/StaffValidationSchema";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import StaffDto from "@/dtos/StaffDto";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import { JobTitleDto } from "@/dtos/JobTitleDto";
import { UserRoleDto } from "@/dtos/UserRoleDto";
import SalaryTypeDto from "@/dtos/SalaryTypeDto";
import {
  InPageAddUpdateActionType,
  InPageAddUpdateState,
  reducer,
} from "@/reducers/InPageAddUpdateAction";
import ImageCropperModal from "@/components/common/ImageCropper";
import Avatar from "../../Avatar";

interface EditStaffByAdminProps extends CommonProps {
  id: number;
  staff: StaffDto;
}

const initialPageState: InPageAddUpdateState<StaffDto> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
};

const EditStaffByAdmin: NextPage<EditStaffByAdminProps> = ({ id, staff }) => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(reducer<StaffDto>, initialPageState);

  const {
    formState: { errors, dirtyFields },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<StaffUpdateModel>({
    resolver: yupResolver(StaffUpdateValidationSchema),
    defaultValues: {
      id: staff.id,
      title: staff.title,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      empStartDate: new Date(
        unitOfService.DateTimeService.convertToLocalDate(
          staff.employmentStartDate
        )
      ),
      salaryAmount: staff.salaryAmount,
      description: staff.description || "",
      jobTitleId: staff.jobTitleId,
      systemRole: staff.systemRole,
      salaryTypeId: staff.salaryTypeId,
    },
  });

  const { register: reg } = useForm();
  const [pushRoute, setPushRoute] = useState<boolean>(false);
  const submitData = async (data: StaffUpdateModel) => {
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof StaffUpdateModel];
      if (key === "profileImage") {
        formData.append(key, data?.[key][0]);
      } else {
        formData.append(key, value as string);
      }
    });

    const response = await unitOfService.StaffService.update(data.id, formData);

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      toast.success("Staff details updated successfully");
      //router.push("/admin/staff/");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [jobTitles, setJobTitle] = useState<JobTitleDto[]>([]);
  const fetchJobTitle = async () => {
    const response = await unitOfService.JobTitleService.getAllForDropDown();
    if (response && response.status === 200 && response.data.data) {
      setJobTitle(response.data.data);
    }
  };

  const [roles, setRoles] = useState<UserRoleDto[]>([]);
  const fetchUserRole = async () => {
    const response = await unitOfService.UserRoleService.getAll("");
    if (response && response.status === 200 && response.data.data) {
      setRoles(response.data.data);
    }
  };

  const [salaryType, setSalaryType] = useState<SalaryTypeDto[]>([]);
  const fetchSalaryType = async () => {
    const response = await unitOfService.SalaryTypeService.getAll();
    if (response && response.status === 200 && response.data.data) {
      setSalaryType(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchJobTitle();
      await fetchUserRole();
      await fetchSalaryType();
    })();
  }, []);

  const [imageSource, setImageSource] = useState("");
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSource(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        setImageSource('');
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
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }

    const formData = new FormData();
    formData.append("id", id as unknown as string);
    formData.append("croppedImage", image as string);

    // new Response(formData).text().then(console.log)
    let response = await unitOfService.StaffService.updatePicture(formData);
    if (response && response.status === 200 && response.data.data) {
      toast.success("Profile picture updated successfully");
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

  useEffect(() => {
    const warningText = 'You have unsaved changes. Are you sure you want to leave this page?';

    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (Object.keys(dirtyFields).length == 0) return;
      e.preventDefault();

      return (e.returnValue = warningText);
    };

    const handleBrowseAway = () => {
      if ((Object.keys(dirtyFields).length > 0 && pushRoute) || Object.keys(dirtyFields).length == 0) return;
      if (window.confirm(warningText)) {
        router.events.off('routeChangeStart', handleBrowseAway);
        return;
      }
      router.events.emit('routeChangeError');

      throw 'routeChange aborted.';
    };

    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [dirtyFields, pushRoute]);

  return (
    <>
      <Form method="put">
        <Form.Control type="hidden" {...reg("id")} />
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Avatar
                imageSrc={imageSource || staff.profilePicture}
                size={100}
                name="croppedImage"
                edit={true}
              />
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
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Form
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit(submitData)}
      >
        <Form.Control type="hidden" {...register("id")} />
        <Row>
          <Col md={6} lg={4}>
            <FloatingLabel label="" className="mb-3">
              <CustomSelect
                name="title"
                control={control}
                placeholder="Title*"
                isSearchable={true}
                options={[
                  { label: "Mr.", value: "Mr." },
                  { label: "Mrs.", value: "Mrs." },
                  { label: "Ms.", value: "Ms." },
                ]}
                textField="label"
                valueField="value"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="First Name*" className="mb-3">
              <CustomInput
                control={control}
                name="firstName"
                placeholder="First Name*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="Last Name*" className="mb-3">
              <CustomInput
                control={control}
                name="lastName"
                placeholder="Last Name*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={6}>
            <FloatingLabel label="Email*" className="mb-3">
              <CustomInput
                control={control}
                name="email"
                placeholder="Email*"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="" className="mb-3">
              <CustomSelect
                name="systemRole"
                control={control}
                placeholder="Role*"
                isSearchable={true}
                options={roles}
                textField="name"
                valueField="id"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="" className="mb-3">
              <CustomSelect
                name="jobTitleId"
                control={control}
                placeholder="Job Title*"
                isSearchable={true}
                options={jobTitles}
                textField="name"
                valueField="id"
              />
            </FloatingLabel>
          </Col>

          <Col md={6} lg={4}>
            <FloatingLabel label="" className="mb-3">
              <CustomInput
                type="datepicker"
                control={control}
                name="empStartDate"
                placeholder="Employment Start Date*"
                dateFormat="MM/dd/yyyy"
              />
            </FloatingLabel>
          </Col>

          <Col md={6} lg={4}>
            <FloatingLabel label="" className="mb-3">
              <CustomSelect
                name="salaryTypeId"
                control={control}
                placeholder="Salary Type*"
                isSearchable={true}
                options={salaryType}
                textField="name"
                valueField="id"
              />
            </FloatingLabel>
          </Col>
          <Col md={6} lg={4}>
            <FloatingLabel label="Salary Amount*" className="mb-3">
              <CustomInput
                control={control}
                name="salaryAmount"
                placeholder="Salary Amount*"
              />
            </FloatingLabel>
          </Col>

          <Col md={12} lg={12}>
            <FloatingLabel
              label="A simple description about the staff"
              className="mb-3"
            >
              <CustomInput
                control={control}
                type="textarea"
                name="description"
                placeholder="A simple description about the staff"
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Button type="submit" className="btn_main mx-1">
          Save
        </Button>
        <Button
          type="button"
          className="btn_border mx-1"
          onClick={() => {
            router.push("/admin/staff/");
          }}
        >
          Cancel
        </Button>
      </Form>
      {states.showLoader && <Loader />}
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
    </>
  );
};
export default EditStaffByAdmin;
