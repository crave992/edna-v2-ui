import CloseIcon from "@/components/svg/CloseIcon";
import NotesCloseIcon from "@/components/svg/NotesCloseIcon";
import * as Yup from 'yup';
import { AnimatePresence, motion } from "framer-motion";
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import CustomInput from "@/components/common/NewCustomFormControls/CustomInput";
import AlertModel from "@/models/AlertModel";
import { useForm, FormProvider, Controller } from 'react-hook-form';
import CustomDatePicker from "../CustomDatePicker";
import StaffDto, { StaffBasicDto } from "@/dtos/StaffDto";
import Multiselect from 'multiselect-react-dropdown';
import Avatar from "@/components/ui/Avatar";
import JpgIcon from "@/components/svg/JpgIcon";
import TrashIcon from "@/components/svg/TrashIcon";
import CustomUploadImage from "@/components/ui/Directory/Class/CustomUploadImage";
import { UploadImageDto } from "@/dtos/MilestoneDto";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomPopupModal from '@/components/ui/CustomPopupModal';
import AvatarEditor from 'react-avatar-editor';
import { formatFileSize } from "@/utils/formatFileSize";
import FeaturedIcon from "@/components/ui/FeaturedIcon";
import CropIcon from "@/components/svg/Crop";
import { CustomAutoCompleteNoControls } from "@/components/common/NewCustomFormControls/CustomAutocomplete";
import { AccidentType, InvolvementType } from '@/models/AlertModel';
import CustomDropdown from "@/components/common/NewCustomFormControls/CustomDropdown";
import CustomButton from "@/components/ui/CustomButton";
import SendIcon from "@/components/svg/SendIcon";
import AlertShareCheckbox from "./AlertShareCheckbox";
import { StudentBasicDto } from "@/dtos/StudentDto";
import { useStudentsQuery } from "@/hooks/queries/useStudentsQuery";
import { useStaffsQuery } from "@/hooks/queries/useStaffsQuery";
import CheckIcon from "@/components/svg/CheckIcon";
import { useFocusContext } from "@/context/FocusContext";

const schema = Yup.object({
  photos: Yup.mixed().required('An image is required'),
});

interface AlertWidgetProps {
  openAlarmWidget?: boolean;
  handleClose: Function;
  buttonRef: HTMLButtonElement | null;
}

interface Item {
  id: number;
  name: string;
  [key: string]: any;
}

