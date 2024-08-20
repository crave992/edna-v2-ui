export const CheckBoxIcon = ({ color = '' }) => {
  let fillColor;

  switch (color) {
    case 'brand':
      fillColor = 'var(--color-fg-brand-primary)';
      break;
    case 'error':
      fillColor = 'var(--color-fg-error-primary)';
      break;
    default:
      fillColor = '#005B85';
  }

  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 4.5C0 2.29086 1.79086 0.5 4 0.5H12C14.2091 0.5 16 2.29086 16 4.5V12.5C16 14.7091 14.2091 16.5 12 16.5H4C1.79086 16.5 0 14.7091 0 12.5V4.5Z"
        fill={fillColor}
      />
      <path
        d="M12 5.5L6.5 11L4 8.5"
        stroke="white"
        strokeWidth="1.6666"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckBoxIcon;
