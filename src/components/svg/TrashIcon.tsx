export const TrashIcon = ({ color = 'gray-primary', size = '20' }) => {
  let fillColor;

  switch (color) {
    case 'gray-primary':
      fillColor = 'var(--color-gray-primary)';
      break;
    case 'brand':
      fillColor = 'var(--color-fg-brand-primary)';
      break;
    case 'error':
      fillColor = 'var(--color-fg-error-primary)';
      break;
    case 'gray-secondary':
      fillColor = 'var(--color-gray-secondary)';
      break;
    case 'fg-quarterary':
      fillColor = 'var(--color-fg-quarterary)';
      break;
    default:
      fillColor = 'currentColor';
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        opacity="0.12"
        d="M15.8334 14.3333V5H4.16675V14.3333C4.16675 15.7335 4.16675 16.4335 4.43923 16.9683C4.67892 17.4387 5.06137 17.8212 5.53177 18.0609C6.06655 18.3333 6.76662 18.3333 8.16675 18.3333H11.8334C13.2335 18.3333 13.9336 18.3333 14.4684 18.0609C14.9388 17.8212 15.3212 17.4387 15.5609 16.9683C15.8334 16.4335 15.8334 15.7335 15.8334 14.3333Z"
        fill={fillColor}
      />
      <path
        d="M13.3333 5.00002V4.33335C13.3333 3.39993 13.3333 2.93322 13.1517 2.5767C12.9919 2.2631 12.7369 2.00813 12.4233 1.84834C12.0668 1.66669 11.6001 1.66669 10.6667 1.66669H9.33333C8.39991 1.66669 7.9332 1.66669 7.57668 1.84834C7.26308 2.00813 7.00811 2.2631 6.84832 2.5767C6.66667 2.93322 6.66667 3.39993 6.66667 4.33335V5.00002M8.33333 9.58335V13.75M11.6667 9.58335V13.75M2.5 5.00002H17.5M15.8333 5.00002V14.3334C15.8333 15.7335 15.8333 16.4336 15.5608 16.9683C15.3212 17.4387 14.9387 17.8212 14.4683 18.0609C13.9335 18.3334 13.2335 18.3334 11.8333 18.3334H8.16667C6.76654 18.3334 6.06647 18.3334 5.53169 18.0609C5.06129 17.8212 4.67883 17.4387 4.43915 16.9683C4.16667 16.4336 4.16667 15.7335 4.16667 14.3334V5.00002"
        stroke={fillColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TrashIcon;
