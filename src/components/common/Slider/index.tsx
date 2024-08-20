import { useRef, useState, MouseEvent, ReactNode, MutableRefObject, useEffect } from 'react';
import cn from '@/utils/cn';

interface SliderProps {
  innerRef: MutableRefObject<HTMLDivElement | null> | undefined;
  rootClass: string;
  children?: ReactNode;
  totalItems?: number;
  direction?: string; // Add direction prop
  autoAdjust?: boolean;
  trigger?: number | undefined;
  disabled?: boolean | null;
}

const Slider = ({
  innerRef,
  rootClass = '',
  children,
  totalItems,
  direction = 'row',
  autoAdjust = false,
  trigger,
  disabled = false,
}: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const mouseCoords = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const handleMouseLeave = () => {
    setIsMouseDown(false); // Release the mouse when leaving the slider
  };

  useEffect(() => {
    const sliderElement = sliderRef.current;

    if (sliderElement) {
      sliderElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    if (autoAdjust && sliderRef.current) {
      //Reset Scroll
      const slider = sliderRef.current.children[0] as HTMLDivElement;

      if (direction === 'row') {
        // Reset horizontal scroll to the start
        slider.scrollLeft = 0;
      } else if (direction === 'col') {
        // Reset vertical scroll to the start
        slider.scrollTop = 0;
      }
    }
  }, [trigger]);

  const [isScrolling, setIsScrolling] = useState(false);
  const handleDragStart = (e: MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current.children[0] as HTMLDivElement;
    const startX = e.pageX - slider.offsetLeft;
    const startY = e.pageY - slider.offsetTop;
    const scrollLeft = slider.scrollLeft;
    const scrollTop = slider.scrollTop;

    mouseCoords.current = { startX, startY, scrollLeft, scrollTop };
    setIsMouseDown(true);
    document.body.style.cursor = 'grabbing';
  };

  const handleDragEnd = () => {
    setIsMouseDown(false);
    if (!sliderRef.current) return;

    document.body.style.cursor = 'default';
  };

  const handleDrag = (e: MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !sliderRef.current || disabled) return;
    e.preventDefault();
    const slider = sliderRef.current.children[0] as HTMLDivElement;
    const x = e.pageX - slider.offsetLeft;
    const y = e.pageY - slider.offsetTop;
    const walkX = (x - mouseCoords.current.startX) * 1.5;
    const walkY = (y - mouseCoords.current.startY) * 1.5;
    if (direction === 'row') {
      slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
    } else if (direction === 'col') {
      slider.scrollTop = mouseCoords.current.scrollTop - walkY;
    }
  };

  return (
    <div
      ref={sliderRef}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      className={cn(rootClass, 'tw-flex')}
    >
      {children}
    </div>
  );
};

export default Slider;
