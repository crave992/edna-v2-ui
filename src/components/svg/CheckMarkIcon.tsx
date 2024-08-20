export const CheckMarkIcon = ({ stroke = '#FFFFFF', width = 12, height= 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 12 12" fill="none">
    <path d="M10 3L4.5 8.5L2 6" stroke={stroke ? stroke : '#FFFFFF'} strokeWidth="1.6666" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default CheckMarkIcon;