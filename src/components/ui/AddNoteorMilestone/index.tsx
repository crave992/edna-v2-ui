import { useEffect, useMemo, useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import { useSaveNote } from '@/hooks/useSaveNote';
import AddMilestone from './AddMilestone';
import LessonDto from '@/dtos/LessonDto';
import { useFocusContext } from '@/context/FocusContext';
import CustomButton from '../CustomButton';
import CustomCheckbox from '@/components/common/NewCustomFormControls/CustomCheckbox';
import * as Yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RecordKeepingDto } from '@/dtos/RecordKeepingDto';

interface SectionProps {
  showModal: string | undefined;
  setShowModal: (showModal: string | undefined) => void;
  name: string;
  studentId: number;
  levelId: number;
  classId: number;
  lesson: LessonDto;
  lessonState: string;
  updateLessonStateMutation: UseMutationResult<
    Response,
    unknown,
    {
      status?: string | undefined;
      order?: number;
      actionDate: string;
      count: number | null;
      reReview: boolean;
      fromStudentLessonId?: number;
    },
    unknown
  > | null;
}

interface NotesDto {
  note: string;
  isRepresent: boolean;
}

const schema = Yup.object({
  note: Yup.string().required('Note is required'),
});

export default function AddNoteorMilestone({
  showModal,
  setShowModal,
  name,
  studentId,
  levelId,
  classId,
  lesson,
  lessonState,
  updateLessonStateMutation,
}: SectionProps) {
  const { currentUserRoles, selectedLessonState, setSelectedLessonState, setOpenAddNoteOrMilestone } =
    useFocusContext();

  const methods = useForm<NotesDto>({
    resolver: yupResolver(schema),
    defaultValues: {
      note: '',
    },
  });
  const shouldRepresent = methods.watch('isRepresent');

  useEffect(() => {
    methods.reset();
    const body = document.querySelector('body');

    if (showModal !== undefined) {
      body && body.classList.add('body-scroll-lock');
    } else {
      body && body.classList.remove('body-scroll-lock');
    }

    return () => {
      body && body.classList.remove('body-scroll-lock');
    };
  }, [showModal]);

  const count = useMemo(() => {
    let newCount = null;

    if (lesson && lesson.recordKeepings && lesson.recordKeepings.length > 0) {
      const studentRecords = lesson.recordKeepings.filter((rk) => {
        return rk.studentId == studentId;
      });

      const recordKeeping = studentRecords[0];
      const status = recordKeeping.status ? recordKeeping.status : undefined;

      switch (status) {
        case 'practicing':
          newCount = recordKeeping.practiceCount;
          break;
        case 'acquired':
          newCount = recordKeeping.acquiredCount;
          break;
        case 'review':
          newCount = recordKeeping.reviewCount;
          break;
        default:
          newCount = recordKeeping.practiceCount ?? recordKeeping.acquiredCount ?? recordKeeping.reviewCount;
      }
    }

    return newCount;
  }, [lesson]);

  const saveNote = async (data: NotesDto) => {
    const isRepresented = shouldRepresent ?? false;
    await saveNoteMutation.mutateAsync(
      {
        note: data?.note,
        lessonState: selectedLessonState,
        shouldInvalidate: !isRepresented,
        count: count!,
      },
      {
        onSuccess: async () => {
          if (shouldRepresent) {
            await updateLessonStateMutation?.mutateAsync({
              status: 'review',
              order: 0,
              actionDate: new Date().toISOString(),
              count: 1,
              reReview: lessonState === 'review',
            });
          }
        },
      }
    );
  };

  const handleSuccess = () => {
    setSelectedLessonState('');
    setShowModal(undefined);
    setOpenAddNoteOrMilestone(undefined);
  };

  const handleCancel = () => {
    setShowModal(undefined);
    setOpenAddNoteOrMilestone(undefined);
  };

  const saveNoteMutation = useSaveNote({ studentId, classId, lessonId: lesson?.id, levelId, handleSuccess });
  const getLessonStateByStudent = () => {
    const recordKeep = lesson && lesson.recordKeepings?.find((e: RecordKeepingDto) => e.studentId === studentId);
    return recordKeep ? recordKeep.status : '';
  };

  return (
    <AnimatePresence>
      {showModal !== undefined && (
        <>
          {/* <div className={`tw-bg-black/[0.3] tw-w-screen tw-h-screen tw-top-0 tw-left-0 tw-fixed tw-z-[60]`} /> */}
          <div className="tw-p-3xl tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-flex tw-items-start tw-justify-center tw-overflow-y-scroll tw-max-h-screen tw-bg-black/[0.3] tw-z-[60] tw-h-screen">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tw-w-[400px] tw-pb-3xl tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50 custom-thin-scrollbar"
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.stopPropagation();
                }
              }}
            >
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(saveNote)}>
                  <div className="tw-px-3xl tw-pt-3xl">
                    <div className="tw-justify-between tw-flex">
                      <div className="tw-font-black tw-text-lg">
                        Add {showModal.charAt(0).toUpperCase() + showModal.slice(1)}
                      </div>
                      <span className="tw-cursor-pointer" onClick={handleCancel}>
                        <NotesCloseIcon />
                      </span>
                    </div>

                    <div className="tw-text-tertiary tw-text-sm-regular">{lesson.name ?? name}</div>
                    <div className="tw-flex tw-items-center tw-gap-xs tw-p-xs tw-rounded-lg tw-my-xl tw-border-secondary tw-bg-secondary tw-border-1 tw tw-border-solid">
                      <div
                        className={`tw-flex-1 tw-text-center tw-py-md tw-rounded-sm tw-text-sm-semibold tw-text-quarterary tw-cursor-pointer
                    ${
                      showModal === 'note' &&
                      'tw-text-secondary tw-bg-primary tw-shadow-[0_1px_3px_0px_rgba(16,24,40,0.10)]'
                    }`}
                        onClick={() => setOpenAddNoteOrMilestone('note')}
                      >
                        Note
                      </div>
                      <div
                        className={`tw-flex-1 tw-text-center tw-py-md tw-rounded-sm tw-text-sm-semibold tw-text-quarterary tw-cursor-pointer
                    ${
                      showModal === 'milestone' &&
                      'tw-text-secondary tw-bg-primary tw-shadow-[0_1px_3px_0px_rgba(16,24,40,0.10)]'
                    }`}
                        onClick={() => setOpenAddNoteOrMilestone('milestone')}
                      >
                        Milestone
                      </div>
                    </div>
                  </div>

                  {showModal == 'note' && (
                    <>
                      <div className="tw-px-6">
                        <Controller
                          name="note"
                          control={methods.control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <textarea
                                {...field}
                                rows={4}
                                className={`tw-h-[117px] tw-mt-2xl tw-block tw-py-10px tw-px-14px tw-w-full tw-text-md-regular tw-text-primary tw-bg-white-50 tw-rounded-md tw-border ${
                                  error ? 'tw-border-red-500' : 'tw-border-secondary'
                                } focus:tw-border-primary tw-resize-none`}
                                placeholder="e.g. Need to repeat lesson next week"
                              />
                            </>
                          )}
                        />
                        {lessonState !== 'planned' && currentUserRoles?.canUpdateLesson && (
                          <div className="tw-flex tw-flex-row tw-items-center tx-gap-x-3 tw-w-full tw-mt-2xl">
                            <CustomCheckbox
                              name="isRepresent"
                              control={methods.control}
                              defaultValue={false}
                              label="Represent Lesson"
                              containerClass="tw-border tw-border-transparent tw-text-secondary"
                              labelClass="tw-text-sm-medium tw-ml-md"
                              checkBoxClass="tw-w-xl tw-h-[16px] tw-rounded-xs"
                            />
                          </div>
                        )}
                      </div>
                      <div className="tw-mt-4xl tw-p-3xl tw-flex tw-justify-end tw-gap-x-3 tw-border-secondary tw-border-t-1 tw-border-b-0 tw-border-x-0 tw-border-solid">
                        <CustomButton
                          text="Cancel"
                          type="button"
                          btnSize="md"
                          heirarchy="secondary-gray"
                          className="!tw-w-auto"
                          onClick={handleCancel}
                        />
                        <CustomButton
                          text="Add Note"
                          type="submit"
                          btnSize="md"
                          heirarchy="primary"
                          onClick={() => saveNote}
                          className="!tw-w-auto"
                          iconLeading={saveNoteMutation?.isLoading && <NotesSpinner />}
                        />
                      </div>
                    </>
                  )}
                </form>
              </FormProvider>
              {showModal == 'milestone' && (
                <AddMilestone
                  classId={classId}
                  studentId={studentId}
                  lessonId={lesson?.id}
                  levelId={levelId}
                  lessonState={getLessonStateByStudent()}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  lessonName={lesson?.name}
                  //lessonState={lesson?.recordKeepings?.[0]?.status ?? ''}
                />
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
