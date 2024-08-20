export const AlarmIcon = ({ fill = 'primary', borderColor = 'primary' }) => {
  let fillColor;
  let colorBorder;

  switch (fill) {
    case 'primary':
      fillColor = 'var(--color-primary)';
      break;
    case 'secondary':
      fillColor = 'var(--color-secondary)';
      break;
    default:
      fillColor = 'currentColor';
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
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path opacity="0.12" d="M1.99203 15.082L8.8461 3.24311C9.22491 2.58881 9.41431 2.26166 9.66142 2.15178C9.87697 2.05593 10.123 2.05593 10.3386 2.15178C10.5857 2.26166 10.7751 2.58881 11.1539 3.24311L18.008 15.082C18.3881 15.7386 18.5782 16.0669 18.5501 16.3364C18.5256 16.5715 18.4025 16.785 18.2114 16.924C17.9922 17.0833 17.6128 17.0833 16.8541 17.0833H3.14593C2.38716 17.0833 2.00777 17.0833 1.78864 16.924C1.59751 16.785 1.47437 16.5715 1.44986 16.3364C1.42177 16.0669 1.61186 15.7386 1.99203 15.082Z" 
        fill={fillColor}/>
      <path d="M10 7.50001V10.8333M10 14.1667H10.0083M8.8461 3.24311L1.99203 15.082C1.61186 15.7386 1.42177 16.0669 1.44986 16.3364C1.47437 16.5715 1.59751 16.785 1.78864 16.924C2.00777 17.0833 2.38716 17.0833 3.14593 17.0833H16.8541C17.6128 17.0833 17.9922 17.0833 18.2114 16.924C18.4025 16.785 18.5256 16.5715 18.5501 16.3364C18.5782 16.0669 18.3881 15.7386 18.008 15.082L11.1539 3.24311C10.7751 2.58881 10.5857 2.26166 10.3386 2.15178C10.123 2.05593 9.87697 2.05593 9.66142 2.15178C9.41431 2.26166 9.22491 2.58881 8.8461 3.24311Z" 
        stroke={colorBorder}
        strokeWidth="1.66667" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AlarmIcon;
