import { useFocusContext } from '@/context/FocusContext';
import { FC } from 'react';
import TopicDto from '@/dtos/TopicDto';
import { lessonTypeColors } from '@/constants/lessonTypeColors';

interface TopicTagProps {
  topic: TopicDto;
}

const TopicTag: FC<TopicTagProps> = ({ topic }) => {
  const { topicId } = useFocusContext();
  const darkColor = lessonTypeColors[topic.area.name]?.dark ? lessonTypeColors[topic.area.name]?.dark : '#000';
  const lightColor = lessonTypeColors[topic.area.name]?.light ? lessonTypeColors[topic.area.name]?.light : '#f3f4f6';

  return (
    <div
      key={topic.id}
      style={{
        borderColor: topicId === topic.id ? darkColor : undefined,
        backgroundColor: topicId === topic.id ? lightColor : undefined,
        color: topicId === topic.id ? darkColor : undefined,
      }}
      className="
        tw-h-[28px]
        tw-px-10px
        tw-py-xs
        tw-border-1
        tw-text-sm-medium
        tw-text-secondary
        tw-whitespace-nowrap
        tw-border-solid
        tw-border-primary
        tw-rounded-sm
        tw-cursor-pointer
        tw-select-none
        hover:tw-bg-gray-100
      "
    >
      {topic.name}
    </div>
  );
};

export default TopicTag;
