import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import AvatarEditor from 'react-avatar-editor';
import JpgIcon from '@/components/svg/JpgIcon';
import TrashIcon from '@/components/svg/TrashIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import { useNoteImage } from '@/hooks/useNoteImage';
import { formatFileSize } from '@/utils/formatFileSize';
import CustomCheckbox from '@/components/common/NewCustomFormControls/CustomCheckbox';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import { useGetTime } from '@/hooks/useGetTime';
import { useEditMilestone } from '@/hooks/useEditMilestone';
import { StudentMilestoneDto } from '@/dtos/StudentDto';
import { useQueryClient } from '@tanstack/react-query';
import FeaturedIcon from '../FeaturedIcon';
import CropIcon from '@/components/svg/Crop';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import Alert from '@/components/ui/Alert'; // Import the Alert component here
import CustomPopupModal from '../CustomPopupModal';
import CustomButton from '../CustomButton';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import SaveIcon from '@/components/svg/SaveIcon';
import useConvertStatus from '@/hooks/useConvertStatus';
import CustomUploadImage from '../Directory/Class/CustomUploadImage';
import { MilestoneDto, UploadImageDto } from '@/dtos/MilestoneDto';
import { useStudentQuery } from '@/hooks/queries/useStudentsQuery';
import { useFocusContext } from '@/context/FocusContext';
dayjs.extend(customParseFormat);

const schema = Yup.object({
  title: Yup.string().required('Title is required'),
  image: Yup.mixed().required('An image is required'),
});

const editSchema = Yup.object({
  image: Yup.mixed(),
  title: Yup.string().required('Title is required'),
  caption: Yup.string().required('Caption is required'),
  note: Yup.string(),
  date: Yup.string(),
  time: Yup.string(),
  shareWithGuardians: Yup.boolean(),
});

interface AddMilestoneProps {
  showModal: string | undefined;
  setShowModal: (showModal: string | undefined) => void;
  studentId?: number | undefined;
  classId?: number | undefined;
  levelId?: number | undefined;
  lessonId?: number | undefined;
  lessonState: string;
  selectedMilestone?: StudentMilestoneDto;
  showMilestones?: boolean;
  lessonName?: string;
  handleClose?: Function;
}

