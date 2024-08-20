import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import { useQueryClient } from '@tanstack/react-query';
import { capitalizeWordFirstLetter } from '@/utils/capitalizeFirstLetter';
import AvatarEditor from 'react-avatar-editor';
import CropIcon from '@/components/svg/Crop';
import FeaturedIcon from '../FeaturedIcon';
import { updateStudentPicture } from '@/services/api/updateStudent';
import { updateStaffPicture } from '@/services/api/updateStaff';
import { updateParentPicture } from '@/services/api/updateParent';
import { updateOnboardingParentPicture, updateOnboardingStudentPicture } from '@/services/api/updateOnboarding';

interface PhotoCropperProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  id: number;
  picture: string;
  savePicture: (picture: string) => void;
  label?: string;
  component:
    | 'Student'
    | 'Staff'
    | 'Parent'
    | 'Contact'
    | 'Class'
    | 'OnboardingParent'
    | 'OnboardingStudent'
    | undefined;
  isProfile: boolean | undefined;
  code?: string;
}

export default function PhotoCropper({
  showModal,
  setShowModal,
  id,
  picture,
  savePicture,
  label,
  component,
  isProfile,
  code,
}: PhotoCropperProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const imgRef = useRef<AvatarEditor | null>(null);
  const [zoom, setZoom] = useState(1);
  const setEditorRef = (editor: AvatarEditor) => (imgRef.current = editor);

  const handleSave = async () => {
    if (!isProfile) {
      if (imgRef.current) {
        const canvasScaled = imgRef.current.getImageScaledToCanvas() as HTMLCanvasElement;
        const dataUrl = canvasScaled.toDataURL('image/jpeg');

        savePicture(dataUrl);
        setIsLoading(false);
        setShowModal(false);
      }
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    if (imgRef.current) {
      const canvasScaled = imgRef.current.getImageScaledToCanvas() as HTMLCanvasElement;
      formData.append('croppedImage', canvasScaled.toDataURL('image/jpeg') as string);
    }
    formData.append('id', String(id));
    // new Response(formData).text().then(console.log);

    try {
      if (component == 'Student') {
        await updateStudentPicture(formData).then(() => {
          queryClient.invalidateQueries(['students-directory']);
          queryClient.invalidateQueries(['students', id]);
        });
      } else if (component == 'Staff') {
        await updateStaffPicture(formData).then(() => {
          queryClient.invalidateQueries(['staffs-directory']);
          queryClient.invalidateQueries(['staffs', id]);
        });
      } else if (component == 'Parent') {
        await updateParentPicture(formData).then(() => {
          queryClient.invalidateQueries(['parents-directory', id]);
        });
      } else if (component == 'OnboardingParent') {
        await updateOnboardingParentPicture(formData, code!);
      } else if (component == 'OnboardingStudent') {
        await updateOnboardingStudentPicture(formData, code!, id);
      }

      setIsLoading(false);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  useEffect(() => {
    const body = document.querySelector('body');

    if (showModal) {
      body && body.classList.add('body-scroll-lock');
    } else {
      body && body.classList.remove('body-scroll-lock');
    }

    return () => {
      body && body.classList.remove('body-scroll-lock');
    };
  }, [showModal]);

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="tw-bg-black/[0.3] tw-w-screen tw-h-screen tw-top-0 tw-left-0 tw-fixed tw-z-20" />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: '-65%', x: '-50%' }}
            animate={{ opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, y: '-65%' }}
            transition={{ duration: 0.3 }}
            className="tw-fixed tw-top-2/4 tw-left-2/4 tw-translate-y-[-50%] tw-translate-x-[-50%] tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50"
          >
            <div className="tw-p-3xl tw-justify-between tw-flex">
              <div className="tw-flex tw-flex-row tw-space-x-xl">
                <FeaturedIcon size="lg" type="modern" color="gray">
                  <CropIcon />
                </FeaturedIcon>
                <div className="tw-flex tw-flex-col tw-justify-start">
                  <div className="tw-text-lg-semibold tw-text-primary tw-flex tw-flex-row tw-space-x-xs">
                    Crop {capitalizeWordFirstLetter(label!)}
                  </div>
                  <div className="tw-text-sm-regular tw-text-tertiary">Maximum 25mb image file allowed.</div>
                </div>
              </div>

              <div
                className="tw-cursor-pointer tw-justify-end"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                <NotesCloseIcon />
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-space-y-xs tw-px-3xl tw-pt-0 tw-pb-sm tw-border-b-[1px] tw-border-x-0 tw-border-t-0 tw-border-solid tw-border-secondary">
              <div className="tw-text-center tw-rounded-lg">
                <AvatarEditor
                  ref={setEditorRef}
                  image={picture}
                  width={330}
                  height={330}
                  border={50}
                  color={[150, 150, 150, 0.6]}
                  scale={zoom}
                  rotate={0}
                  borderRadius={165}
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
                className="tw-w-full tw-appearance-none tw-cursor-pointer"
              />
            </div>
            <div className="tw-p-3xl tw-flex tw-items-center tw-justify-between">
              <div className="tw-space-x-md"></div>
              <div className="tw-flex tw-items-center tw-justify-center tw-space-x-lg">
                <button
                  className="tw-h-[44px] tw-text-md-semibold tw-text-button-secondary-fg tw-rounded-md tw-px-xl tw-py-10px tw-shadow-sm tw-bg-white tw-border tw-border-primary tw-border-solid noprint hover:tw-bg-button-secondary-hover"
                  onClick={() => {
                    setShowModal(false);
                  }}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="tw-h-[44px] tw-flex tw-text-md-semibold tw-text-white tw-rounded-md tw-px-xl tw-py-10px tw-gap-sm tw-shadow-sm tw-bg-brand-primary tw-border tw-border-brand tw-border-solid noprint hover:tw-bg-button-primary-hover"
                  type="button"
                  onClick={handleSave}
                >
                  {isLoading ? (
                    <div role="status" className="tw-w-[60px] tw-h-[22px] tw-flex tw-items-center tw-justify-center">
                      <NotesSpinner />
                    </div>
                  ) : (
                    <div className="tw-flex">Save Changes</div>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
