import React, { useState, useEffect } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import AiHistory from './AiHistory';
import type { ThemeProps } from '../../App';
import styles from './AiTheme.module.css';
import { Sparkles, Wand2, History } from 'lucide-react';
import { useFitText } from '../../hooks/useFitText';

const SUGGESTIONS = [
  "Try: 15% of 200",
  "Did you know 2^10 = 1024?",
  "Golden Ratio ≈ 1.618",
  "Tip: Use history for past results",
  "Try: sin(90)",
  "Calculating optimal path..."
];

const AiTheme: React.FC<ThemeProps> = () => {
  const calc = useCalculator('ai');
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

  const [suggestion, setSuggestion] = useState(SUGGESTIONS[0]);

  // Cycle suggestions
  useEffect(() => {
    const timer = setInterval(() => {
      setSuggestion(prev => {
        const idx = SUGGESTIONS.indexOf(prev);
        return SUGGESTIONS[(idx + 1) % SUGGESTIONS.length];
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const formatDisplay = (val: string) => {
    if (val === 'Error') return 'Error';
    if (val.includes('e')) return val;
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const { containerRef, textRef, fontSize, renderedValue } = useFitText(displayValue, 56, 26, formatDisplay);

  return (
    <div className={styles.wrapper}>
      <div className={styles.ambientBackground}></div>

      <div className={styles.calculator}>
        <div className={styles.header}>
          <div className={styles.orbContainer}>
            <div className={styles.orb}></div>
          </div>
          <div className={styles.brand}>Assistant</div>
          <button 
            className={`${styles.sciToggle} ${isScientific ? styles.active : ''}`}
            onClick={() => setIsScientific(!isScientific)}
          >
            <Wand2 size={16} />
          </button>
          <button className={styles.sciToggle} onClick={() => setShowHistory(true)} title="History">
            <History size={16} />
          </button>
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
          
          <div className={styles.suggestionLine}>
            <Sparkles size={12} className={styles.sparkleIcon} />
            <span className={styles.suggestionText}>{suggestion}</span>
          </div>
        </div>

        <div className={styles.keypad}>
          {isScientific && (
            <div className={styles.sciPad}>
              <button className={styles.btnSci} onClick={() => handleAction('sin(')}>sin</button>
              <button className={styles.btnSci} onClick={() => handleAction('cos(')}>cos</button>
              <button className={styles.btnSci} onClick={() => handleAction('tan(')}>tan</button>
              <button className={styles.btnSci} onClick={() => handleAction('log(')}>log</button>
              
              <button className={styles.btnSci} onClick={() => handleAction('x²')}>x²</button>
              <button className={styles.btnSci} onClick={() => handleOperator('^')}>xʸ</button>
              <button className={styles.btnSci} onClick={() => handleAction('!')}>x!</button>
              <button className={styles.btnSci} onClick={() => handleAction('ln(')}>ln</button>
              
              <button className={styles.btnSci} onClick={() => handleAction('√(')}>√</button>
              <button className={styles.btnSci} onClick={() => handleAction('π')}>π</button>
              <button className={styles.btnSci} onClick={() => handleAction('e')}>e</button>
              <button className={styles.btnSci} onClick={() => handleAction('(')}>(</button>
              
              <button className={styles.btnSci} onClick={() => handleAction(')')}>)</button>
              <button className={styles.btnSci} onClick={() => handleAction('MC')}>mc</button>
              <button className={styles.btnSci} onClick={() => handleAction('MR')}>mr</button>
              <button className={styles.btnSci} onClick={() => handleAction('M+')}>m+</button>
            </div>
          )}

          <div className={styles.mainPad}>
            <button className={`${styles.btn} ${styles.btnLight}`} onClick={() => handleAction('AC')}>AC</button>
            <button className={`${styles.btn} ${styles.btnLight}`} onClick={() => handleAction('±')}>±</button>
            <button className={`${styles.btn} ${styles.btnLight}`} onClick={() => handleAction('%')}>%</button>
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

            <button className={`${styles.btn} ${styles.btnLight}`} onClick={() => handleAction('C')}>C</button>
            <button className={styles.btn} onClick={() => handleNumber('0')}>0</button>
            <button className={styles.btn} onClick={() => handleNumber('.')}>.</button>
            <button className={`${styles.btn} ${styles.btnEq}`} onClick={() => handleAction('=')}>=</button>
          </div>
        </div>
      </div>
      <AiHistory 
        history={calc.history.filter(h => h.theme === 'ai')} 
        onClear={calc.clearHistory} 
        onClose={() => setShowHistory(false)} 
        isVisible={showHistory} 
        onReuse={calc.loadResult}
      />
    </div>
  );
};

export default AiTheme;
