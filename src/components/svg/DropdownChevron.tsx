export const DropdownChevron = ({ fill = 'none', color = '#667085', width = '20', height = '20' }) => {
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
      fillColor = color;
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill={fill}>
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke={fillColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DropdownChevron;
