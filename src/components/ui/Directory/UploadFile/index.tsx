import { useState, useEffect, ChangeEvent } from 'react';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import SaveIcon from '@/components/svg/SaveIcon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import 'react-datepicker/dist/react-datepicker.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { StudentDto } from '@/dtos/StudentDto';
import { AttendanceValidationSchema } from '@/validation/AttendanceValidationSchema';
import StaffDto from '@/dtos/StaffDto';
import { ParentDto } from '@/dtos/ParentDto';
import CustomPopupModal from '../../CustomPopupModal';
import { CustomModal } from '../../CustomModal';
import FileDto from '@/dtos/FileDto';
import CustomUploadImage from '../Class/CustomUploadImage';
import { deleteFile, uploadFile } from '@/services/api/uploadFile';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import JpgIcon from '@/components/svg/JpgIcon';
import { formatFileSize } from '@/utils/formatFileSize';
import CheckBoxIcon from '@/components/svg/Checkbox';
import { getFileTypeStyles } from '@/utils/fileTypeStyles';
import Alert from '../../Alert';
import { AlertCircleIcon } from '@/components/svg/AlertCircle';

interface UploadFileProps {
  showModal?: boolean;
  setShowModal: (showModal: boolean) => void;
  data: StudentDto | StaffDto | ParentDto;
  type: 'student' | 'staff' | 'parent';
}

