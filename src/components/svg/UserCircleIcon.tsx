import { SVGProps } from 'react';
interface UsersIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  width?: string | number;
  height?: string | number;
  fill?: string;
}

export const UserCircleIcon = ({ color = "#344054", width = '20', height = '20', fill = '#101828' }: UsersIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_253_2245)">
      <g opacity="0.12">
        <path
          d="M15.5699 16.1987C14.0939 17.5258 12.1413 18.3334 10.0002 18.3334C7.859 18.3334 5.90643 17.5258 4.43042 16.1987C4.93736 15.0044 6.12094 14.1667 7.50017 14.1667H12.5002C13.8794 14.1667 15.063 15.0044 15.5699 16.1987Z"
          fill={fill}
        />
        <path
          d="M10.0001 11.25C11.841 11.25 13.3334 9.75766 13.3334 7.91671C13.3334 6.07576 11.841 4.58337 10.0001 4.58337C8.15913 4.58337 6.66675 6.07576 6.66675 7.91671C6.66675 9.75766 8.15913 11.25 10.0001 11.25Z"
          fill={fill}
        />
      </g>
      <path
        d="M4.43033 16.1986C4.93727 15.0043 6.12085 14.1666 7.50008 14.1666H12.5001C13.8793 14.1666 15.0629 15.0043 15.5698 16.1986M13.3334 7.91663C13.3334 9.75758 11.841 11.25 10.0001 11.25C8.15913 11.25 6.66675 9.75758 6.66675 7.91663C6.66675 6.07568 8.15913 4.58329 10.0001 4.58329C11.841 4.58329 13.3334 6.07568 13.3334 7.91663ZM18.3334 9.99996C18.3334 14.6023 14.6025 18.3333 10.0001 18.3333C5.39771 18.3333 1.66675 14.6023 1.66675 9.99996C1.66675 5.39759 5.39771 1.66663 10.0001 1.66663C14.6025 1.66663 18.3334 5.39759 18.3334 9.99996Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_253_2245">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default UserCircleIcon;
