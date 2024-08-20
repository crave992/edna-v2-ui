export const CloseIcon = ({ color = '', width = '15', height = '15' }) => {
  let fillColor;

  switch (color) {
    case 'brand':
      fillColor = 'var(--color-fg-brand-primary)';
      break;
    case 'error':
      fillColor = 'var(--color-fg-error-primary)';
      break;
    case 'primary':
      fillColor = 'var(--color-fg-primary)';
      break;
    default:
      fillColor = '#98A2B3';
  }

  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="x-close">
        <path
          id="Icon"
          d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
          stroke={fillColor}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default CloseIcon;
