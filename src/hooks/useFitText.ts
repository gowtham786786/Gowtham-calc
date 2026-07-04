import { useLayoutEffect, useState, useRef, useMemo } from 'react';

export function useFitText(displayValue: string, maxSize: number, minSize: number, formatFn: (val: string) => string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [measuredValue, setMeasuredValue] = useState('');
  const [fontSize, setFontSize] = useState(maxSize);
  const [isScientific, setIsScientific] = useState(false);

  const needsMeasurement = measuredValue !== displayValue;

  useLayoutEffect(() => {
    if (!needsMeasurement) return;
    if (!containerRef.current || !textRef.current) return;

    const displayEl = textRef.current;
    const containerEl = containerRef.current;

    let currentSize = maxSize;
    displayEl.style.fontSize = currentSize + 'px';
    displayEl.style.whiteSpace = 'nowrap';

    while (displayEl.scrollWidth > containerEl.clientWidth && currentSize > minSize) {
      currentSize -= 1;
      displayEl.style.fontSize = currentSize + 'px';
    }

    if (displayEl.scrollWidth > containerEl.clientWidth) {
      setIsScientific(true);
      setFontSize(minSize);
    } else {
      setIsScientific(false);
      setFontSize(currentSize);
    }
    
    setMeasuredValue(displayValue);
  }, [displayValue, maxSize, minSize, needsMeasurement]);

  const renderedValue = useMemo(() => {
    if (needsMeasurement) {
      return formatFn(displayValue);
    }
    if (isScientific && displayValue !== 'Error') {
      const num = Number(displayValue);
      if (!isNaN(num)) {
        return num.toExponential(6);
      }
    }
    return formatFn(displayValue);
  }, [displayValue, isScientific, needsMeasurement, formatFn]);

  const currentFontSize = needsMeasurement ? maxSize : fontSize;

  return { containerRef, textRef, fontSize: currentFontSize, renderedValue };
}
