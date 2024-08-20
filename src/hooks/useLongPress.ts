// @ts-nocheck
import { useCallback, useRef, useState } from 'react';

function preventDefault(e: Event) {
  if (!isTouchEvent(e)) return;

  if (e.touches.length < 2 && e.preventDefault) {
    e.preventDefault();
  }
}

export function isTouchEvent(e: Event): e is TouchEvent {
  return e && 'touches' in e;
}

interface PressHandlers<T> {
  onLongPress: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onClick?: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onDbClick?: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onTouchRightClick?: (e: React.TouchEvent<T>) => void;
}

interface Options {
  delay?: number;
  shouldPreventDefault?: boolean;
}

export default function useLongPress<T>(
  { onLongPress, onClick, onDbClick, onTouchRightClick }: PressHandlers<T>,
  { delay = 200, shouldPreventDefault = true }: Options = {}
) {
  //const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();
  const clickTime = useRef(0);
  const clickRan = useRef(false);
  const touchTimer = useRef<NodeJS.Timeout>();
  const isDoubleFingerTap = useRef(false);

  const touchStartX = useRef<number>();
  const touchStartY = useRef<number>();

  const longPressTriggered = useRef(false);

  const start = useCallback(
    (e: React.MouseEvent<T> | React.TouchEvent<T>) => {
      e.persist();
      const clonedEvent = { ...e };

      if (shouldPreventDefault && e.target) {
        e.target.addEventListener('touchend', preventDefault, { passive: false });
        target.current = e.target;
      }

      touchStartX.current = isTouchEvent(e) ? e.touches[0].clientX : (e as unknown as React.MouseEvent).clientX;
      touchStartY.current = isTouchEvent(e) ? e.touches[0].clientY : (e as unknown as React.MouseEvent).clientY;

      if (isTouchEvent(e)) {
        if (e.touches.length === 2) {
          isDoubleFingerTap.current = true;
          clearTimeout(touchTimer.current);
          onTouchRightClick?.(clonedEvent);
          touchTimer.current = setTimeout(() => {
            isDoubleFingerTap.current = false;
          }, 100);
        }
      }

      timeout.current = setTimeout(() => {
        clearTimeout(timeout.current);
        timeout.current = null;
        longPressTriggered.current = true;
        onLongPress(clonedEvent);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const move = useCallback((e: React.TouchEvent<T>) => {
    if (touchStartX.current && touchStartY.current) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = Math.abs(currentX - touchStartX.current);
      const deltaY = Math.abs(currentY - touchStartY.current);

      if (deltaX > 10 || deltaY > 10) {
        clear(e, false);
      }
    }
  }, []);

  const clear = useCallback(
    (e: React.MouseEvent<T> | React.TouchEvent<T>, shouldTriggerClick = true) => {
      if (!shouldTriggerClick) return;
      if (isDoubleFingerTap.current) return;
      if (timeout.current) {
        clearTimeout(timeout.current);

        if (!longPressTriggered.current) {
          if (e.detail === 1) {
            setTimeout(() => {
              if (Date.now() - clickTime.current > 400) {
                clickRan.current = true;

                onClick?.(e);

                setTimeout(() => {
                  clickRan.current = false;
                }, 50);
              }
            }, 400);
          }

          if (e.detail === 2) {
            if (clickRan.current) {
              //('click and dblClick collided')
              clickRan.current = false;
            } else {
              clickTime.current = Date.now();
              onDbClick?.(e);
            }
          }
        }

        longPressTriggered.current = false;
      }

      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault);
      }
    },
    [shouldPreventDefault, onClick]
  );

  return {
    onMouseDown: (e: React.MouseEvent<T>) => start(e),
    onTouchStart: (e: React.TouchEvent<T>) => start(e),
    onMouseUp: (e: React.MouseEvent<T>) => clear(e),
    onMouseLeave: (e: React.MouseEvent<T>) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent<T>) => clear(e),
    onTouchMove: (e: React.TouchEvent<T>) => move(e, false),
  };
}
