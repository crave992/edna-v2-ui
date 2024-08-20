export const CameraPlusIcon = ({ color = 'brand', size = '32' }) => {
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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="camera-plus">
        <path
          id="Fill"
          opacity="0.12"
          d="M16.7503 21.3333C19.6958 21.3333 22.0837 18.9455 22.0837 16C22.0837 13.0544 19.6958 10.6666 16.7503 10.6666C13.8048 10.6666 11.417 13.0544 11.417 16C11.417 18.9455 13.8048 21.3333 16.7503 21.3333Z"
          fill="#101828"
        />
        <path
          id="Icon"
          d="M30.0837 15.3333V19.4666C30.0837 22.4536 30.0837 23.947 29.5024 25.0879C28.991 26.0914 28.1751 26.9073 27.1716 27.4187C26.0307 28 24.5373 28 21.5503 28H11.9503C8.96338 28 7.46991 28 6.32904 27.4187C5.32551 26.9073 4.50962 26.0914 3.99829 25.0879C3.41699 23.947 3.41699 22.4536 3.41699 19.4666V12.5333C3.41699 9.54635 3.41699 8.05287 3.99829 6.91201C4.50962 5.90848 5.32551 5.09258 6.32904 4.58126C7.46991 3.99996 8.96338 3.99996 11.9503 3.99996H17.417M26.0837 10.6666V2.66663M22.0837 6.66663H30.0837M22.0837 16C22.0837 18.9455 19.6958 21.3333 16.7503 21.3333C13.8048 21.3333 11.417 18.9455 11.417 16C11.417 13.0544 13.8048 10.6666 16.7503 10.6666C19.6958 10.6666 22.0837 13.0544 22.0837 16Z"
          stroke="#667085"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default CameraPlusIcon;
