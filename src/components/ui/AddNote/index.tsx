import { useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import { useSaveNote } from '@/hooks/useSaveNote';

interface SectionProps {
  showModal?: boolean;
  setShowModal: Function;
  name: string;
  studentId: number;
  levelId: number;
  classId: number;
  lessonId: number;
  lessonState: string;
  updateLessonStateMutation: UseMutationResult<
    Response,
    unknown,
    {
      status?: string | undefined;
      order?:number;
      actionDate: string;
      count: number | null;
      reReview: boolean;
      fromStudentLessonId?: number;
    },
    unknown
  > | null;
}

export default function AddNote({
  showModal,
  setShowModal,
  name,
  studentId,
  levelId,
  classId,
  lessonId,
  lessonState,
  updateLessonStateMutation,
}: SectionProps) {
  const [note, setNote] = useState<string>('');
  const [review, setReview] = useState<boolean>(false);

  const saveNote = () => {
    saveNoteMutation.mutate({ note,  lessonState }, { //add notes like normal
      onSuccess: () => {
        if (review && updateLessonStateMutation != null) { //if the review checkbox is ticked
          saveNoteMutation.mutate({ lessonState: 'represented' }, { //add a represented note
            onSuccess: () => {
              updateLessonStateMutation.mutate({ //update the state to review
                status: 'review',
                order: -1, //means don't update order
                actionDate: new Date().toISOString(),
                count: 1,
                reReview: lessonState == 'review',
              });
            }
          });                 
        }
      }
    });
  };

  const handleSuccess = () => {
    setNote('');
    setReview(false);
    setShowModal(false);
  };

  const saveNoteMutation = useSaveNote({ studentId, classId, lessonId, levelId, handleSuccess });

  return (
    <AnimatePresence>
      {showModal ? (
        <>
          {/* Backdrop */}
          <div className="tw-bg-black/[0.3] tw-w-screen tw-h-screen tw-top-0 tw-left-0 tw-fixed tw-z-20" />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: '-65%', x: '-50%' }}
            animate={{ opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, y: '-65%' }}
            transition={{ duration: 0.3 }}
            className="tw-p-3xl tw-fixed tw-top-2/4 tw-left-2/4 tw-translate-y-[-50%] tw-translate-x-[-50%] tw-w-[400px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50"
          >
            <div className="tw-justify-between tw-flex">
              <div className="tw-font-black tw-text-lg">Add Note</div>
              <span className="tw-cursor-pointer" onClick={() => setShowModal(false)}>
                <NotesCloseIcon />
              </span>
            </div>

            <div>{name}</div>

            <textarea
              id="note"
              rows={4}
              className="tw-h-[117px] tw-mt-6 tw-block tw-py-2.5 tw-px-3.5 tw-w-full tw-text-sm tw-text-[#667085]-900 tw-bg-white-50 tw-rounded-md tw-border tw-border-gray-300 tw-focus:ring-blue-500 tw-focus:border-blue-500 tw-resize-none"
              placeholder="e.g. Need to repeat lesson next week"
              onChange={(event) => setNote(event.target.value)}
            />
            {lessonState != 'planned' && (
              <div className="tw-flex tw-items-center tw-mt-5">
                <input
                  id="review-lesson"
                  type="checkbox"
                  value=""
                  className="tw-w-4 tw-h-4 bg-white-100 border-gray-300 rounded"
                  onChange={(event) => setReview(event.target.checked)}
                />
                <label htmlFor="review-lesson" className="tw-ms-2 tw-text-sm tw-font-medium tw-text-[#344054]-900">
                  Review Lesson
                </label>
              </div>
            )}

            <div className="tw-mt-8 tw-flex tw-gap-x-3">
              <button
                className="tw-bg-white tw-py-2.5 tw-px-4 tw-text-base tw-text-[#344054] tw-font-semibold tw-shadow-sm tw-rounded-md tw-w-3/6 tw-border-[#D0D5DD] tw-border tw-border-solid"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="tw-py-2.5 tw-px-4 tw-text-base tw-text-white tw-font-semibold tw-shadow-sm tw-rounded-md tw-w-3/6 tw-bg-brand-primary tw-border-brand tw-border tw-border-solid"
                onClick={saveNote}
              >
                {saveNoteMutation?.isLoading ? (
                  <div role="status">
                    <NotesSpinner />
                  </div>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