const AlertWidget = ({ openAlarmWidget, handleClose, buttonRef }: AlertWidgetProps) => {
  const [widgetRef, setWidgetRef] = useState<HTMLDivElement | null>(null);
  const [alertDate, setAlertDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<string>('accident');
  const [selectedStudent, setSelectedStudent] = useState<StudentBasicDto | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffBasicDto[] | null>([]); // Define selectedStaff state
  const [selectedAccidentItem, setSelectedAccidentItem] = useState<Item | null>(null);
  const [selectedInvolvementItem, setSelectedInvolvementItem] = useState<Item | null>(null);
  const [checkedEmails, setCheckedEmails] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState<UploadImageDto | undefined>(undefined);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<'error' | 'succes' | 'warning' | 'info' | 'gray-info'>('error');
  const [alertText, setAlertText] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [share, setShare] = useState<boolean>(false);
  const editorRef = useRef<AvatarEditor | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const {currentUserRoles} = useFocusContext();
  const accidentTypes: Item[] = Object.values(AccidentType).map((type, index) => ({
    id: index,
    name: type,
  }));
  const involvementTypes: Item[] = Object.values(InvolvementType).map((type, index) => ({
    id: index,
    name: type,
  }));

  const methods = useForm<AlertModel>({
    resolver: yupResolver(schema),
  });

  const { data: studentData, error: studentsError, isLoading: isStudentsLoading } = useStudentsQuery();
  const { data: staffData, error: staffError, isLoading: isFetchingStaffMembers } = useStaffsQuery(); 

  const customStyles = {
    multiselectContainer: {
      border: '#D0D5DD 1px solid',
      borderRadius: '8px',
      color: 'red',
    },
    searchBox: {
      border: 'transparent',
    },
    inputField: {
      margin: '5px',
    },
    chips: {
      background: 'white',
      border: '#D0D5DD 1px solid',
      borderRadius: '6px',
      color: '#344054',
      fontSize: '14px',
      fontColor: '#344054',
      fontWeight: 500,
      paddingLeft: '5px',
    },
    optionContainer: {
      background: 'white',
      color: 'red',
      marginTop: '5px',
      paddingTop: '5px',
      borderRadius: '8px',
    },
    option: {
      color: '#344054',
      fontSize: '14px',
      fontColor: '#344054',
      fontWeight: 500,
    },
    groupHeading: {},
  };

  useEffect(() => {
    console.log('Checked emails changed in ParentComponent:', checkedEmails);
    methods.setValue('recipients', checkedEmails);
  }, [checkedEmails]);

  const handleShareButton = () => {
    setShare(!share);
  }

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (uploadingImage || croppedImage) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setAlertType('error');
      setAlertText('File size should not exceed 25MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const newImage: UploadImageDto = {
        id: Date.now(),
        imageName: file.name,
        imageSize: file.size.toString(),
        imageType: file.type.split('/')[1],
        imageUrl: reader.result as string,
      };
      setUploadingImage(newImage);
      setShowCropper(true);
    };
    reader.onerror = () => {
      setAlertType('error');
      setAlertText('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleCropImage = () => {
    if (editorRef.current && uploadingImage) {
      const croppedCanvas = editorRef.current.getImage();
      const croppedImage = croppedCanvas.toDataURL('image/jpeg');
      setCroppedImage(croppedImage);
      setShowCropper(false);
      setUploadingImage((prevImage) => ({
        ...prevImage!,
        imageUrl: croppedImage,
      }));
      methods.setValue('image', uploadingImage!);
    }
  };

  const handleDeleteImage = () => {
    // Clear croppedImage and uploadingImage
    setCroppedImage(null);
    setUploadingImage(undefined);
    methods.setValue('image', undefined); // Clear the value of the 'image' field in the form
  };

  const handleCropperCancel = () => {
    setShowCropper(false);
    setUploadingImage(undefined);
    methods.setValue('image', undefined);
  };
  const handlePickDate = (date: Date | null) => {
    setAlertDate(date);
    methods.setValue('date', date);
  };

  const handleSave = async () => {
    // Retrieve the form data from react-hook-form
    methods.setValue('student', selectedStudent);
    const formData = methods.getValues();
    
    // Log the form data to the console
    console.log('Form Data:', formData);
  };
  
  const selectedValueDecorator = (value: ReactNode, option: StaffDto) => (
    <div className="tw-flex tw-items-center tw-space-x-[5px]">
      {option && option.profilePicture ? (
        <>
          <Avatar link={option.profilePicture} photoSize={16} firstName={option.firstName} lastName={option.lastName} />
          <div>{option.firstName}</div>
        </>
      ) : (
        <>
          <Avatar link={option.profilePicture} photoSize={16} noImage />
          <div>{option.firstName}</div>
        </>
      )}
    </div>
  );

  const optionValueDecorator = (value: ReactNode, option: StaffDto) => (
    <div className="tw-flex tw-flex-row tw-space-x-[5px]">
      {option && (
        <>
          <Avatar link={option.profilePicture} photoSize={16} firstName={option.firstName} lastName={option.lastName} />
          <div>{`${option.firstName} ${option.lastName}`}</div>
        </>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {openAlarmWidget ? (
        <>
          <motion.div
            initial={{ right: -400 }}
            animate={{ right: 0 }}
            exit={{ right: -400 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="tw-w-[400px] tw-bg-white tw-fixed tw-top-0 tw-right-0 tw-h-screen tw-z-[100] tw-overflow-y-scroll custom-scrollbar tw-shadow"
            ref={setWidgetRef}
          >
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleSave)}>
              <div className="tw-sticky tw-top-0 tw-bg-white">
                <div className="tw-px-3xl tw-pt-3xl tw-pb-xl tw-border-0 tw-border-b-1 tw-border-solid tw-border-secondary">
                  <div className="tw-flex tw-justify-between tw-items-center">
                    <div className="tw-text-xl tw-font-semibold">Alert Form</div>
                    <div className="tw-p-2 tw-cursor-pointer" onClick={() => handleClose()}>
                      <NotesCloseIcon />
                    </div>
                  </div>
                  <div className={`tw-flex tw-items-center tw-gap-xs tw-p-xs tw-rounded-lg tw-mt-lg tw-border-[#EAECF0] tw-bg-[#F9FAFB] tw-border-1 tw-border-solid`}>
                    <div
                      className={`tw-flex-1 tw-text-center tw-py-md tw-rounded-sm tw-text-sm-semibold tw-text-quarterary tw-cursor-pointer
                      ${activeTab === 'accident' ? 'tw-text-sm-bold tw-text-secondary tw-bg-primary tw-shadow-[0_1px_3px_0px_rgba(16,24,40,0.10)]' : ''}`}
                      onClick={() => setActiveTab('accident')}
                    >
                      Accident
                    </div>
                    <div
                      className={`tw-flex-1 tw-text-center tw-py-md tw-rounded-sm tw-text-sm-semibold tw-text-quarterary tw-cursor-pointer
                      ${activeTab === 'incident' ? 'tw-text-sm-bold tw-text-secondary tw-bg-primary tw-shadow-[0_1px_3px_0px_rgba(16,24,40,0.10)]' : ''}`}
                      onClick={() => setActiveTab('incident')}
                    >
                      Incident
                    </div>
                  </div>
                  
                </div>
                <div className="tw-px-3xl tw-pb-4xl tw-pt-3xl">
                  <div className="tw-mb-xl">
                    <CustomAutoCompleteNoControls
                      control={methods.control}
                      name="student"
                      data={studentData?.student || []}
                      component="Child Involved"
                      selectedItems={selectedStudent}
                      withProfile={true}
                      iconLeading={true}
                      withIcon={true}
                      placeHolderIcon="student"
                      setSelectedItems={setSelectedStudent}
                    />
                  </div>
                  <div className="tw-mb-xl">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      name="title"
                      label={`${activeTab === 'accident' ? 'Accident Report Title' : 'Incident Report Title'}`}
                    />
                  </div>
                  <div className="tw-mb-xl">
                    <div className="tw-text-sm-medium tw-text-secondary tw-mb-sm">
                      Time
                    </div>
                    <div className="tw-flex tw-justify-between tw-space-x-xl">
                      <CustomInput
                        control={methods.control}
                        type="time"
                        name="time"
                        containerClassName="tw-w-full"
                        noClockIcon={true}
                      />
                      <CustomDatePicker
                        name={'date'}
                        selected={alertDate}
                        padding="tw-px-3.5 tw-py-2.5"
                        height="tw-h-[46px]"
                        width="tw-w-full"
                        className="tw-w-full tw-flex tw-flex-col tw-items-start tw-justify-start tw-relative"
                        onChange={(date: Date | null) => handlePickDate(date)}
                      />
                    </div>
                  </div>
                  
                  <div className="tw-mb-xl">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      name="location"
                      label="Location"
                    />
                  </div>
                  {activeTab === 'accident' ? (
                    <div className="tw-mb-xl">
                      <div className="tw-flex tw-justify-between tw-space-x-xl">
                        <div className="tw-w-full">
                          <div className="tw-text-sm-medium tw-text-secondary tw-mb-sm">
                            Accident Type
                          </div>
                          <CustomDropdown
                            component=""
                            data={accidentTypes}
                            selectedItems={selectedAccidentItem}
                            setSelectedItems={setSelectedAccidentItem}
                            control={methods.control}
                            name="type"
                          />
                        </div>
                        <div className="tw-w-full">
                          <div className="tw-text-sm-medium tw-text-secondary tw-mb-sm">
                            Involvement
                          </div>
                          <CustomDropdown
                            component=""
                            data={involvementTypes}
                            selectedItems={selectedInvolvementItem}
                            setSelectedItems={setSelectedInvolvementItem}
                            control={methods.control}
                            name="involvement"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="tw-mb-xl">
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="type"
                        label="Incident Type"
                      />
                  </div>
                  )}
                  <div className="tw-mb-xl">
                    <CustomInput
                      control={methods.control}
                      type="textarea"
                      inputClassName="tw-h-[130px]"
                      name="description"
                      label="Description"
                      placeholder="Enter a detailed description of accident..."
                    />
                  </div>
                  <div className="tw-mb-xl">
                    <div className="tw-text-sm-medium tw-text-secondary tw-mb-sm">
                      Staff Present
                    </div>
                    <Controller
                      control={methods.control}
                      name="staff"
                      defaultValue={[]}
                      render={({ field: { value, onChange } }) => (
                        <Multiselect
                          options={staffData?.staff || []}
                          selectedValues={value}
                          selectedValueDecorator={(value, option) => selectedValueDecorator(value, option)}
                                optionValueDecorator={(value, option) => optionValueDecorator(value, option)}
                          onSelect={(selectedStaff) => {
                            onChange(selectedStaff);
                            setSelectedStaff(selectedStaff);
                          }}
                          onRemove={(selectedStaff) => {
                            onChange(selectedStaff);
                            setSelectedStaff(selectedStaff);
                          }}
                          closeOnSelect={true}
                          avoidHighlightFirstOption={true}
                          displayValue="firstName"
                          closeIcon="cancel"
                          placeholder={value.length > 0 ? '' : 'Select Staff'}                           
                          style={customStyles}
                          customCloseIcon={
                            <div className="tw-cursor-pointer tw-ml-sm -tw-mr-sm">
                              <CloseIcon />
                            </div>
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="tw-mb-xl">
                    <CustomInput
                      control={methods.control}
                      type="textarea"
                      inputClassName="tw-h-[130px]"
                      name="action"
                      label="Action Taken by Staff"
                      placeholder="Enter a detailed description of accident..."
                    />
                  </div>
                  <div className="tw-mb-xl">
                    <CustomInput
                      control={methods.control}
                      type="textarea"
                      inputClassName="tw-h-[130px]"
                      name="comments"
                      label="Comments"
                      placeholder="Enter additional notes if needed..."
                    />
                  </div>
                  <div className="tw-mb-xl">
                    <div className="tw-text-sm-medium tw-text-secondary tw-mb-sm">
                      Photos
                    </div>
                    <CustomUploadImage
                        key={uploadingImage ? uploadingImage.id : 'default'}
                        component="Student"
                        control={methods.control}
                        type="file"
                        name="image"
                        icon="cloud"
                        label=""
                        isProfile={true}
                        disabled={isLoading}
                        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                          handleUploadImage(e);
                        }}
                      />
                    </div>
                    {croppedImage && (
                      <div className="tw-flex tw-flex-row tw-justify-between tw-p-xl tw-h-[72px] tw-py-lg tw-px-2xl tw-w-full tw-border tw-border-solid tw-border-secondary tw-rounded-xl tw-mt-xl">
                        <div className="tw-flex tw-space-x-xl">
                          <div className="tw-relative">
                            <JpgIcon />
                            <div className="tw-uppercase tw-rounded-xs tw-w-[30px] tw-h-[17px] tw-absolute tw-bottom-[12px] tw-left-[-5px] tw-text-[10px] tw-font-bold tw-text-white tw-bg-brand tw-py-0.5 tw-px-[3px]">
                              {uploadingImage?.imageType.toUpperCase()}
                            </div>
                          </div>
                          <div className="tw-flex tw-flex-col">
                            <div
                              className="tw-text-sm-medium tw-text-secondary
                            "
                            >
                              {uploadingImage?.imageName}
                            </div>
                            <div className="tw-text-sm-regular tw-text-tertiary">
                              {formatFileSize(Number(uploadingImage?.imageSize))}
                            </div>
                          </div>
                        </div>
                        <div onClick={handleDeleteImage} className="tw-flex tw-items-center tw-cursor-pointer">
                          <TrashIcon />
                        </div>
                      </div>
                    )}
                    {selectedStudent && (
                      <div className="tw-mb-xl">
                        <AlertShareCheckbox 
                          studentId={selectedStudent.id} 
                          checkedEmails={checkedEmails}
                          isIncident={activeTab === 'incident'}
                          setCheckedEmails={setCheckedEmails}
                        />
                      </div>
                    )}
                    <div className="tw-mb-xl">
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="emailSubject"
                        label="Email Subject Line"
                      />
                    </div>
                    {currentUserRoles?.isAssociateGuide ? (
                      <>
                        <div className="tw-mb-xl">
                          <CustomButton
                            text="Save"
                            btnSize="lg"
                            heirarchy="primary"
                            type="button"
                            iconLeading={<SendIcon color="primary" borderColor="#FFFFFF"/>}
                            onClick={handleSave}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                      <div className="tw-mb-xl">
                          <CustomButton
                            text="Share"
                            btnSize="lg"
                            heirarchy="primary"
                            type="button"
                            iconLeading={<SendIcon color="primary" borderColor="#FFFFFF"/>}
                            onClick={handleShareButton}
                          />
                        </div>
                        { share &&
                          <>
                            <CustomButton
                              text={'Confirm Share?'}
                              btnSize={'lg'}
                              heirarchy="success"
                              type="submit"
                              onClick={handleSave}
                              iconLeading={<CheckIcon stroke="#FFFFFF" width={20} height={20}/>}
                            />
                          </>
                        }
                      </>
                    )}
                  </div>
                </div>
              </form>
              
                <CustomPopupModal
                  showModal={showCropper}
                  setShowModal={setShowCropper}
                  width={500}
                  backdropClass="!tw-bg-transparent"
                >
                <CustomPopupModal.Header>
                  <div className="tw-justify-between tw-flex">
                    <div className="tw-flex tw-flex-row tw-space-x-xl">
                      <FeaturedIcon size="lg" type="modern" color="gray">
                        <CropIcon />
                      </FeaturedIcon>
                      <div className="tw-flex tw-flex-col tw-justify-start">
                        <div className="tw-text-lg-semibold tw-text-primary tw-flex tw-flex-row tw-space-x-xs">
                          Crop Milestone Image
                        </div>
                        <div className="tw-text-sm-regular tw-text-tertiary">Maximum 25mb image file allowed.</div>
                      </div>
                    </div>

                    <div className="tw-cursor-pointer tw-justify-end" onClick={handleCropperCancel}>
                      <NotesCloseIcon />
                    </div>
                  </div>
                </CustomPopupModal.Header>
                <CustomPopupModal.Content>
                  <div className="tw-flex tw-flex-col tw-space-y-xs tw-pt-0 tw-pb-sm tw-border-b-[1px] tw-border-x-0 tw-border-t-0 tw-border-solid tw-border-secondary">
                    <div className="tw-text-center tw-rounded-lg">
                      <AvatarEditor
                        ref={editorRef}
                        image={uploadingImage?.imageUrl || ''}
                        width={330} // Set the width to a fixed value
                        height={330 * (9 / 16)} // Calculate the height based on a 16:9 aspect ratio
                        border={50}
                        color={[150, 150, 150, 0.6]}
                        scale={zoom}
                        rotate={0}
                        style={{ borderRadius: '8px' }}
                      />
                    </div>
                    <input
                      id="default-range"
                      type="range"
                      value={zoom}
                      min={1}
                      max={5}
                      step={0.1}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="tw-w-full tw-appearance-none tw-cursor-pointer tw-pointer-events-auto"
                    />
                  </div>
                </CustomPopupModal.Content>
                <CustomPopupModal.Footer
                  type="button"
                  submitText="Save Changes"
                  showLoader={false}
                  onClick={handleCropImage}
                  hasCancel
                  cancelText="Cancel"
                  flex="row"
                  className="!tw-justify-end"
                  submitClass="tw-order-2 !tw-w-auto"
                  cancelClass="tw-order-1 !tw-w-auto"
                  onCancel={handleCropperCancel}
                />
              </CustomPopupModal>
            </FormProvider>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default AlertWidget;
