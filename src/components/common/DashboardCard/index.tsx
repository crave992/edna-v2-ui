import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';

interface DashboardCardProps {
  title: string;
  count?: number;
  icon: IconDefinition;
  linkUrl?: string;
  linkText?: string;
  target?: '_blank' | '_parent' | '_self' | '_top';
}

const DashboardCard = ({ title, count, icon, linkUrl, linkText, target = '_self' }: DashboardCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (linkUrl) {
      if (target === '_blank') {
        window.open(linkUrl, target);
      } else {
        router.push(linkUrl);
      }
    }
  };

  return (
    <div
      className="db_data_overview_each group tw-cursor-pointer tw-rounded-lg hover:tw-bg-secondary"
      onClick={handleClick}
    >
      {count && (
        <div className="dataNumber ">
          <div className="tw-text-2xl-semibold tw-text-brand">{count}</div>
        </div>
      )}

      {title && (
        <div className="dataName">
          <div className="tw-text-md-medium tw-text-secondary">{title}</div>
        </div>
      )}

      {linkText && <div className="dataPageUrl tw-text-sm-semibold tw-text-brand">{linkText}</div>}

      <FontAwesomeIcon icon={icon} />
    </div>
  );
};

export default DashboardCard;
