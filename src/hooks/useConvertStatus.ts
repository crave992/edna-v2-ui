import { useFocusContext } from '@/context/FocusContext';

const useConvertStatus = (lessonState: string, count?: number) => {
  const { organization } = useFocusContext();

  switch (lessonState) {
    case 'review':
      return 'is reviewing';
    case 'acquired':
      return `has ${organization?.termInfo?.acquired ? organization.termInfo.acquired : 'acquired'}`;
    case 'planned':
      return 'is planning to learn';
    case 'practicing':
      return count === 0 ? 'was presented with' : 'is practicing';
    default:
      return '';
  }
};

export default useConvertStatus;
