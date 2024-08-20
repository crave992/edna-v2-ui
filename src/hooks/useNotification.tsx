import { ReactNode } from 'react';
import { Theme, ToastPosition, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastConfig {
  position?: ToastPosition;
  autoClose?: number;
  hideProgressBar?: boolean;
  newestOnTop?: boolean;
  closeOnClick?: boolean;
  rtl?: boolean;
  pauseOnFocusLoss?: boolean;
  draggable?: boolean;
  pauseOnHover?: boolean;
  theme?: Theme;
  closeButton?: boolean;
  className?: string;
}

const toastOptions: ToastConfig = {
  position: 'bottom-center',
  autoClose: 10000,
  hideProgressBar: true,
  newestOnTop: true,
  closeOnClick: false,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: false,
  pauseOnHover: true,
  theme: 'light',
  closeButton: false,
  className: 'tw-rounded-xl !tw-w-fit !tw-text-sm-medium !tw-text-primary',
};

const useNotification = (message?: string, icon?: ReactNode, iconClass?: string, messageClass?: string, containeClass?:string): void => {
  toast(
    <div className={`tw-flex tw-flex-row tw-space-x-lg ${containeClass}`}>
      <span className={`${iconClass}`}>{icon}</span>
      <div className={`tw-flex !tw-text-sm-medium !tw-text-primary tw-items-center ${messageClass}`}>{message}</div>
    </div>,
    toastOptions
  );
};

export default useNotification;
