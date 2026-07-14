import React, { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import GlassHistory from './GlassHistory';
import type { ThemeProps } from '../../App';
import styles from './GlassTheme.module.css';
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import { useFitText } from '../../hooks/useFitText';

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

  const { containerRef, textRef, fontSize, renderedValue } = useFitText(displayValue, 72, 32, formatDisplay);

  return (
    <div className={`${styles.wrapper} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      <div className={styles.blob3}></div>

      <div className={styles.calculator}>
        <div className={styles.displayArea} ref={containerRef} style={{ maxWidth: '100%' }}>
          <div className={styles.equation}>{equation}</div>
          <div 
            className={styles.display} 
            ref={textRef}
            style={{ fontSize: `${fontSize}px` }}
          >
            {renderedValue}
          </div>
        </div>

        <div className={styles.controls}>
          <button 
            className={styles.sciToggleBtn} 
            onClick={() => setIsScientific(!isScientific)}
          >
            {isScientific ? 'Hide Advanced' : 'Show Advanced'}
            {isScientific ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
          <button 
            className={styles.sciToggleBtn} 
            onClick={() => setShowHistory(true)}
            title="History"
          >
            <History size={16}/> History
          </button>
        </div>

        <div className={`${styles.keypad} ${isScientific ? styles.scientific : ''}`}>
          <div className={styles.mainPad}>
            {isScientific && (
              <>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('sin(')}>sin</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('cos(')}>cos</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('tan(')}>tan</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('asin(')}>asin</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('acos(')}>acos</button>

                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('atan(')}>atan</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('log(')}>log</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('ln(')}>ln</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('√(')}>√</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('x²')}>x²</button>

                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('x³')}>x³</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleOperator('^')}>xʸ</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('π')}>π</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('e')}>e</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('1/x')}>1/x</button>

                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('%')}>%</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('mod')}>mod</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('!')}>n!</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('10ˣ')}>10ˣ</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('exp(')}>exp</button>

                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('abs(')}>abs</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('floor(')}>floor</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('ceil(')}>ceil</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('round(')}>round</button>
                <button className={`${styles.btnSci} ${styles.colSpan4}`} onClick={() => handleAction('Rand')}>Rand</button>
              </>
            )}

            <button className={`${styles.btn} ${styles.btnSpecial} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleAction('C')}>C</button>
            <button className={`${styles.btn} ${styles.btnSpecial} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleAction('±')}>±</button>
            <button className={`${styles.btn} ${styles.btnSpecial} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleAction('%')}>%</button>
            <button className={`${styles.btn} ${styles.btnOp} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleOperator('÷')}>÷</button>

            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('7')}>7</button>
            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('8')}>8</button>
            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('9')}>9</button>
            <button className={`${styles.btn} ${styles.btnOp} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleOperator('×')}>×</button>

            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('4')}>4</button>
            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('5')}>5</button>
            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('6')}>6</button>
            <button className={`${styles.btn} ${styles.btnOp} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleOperator('-')}>−</button>

            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('1')}>1</button>
            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('2')}>2</button>
            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('3')}>3</button>
            <button className={`${styles.btn} ${styles.btnOp} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleOperator('+')}>+</button>

            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleAction('AC')}>AC</button>
            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('0')}>0</button>
            <button className={`${styles.btn} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleNumber('.')}>.</button>
            <button className={`${styles.btn} ${styles.btnEq} ${isScientific ? styles.colSpan5 : styles.colSpan5}`} onClick={() => handleAction('=')}>=</button>
          </div>
        </div>
      </div>
      <GlassHistory 
        history={calc.history.filter(h => h.theme === 'glass')} 
        onClear={calc.clearHistory} 
        onClose={() => setShowHistory(false)} 
        isVisible={showHistory} 
        onReuse={calc.loadResult}
      />
    </div>
  );
};

export default GlassTheme;
