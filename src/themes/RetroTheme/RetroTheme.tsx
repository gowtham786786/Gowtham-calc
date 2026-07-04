import React, { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import RetroHistory from './RetroHistory';
import { History } from 'lucide-react';
import type { ThemeProps } from '../../App';
import styles from './RetroTheme.module.css';
import { useFitText } from '../../hooks/useFitText';

const RetroTheme: React.FC<ThemeProps> = () => {
  const calc = useCalculator('retro');
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

  const formatDisplay = (val: string) => {
    if (val === 'Error') return 'ERROR';
    if (val.includes('e')) return val;
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const { containerRef, textRef, fontSize, renderedValue } = useFitText(displayValue, 51, 24, formatDisplay);

  return (
    <div className={styles.wrapper}>
      <div className={styles.calculator}>
        <div className={styles.brandContainer}>
          <div className={styles.brand}>CASIO-TONE 1984</div>
          <div className={styles.solarPanel}>
            <div></div><div></div><div></div><div></div>
          </div>
        </div>

        <div className={styles.displayArea}>
          <div className={styles.displayInner} ref={containerRef}>
            <div className={styles.equation}>{equation || ' '}</div>
            <div 
              className={styles.display} 
              ref={textRef}
              style={{ fontSize: `${fontSize}px` }}
            >
              {renderedValue}
            </div>
          </div>
        </div>

        <div className={styles.modeToggle}>
          <span className={styles.label}>STD</span>
          <div 
            className={`${styles.switch} ${isScientific ? styles.active : ''}`}
            onClick={() => setIsScientific(!isScientific)}
          >
            <div className={styles.slider}></div>
          </div>
          <span className={styles.label}>SCI</span>
          
          <div 
            className={styles.switch}
            onClick={() => setShowHistory(true)}
            style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px'}}
          >
            <History size={14} color="#f0f0f0" />
          </div>
        </div>

        <div className={styles.keypad}>
          {isScientific && (
            <div className={styles.sciPad}>
              <button className={styles.btnSci} onClick={() => handleAction('sin(')}>sin</button>
              <button className={styles.btnSci} onClick={() => handleAction('cos(')}>cos</button>
              <button className={styles.btnSci} onClick={() => handleAction('tan(')}>tan</button>
              <button className={styles.btnSci} onClick={() => handleAction('log(')}>log</button>
              <button className={styles.btnSci} onClick={() => handleAction('ln(')}>ln</button>

              <button className={styles.btnSci} onClick={() => handleAction('x²')}>x²</button>
              <button className={styles.btnSci} onClick={() => handleOperator('^')}>xy</button>
              <button className={styles.btnSci} onClick={() => handleAction('!')}>x!</button>
              <button className={styles.btnSci} onClick={() => handleAction('(')}>(</button>
              <button className={styles.btnSci} onClick={() => handleAction(')')}>)</button>

              <button className={styles.btnSci} onClick={() => handleAction('√(')}>√</button>
              <button className={styles.btnSci} onClick={() => handleAction('π')}>π</button>
              <button className={styles.btnSci} onClick={() => handleAction('e')}>e</button>
              <button className={styles.btnSci} onClick={() => handleAction('M+')}>M+</button>
              <button className={styles.btnSci} onClick={() => handleAction('MR')}>MR</button>
            </div>
          )}

          <div className={styles.mainPad}>
            <button className={`${styles.btn} ${styles.btnSpecial}`} onClick={() => handleAction('C')}>C</button>
            <button className={`${styles.btn} ${styles.btnSpecial}`} onClick={() => handleAction('±')}>+/-</button>
            <button className={`${styles.btn} ${styles.btnSpecial}`} onClick={() => handleAction('%')}>%</button>
            <button className={`${styles.btn} ${styles.btnSpecial}`} onClick={() => handleAction('AC')}>AC</button>

            <button className={styles.btn} onClick={() => handleNumber('7')}>7</button>
            <button className={styles.btn} onClick={() => handleNumber('8')}>8</button>
            <button className={styles.btn} onClick={() => handleNumber('9')}>9</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('÷')}>/</button>

            <button className={styles.btn} onClick={() => handleNumber('4')}>4</button>
            <button className={styles.btn} onClick={() => handleNumber('5')}>5</button>
            <button className={styles.btn} onClick={() => handleNumber('6')}>6</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('×')}>x</button>

            <button className={styles.btn} onClick={() => handleNumber('1')}>1</button>
            <button className={styles.btn} onClick={() => handleNumber('2')}>2</button>
            <button className={styles.btn} onClick={() => handleNumber('3')}>3</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('-')}>-</button>

            <button className={styles.btn} onClick={() => handleNumber('0')}>0</button>
            <button className={styles.btn} onClick={() => handleNumber('.')}>.</button>
            <button className={`${styles.btn} ${styles.btnEq}`} onClick={() => handleAction('=')}>=</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('+')}>+</button>
          </div>
        </div>
      </div>
      <RetroHistory 
        history={calc.history.filter(h => h.theme === 'retro')} 
        onClear={calc.clearHistory} 
        onClose={() => setShowHistory(false)} 
        isVisible={showHistory} 
        onReuse={calc.loadResult}
      />
    </div>
  );
};

export default RetroTheme;
