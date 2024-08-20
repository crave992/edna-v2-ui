export const EditIcon = ({ color = '#101828', stroke = "white", size = "20" }) => {
  let fillColor;

  switch (color) {
    case 'brand':
      fillColor = 'var(--color-fg-brand-primary)';
      break;
    case 'error':
      fillColor = 'var(--color-fg-error-primary)';
      break;
    default:
      fillColor = '#101828';
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="edit-02">
        <path
          id="Fill"
          opacity="0.12"
          d="M17.5 6.33332C18.4204 5.41285 18.4204 3.92046 17.5 2.99999C16.5795 2.07951 15.0871 2.07951 14.1666 2.99999L11.6666 5.49999L15 8.83332L17.5 6.33332Z"
          fill={fillColor}
        />
        <path
          id="Icon"
          d="M14.9999 8.83332L11.6666 5.49999M2.08325 18.4167L4.90356 18.1033C5.24813 18.065 5.42042 18.0459 5.58146 17.9937C5.72433 17.9475 5.86029 17.8821 5.98566 17.7995C6.12696 17.7063 6.24954 17.5837 6.49469 17.3386L17.4999 6.33332C18.4204 5.41285 18.4204 3.92046 17.4999 2.99999C16.5795 2.07951 15.0871 2.07951 14.1666 2.99999L3.16136 14.0052C2.91621 14.2504 2.79363 14.3729 2.70045 14.5142C2.61778 14.6396 2.55243 14.7756 2.50618 14.9185C2.45405 15.0795 2.43491 15.2518 2.39662 15.5964L2.08325 18.4167Z"
          stroke={stroke}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default EditIcon;
