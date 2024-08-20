import { SVGProps } from 'react';
interface GlobalSlatedProps extends SVGProps<SVGSVGElement> {
  color?: string;
  width?: string | number;
  height?: string | number;
  fill?: string;
}

export const GlobalSlatedIcon = ({ color = 'gray', width = '20', height = '20', fill = "#101828" }: GlobalSlatedProps) => {
  let fillColor;

  switch (color) {
    case 'gray':
      fillColor = '#101828';
      break;
    case 'brand':
      fillColor = '#FFFFFF';
      break;
    default:
      fillColor = color;
  }
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="globe-slated-02">
        <path
          id="Fill"
          opacity="0.12"
          d="M9.58301 12.9166C12.3444 12.9166 14.583 10.678 14.583 7.91663C14.583 5.1552 12.3444 2.91663 9.58301 2.91663C6.82158 2.91663 4.58301 5.1552 4.58301 7.91663C4.58301 10.678 6.82158 12.9166 9.58301 12.9166Z"
          fill={fill}
        />
        <path
          id="Icon"
          d="M2.21777 15.2823L6.04599 11.4541M15.1814 2.31873C18.273 5.41038 18.273 10.4229 15.1814 13.5146C12.0897 16.6062 7.07719 16.6062 3.98554 13.5146M14.1668 18.3333H5.83347M10.0001 18.3333V15.8333M14.5835 7.91665C14.5835 10.6781 12.3449 12.9167 9.58347 12.9167C6.82205 12.9167 4.58347 10.6781 4.58347 7.91665C4.58347 5.15523 6.82205 2.91665 9.58347 2.91665C12.3449 2.91665 14.5835 5.15523 14.5835 7.91665Z"
          stroke={fillColor}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default GlobalSlatedIcon;
