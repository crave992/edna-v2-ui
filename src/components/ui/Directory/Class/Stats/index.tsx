import ClassDto from '@/dtos/ClassDto';
import { useState, useEffect, ReactNode } from 'react';
import StatSkeleton from './StatSkeleton';
import TooltipWrapper from '@/components/ui/TooltipWrapper';

interface ClassStatsProps {
  classData: ClassDto;
  isLoading: boolean;
}

type BoxType = {
  label: string;
  data?: number;
  children?: ReactNode;
};

const agesArray = [
  { age: 2, count: 5 },
  { age: 3, count: 20 },
  { age: 4, count: 8 },
  { age: 5, count: 10 },
];

const colors = [1, 0.83, 0.67, 0.5, 0.33, 0.167];
//const colors = [1, 0.7, 0.4, 0.2];

const ClassStats = ({ classData, isLoading }: ClassStatsProps) => {
  const [girlsCount, setGirlsCount] = useState<number>(0);
  const [boysCount, setBoysCount] = useState<number>(0);

  useEffect(() => {
    setGirlsCount(0);
    setBoysCount(0);

    if (classData && classData.genderWiseCount && classData.genderWiseCount.length > 0) {
      classData.genderWiseCount.map((gender) => {
        if (gender.gender === 'Female') setGirlsCount(gender.total);
        else if (gender.gender === 'Male') setBoysCount(gender.total);
      });
    }
  }, [classData]);

  const Box = ({ label, data, children }: BoxType) => {
    return (
      <div className="tw-space-y-md tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center tw-border tw-border-secondary tw-rounded-xl tw-border-solid tw-p-3xl tw-h-[120px] tw-bg-white">
        <div className="tw-text-sm-medium tw-text-tertiary">{label}</div>
        {isLoading ? (
          <StatSkeleton />
        ) : children ? (
          children
        ) : (
          <div className="tw-text-display-md-semibold tw-text-primary">{data}</div>
        )}
      </div>
    );
  };

  const totalCount = classData?.ages.reduce((sum, age) => sum + age.count, 0);

  return (
    <div className="tw-bg-secondary">
      <div className="tw-flex tw-min-w-[1016px] tw-mx-4xl tw-space-x-xl">
        <Box label={'Capacity'} data={classData?.capacity} />
        <Box label={'Enrolled'} data={classData?.students.length} />
        <Box label={'Girls'} data={girlsCount} />
        <Box label={'Boys'} data={boysCount} />

        <Box label={'Ages'} data={boysCount}>
          <div className="tw-flex tw-flex-col tw-h-[44px] tw-w-full">
            <div className="tw-flex tw-w-full">
              {classData &&
                classData?.ages.map((age) => {
                  return (
                    <div
                      className="tw-text-md-semibold tw-text-center"
                      style={{
                        width: `${(age.count / totalCount) * 100}%`,
                      }}
                      key={`count-${age.age}`}
                    >
                      {age.age}
                    </div>
                  );
                })}
            </div>
            <div className="tw-flex tw-w-full">
              {classData &&
                classData?.ages.map((age, index) => {
                  if (index < 6)
                    return (
                      <div
                        className={`tw-text-md-semibold ${index === 0 && 'tw-rounded-l-full'} ${
                          classData?.ages.length - 1 === index && 'tw-rounded-r-full'
                        }`}
                        style={{
                          backgroundColor: `rgba(255, 164, 0, ${colors[index]})`,
                          width: `${(age.count / totalCount) * 100}%`,
                          height: 16,
                        }}
                        key={`bar-${age.age}`}
                      >
                        <TooltipWrapper placement="bottom" text={`${age.count} Student${age.count > 1 ? 's' : ''}`}>
                          <div>&nbsp;</div>
                        </TooltipWrapper>
                      </div>
                    );
                })}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ClassStats;
