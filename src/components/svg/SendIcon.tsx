export const SendIcon = ({ color = '', borderColor = 'primary' }) => {
  let fillColor;
  let colorBorder;

  switch (color) {
    case 'primary': 
      fillColor = '#FFFFFF';
    case 'brand':
      fillColor = 'var(--color-fg-brand-primary)';
      break;
    case 'error':
      fillColor = 'var(--color-fg-error-primary)';
      break;
    default:
      fillColor = '#101828';
  }

  switch (borderColor) {
    case 'primary':
      colorBorder = 'var(--color-primary)';
      break;
    case 'secondary':
      colorBorder = 'var(--color-secondary)';
      break;
    default:
      colorBorder = 'currentColor';
  }

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="0.12"
        d="M16.0849 3.9151C16.7322 3.2678 17.0558 2.94415 17.2365 2.95012C17.3918 2.95527 17.5314 3.04646 17.5985 3.18667C17.6765 3.34968 17.5101 3.77608 17.1774 4.62887L12.2888 17.1558C12.0953 17.6517 11.9985 17.8996 11.8594 17.9719C11.7389 18.0345 11.5953 18.0344 11.4748 17.9717C11.3358 17.8992 11.2393 17.6512 11.0464 17.155L8.75 11.25L16.0849 3.9151Z"
        fill={fillColor}
      />
      <path
        d="M8.75001 11.25L17.5 2.49999M8.85633 11.5234L11.0464 17.155C11.2394 17.6512 11.3358 17.8992 11.4748 17.9717C11.5953 18.0344 11.7389 18.0345 11.8594 17.9719C11.9985 17.8996 12.0953 17.6517 12.2888 17.1558L17.7808 3.08266C17.9554 2.63501 18.0428 2.41118 17.995 2.26816C17.9535 2.14395 17.856 2.04648 17.7318 2.00498C17.5888 1.9572 17.365 2.04455 16.9173 2.21924L2.84422 7.71119C2.34833 7.90471 2.10038 8.00147 2.02812 8.14056C1.96548 8.26113 1.96557 8.40467 2.02835 8.52517C2.10077 8.66418 2.34883 8.76064 2.84495 8.95358L8.47662 11.1437C8.57733 11.1828 8.62768 11.2024 8.67008 11.2327C8.70766 11.2595 8.74053 11.2923 8.76734 11.3299C8.79758 11.3723 8.81716 11.4227 8.85633 11.5234Z"
        stroke={colorBorder}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SendIcon;
