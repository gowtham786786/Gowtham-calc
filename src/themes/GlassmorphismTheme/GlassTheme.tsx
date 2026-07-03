import React, { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import GlassHistory from './GlassHistory';
import type { ThemeProps } from '../../App';
import styles from './GlassTheme.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

const GlassTheme: React.FC<ThemeProps> = ({ settings }) => {
  const calc = useCalculator('glass');
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

  return (
    <div className={`${styles.wrapper} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      <div className={styles.blob3}></div>

      <div className={styles.calculator}>
        <div className={styles.displayArea}>
          <div className={styles.equation}>{equation}</div>
          <div className={styles.display}>{formatDisplay(displayValue)}</div>
        </div>

        <button 
          className={styles.sciToggleBtn} 
          onClick={() => setIsScientific(!isScientific)}
        >
          {isScientific ? 'Hide Advanced' : 'Show Advanced'}
          {isScientific ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>

        <div className={styles.keypad}>
          {isScientific && (
            <div className={styles.sciPad}>
              <button className={styles.btnSci} onClick={() => handleAction('sin(')}>sin</button>
              <button className={styles.btnSci} onClick={() => handleAction('cos(')}>cos</button>
              <button className={styles.btnSci} onClick={() => handleAction('tan(')}>tan</button>
              <button className={styles.btnSci} onClick={() => handleAction('asin(')}>asin</button>
              <button className={styles.btnSci} onClick={() => handleAction('acos(')}>acos</button>

              <button className={styles.btnSci} onClick={() => handleAction('atan(')}>atan</button>
              <button className={styles.btnSci} onClick={() => handleAction('log(')}>log</button>
              <button className={styles.btnSci} onClick={() => handleAction('ln(')}>ln</button>
              <button className={styles.btnSci} onClick={() => handleAction('√(')}>√</button>
              <button className={styles.btnSci} onClick={() => handleAction('x²')}>x²</button>

              <button className={styles.btnSci} onClick={() => handleAction('x³')}>x³</button>
              <button className={styles.btnSci} onClick={() => handleOperator('^')}>xʸ</button>
              <button className={styles.btnSci} onClick={() => handleAction('π')}>π</button>
              <button className={styles.btnSci} onClick={() => handleAction('e')}>e</button>
              <button className={styles.btnSci} onClick={() => handleAction('1/x')}>1/x</button>

              <button className={styles.btnSci} onClick={() => handleAction('%')}>%</button>
              <button className={styles.btnSci} onClick={() => handleAction('mod')}>mod</button>
              <button className={styles.btnSci} onClick={() => handleAction('!')}>n!</button>
              <button className={styles.btnSci} onClick={() => handleAction('10ˣ')}>10ˣ</button>
              <button className={styles.btnSci} onClick={() => handleAction('exp(')}>exp</button>

              <button className={styles.btnSci} onClick={() => handleAction('abs(')}>abs</button>
              <button className={styles.btnSci} onClick={() => handleAction('floor(')}>floor</button>
              <button className={styles.btnSci} onClick={() => handleAction('ceil(')}>ceil</button>
              <button className={styles.btnSci} onClick={() => handleAction('round(')}>round</button>
              <button className={styles.btnSci} onClick={() => handleAction('Rand')}>Rand</button>
            </div>
          )}

          <div className={styles.mainPad}>
            <button className={`${styles.btn} ${styles.btnSpecial}`} onClick={() => handleAction('C')}>C</button>
            <button className={`${styles.btn} ${styles.btnSpecial}`} onClick={() => handleAction('±')}>±</button>
            <button className={`${styles.btn} ${styles.btnSpecial}`} onClick={() => handleAction('%')}>%</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('÷')}>÷</button>

            <button className={styles.btn} onClick={() => handleNumber('7')}>7</button>
            <button className={styles.btn} onClick={() => handleNumber('8')}>8</button>
            <button className={styles.btn} onClick={() => handleNumber('9')}>9</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('×')}>×</button>

            <button className={styles.btn} onClick={() => handleNumber('4')}>4</button>
            <button className={styles.btn} onClick={() => handleNumber('5')}>5</button>
            <button className={styles.btn} onClick={() => handleNumber('6')}>6</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('-')}>−</button>

            <button className={styles.btn} onClick={() => handleNumber('1')}>1</button>
            <button className={styles.btn} onClick={() => handleNumber('2')}>2</button>
            <button className={styles.btn} onClick={() => handleNumber('3')}>3</button>
            <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('+')}>+</button>

            <button className={styles.btn} onClick={() => handleAction('AC')}>AC</button>
            <button className={styles.btn} onClick={() => handleNumber('0')}>0</button>
            <button className={styles.btn} onClick={() => handleNumber('.')}>.</button>
            <button className={`${styles.btn} ${styles.btnEq}`} onClick={() => handleAction('=')}>=</button>
          </div>
        </div>
      </div>
      <GlassHistory history={calc.history} onClear={calc.clearHistory} onClose={() => setShowHistory(false)} isVisible={showHistory} />
    </div>
  );
};

export default GlassTheme;
