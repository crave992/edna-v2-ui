import { RefObject } from 'react';
import { isMobile } from 'react-device-detect';

interface getMarginProps {
  containerRef: RefObject<HTMLDivElement | null>;
  widthRef: RefObject<HTMLDivElement | null>;
}

export const useGetMargin = ({ containerRef, widthRef }: getMarginProps) => {
  if (containerRef?.current && widthRef?.current) {
    const container = document.querySelector('html');
    const hasVerticalScrollbar = container ? container.scrollHeight > container.clientHeight : false;
    const scrollBarOffset = hasVerticalScrollbar && !isMobile ? 17 : 0;
    const basisWidth = containerRef.current.getBoundingClientRect().width;
    const elementWidth = widthRef.current.getBoundingClientRect().width;

    return elementWidth > basisWidth ? ((elementWidth - (basisWidth + scrollBarOffset)) - 32) / 2 : 0;
  }
  return 0;
};
