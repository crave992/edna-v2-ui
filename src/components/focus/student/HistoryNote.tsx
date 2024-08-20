import { UserBadge } from '@/components/ui/UserBadge';
import { UserContext } from '@/context/UserContext';
import { RecordKeepingHistoryDto } from '@/dtos/RecordKeepingDto';
import dayjs from 'dayjs';
import { useContext } from 'react';

interface HistoryNoteProps {
  historyEntry: RecordKeepingHistoryDto | null;
  displayDate?: boolean;
  isOpenNote?: boolean;
}

const HistoryNote = ({ historyEntry, displayDate = true, isOpenNote = false }: HistoryNoteProps) => {
  const { user } = useContext(UserContext);
  const latestDate = historyEntry ? dayjs(historyEntry.createdOn) : null;
  const latestTime = latestDate
    ? latestDate.isSame(dayjs(), 'day')
      ? latestDate.format('h:mma')
      : latestDate.format('MM/DD/YY h:mma')
    : '';

  const getStatusText = () => {
    if (historyEntry)
      switch (historyEntry.status) {
        case 'practicing':
          return 'Practice';
        case 'review':
          return 'Re-Presented';
        case 'acquired':
          return 'Acquired';
        default:
          return 'Attempt';
      }
    return '';
  };

  return (
    historyEntry && (
      <div key={historyEntry && historyEntry.id} className="tw-w-full">
        {historyEntry.message ? (
          <div>
            <div className="tw-flex tw-justify-between tw-mb-xs">
              <div
                className={`tw-text-xs-medium ${
                  isOpenNote ? 'tw-text-secondary' : 'tw-text-quarterary'
                }`}
              >
                {getStatusText()} #{historyEntry.count}
              </div>
              {displayDate && (
                <div
                  className={`tw-text-xs-regular tw-text-secondary ${
                    isOpenNote ? 'tw-text-secondary' : 'tw-text-tertiary'
                  }`}
                >
                  {latestTime}
                </div>
              )}
            </div>
            <div className="tw-text-xs-regular tw-text-tertiary tw-mb-md">{historyEntry.message}</div>
            {historyEntry.createdByUser && historyEntry.createdByUser.id !== user?.id && (
              <div className="tw-w-auto">
                <UserBadge
                  fullName={historyEntry.createdByUser.fullName}
                  profilePicture={historyEntry.createdByUser.profilePicture}
                  nameClassName="!tw-text-xxs-medium !tw-text-secondary"
                  className="!tw-bg-secondary"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="tw-flex tw-items-center tw-justify-between">
            {historyEntry && ['practicing', 'review', 'acquired'].includes(historyEntry.status) && (
              <>
                <div className={`tw-text-xs-medium ${isOpenNote ? 'tw-text-secondary' : 'tw-text-quarterary'}`}>
                  {getStatusText()} #{historyEntry.count}
                </div>
                {displayDate && (
                  <div className={`tw-text-xs-regular ${isOpenNote ? 'tw-text-secondary' : 'tw-text-tertiary'}`}>
                    {latestTime}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    )
  );
};

export default HistoryNote;
