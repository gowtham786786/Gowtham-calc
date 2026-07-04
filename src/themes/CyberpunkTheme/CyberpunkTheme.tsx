import CyberpunkHistory from './CyberpunkHistory';
import { useCalculator } from '../../hooks/useCalculator';
import React, { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import type { ThemeProps } from '../../App';
import styles from './CyberpunkTheme.module.css';
import { useFitText } from '../../hooks/useFitText';

const CyberpunkTheme: React.FC<ThemeProps> = ({ settings }) => {
  const calc = useCalculator('cyberpunk');
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

  // Glitch effect on value change
  const [glitchKey, setGlitchKey] = useState(0);
  useEffect(() => {
    setGlitchKey(prev => prev + 1);
  }, [displayValue]);

  const formatDisplay = (val: string) => {
    if (val === 'Error') return 'ERR://O.R';
    if (val.includes('e')) return val;
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const { containerRef, textRef, fontSize, renderedValue } = useFitText(displayValue, 56, 24, formatDisplay);

  return (
    <div className={styles.wrapper}>
      <div className={styles.scanlines}></div>
      <div className={styles.gridOverlay}></div>

      <div className={styles.calculator}>
        <div className={styles.header}>
          <div className={styles.brand}>CYBER//CALC v1.0</div>
          <button 
            className={`${styles.sciToggle} ${isScientific ? styles.active : ''}`}
            onClick={() => setIsScientific(!isScientific)}
          >
            SYS.ADV
          </button>
          <button className={styles.sciToggle} onClick={() => setShowHistory(true)} title="History">
            <History size={14} />
          </button>
        </div>

        <div className={styles.displayArea} ref={containerRef}>
          <div className={styles.equation}>{equation}</div>
          <div key={glitchKey} className={styles.display} ref={textRef} style={{ fontSize: `${fontSize}px` }}>
            {renderedValue}
          </div>
        </div>

        <div className={styles.keypad}>
          {isScientific && (
            <div className={styles.sciPad}>
              <button className={styles.btnSci} onClick={() => handleAction('sin(')}>SIN</button>
              <button className={styles.btnSci} onClick={() => handleAction('cos(')}>COS</button>
              <button className={styles.btnSci} onClick={() => handleAction('tan(')}>TAN</button>
              <button className={styles.btnSci} onClick={() => handleAction('log(')}>LOG</button>
              
              <button className={styles.btnSci} onClick={() => handleAction('x²')}>POW2</button>
              <button className={styles.btnSci} onClick={() => handleOperator('^')}>POW</button>
              <button className={styles.btnSci} onClick={() => handleAction('!')}>FACT</button>
              <button className={styles.btnSci} onClick={() => handleAction('ln(')}>LN</button>
              
              <button className={styles.btnSci} onClick={() => handleAction('√(')}>SQRT</button>
              <button className={styles.btnSci} onClick={() => handleAction('π')}>PI</button>
              <button className={styles.btnSci} onClick={() => handleAction('e')}>E</button>
              <button className={styles.btnSci} onClick={() => handleAction('(')}>(</button>
              
              <button className={styles.btnSci} onClick={() => handleAction(')')}>)</button>
              <button className={styles.btnSci} onClick={() => handleAction('MC')}>M.CLR</button>
              <button className={styles.btnSci} onClick={() => handleAction('MR')}>M.RCL</button>
              <button className={styles.btnSci} onClick={() => handleAction('M+')}>M.ADD</button>
            </div>
          )}

          <div className={styles.mainPad}>
            <button className={`${styles.btn} ${styles.btnSys}`} onClick={() => handleAction('AC')}>RST</button>
            <button className={`${styles.btn} ${styles.btnSys}`} onClick={() => handleAction('±')}>NEG</button>
            <button className={`${styles.btn} ${styles.btnSys}`} onClick={() => handleAction('%')}>MOD</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('÷')}>/</button>

            <button className={styles.btn} onClick={() => handleNumber('7')}>7</button>
            <button className={styles.btn} onClick={() => handleNumber('8')}>8</button>
            <button className={styles.btn} onClick={() => handleNumber('9')}>9</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('×')}>*</button>

            <button className={styles.btn} onClick={() => handleNumber('4')}>4</button>
            <button className={styles.btn} onClick={() => handleNumber('5')}>5</button>
            <button className={styles.btn} onClick={() => handleNumber('6')}>6</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('-')}>-</button>

            <button className={styles.btn} onClick={() => handleNumber('1')}>1</button>
            <button className={styles.btn} onClick={() => handleNumber('2')}>2</button>
            <button className={styles.btn} onClick={() => handleNumber('3')}>3</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('+')}>+</button>

            <button className={`${styles.btn} ${styles.btnSys}`} onClick={() => handleAction('C')}>DEL</button>
            <button className={styles.btn} onClick={() => handleNumber('0')}>0</button>
            <button className={styles.btn} onClick={() => handleNumber('.')}>.</button>
            <button className={`${styles.btn} ${styles.btnEq}`} onClick={() => handleAction('=')}>EXE</button>
          </div>
        </div>
      </div>
      <CyberpunkHistory 
        history={calc.history.filter(h => h.theme === 'cyberpunk')} 
        onClear={calc.clearHistory} 
        onClose={() => setShowHistory(false)} 
        isVisible={showHistory} 
        onReuse={calc.loadResult}
      />
    </div>
  );
};

export default CyberpunkTheme;
