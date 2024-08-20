export const AlertCircleIcon = ({ color = 'brand'}) => {
  let fillColor;

  switch (color) {
    case 'brand':
      fillColor = 'var(--color-fg-brand-primary)';
      break;
    case 'error':
      fillColor = 'var(--color-fg-error-primary)';
      break;
    default:
      fillColor = 'currentColor';
  }

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="alert-circle" clipPath="url(#clip0_8901_3821)">
        <path
          id="Icon"
          d="M10 6.66663V9.99996M10 13.3333H10.0083M18.3333 9.99996C18.3333 14.6023 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6023 1.66667 9.99996C1.66667 5.39759 5.39763 1.66663 10 1.66663C14.6024 1.66663 18.3333 5.39759 18.3333 9.99996Z"
          stroke={fillColor}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_8901_3821">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default AlertCircleIcon;