export default function UploadFile({ showModal, setShowModal, data, type }: UploadFileProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [fileArray, setFileArray] = useState<FileDto[]>([]);
  const [uploadingFileArray, setUploadingFileArray] = useState<FileDto[]>([]);
  const [uploadingFileIds, setUploadingFileIds] = useState<number[]>([]);
  const [errorUpload, setErrorUpload] = useState<boolean>(false);

  const methods = useForm<FileDto>({
    resolver: yupResolver(AttendanceValidationSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (type == 'student') {
      methods.setValue('studentId', data?.id);
    } else if (type == 'staff') {
      methods.setValue('staffId', data?.id);
    } else if (type == 'parent') {
      methods.setValue('parentId', data?.id);
    }
  }, [showModal]);

  const deleteFileMutation = useMutation(
    async ({ id, type }: { id: number; type: string }) => {
      await deleteFile(id, type);
    },
    {
      onSuccess: (_, variables) => {
        if (variables.type == 'student') {
          queryClient.invalidateQueries(['students-directory', data?.id]);
        } else if (variables.type == 'staff') {
          queryClient.invalidateQueries(['staffs-directory', data?.id]);
        } else if (variables.type == 'parent') {
          queryClient.invalidateQueries(['parents-directory', data?.id]);
        }
      },
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    }
  );

  const resetData = () => {
    setShowModal(false);
    methods.reset();

    uploadingFileArray &&
      uploadingFileArray.length > 0 &&
      uploadingFileArray.forEach(async (file) => {
        try {
          await deleteFileMutation.mutateAsync({ id: file.id, type });
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      });
  };

  const handleSuccess = () => {
    methods.reset();
    setIsLoading(false);
    setShowModal(false);
  };

  const handleSave = async () => {
    if (fileArray.length == 0 && uploadingFileArray.length == 0) {
      setErrorUpload(true);
      return;
    }
    setIsLoading(true);
    if (type == 'student') {
      queryClient.invalidateQueries(['students-directory', data?.id]);
    } else if (type == 'staff') {
      queryClient.invalidateQueries(['staffs-directory', data?.id]);
    } else if (type == 'parent') {
      queryClient.invalidateQueries(['parents-directory', data?.id]);
    }

    setIsLoading(false);
    handleSuccess();
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

  const addFileMutation = useMutation(
    async ({ formData, uploadingId }: { formData: FormData; uploadingId: number }) => {
      const response = await uploadFile(formData, data?.id, type);
      return response;
    },
    {
      onSuccess: (data, variables) => {
        const { uploadingId } = variables;
        const updatedFiles = uploadingFileArray.map((file) => {
          if (file.id === uploadingId) {
            return { ...file, id: data.data.id };
          }
          return file;
        });
        setUploadingFileIds((prevIds) => prevIds.filter((id) => id !== uploadingId));
        setUploadingFileArray(updatedFiles);
      },
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    }
  );

  const handleUploadImage = async (files: FileList) => {
    if (fileArray.length + uploadingFileArray.length >= 7) {
      // alert('A maximum of 7 images can be uploaded to the gallery.');
      return;
    }

    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 25 * 1024 * 1024) {
        return;
      }

      const newFile: FileDto = {
        id: Date.now(),
        fileName: file.name,
        fileSize: file.size.toString(),
        fileType:
          file.type.split('/')[1] == 'msword'
            ? 'doc'
            : file.type.split('/')[0] == 'text'
            ? 'txt'
            : file.type.split('/')[1],
        fileUrl: '',
        createdBy: 0,
        createdOn: new Date(),
      };

      setUploadingFileIds((prevIds) => [...prevIds, newFile.id]);
      setUploadingFileArray((prevGallery) => [...prevGallery, newFile]);

      const formData = new FormData();
      // formData.append('id', data?.id);

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString() || '';
        formData.append('fileB64', base64String);
        formData.append('fileName', file.name);

        try {
          addFileMutation.mutateAsync({ formData, uploadingId: newFile.id });
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

  return (
    <CustomPopupModal showModal={showModal!} setShowModal={setShowModal}>
      <CustomModal.Header>
        <div className="tw-flex tw-flex-col tw-space-y-xs">
          <div className="tw-justify-between tw-flex">
            <div className="tw-text-lg-semibold tw-text-primary">Upload files</div>
            <span className="tw-cursor-pointer" onClick={resetData}>
              <NotesCloseIcon />
            </span>
          </div>

          <div className="tw-text-sm-regular tw-text-tertiary">
            {`
              ${data?.firstName}
              ${data?.lastName}
            `}
          </div>
        </div>
      </CustomModal.Header>
      <CustomModal.Content>
        <FormProvider {...methods}>
          <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)} id="upload-file">
            <div className="tw-flex tw-flex-col tw-space-y-xl tw-w-full">
              <div className="tw-w-full">
                <CustomUploadImage
                  id={data?.id}
                  component="Class"
                  control={methods.control}
                  type="file"
                  name="file"
                  icon={'cloud'}
                  label=""
                  isProfile={true}
                  acceptedFiles=".pdf,.png,.jpg,.jpeg,.pptx,.ppt,.txt,.doc,.docx"
                  disabled={uploadingFileArray.length >= 7}
                  onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    handleUploadImage(files!);
                  }}
                />
              </div>
              {errorUpload && (
                <Alert
                  type="error"
                  icon={<AlertCircleIcon color="error" />}
                  errorText="File attachment(s) not found or is currently uploading."
                  onClose={() => setErrorUpload(false)}
                />
              )}
              {uploadingFileArray.map((file: FileDto) => {
                const { backgroundColor, displayText } = getFileTypeStyles(file);
                return (
                  <div
                    key={file.id}
                    className="tw-flex tw-flex-row tw-justify-between tw-p-xl tw-h-[72px] tw-py-lg tw-px-2xl tw-w-full tw-border tw-border-solid tw-border-secondary tw-rounded-xl tw-relative"
                  >
                    <div className="tw-flex tw-space-x-xl">
                      <div className="tw-relative">
                        <JpgIcon />
                        <div
                          className={`tw-uppercase tw-rounded-xs tw-w-auto tw-h-[17px] tw-absolute tw-bottom-[5px] tw-left-[-5px] tw-text-[10px] tw-font-bold tw-text-white tw-py-0.5 tw-px-[3px] ${backgroundColor}`}
                        >
                          {displayText}
                        </div>
                      </div>
                      <div className="tw-flex tw-flex-col">
                        <div className="tw-flex tw-truncate tw-w-[316px]">
                          {file.fileName == '' ? 'untitled' : file.fileName}
                        </div>
                        <div>{formatFileSize(Number(file.fileSize))}</div>
                      </div>
                    </div>
                    {uploadingFileIds.includes(file.id) ? (
                      <div role="status" className="tw-flex tw-items-center tw-justify-center">
                        <LoadingSpinner width={32} />
                      </div>
                    ) : (
                      <div className="tw-flex tw-items-center">
                        <CheckBoxIcon />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </form>
        </FormProvider>
      </CustomModal.Content>
      <CustomPopupModal.Footer
        hasCancel={true}
        cancelText="Cancel"
        submitText="Attach files"
        submitIcon={<SaveIcon />}
        formId="upload-file"
        onClick={handleSave}
        onCancel={resetData}
        flex="row"
        className="!tw-flex-row-reverse !tw-space-x-lg"
        submitClass="!tw-h-[44px] !tw-w-[150px]"
        cancelClass="!tw-w-[90px] tw-text-button-secondary-fg tw-border-primary hover:tw-bg-secondary"
      />
    </CustomPopupModal>
  );
}
