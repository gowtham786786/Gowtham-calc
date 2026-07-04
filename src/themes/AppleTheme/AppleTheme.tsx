import React, { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import AppleHistory from './AppleHistory';
import type { ThemeProps } from '../../App';
import styles from './AppleTheme.module.css';
import { RotateCcw, History } from 'lucide-react';
import { useFitText } from '../../hooks/useFitText';

const AppleTheme: React.FC<ThemeProps> = ({ settings }) => {
  const calc = useCalculator('apple');
  const [showHistory, setShowHistory] = useState(false);
  const {
    displayValue,
    isScientific,
    setIsScientific,
    handleNumber,
    handleOperator,
    handleAction,
  } = calc;

  // Format display value with commas
  const formatDisplay = (val: string) => {
    if (val === 'Error') return 'Error';
    if (val.includes('e')) return val; // scientific notation
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Extract the last operator from the equation to highlight active operator
  const getActiveOperator = () => {
    const eq = calc.equation.trim().split(' ');
    const last = eq[eq.length - 1];
    if (['+', '-', '×', '÷'].includes(last)) return last;
    return null;
  };
  const activeOp = getActiveOperator();

  const { containerRef, textRef, fontSize, renderedValue } = useFitText(displayValue, 96, 40, formatDisplay);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tools}>
        <button 
          className={`${styles.toolBtn} ${isScientific ? styles.active : ''}`}
          onClick={() => setIsScientific(!isScientific)}
          title="Toggle Scientific Mode"
        >
          <RotateCcw size={18} />
        </button>
      
        <button className={styles.toolBtn} onClick={() => setShowHistory(true)} title="History">
          <History size={18} />
        </button>
      </div>

      <div className={styles.calculator}>
        <div className={styles.displayContainer} ref={containerRef}>
          <div 
            className={styles.display} 
            ref={textRef}
            style={{ fontSize: `${fontSize}px` }}
          >
            {renderedValue}
          </div>
        </div>

        <div className={`${styles.keypad} ${isScientific ? styles.scientific : ''}`}>
          {isScientific && (
            <div className={styles.sciPad}>
              <button className={styles.btnSci} onClick={() => handleAction('(')}>(</button>
              <button className={styles.btnSci} onClick={() => handleAction(')')}>)</button>
              <button className={styles.btnSci} onClick={() => handleAction('MC')}>mc</button>
              <button className={styles.btnSci} onClick={() => handleAction('M+')}>m+</button>
              
              <button className={styles.btnSci} onClick={() => handleAction('M-')}>m-</button>
              <button className={styles.btnSci} onClick={() => handleAction('MR')}>mr</button>
              <button className={styles.btnSci} onClick={() => handleAction('x²')}>x²</button>
              <button className={styles.btnSci} onClick={() => handleOperator('^')}>xʸ</button>
              
              <button className={styles.btnSci} onClick={() => handleAction('sin(')}>sin</button>
              <button className={styles.btnSci} onClick={() => handleAction('cos(')}>cos</button>
              <button className={styles.btnSci} onClick={() => handleAction('tan(')}>tan</button>
              <button className={styles.btnSci} onClick={() => handleAction('log(')}>log</button>
  
              <button className={styles.btnSci} onClick={() => handleAction('ln(')}>ln</button>
              <button className={styles.btnSci} onClick={() => handleAction('√(')}>√</button>
              <button className={styles.btnSci} onClick={() => handleAction('π')}>π</button>
              <button className={styles.btnSci} onClick={() => handleAction('!')}>x!</button>
            </div>
          )}

        <div className={styles.mainPad}>
          <button className={`${styles.btn} ${styles.btnLightGray}`} onClick={() => handleAction(displayValue === '0' ? 'AC' : 'C')}>
            {displayValue === '0' ? 'AC' : 'C'}
          </button>
          <button className={`${styles.btn} ${styles.btnLightGray}`} onClick={() => handleAction('±')}>⁺∕₋</button>
          <button className={`${styles.btn} ${styles.btnLightGray}`} onClick={() => handleAction('%')}>%</button>
          <button className={`${styles.btn} ${styles.btnOrange} ${activeOp === '÷' ? styles.btnOrangeActive : ''}`} onClick={() => handleOperator('÷')}>÷</button>

          <button className={`${styles.btn} ${styles.btnDarkGray}`} onClick={() => handleNumber('7')}>7</button>
          <button className={`${styles.btn} ${styles.btnDarkGray}`} onClick={() => handleNumber('8')}>8</button>
          <button className={`${styles.btn} ${styles.btnDarkGray}`} onClick={() => handleNumber('9')}>9</button>
          <button className={`${styles.btn} ${styles.btnOrange} ${activeOp === '×' ? styles.btnOrangeActive : ''}`} onClick={() => handleOperator('×')}>×</button>

          <button className={`${styles.btn} ${styles.btnDarkGray}`} onClick={() => handleNumber('4')}>4</button>
          <button className={`${styles.btn} ${styles.btnDarkGray}`} onClick={() => handleNumber('5')}>5</button>
          <button className={`${styles.btn} ${styles.btnDarkGray}`} onClick={() => handleNumber('6')}>6</button>
          <button className={`${styles.btn} ${styles.btnOrange} ${activeOp === '-' ? styles.btnOrangeActive : ''}`} onClick={() => handleOperator('-')}>−</button>

          <button className={`${styles.btn} ${styles.btnDarkGray}`} onClick={() => handleNumber('1')}>1</button>
          <button className={`${styles.btn} ${styles.btnDarkGray}`} onClick={() => handleNumber('2')}>2</button>
          <button className={`${styles.btn} ${styles.btnDarkGray}`} onClick={() => handleNumber('3')}>3</button>
          <button className={`${styles.btn} ${styles.btnOrange} ${activeOp === '+' ? styles.btnOrangeActive : ''}`} onClick={() => handleOperator('+')}>+</button>

          <button className={`${styles.btn} ${styles.btnDarkGray} ${styles.zeroBtn}`} onClick={() => handleNumber('0')}>0</button>
          <button className={`${styles.btn} ${styles.btnDarkGray}`} onClick={() => handleNumber('.')}>.</button>
          <button className={`${styles.btn} ${styles.btnOrange}`} onClick={() => handleAction('=')}>=</button>
        </div>
      </div>
      </div>
      <AppleHistory 
        history={calc.history.filter((h) => h.theme === 'apple')} 
        onClear={calc.clearHistory} 
        onClose={() => setShowHistory(false)} 
        isVisible={showHistory} 
        onReuse={calc.loadResult}
      />
    </div>
  );
};

export default AppleTheme;
