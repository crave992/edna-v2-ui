export const StatusDot = ({ fill = 'success' }) => {
  let fillColor;

  switch (fill) {
    case 'success':
      fillColor = 'var(--color-success)';
      break;
    case 'warning':
      fillColor = 'var(--color-warning)';
      break;
    case 'error':
      fillColor = 'var(--color-error)';
      break;
    case 'brand':
      fillColor = 'var(--color-brand)';
      break;
    default:
      fillColor = 'currentColor';
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
      <circle cx="5" cy="5" r="4" fill={fillColor} />
    </svg>
  );
};

export default StatusDot;
