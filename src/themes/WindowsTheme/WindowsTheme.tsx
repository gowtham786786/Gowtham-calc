import React, { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import WindowsHistory from './WindowsHistory';
import type { ThemeProps } from '../../App';
import styles from './WindowsTheme.module.css';
import { Menu, History, Square, X, Minus } from 'lucide-react';
import { useFitText } from '../../hooks/useFitText';

const WindowsTheme: React.FC<ThemeProps> = ({ settings }) => {
  const calc = useCalculator('windows');
  const [showHistory, setShowHistory] = useState(false);
  const {
    displayValue,
    equation,
    isScientific,
    setIsScientific,
    handleNumber,
    handleOperator,
    handleAction,
  } = calc;

  const isDark = settings.isDarkMode;

  const formatDisplay = (val: string) => {
    if (val === 'Error') return 'Error';
    if (val.includes('e')) return val;
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const { containerRef, textRef, fontSize, renderedValue } = useFitText(displayValue, 64, 32, formatDisplay);

  return (
    <div className={`${styles.window} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.titlebar}>
        <div className={styles.titleLeft}>Calculator</div>
        <div className={styles.titleRight}>
          <div className={styles.winControl}><Minus size={14} /></div>
          <div className={styles.winControl}><Square size={12} /></div>
          <div className={`${styles.winControl} ${styles.winClose}`}><X size={14} /></div>
        </div>
      </div>

      <div className={styles.header}>
        <div 
          className={styles.menuToggle}
          onClick={() => setIsScientific(!isScientific)}
        >
          <Menu size={18} />
          <span>{isScientific ? 'Advanced' : 'Standard'}</span>
        </div>
        <div className={styles.historyToggle} onClick={() => setShowHistory(true)}>
          <History size={16} />
        </div>
      </div>

      <div className={styles.displayArea} ref={containerRef}>
        <div className={styles.equation}>{equation}</div>
        <div 
          className={styles.display} 
          ref={textRef} 
          style={{ fontSize: `${fontSize}px` }}
        >
          {renderedValue}
        </div>
      </div>

      <div className={styles.keypadWrapper}>
        <div className={styles.memoryPad}>
          <button className={styles.memBtn} onClick={() => handleAction('MC')}>MC</button>
          <button className={styles.memBtn} onClick={() => handleAction('MR')}>MR</button>
          <button className={styles.memBtn} onClick={() => handleAction('M+')}>M+</button>
          <button className={styles.memBtn} onClick={() => handleAction('M-')}>M-</button>
          <button className={styles.memBtn} onClick={() => handleAction('MS')}>MS</button>
        </div>

        <div className={`${styles.keypad} ${isScientific ? styles.scientific : ''}`}>
          {isScientific && (
            <div className={styles.sciPad}>
              <button className={styles.btnSecondary} onClick={() => handleAction('x²')}>x²</button>
              <button className={styles.btnSecondary} onClick={() => handleOperator('^')}>xʸ</button>
              <button className={styles.btnSecondary} onClick={() => handleAction('sin(')}>sin</button>
              <button className={styles.btnSecondary} onClick={() => handleAction('cos(')}>cos</button>
              <button className={styles.btnSecondary} onClick={() => handleAction('tan(')}>tan</button>
              
              <button className={styles.btnSecondary} onClick={() => handleAction('√(')}>√</button>
              <button className={styles.btnSecondary} onClick={() => handleAction('10^')}>10ˣ</button>
              <button className={styles.btnSecondary} onClick={() => handleAction('log(')}>log</button>
              <button className={styles.btnSecondary} onClick={() => handleAction('ln(')}>ln</button>
              <button className={styles.btnSecondary} onClick={() => handleAction('e')}>e</button>

              <button className={styles.btnSecondary} onClick={() => handleAction('π')}>π</button>
              <button className={styles.btnSecondary} onClick={() => handleAction('!')}>n!</button>
              <button className={styles.btnSecondary} onClick={() => handleAction('(')}>(</button>
              <button className={styles.btnSecondary} onClick={() => handleAction(')')}>)</button>
              <button className={styles.btnSecondary} onClick={() => handleAction('±')}>±</button>
            </div>
          )}

          <div className={styles.mainPad}>
            <button className={styles.btnSecondary} onClick={() => handleAction('%')}>%</button>
            <button className={styles.btnSecondary} onClick={() => handleAction('CE')}>CE</button>
            <button className={styles.btnSecondary} onClick={() => handleAction('C')}>C</button>
            <button className={styles.btnSecondary} onClick={() => handleAction('Backspace')}>⌫</button>

            <button className={styles.btnSecondary} onClick={() => handleAction('1/x')}>¹/x</button>
            <button className={styles.btnSecondary} onClick={() => handleAction('x²')}>x²</button>
            <button className={styles.btnSecondary} onClick={() => handleAction('√(')}>²√x</button>
            <button className={styles.btnSecondary} onClick={() => handleOperator('÷')}>÷</button>

            <button className={styles.btnNum} onClick={() => handleNumber('7')}>7</button>
            <button className={styles.btnNum} onClick={() => handleNumber('8')}>8</button>
            <button className={styles.btnNum} onClick={() => handleNumber('9')}>9</button>
            <button className={styles.btnSecondary} onClick={() => handleOperator('×')}>×</button>

            <button className={styles.btnNum} onClick={() => handleNumber('4')}>4</button>
            <button className={styles.btnNum} onClick={() => handleNumber('5')}>5</button>
            <button className={styles.btnNum} onClick={() => handleNumber('6')}>6</button>
            <button className={styles.btnSecondary} onClick={() => handleOperator('-')}>−</button>

            <button className={styles.btnNum} onClick={() => handleNumber('1')}>1</button>
            <button className={styles.btnNum} onClick={() => handleNumber('2')}>2</button>
            <button className={styles.btnNum} onClick={() => handleNumber('3')}>3</button>
            <button className={styles.btnSecondary} onClick={() => handleOperator('+')}>+</button>

            <button className={styles.btnNum} onClick={() => handleAction('±')}>⁺∕₋</button>
            <button className={styles.btnNum} onClick={() => handleNumber('0')}>0</button>
            <button className={styles.btnNum} onClick={() => handleNumber('.')}>.</button>
            <button className={styles.btnAccent} onClick={() => handleAction('=')}>=</button>
          </div>
        </div>
      </div>
      <WindowsHistory 
        history={calc.history.filter(h => h.theme === 'windows')} 
        onClear={calc.clearHistory} 
        onClose={() => setShowHistory(false)} 
        isVisible={showHistory} 
        onReuse={calc.loadResult}
      />
    </div>
  );
};

export default WindowsTheme;
