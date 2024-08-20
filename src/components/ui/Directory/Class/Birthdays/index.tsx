import Slider from '@/components/common/Slider';
import Avatar from '@/components/ui/Avatar';
import ClassDto from '@/dtos/ClassDto';
import { StudentBasicDto, StudentBirthdayBasicDto } from '@/dtos/StudentDto';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import BirthdaySkeleton from './BirthdaySkeleton';

interface BirthdayProps {
  classData: ClassDto;
  isLoading: boolean;
  fromAdminDashboard?: boolean;
  upcomingBirthdays?: StudentBirthdayBasicDto[];
}

const Birthdays = ({ classData, isLoading, fromAdminDashboard, upcomingBirthdays }: BirthdayProps) => {
  const studentRef = useRef<HTMLDivElement | null>(null);
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const currentDate = `${mm}-${dd}`;

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const dayInt = parseInt(day, 10);
    let suffix = 'th';

    if (dayInt === 1 || dayInt === 21 || dayInt === 31) {
      suffix = 'st';
    } else if (dayInt === 2 || dayInt === 22) {
      suffix = 'nd';
    } else if (dayInt === 3 || dayInt === 23) {
      suffix = 'rd';
    }

    const formattedDate = `${monthNames[parseInt(month, 10) - 1]} ${dayInt}${suffix}`;
    return formattedDate;
  };

  const coveredMonths = new Date();
  coveredMonths.setMonth(coveredMonths.getMonth() + 6);

  useEffect(() => {
    const slider = studentRef.current;

    const handleSliderMove = () => {
      const studentContainer = studentRef.current;
      if (studentContainer) {
        studentContainer.classList.remove('tw-px-3xl');
      }
    };

    slider?.addEventListener('sliderMove', handleSliderMove);

    return () => {
      slider?.removeEventListener('sliderMove', handleSliderMove);
    };
  }, []);
  
  
  const classStudentBirthdayList = useMemo(() => {
    if (classData && classData.students) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const todayString = today.toDateString();

      const upcomingBirthdays = classData.students
        .map(student => {
          const dateString = String(student.dob).split('T')[0];
          const [year, month, day] = dateString.split('-').map(Number);
          const dob = new Date(year, month - 1, day); // month is 0-based

          const birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
          const birthdayNextYear = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());

          return {
            ...student,
            birthdayThisYear,
            birthdayNextYear,
          };
        })
        .filter(student => {
          const birthdayThisYear = student.birthdayThisYear;
          const birthdayNextYear = student.birthdayNextYear;

          // Consider both this year's and next year's birthdays
          return birthdayThisYear >= today || birthdayNextYear >= today;
        })
        .sort((a, b) => {
          const aBirthdayThisYear = a.birthdayThisYear.toDateString();
          const bBirthdayThisYear = b.birthdayThisYear.toDateString();

          // Ensure today's birthday comes first
          if (aBirthdayThisYear === todayString) return -1;
          if (bBirthdayThisYear === todayString) return 1;

          // Sort other birthdays
          const aBirthday = a.birthdayThisYear >= today ? a.birthdayThisYear : a.birthdayNextYear;
          const bBirthday = b.birthdayThisYear >= today ? b.birthdayThisYear : b.birthdayNextYear;

          return aBirthday.getTime() - bBirthday.getTime();
        });

      // Find students whose birthday is before today
      const pastBirthdays = upcomingBirthdays
        .filter(student => {
          const birthdayThisYear = student.birthdayThisYear;

          // Consider only this year's birthdays before today
          return birthdayThisYear < today;
      });

      const upComingbirthday = upcomingBirthdays
        .filter(student => {
          const birthdayThisYear = student.birthdayThisYear;

          // Consider only this year's birthdays before today
          return birthdayThisYear >= today;
      });

      const sortedBirthdays = [...upComingbirthday, ...pastBirthdays];
      return sortedBirthdays;
    }
  }, [classData]);


  return (
    <div className="tw-bg-secondary">
      <div
        className={`tw-flex tw-flex-col tw-space-y-2xl ${
          fromAdminDashboard ? '' : 'tw-min-w-[1016px] tw-mx-4xl'
        }   tw-rounded-xl tw-bg-white tw-py-3xl tw-h-[272.05px] tw-border tw-border-secondary tw-border-solid`}
      >
        <div className="tw-text-lg-semibold tw-text-primary tw-px-3xl">
          Upcoming {!fromAdminDashboard && 'Class'} Birthdays
        </div>
        <Slider innerRef={studentRef} rootClass={'drag'}>
          <div
            ref={studentRef}
            className="tw-px-3xl no-scroll md:no-scroll custom-scrollbar tw-flex tw-flex-row tw-items-center tw-overflow-y-hidden tw-overflow-x-scroll tw-select-none tw-space-x-2xl"
          >
            {isLoading ? (
              <BirthdaySkeleton />
            ) : fromAdminDashboard ? (
              upcomingBirthdays &&
              upcomingBirthdays.map((student: StudentBirthdayBasicDto, index: number) => {
                const bdaySplit = String(student.birthday).split('T')[0].split('-');

                return (
                  <div
                    key={student.id}
                    className={`tw-min-w-[132px] tw-h-[176.05px] tw-flex tw-flex-col tw-items-center tw-justify-center tw-rounded-xl tw-space-y-md hover:tw-border hover:tw-border-solid hover:tw-border-secondary ${
                      today.getMonth() + 1 === parseInt(bdaySplit[1]) && today.getDate() === parseInt(bdaySplit[2])
                        ? 'birthday-now'
                        : 'tw-bg-secondary'
                    }`}
                  >
                    <div className="tw-text-xs-regular tw-text-secondary">
                      {formatDate(String(student.birthday).split('T')[0])}
                    </div>
                    <Avatar
                      link={student.profilePicture ? student.profilePicture : ''}
                      photoSize={90}
                      firstName={student.firstName}
                      lastName={student.lastName}
                    />
                    <div className="tw-text-lg-medium tw-text-primary tw-overflow-hidden tw-whitespace-nowrap tw-overflow-ellipsis tw-max-w-full">{student.nickName ?? student.firstName}</div>
                  </div>
                );
              })
            ) : (
              classStudentBirthdayList?.map((student: StudentBasicDto, index: number) => {
                const bdaySplit = String(student.dob).split('T')[0].split('-');
                return (
                  <div
                    key={student.id}
                    className={`tw-min-w-[132px] tw-h-[176.05px] tw-flex tw-flex-col tw-items-center tw-justify-center tw-rounded-xl tw-space-y-md hover:tw-border hover:tw-border-solid hover:tw-border-secondary ${
                      today.getMonth() + 1 === parseInt(bdaySplit[1]) && today.getDate() === parseInt(bdaySplit[2])
                        ? 'birthday-now'
                        : 'tw-bg-secondary'
                    }`}
                  >
                    <div className="tw-text-xs-regular tw-text-secondary">
                      {formatDate(String(student.dob).split('T')[0])}
                    </div>
                    <Avatar
                      link={student.profilePicture}
                      photoSize={90}
                      firstName={student.firstName}
                      lastName={student.lastName}
                    />
                    <div className="tw-text-lg-medium tw-text-primary tw-overflow-hidden tw-whitespace-nowrap tw-overflow-ellipsis tw-max-w-full">{student.nickName ?? student.firstName}</div>
                  </div>
                );
              })
            )}
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Birthdays;
