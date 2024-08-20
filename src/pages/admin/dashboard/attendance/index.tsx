import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  PluginOptionsByType,
  ChartTypeRegistry,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { defaults } from 'chart.js';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';

defaults.font.family = 'DM Sans';
defaults.font.size = 13;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AttendanceDto {
  absent: number;
  date: string;
  present: number;
  tardy: number;
}

interface ChartProps {
  data: AttendanceDto[];
  type: number;
  setType: Function;
  total: number;
  today: number;
}

// Define _DeepPartialObject type
type _DeepPartialObject<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? _DeepPartialObject<U>[]
    : T[P] extends object
    ? _DeepPartialObject<T[P]>
    : T[P];
};

// Extend PluginOptionsByType to include font property
type ExtendedPluginOptionsByType<T extends keyof ChartTypeRegistry> = PluginOptionsByType<T> & {
  legend?: {
    labels?: {
      font?: {
        size?: number;
      };
    };
  };
};

interface CustomChartOptions extends _DeepPartialObject<ExtendedPluginOptionsByType<keyof ChartTypeRegistry>> {
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right' | 'chartArea' | { [scaleId: string]: number };
      align?: 'start' | 'center' | 'end'; // Ensure align property matches predefined values
      reverse?: boolean;
      labels?: {
        usePointStyle?: boolean;
        pointStyle?: string;
        boxHeight?: number;
        font?: {
          size?: number;
        };
      };
    };
    tooltip?: {
      callbacks?: {
        label?: (tooltipItem: any) => string;
      };
    };
    [key: string]: any; // Accept additional properties
  };
  [key: string]: any; // Accept additional properties
}

type GroupedDates = Record<string, AttendanceDto[]>;

interface GroupedData {
  [key: string]: {
    records: AttendanceDto[];
    totalAbsents: number;
    totalPresents: number;
    totalTardies: number;
  };
}