const AddMilestone: React.FC<AddMilestoneProps> = ({
  showModal,
  setShowModal,
  classId,
  studentId,
  lessonId,
  levelId,
  lessonState,
  selectedMilestone,
  showMilestones,
  lessonName = '',
  handleClose,
}) => {
  const queryClient = useQueryClient();
  const { setOpenAddNoteOrMilestone, openAddNoteOrMilestone } = useFocusContext();
  const [alertType, setAlertType] = useState<'error' | 'succes' | 'warning' | 'info' | 'gray-info'>('error');
  const [alertText, setAlertText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date | null>(null);
  const [note, setNote] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState<UploadImageDto | undefined>(undefined);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const editorRef = useRef<AvatarEditor | null>(null);
  const getTime = useGetTime();
  const convertStatus = useConvertStatus(lessonState);

  const { data: student } = useStudentQuery(studentId!);

  const methods = useForm<MilestoneDto>({
    resolver: yupResolver(selectedMilestone ? editSchema : schema),
    defaultValues: {
      note: '',
    },
  });

  useEffect(() => {
    if ((showModal !== undefined || openAddNoteOrMilestone !== undefined) && selectedMilestone) {
      // methods.setValue('image', selectedMilestone?.lessonImageUrl || '');
      methods.setValue('title', selectedMilestone?.title || '');
      methods.setValue('caption', selectedMilestone?.lessonImageCaption || '');
      methods.setValue('note', selectedMilestone?.notes || '');
      methods.setValue('date', selectedMilestone?.createdOn || '');
      methods.setValue('time', getTime(selectedMilestone?.createdOn) || '');
      methods.setValue('shareWithGuardians', false);
      setDate(new Date(selectedMilestone?.createdOn));
    } else {
      methods.reset();
    }
  }, [showModal, openAddNoteOrMilestone, selectedMilestone, showMilestones]);

  useEffect(() => {
    if (student) {
      methods.setValue('title', `${student.firstName} ${student.lastName} ${convertStatus} ${lessonName}`);
    }
  }, [student]);

  useEffect(() => {
    const body = document.querySelector('body');

    // Add the class to disable scrolling when the modal is open
    if (showModal !== undefined) {
      body && body.classList.add('body-scroll-lock');
    } else {
      // Remove the class when the modal is closed
      body && body.classList.remove('body-scroll-lock');
    }

    // Cleanup effect
    return () => {
      body && body.classList.remove('body-scroll-lock');
    };
  }, [showModal]);

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

  const handleSuccess = () => {
    setNote('');
  };

  const handleCropperCancel = () => {
    setShowCropper(false);
    setUploadingImage(undefined);
    methods.setValue('image', undefined);
  };

  const saveNoteMutation = useNoteImage({ studentId, classId, lessonId, levelId, handleSuccess });
  const editMilestoneMutation = useEditMilestone({ handleSuccess });

  const handleSave = async (data: MilestoneDto) => {
    // Set isLoading to true immediately
    setIsLoading(true);
    const imageB64 = croppedImage;

    if (!selectedMilestone && data.image && parseInt(data.image.imageSize) > 25 * 1024 * 1024) {
      setAlertType('error');
      setAlertText('File size should not exceed 25MB.');
      setIsLoading(false);
      return;
    }

    if (selectedMilestone) {
      await editMilestoneMutation.mutateAsync({
        title: data?.title,
        note: data?.note,
        lessonState: selectedMilestone?.lessonState,
        imageName: data.image?.imageName ?? null,
        imageB64: data.image?.imageUrl ? imageB64 : null,
        lessonImageCaption: data.caption,
        id: selectedMilestone.id,
        date: dayjs(data.date).format('YYYY/MM/DD'),
        time: dayjs(data.time, 'h:mm A').format('HH:mm'),
        shareWithGuardians: data?.shareWithGuardians ?? false,
      });
      queryClient.invalidateQueries(['students-directory', 'milestones', studentId]);
      closeModal();
    } else {
      try {
        // Execute the save operation
        await saveNoteMutation.mutateAsync({
          title: data.title || '',
          note: data.note || '',
          lessonState: lessonState ?? '',
          imageName: data.image?.imageName,
          imageB64: imageB64 ?? '',
          lessonImageCaption: data.caption,
          shareWithGuardians: data.shareWithGuardians,
        });
        queryClient.invalidateQueries(['students-directory', 'milestones', studentId]);
        closeModal();
      } catch (error) {
        console.error('Error saving note:', error);
        setIsLoading(false);
      }
    }
  };

  const handlePickDate = (date: Date | null) => {
    setDate(date);
    methods.setValue('date', dayjs(date).format('YYYY/MM/DD'));
  };

  const closeModal = () => {
    if (handleClose) handleClose();
    methods.reset();
    setIsLoading(false);
    setShowModal(undefined);
    setOpenAddNoteOrMilestone(undefined);
  };

  // const watchImage = methods.watch('image');

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSave)}>
          <div className="tw-px-6 tw-space-y-xl">
            <div className="tw-space-y-sm">
              <div className="tw-text-sm-medium tw-text-secondary">Title</div>
              <CustomInput control={methods.control} type="text" name="title" placeholder="Milestone Title" />
            </div>
            {selectedMilestone && (
              <div className="tw-space-y-sm">
                <div className="tw-text-sm-medium tw-text-secondary">Time</div>
                <CustomInput control={methods.control} type="text" name="time" placeholder="Enter time" />
              </div>
            )}
            {selectedMilestone && (
              <CustomDatePicker name={'date'} selected={date} onChange={(date: Date | null) => handlePickDate(date)} />
            )}
            <div className="tw-w-full">
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
            <div className="tw-flex tw-flex-col tw-space-y-sm">
              <div className="tw-text-sm-medium tw-text-secondary">Caption</div>
              <Controller
                name="caption"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <textarea
                      {...field}
                      rows={4}
                      className={`tw-h-[92px] tw-mt-2xl tw-block tw-py-10px tw-px-14px tw-w-full tw-text-md-regular tw-text-primary tw-bg-white-50 tw-rounded-md tw-border ${
                        error ? 'tw-border-red-500' : 'tw-border-gray-300'
                      } tw-focus:ring-blue-500 tw-focus:border-blue-500 tw-resize-none`}
                      placeholder="Write a caption..."
                    />
                  </>
                )}
              />
            </div>
            <div className="tw-flex tw-flex-row tw-items-center tx-gap-x-3 tw-w-full tw-mt-2xl">
              <CustomCheckbox
                name="shareWithGuardians"
                control={methods.control}
                defaultValue={false}
                label="Share with Guardians"
                containerClass="tw-border tw-border-transparent tw-text-secondary"
                labelClass="tw-text-sm-medium tw-ml-md"
                checkBoxClass="tw-w-xl tw-h-[16px] tw-rounded-xs"
              />
            </div>
            {alertType && alertText && (
              <Alert
                type={alertType}
                errorText={alertText}
                onClose={() => {
                  setAlertType('error');
                  setAlertText(null);
                }}
              />
            )}
            <div className="tw-flex tw-flex-col tw-space-y-sm">
              <div className="tw-text-sm-medium tw-text-secondary">Private Note</div>
              <Controller
                name="note"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <textarea
                      {...field}
                      rows={4}
                      className={`tw-h-[92px] tw-mt-2xl tw-block tw-py-2.5 tw-px-3.5 tw-w-full tw-text-[16px] tw-text-[#667085]-900 tw-bg-white-50 tw-rounded-md tw-border ${
                        error ? 'tw-border-red-500' : 'tw-border-gray-300'
                      } tw-focus:ring-blue-500 tw-focus:border-blue-500 tw-resize-none`}
                      placeholder="e.g. Need to repeat lesson next week"
                    />
                    {error && (
                      <p className="tw-text-error tw-text-xs-regular">{error.message}</p> // Display the error message
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="tw-mt-4xl tw-p-3xl tw-flex tw-justify-end tw-gap-x-3 tw-border-secondary tw-border-t-1 tw-border-b-0 tw-border-x-0 tw-border-solid">
            <CustomButton
              type="button"
              text="Cancel"
              btnSize="lg"
              heirarchy="secondary-gray"
              className="!tw-w-auto"
              onClick={() => closeModal()}
            />
            <CustomButton
              text={isLoading ? <NotesSpinner /> : selectedMilestone ? 'Save' : 'Add Milestone'}
              btnSize={'lg'}
              className="!tw-w-auto"
              heirarchy="primary"
              type="submit"
              disabled={methods.formState.isSubmitting || isLoading || Object.keys(methods.formState.errors).length > 0}
              onClick={methods.handleSubmit(handleSave)}
              iconLeading={selectedMilestone ? <SaveIcon /> : false}
            />
          </div>
        </form>
      </FormProvider>
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
    </>
  );
};

export default AddMilestone;
