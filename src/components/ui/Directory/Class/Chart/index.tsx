import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { defaults } from 'chart.js';
import AreaDto from '@/dtos/AreaDto';
import { lessonTypeColors } from '@/constants/lessonTypeColors';
import { useFocusContext } from '@/context/FocusContext';

defaults.font.family = 'DM Sans';
defaults.font.size = 13;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  data: AreaDto[];
}

const Chart: React.FC<ChartProps> = ({ data }: ChartProps) => {
  const { organization } = useFocusContext();
  const getMaxValue = (data: AreaDto[]) => {
    if (data && data.length > 0) {
      const acquired = data.map((item) => (item.totalAcquiredLessons / item.totalLessons) * 100);
      const practicing = data.map((item) => (item.totalPracticingLessons / item.totalLessons) * 100);
      const planned = data.map((item) => (item.totalPlannedLessons / item.totalLessons) * 100);
      return Math.max(...acquired, ...practicing, ...planned);
    }
    return 0;
  };

  const maxValue = getMaxValue(data);

  let maxYAxis = 100;
  let stepSize = 25;

  if (maxValue <= 25) {
    maxYAxis = 25;
    stepSize = 5;
  } else if (maxValue <= 50) {
    maxYAxis = 50;
    stepSize = 10;
  } else if (maxValue <= 75) {
    maxYAxis = 75;
    stepSize = 15;
  } else if (maxValue <= 100) {
    maxYAxis = 100;
    stepSize = 20;
  }

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const datasetLabel = tooltipItem.dataset.label || '';
            const data = tooltipItem.dataset.data[tooltipItem.dataIndex];
            const formattedData = data < 1 ? data.toFixed(2) : Math.round(data).toString();
            return `${datasetLabel}: ${formattedData}%`;
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
        max: maxYAxis,
        ticks: {
          stepSize: 25,
          callback: function (value: number | string) {
            return value + '%';
          },
        },
        grid: {
          drawBorder: false,
          color: '#EAECF0',
        },
      },
    },
    maintainAspectRatio: false,
  };

  const chartData = {
    labels: data && data.length > 0 ? data.map((item) => item.name) : [],
    datasets: [
      {
        label:
          organization && organization?.termInfo && organization?.termInfo?.acquired
            ? organization.termInfo.acquired
            : 'Acquired',
        data: data && data.length > 0 ? data.map((item) => (item.totalAcquiredLessons / item.totalLessons) * 100) : [],
        backgroundColor:
          data && data.length > 0 ? data.map((item) => lessonTypeColors[item.name]?.darkRegular || '#61646C') : [],
      },
      {
        label: 'Practicing',
        data:
          data && data.length > 0 ? data.map((item) => (item.totalPracticingLessons / item.totalLessons) * 100) : [],
        backgroundColor:
          data && data.length > 0 ? data.map((item) => lessonTypeColors[item.name]?.lightMedium || '#CECFD2') : [],
      },
      {
        label: 'Planned',
        data: data && data.length > 0 ? data.map((item) => (item.totalPlannedLessons / item.totalLessons) * 100) : [],
        backgroundColor:
          data && data.length > 0 ? data.map((item) => lessonTypeColors[item.name]?.medium || '#F0F1F1') : [],
      },
    ],
  };

  return (
    <div className="tw-bg-secondary">
      <div className="tw-min-w-[1016px] tw-mx-4xl tw-relative tw-h-[289px] tw-flex">
        <div className="tw-items-center tw-justify-center  tw-w-full ">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Chart;
