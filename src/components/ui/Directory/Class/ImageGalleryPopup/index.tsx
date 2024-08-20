import JpgIcon from '@/components/svg/JpgIcon';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import SaveIcon from '@/components/svg/SaveIcon';
import TrashIcon from '@/components/svg/TrashIcon';
import CustomButton from '@/components/ui/CustomButton';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import ClassDto, { ClassImageGalleryDto } from '@/dtos/ClassDto';
import { formatFileSize } from '@/utils/formatFileSize';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { FormProvider, Controller, useForm } from 'react-hook-form';
import CustomUploadImage from '../CustomUploadImage';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addClassImage, updateClassShowBanner } from '@/services/api/updateClass';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ImageGalleryPopupProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  classData: ClassDto;
  showBanner: boolean;
  setShowBanner: (showBanner: boolean) => void;
}

const schema = Yup.object().shape({
  showBannerGallery: Yup.boolean(),
});

const ImageGalleryPopup = ({
  showModal,
  setShowModal,
  classData,
  showBanner,
  setShowBanner,
}: ImageGalleryPopupProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deletingImageIds, setDeletingImageIds] = useState<number[]>([]);
  const [classImageGallery, setClassImageGallery] = useState<ClassImageGalleryDto[]>([]);
  const [uploadingImageGallery, setUploadingImageGallery] = useState<ClassImageGalleryDto[]>([]);
  const [uploadingImageIds, setUploadingImageIds] = useState<number[]>([]);

  const methods = useForm<ClassDto>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      showBannerGallery: classData?.showBannerGallery || false,
    },
  });

  useEffect(() => {
    if (showModal) {
      methods.setValue('showBannerGallery', classData.showBannerGallery);
      setShowBanner(classData.showBannerGallery);
    }
  }, [showModal]);

  useEffect(() => {
    if (classData) {
      methods.setValue('id', classData.id);
      setClassImageGallery(classData.classImageGallery);
    }
  }, [classData]);

  const deleteImageMutation = useMutation(
    async (imageId: number) =>
      await fetch(`/api/class/delete-image/${imageId}`, {
        method: 'DELETE',
      }),
    {
      onSuccess: (_, imageId) => {
        queryClient.invalidateQueries(['classes', classData?.id]);
        setDeletingImageIds((prevIds) => prevIds.filter((id) => id !== imageId));
      },
      onError: (error) => {
        console.error('Error deleting image:', error);
      },
    }
  );

  const addImageMutation = useMutation(
    async ({ formData, uploadingId }: { formData: FormData; uploadingId: number }) => {
      const response = await addClassImage(formData, classData?.id!);
      return response;
    },
    {
      onSuccess: (data, variables) => {
        const { uploadingId } = variables;
        queryClient.invalidateQueries(['classes', classData?.id]);
        setUploadingImageGallery((prevGallery) => prevGallery.filter((item) => item.id !== uploadingId));
        setUploadingImageIds((prevIds) => prevIds.filter((id) => id !== uploadingId));
      },
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    }
  );

  const handleDeleteImage = async (imageId: number) => {
    setDeletingImageIds((prevIds) => [...prevIds, imageId]);

    try {
      await deleteImageMutation.mutateAsync(imageId);
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setDeletingImageIds((prevIds) => prevIds.filter((id) => id !== imageId));
    }
  };

  const handleUploadImage = async (files: FileList) => {
    if (classImageGallery.length + uploadingImageGallery.length >= 7) {
      alert('A maximum of 7 images can be uploaded to the gallery.');
      return;
    }

    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 25 * 1024 * 1024) {
        return;
      }

      const newImage: ClassImageGalleryDto = {
        id: Date.now(),
        imageName: file.name,
        imageSize: file.size.toString(),
        imageType: file.type.split('/')[1],
        imageUrl: '',
        createdBy: '',
        createdOn: '',
      };

      setUploadingImageIds((prevIds) => [...prevIds, newImage.id]);
      setUploadingImageGallery((prevGallery) => [...prevGallery, newImage]);

      const formData = new FormData();
      formData.append('id', classData?.id as unknown as string);

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString() || '';
        formData.append('imageB64', base64String);
        formData.append('imageName', file.name);

        try {
          addImageMutation.mutateAsync({ formData, uploadingId: newImage.id });
        } catch (error) {
          console.error('Error adding image:', error);
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetData = (type: string) => {
    methods.reset();
    setIsLoading(false);
    setShowModal(false);
    setShowBanner(classData?.showBannerGallery!);
  };

  const handleSave = async (values: ClassDto) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof ClassDto];
      if (key === 'showBannerGallery') {
        formData.append(key, showBanner!.toString());
      } else {
        formData.append(key, value as string);
      }
    });
    // new Response(formData).text().then(console.log);

    await updateClassShowBanner(showBanner, classData?.id!).then(() => {
      queryClient.invalidateQueries(['classes']);
      setIsLoading(false);
      setShowModal(false);
    });
  };
  return (
    <AnimatePresence>
      {showModal ? (
        <>
          <div className="tw-p-3xl tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-flex tw-items-start tw-justify-center tw-overflow-y-scroll tw-max-h-screen tw-bg-black/[0.3] tw-z-20 tw-h-screen">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50 custom-thin-scrollbar"
            >
              <FormProvider {...methods}>
                <form
                  method="post"
                  autoComplete="off"
                  onSubmit={methods.handleSubmit(handleSave)}
                  encType="multipart/form-data"
                >
                  <div className="tw-p-3xl">
                    <div className="tw-mb-2xl">
                      <div className="tw-justify-between tw-flex">
                        <div className="tw-font-black tw-text-lg">Class Image Gallery</div>
                        <span className="tw-cursor-pointer" onClick={() => resetData('cancel')}>
                          <NotesCloseIcon />
                        </span>
                      </div>
                      <div className="tw-text-sm-regular tw-text-tertiary ">
                        A maximum of 7 images can be uploaded to the gallery.
                      </div>
                    </div>
                    <div className="tw-flex tw-flex-col tw-space-y-xl tw-items-center tw-justify-between">
                      <div className="tw-flex tw-py-lg tw-px-2xl tw-w-full tw-h-[44px] tw-border tw-border-solid tw-border-secondary tw-rounded-xl">
                        <Controller
                          control={methods.control}
                          name="showBannerGallery"
                          render={({ field, fieldState: { error } }) => {
                            return (
                              <ToggleSwitch
                                {...field}
                                label="Show Banner Gallery"
                                checked={showBanner}
                                onChange={() => setShowBanner(!showBanner)}
                              />
                            );
                          }}
                        />
                      </div>
                      {showBanner && (
                        <div className="tw-flex tw-flex-col tw-space-y-xl tw-w-full">
                          <div className="tw-w-full">
                            <CustomUploadImage
                              id={classData?.id}
                              component="Class"
                              control={methods.control}
                              type="file"
                              name="classImageGallery"
                              icon={'cloud'}
                              label=""
                              isProfile={true}
                              disabled={classImageGallery.length + uploadingImageGallery.length >= 7}
                              onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                                const files = e.target.files;
                                handleUploadImage(files!);
                              }}
                            />
                          </div>
                          {classImageGallery.map((image: ClassImageGalleryDto) => (
                            <div
                              key={image.id}
                              className="tw-flex tw-flex-row tw-justify-between tw-p-xl tw-h-[72px] tw-py-lg tw-px-2xl tw-w-full tw-border tw-border-solid tw-border-secondary tw-rounded-xl"
                            >
                              <div className="tw-flex tw-space-x-xl">
                                <div className="tw-relative">
                                  <JpgIcon />
                                  <div className="tw-uppercase tw-rounded-xs tw-w-[30px] tw-h-[17px] tw-absolute tw-bottom-[5px] tw-left-[-5px] tw-text-[10px] tw-font-bold tw-text-white tw-bg-[#005B85] tw-py-0.5 tw-px-[3px]">
                                    {image.imageType == '' ? 'JPG' : image.imageType}
                                  </div>
                                </div>
                                <div className="tw-flex tw-flex-col">
                                  <div className="tw-truncate tw-w-[300px]">
                                    {image.imageName == '' ? 'untitled' : image.imageName}
                                  </div>
                                  <div>{formatFileSize(Number(image.imageSize))}</div>
                                </div>
                              </div>
                              {deletingImageIds.includes(image.id) ? (
                                <div role="status" className="tw-flex tw-items-center tw-justify-center">
                                  <LoadingSpinner width={32} />
                                </div>
                              ) : (
                                <div
                                  className="tw-flex tw-items-center tw-cursor-pointer"
                                  onClick={() => handleDeleteImage(image.id)}
                                >
                                  <TrashIcon />
                                </div>
                              )}
                            </div>
                          ))}
                          {uploadingImageGallery.map((image: ClassImageGalleryDto) => (
                            <div
                              key={image.id}
                              className="tw-flex tw-flex-row tw-justify-between tw-p-xl tw-h-[72px] tw-py-lg tw-px-2xl tw-w-full tw-border tw-border-solid tw-border-secondary tw-rounded-xl tw-relative"
                            >
                              <div className="tw-flex tw-space-x-xl">
                                <div className="tw-relative">
                                  <JpgIcon />
                                  <div className="tw-uppercase tw-rounded-xs tw-w-[26px] tw-h-[17px] tw-absolute tw-bottom-[5px] tw-left-[-5px] tw-text-[10px] tw-font-bold tw-text-white tw-bg-[#005B85] tw-py-0.5 tw-px-[3px]">
                                    {image.imageType == '' ? 'JPG' : image.imageType.substring(1)}
                                  </div>
                                </div>
                                <div className="tw-flex tw-flex-col">
                                  <div>{image.imageName == '' ? 'untitled' : image.imageName}</div>
                                  <div>{formatFileSize(Number(image.imageSize))}</div>
                                </div>
                              </div>
                              {uploadingImageIds.includes(image.id) && (
                                <div role="status" className="tw-flex tw-items-center tw-justify-center">
                                  <LoadingSpinner width={32} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="tw-pt-4xl tw-flex tw-items-center tw-justify-end tw-space-x-lg">
                      <CustomButton
                        text="Cancel"
                        btnSize="lg"
                        heirarchy="secondary-gray"
                        className="!tw-w-auto"
                        onClick={() => resetData('cancel')}
                      />
                      <CustomButton
                        text="Save"
                        btnSize="lg"
                        heirarchy="primary"
                        className="!tw-w-auto"
                        type="submit"
                        iconLeading={isLoading ? <NotesSpinner /> : <SaveIcon />}
                      />
                    </div>
                  </div>
                </form>
              </FormProvider>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default ImageGalleryPopup;
