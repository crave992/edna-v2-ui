import { useRef } from 'react';
import MilestonesTabsCard from '@/components/ui/Milestones/MilestonesTabCard';
import Slider from '@/components/common/Slider';
import dayjs from 'dayjs';
import { StudentDto, StudentMilestoneDto } from '@/dtos/StudentDto';

// const milestones = [
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T08:28:00.3809819+00:00',
//     id: 1,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 2,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'practicing',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 3,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'planned',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 4,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'acquired',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 5,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 6,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 7,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 8,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 9,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 10,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 11,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 12,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T12:28:00.3809819+00:00',
//     id: 13,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
//   {
//     staff: {
//       profilepicture: 'https://cdn.ednaapp.net/local/organization-1/images/profilepicture/2024152182720.jpeg',
//       nickname: 'Pam',
//       firstName: 'Pam',
//       lastName: 'Ketner',
//     },
//     lessonImageUrl: 'https://cdn.ednaapp.net/local/organization-1/class/5/gallery/luffy.jpg',
//     createdOn: '2024-05-20T08:28:00.3809819+00:00',
//     id: 14,
//     lessonImageCaption:
//       'I am so happy to see Alisa starting to make friends. She is adjusting well after the school transition.',
//     lessonState: 'review',
//     lessonName: 'Pink Blocks',
//     student: {
//       nickname: 'Alisa',
//       firstName: 'Alisa',
//       lastName: 'Hester',
//     },
//     note: 'test note'
//   },
// ];

interface MilestonesRowProps {
  label: string;
  disableScroll: boolean;
  setDisableScroll: Function;
  milestones: StudentMilestoneDto[];
  student: StudentDto | undefined;
  isLastRow: boolean;
}

const MilestonesRow = ({ milestones, label, disableScroll, setDisableScroll, student, isLastRow }: MilestonesRowProps) => {
  const milestonesRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className='tw-space-y-3xl'>
      <div className="tw-text-lg-semibold tw-text-primary">{dayjs(label).format('dddd MMMM Do, YYYY')}</div>
      <div>
        <Slider innerRef={milestonesRef} rootClass={`drag`} disabled={disableScroll}>
          <div
            ref={milestonesRef}
            className={`no-scroll md:no-scroll custom-scrollbar tw-flex tw-flex-row tw-items-stretch tw-overflow-y-hidden tw-overflow-x-scroll tw-select-none tw-space-x-4xl ${(isLastRow && student) && 'tw-pb-4xl'}`}
          >
            {milestones && milestones.map((milestone: StudentMilestoneDto, index: number) => {
              return (
                <MilestonesTabsCard
                  milestone={milestone}
                  isLast={milestones.length - 1 === index}
                  setDisableScroll={setDisableScroll}
                  key={`milestone-tab-card-${milestone.id}`}
                  student={student ? student : milestone.student}
                />
              );
            })}
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default MilestonesRow;
