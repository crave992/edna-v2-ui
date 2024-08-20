import { SVGProps } from 'react';
interface EmergencyIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  width?: string | number;
  height?: string | number;
  fill?: string;
}

export const EmergencyIcon = ({ color = 'gray', width = '20', height = '20', fill }: EmergencyIconProps) => {
  let strokeColor;

  switch (color) {
    case 'gray':
      strokeColor = 'var(--color-fg-primary)';
      break;
    case 'error':
      strokeColor = 'var(--color-fg-error-primary)';
      break;
    default:
      strokeColor = fill ? fill : color; //'currentColor';
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 20 20`} fill="none">
      <path
        opacity="0.12"
        d="M11.5279 6.08332C11.5279 5.84997 11.5279 5.73329 11.4824 5.64416C11.4425 5.56576 11.3788 5.50202 11.3004 5.46207C11.2112 5.41666 11.0945 5.41666 10.8612 5.41666H9.13897C8.90561 5.41666 8.78894 5.41666 8.69981 5.46207C8.62141 5.50202 8.55766 5.56576 8.51772 5.64416C8.4723 5.73329 8.4723 5.84997 8.4723 6.08332V7.80554C8.4723 8.0389 8.4723 8.15558 8.42689 8.24471C8.38694 8.32311 8.3232 8.38685 8.2448 8.4268C8.15567 8.47221 8.03899 8.47221 7.80564 8.47221L6.08341 8.47221C5.85006 8.47221 5.73338 8.47221 5.64425 8.51763C5.56585 8.55757 5.50211 8.62131 5.46216 8.69972C5.41675 8.78885 5.41675 8.90552 5.41675 9.13888V10.8611C5.41675 11.0945 5.41675 11.2111 5.46216 11.3003C5.50211 11.3787 5.56585 11.4424 5.64425 11.4824C5.73338 11.5278 5.85006 11.5278 6.08342 11.5278H7.80564C8.03899 11.5278 8.15567 11.5278 8.2448 11.5732C8.3232 11.6131 8.38694 11.6769 8.42689 11.7553C8.4723 11.8444 8.4723 11.9611 8.4723 12.1944V13.9167C8.4723 14.15 8.4723 14.2667 8.51772 14.3558C8.55766 14.4342 8.62141 14.498 8.69981 14.5379C8.78894 14.5833 8.90561 14.5833 9.13897 14.5833H10.8612C11.0945 14.5833 11.2112 14.5833 11.3004 14.5379C11.3788 14.498 11.4425 14.4342 11.4824 14.3558C11.5279 14.2667 11.5279 14.15 11.5279 13.9167V12.1944C11.5279 11.9611 11.5279 11.8444 11.5733 11.7553C11.6132 11.6769 11.677 11.6131 11.7554 11.5732C11.8445 11.5278 11.9612 11.5278 12.1945 11.5278H13.9167C14.1501 11.5278 14.2668 11.5278 14.3559 11.4824C14.4343 11.4424 14.4981 11.3787 14.538 11.3003C14.5834 11.2111 14.5834 11.0945 14.5834 10.8611V9.13888C14.5834 8.90552 14.5834 8.78885 14.538 8.69972C14.4981 8.62132 14.4343 8.55757 14.3559 8.51763C14.2668 8.47221 14.1501 8.47221 13.9167 8.47221L12.1945 8.47221C11.9612 8.47221 11.8445 8.47221 11.7554 8.4268C11.677 8.38685 11.6132 8.32311 11.5733 8.24471C11.5279 8.15558 11.5279 8.0389 11.5279 7.80554V6.08332Z"
        fill={strokeColor}
      />
      <path
        d="M2.5 6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H13.5C14.9001 2.5 15.6002 2.5 16.135 2.77248C16.6054 3.01217 16.9878 3.39462 17.2275 3.86502C17.5 4.3998 17.5 5.09987 17.5 6.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5Z"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5278 6.08333C11.5278 5.84998 11.5278 5.7333 11.4824 5.64417C11.4424 5.56577 11.3787 5.50203 11.3003 5.46208C11.2111 5.41667 11.0945 5.41667 10.8611 5.41667H9.13889C8.90553 5.41667 8.78886 5.41667 8.69973 5.46208C8.62133 5.50203 8.55758 5.56577 8.51764 5.64417C8.47222 5.7333 8.47222 5.84998 8.47222 6.08333V7.80556C8.47222 8.03891 8.47222 8.15559 8.42681 8.24472C8.38686 8.32312 8.32312 8.38686 8.24472 8.42681C8.15559 8.47222 8.03891 8.47222 7.80555 8.47222H6.08333C5.84998 8.47222 5.7333 8.47222 5.64417 8.51764C5.56577 8.55758 5.50203 8.62132 5.46208 8.69973C5.41667 8.78886 5.41667 8.90553 5.41667 9.13889V10.8611C5.41667 11.0945 5.41667 11.2111 5.46208 11.3003C5.50203 11.3787 5.56577 11.4424 5.64417 11.4824C5.7333 11.5278 5.84998 11.5278 6.08333 11.5278H7.80556C8.03891 11.5278 8.15559 11.5278 8.24472 11.5732C8.32312 11.6131 8.38686 11.6769 8.42681 11.7553C8.47222 11.8444 8.47222 11.9611 8.47222 12.1944V13.9167C8.47222 14.15 8.47222 14.2667 8.51764 14.3558C8.55758 14.4342 8.62133 14.498 8.69973 14.5379C8.78886 14.5833 8.90553 14.5833 9.13889 14.5833H10.8611C11.0945 14.5833 11.2111 14.5833 11.3003 14.5379C11.3787 14.498 11.4424 14.4342 11.4824 14.3558C11.5278 14.2667 11.5278 14.15 11.5278 13.9167V12.1944C11.5278 11.9611 11.5278 11.8444 11.5732 11.7553C11.6131 11.6769 11.6769 11.6131 11.7553 11.5732C11.8444 11.5278 11.9611 11.5278 12.1944 11.5278H13.9167C14.15 11.5278 14.2667 11.5278 14.3558 11.4824C14.4342 11.4424 14.498 11.3787 14.5379 11.3003C14.5833 11.2111 14.5833 11.0945 14.5833 10.8611V9.13889C14.5833 8.90553 14.5833 8.78886 14.5379 8.69973C14.498 8.62133 14.4342 8.55758 14.3558 8.51764C14.2667 8.47222 14.15 8.47222 13.9167 8.47222H12.1944C11.9611 8.47222 11.8444 8.47222 11.7553 8.42681C11.6769 8.38686 11.6131 8.32312 11.5732 8.24472C11.5278 8.15559 11.5278 8.03891 11.5278 7.80555V6.08333Z"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EmergencyIcon;
