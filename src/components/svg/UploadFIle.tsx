export const UploadFileIcon = ({ color = 'white' }) => {
  let fillColor;

  switch (color) {
    case 'brand':
      fillColor = 'var(--color-fg-brand-primary)';
      break;
    case 'error':
      fillColor = 'var(--color-fg-error-primary)';
      break;
    default:
      fillColor = 'white';
  }

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="upload-cloud-02">
        <path
          id="Fill"
          opacity="0.12"
          d="M7.91602 2.5C4.46424 2.5 1.66602 5.29822 1.66602 8.75C1.66602 10.4718 2.36222 12.0309 3.48847 13.1613L6.66602 13.3333L9.99935 10L13.3327 13.352V13.7523L16.666 13.9524C17.6839 13.1117 18.3327 11.8399 18.3327 10.4167C18.3327 7.88536 16.2807 5.83333 13.7493 5.83333C13.6488 5.83333 13.5491 5.83657 13.4502 5.84294C12.404 3.85528 10.3183 2.5 7.91602 2.5Z"
          fill="#101828"
        />
        <path
          id="Icon"
          d="M6.66602 13.3333L9.99935 10M9.99935 10L13.3327 13.3333M9.99935 10V17.5M16.666 13.9524C17.6839 13.1117 18.3327 11.8399 18.3327 10.4167C18.3327 7.88536 16.2807 5.83333 13.7493 5.83333C13.5673 5.83333 13.3969 5.73833 13.3044 5.58145C12.2177 3.73736 10.2114 2.5 7.91602 2.5C4.46424 2.5 1.66602 5.29822 1.66602 8.75C1.66602 10.4718 2.36222 12.0309 3.48847 13.1613"
          stroke={fillColor}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default UploadFileIcon;
