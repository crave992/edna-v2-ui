export const PlusCircleIcon = ({ color = 'gray-secondary', width = 20, height = 20 }) => {
  let fillColor;

  switch (color) {
    case 'brand':
      fillColor = 'var(--color-fg-brand-primary)';
      break;
    case 'error':
      fillColor = 'var(--color-fg-error-primary)';
      break;
    case 'gray':
      fillColor = 'var(--color-gray-primary)';
      break;
    case 'gray-secondary':
      fillColor = 'var(--color-gray-secondary)';
      break;
    default:
      fillColor = color;
  }

  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="plus-circle" clipPath="url(#clip0_650_1755)">
        <path
          id="Fill"
          opacity="0.12"
          d="M10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332Z"
          fill={fillColor}
        />
        <path
          id="Icon"
          d="M10.0003 6.6665V13.3332M6.66699 9.99984H13.3337M18.3337 9.99984C18.3337 14.6022 14.6027 18.3332 10.0003 18.3332C5.39795 18.3332 1.66699 14.6022 1.66699 9.99984C1.66699 5.39746 5.39795 1.6665 10.0003 1.6665C14.6027 1.6665 18.3337 5.39746 18.3337 9.99984Z"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={fillColor}
        />
      </g>
      <defs>
        <clipPath id="clip0_650_1755">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PlusCircleIcon;
