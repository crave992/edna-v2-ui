import { usePopper } from 'react-popper';
import { useCallback, useEffect, useState } from 'react';
import { Placement, Boundary } from '@popperjs/core';

export const usePopover = (type?: string) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [popperPlacement, setPopperPlacement] = useState<Placement>('auto');

  // Define the offset callback function with correct type
  const offsetCallback = useCallback(
    ({ placement, popper }: { placement: Placement; popper: { height: number; width: number } }) => {
      let offsetX = 0; // Dynamic vertical offset to center the popper relative to the reference element
      let offsetY = 0;

      if (placement === 'left' || placement === 'right') {
        offsetX = -popper.height / 2;
        // Specific horizontal offset based on type
        if (type === 'lessonBox') offsetX += 20;
        else if (type === 'lessonCard') offsetX += 35;
      }

      return [offsetX, offsetY] as [number, number];
    },
    [type]
  );

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'preventOverflow',
        options: {
          boundary: 'viewport' as Boundary,
        },
      },
      {
        name: 'offset',
        options: {
          offset: offsetCallback,
        },
      },
    ],
    placement: popperPlacement,
    strategy: 'fixed',
  });

  // Update the popper position whenever its size changes
  useEffect(() => {
    if (popperElement && update) {
      const observer = new ResizeObserver(() => update());
      observer.observe(popperElement);

      return () => {
        observer.disconnect();
      };
    }
  }, [popperElement, update]);

  return {
    referenceElement,
    setReferenceElement,
    popperElement,
    setPopperElement,
    setPopperPlacement,
    popOverStyles: styles,
    popOverAttributes: attributes,
  };
};
