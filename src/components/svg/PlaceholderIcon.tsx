export const PlaceholderIcon = ({ stroke = '#D0D5DD' }) => (
  <svg width="100%" height="12" viewBox="0 0 100% 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <line x1="8.5" y1="5.5" x2="100%" y2="5.5" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
    <circle cx="6.5" cy="6" r="4.5" fill="white" stroke={stroke} strokeWidth="3" />
  </svg>
);

export default PlaceholderIcon;