const Attendance: React.FC<ChartProps> = ({ data, type, setType, total, today }: ChartProps) => {
  const groupByMonth = (dates: AttendanceDto[]): GroupedDates => {
    const grouped: GroupedDates = {};

    dates &&
      dates.forEach((obj) => {
        const date = dayjs(obj.date);
        const month = date.format('MMM'); // Format month as three-letter abbreviation

        if (!grouped[month]) {
          grouped[month] = [];
        }
        grouped[month].push(obj);
      });

    return grouped;
  };

  const groupedDays: GroupedData =
    data &&
    data.reduce<GroupedData>((acc, item) => {
      // Parse the date
      const date = new Date(item.date);
      // Extract month and day in MM/DD format
      const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

      // Initialize the entry for this month/day if it doesn't exist
      if (!acc[monthDay]) {
        acc[monthDay] = {
          records: [],
          totalAbsents: 0,
          totalPresents: 0,
          totalTardies: 0,
        };
      }

      // Add the item to the corresponding month/day array
      acc[monthDay].records.push(item);
      // Accumulate the absents, presents, and tardies
      acc[monthDay].totalAbsents += item.absent;
      acc[monthDay].totalPresents += item.present;
      acc[monthDay].totalTardies += item.tardy;

      return acc;
    }, {});

  const groupedDates = groupByMonth(data);

  const getMonths = () => {
    if (groupedDates) return Object.keys(groupedDates);
  };

  const getDays = () => {
    if (groupedDays) return Object.keys(groupedDays);
  };

  const options: CustomChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        reverse: true,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxHeight: 8,
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const datasetLabel = tooltipItem.dataset.label || '';
            const data = tooltipItem.dataset.data[tooltipItem.dataIndex];
            return `${datasetLabel}: ${(Math.round(data * 100) / 100).toFixed(0)}`;
          },
        },
      },
    },
    responsive: true,
    borderRadius: 8,
    barThickness: 50,
    scales: {
      x: {
        border: {
          display: false,
        },
        stacked: true,
        grid: {
          drawBorder: false,
          color: '#F9FAFB',
        },
      },
      y: {
        border: {
          display: false,
        },
        stacked: true,
        max: total,
        ticks: {
          stepSize: total / 5,
          callback: function (value: number | string) {
            return value + '%';
          },
          display: false, // Hide y-axis labels
        },
        grid: {
          drawBorder: false,
          color: '#EAECF0',
        },
      },
    },
    maintainAspectRatio: false,
  };

  const getPresentData = () => {
    if (type === 0 && groupedDays) return Object.keys(groupedDays).map((item) => groupedDays[item].totalPresents);
    else if (type !== 0 && groupedDays) return Object.keys(groupedDates).map((item) => groupedDates[item][0].present);
  };

  const getTardyData = () => {
    if (type === 0 && groupedDays) return Object.keys(groupedDays).map((item) => groupedDays[item].totalTardies);
    else if (type !== 0) return Object.keys(groupedDates).map((item) => groupedDates[item][0].tardy);
  };

  const getAbsentData = () => {
    if (type === 0 && groupedDays) return Object.keys(groupedDays).map((item) => groupedDays[item].totalAbsents);
    else if (type !== 0 && groupedDays) return Object.keys(groupedDates).map((item) => groupedDates[item][0].absent);
  };

  const chartData = {
    labels: type === 0 ? getDays() : getMonths(),
    datasets: [
      {
        label: 'Present',
        data: getPresentData(),
        backgroundColor: [
          '#00466E',
          '#00466E',
          '#00466E',
          '#00466E',
          '#00466E',
          '#00466E',
          '#00466E',
          '#00466E',
          '#00466E',
          '#00466E',
          '#00466E',
          '#00466E',
          '#00466E',
        ],
      },
      {
        label: 'Tardy',
        data: getTardyData(),
        backgroundColor: [
          '#2A719D',
          '#2A719D',
          '#2A719D',
          '#2A719D',
          '#2A719D',
          '#2A719D',
          '#2A719D',
          '#2A719D',
          '#2A719D',
          '#2A719D',
          '#2A719D',
          '#2A719D',
          '#2A719D',
        ],
      },
      {
        label: 'Absent',
        data: getAbsentData(),
        backgroundColor: [
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
          '#EAECF0',
        ],
      },
    ],
  };

  const handleChangeTab = (tab: number) => {
    setType(tab);
  };

  const getCurrentTime = () => {
    let date = new Date();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();

    return `${hours}:${minutesStr} ${ampm}`;
  };

  return (
    <div className="tw-p-3xl tw-flex-col tw-flex tw-bg-primary tw-rounded-xl tw-border-secondary tw-border-solid tw-border tw-space-y-2xl">
      <div className="tw-space-y-xs">
        <div className="tw-text-left tw-text-lg-semibold tw-text-primary">Attendance</div>
        <div className="tw-text-sm-regular tw-text-tertiary">
          {today} Student{today > 1 ? 's' : ''} have been marked present as of {getCurrentTime()}
        </div>
      </div>
      <div className="tw-flex tw-space-x-lg tw-border-b tw-border-secondary tw-border-0 tw-border-solid">
        <div
          className={`tw-text-sm-semibold tw-text-querterary tw-h-[32px] tw-px-xs tw-pb-xl tw-cursor-pointer ${
            type === 0 && 'tw-border-0 tw-border-b-[2px] tw-border-brand tw-border-solid'
          }`}
          onClick={() => handleChangeTab(0)}
        >
          Daily
        </div>
        <div
          className={`tw-text-sm-semibold tw-text-button-secondary-color-fg tw-h-[32px] tw-px-xs tw-pb-xl tw-cursor-pointer ${
            type === 1 && 'tw-border-0 tw-border-b-[2px] tw-border-brand tw-border-solid'
          }`}
          onClick={() => handleChangeTab(1)}
        >
          Monthly
        </div>
      </div>
      <div className="tw-relative tw-h-[289px] tw-flex">
        <div className="tw-items-center tw-justify-center  tw-w-full ">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export const AttendanceSkeleton = () => {
  const skeletonItemClasses = 'tw-flex tw-h-[258px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1';

  return (
    <div className="tw-p-3xl tw-gap-xl tw-flex-wrap tw-flex tw-flex-col tw-bg-primary tw-rounded-xl tw-border tw-border-solid tw-border-secondary">
      <div className={`${skeletonItemClasses} tw-h-[20px] tw-w-[150px]`}></div>
      <div className={`${skeletonItemClasses} tw-h-[20px] tw-w-[350px]`}></div>
      <div className={`${skeletonItemClasses} tw-h-[20px] tw-w-[100px]`}></div>
      <div className="tw-flex tw-flex-col tw-space-y-3xl">
        {[...Array(6)].map((_, index) => (
          <div key={index} className={skeletonItemClasses}></div>
        ))}
      </div>
    </div>
  );
};

export default Attendance;
