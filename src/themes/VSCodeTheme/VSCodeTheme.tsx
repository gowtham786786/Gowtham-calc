import React, { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import VSCodeHistory from './VSCodeHistory';
import type { ThemeProps } from '../../App';
import styles from './VSCodeTheme.module.css';
import { FileCode2, TerminalSquare, Minus, Square, X, History } from 'lucide-react';
import { useFitText } from '../../hooks/useFitText';

const VSCodeTheme: React.FC<ThemeProps> = () => {
  const calc = useCalculator('vscode');
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

  const formatDisplay = (val: string) => val;
  const { containerRef, textRef, fontSize, renderedValue } = useFitText(displayValue, 56, 28, formatDisplay);

  return (
    <div className={styles.window}>
      <div className={styles.titlebar}>
        <div className={styles.titleLeft}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" alt="VSCode" className={styles.vsIcon} />
          <span>Calculator - Visual Studio Code</span>
        </div>
        <div className={styles.titleRight}>
          <div className={styles.winControl}><Minus size={14} /></div>
          <div className={styles.winControl}><Square size={12} /></div>
          <div className={`${styles.winControl} ${styles.winClose}`}><X size={14} /></div>
        </div>
      </div>
      
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <div className={styles.sideIcon}><FileCode2 size={24} /></div>
          <div className={styles.sideIcon} onClick={() => setIsScientific(!isScientific)} title="Toggle Scientific">
            <TerminalSquare size={24} />
          </div>
          <div className={styles.sideIcon} onClick={() => setShowHistory(true)} title="History">
            <History size={24} />
          </div>
        </div>
        
        <div className={styles.mainArea}>
          <div className={styles.tabs}>
            <div className={styles.tab}>
              <span className={styles.tsIcon}>TS</span>
              <span>calculator.ts</span>
            </div>
            <div className={styles.tabEmpty}></div>
          </div>
          
          <div className={styles.editor}>
            <div className={styles.displayArea}>
              <div className={styles.lineNumbers}>
                <span>1</span>
                <span>2</span>
                <span>3</span>
              </div>
              <div className={styles.displayContent} ref={containerRef}>
                <div className={styles.line}>
                  <span className={styles.keyword}>const</span> <span className={styles.variable}>equation</span> <span className={styles.operator}>=</span> <span className={styles.string}>"{equation || ' '}"</span><span className={styles.punctuation}>;</span>
                </div>
                <div className={styles.line}>
                  <span className={styles.keyword}>const</span> <span className={styles.variable}>result</span> <span className={styles.operator}>=</span> <span className={styles.number} ref={textRef} style={{ fontSize: `${fontSize}px` }}>{renderedValue}</span><span className={styles.punctuation}>;</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.terminal}>
            <div className={styles.termHeader}>
              <span>TERMINAL</span>
              <span>OUTPUT</span>
              <span>DEBUG CONSOLE</span>
            </div>
            
            <div className={styles.keypadWrapper}>
              <div className={`${styles.keypad} ${isScientific ? styles.scientific : ''}`}>
                {isScientific && (
                  <div className={styles.sciPad}>
                    <button className={`${styles.btn} ${styles.btnFunc}`} onClick={() => handleAction('sin(')}>sin()</button>
                    <button className={`${styles.btn} ${styles.btnFunc}`} onClick={() => handleAction('cos(')}>cos()</button>
                    <button className={`${styles.btn} ${styles.btnFunc}`} onClick={() => handleAction('tan(')}>tan()</button>
                    <button className={`${styles.btn} ${styles.btnFunc}`} onClick={() => handleAction('(')}>(</button>
                    <button className={`${styles.btn} ${styles.btnFunc}`} onClick={() => handleAction(')')}>)</button>
                    
                    <button className={`${styles.btn} ${styles.btnFunc}`} onClick={() => handleAction('log(')}>log()</button>
                    <button className={`${styles.btn} ${styles.btnFunc}`} onClick={() => handleAction('ln(')}>ln()</button>
                    <button className={`${styles.btn} ${styles.btnFunc}`} onClick={() => handleAction('x²')}>pow2()</button>
                    <button className={`${styles.btn} ${styles.btnFunc}`} onClick={() => handleOperator('^')}>pow()</button>
                    <button className={`${styles.btn} ${styles.btnFunc}`} onClick={() => handleAction('!')}>fact()</button>
                    
                    <button className={`${styles.btn} ${styles.btnVar}`} onClick={() => handleAction('π')}>PI</button>
                    <button className={`${styles.btn} ${styles.btnVar}`} onClick={() => handleAction('e')}>E</button>
                    <button className={`${styles.btn} ${styles.btnVar}`} onClick={() => handleAction('√(')}>sqrt()</button>
                    <button className={`${styles.btn} ${styles.btnVar}`} onClick={() => handleAction('MC')}>MC</button>
                    <button className={`${styles.btn} ${styles.btnVar}`} onClick={() => handleAction('MR')}>MR</button>
                    <button className={`${styles.btn} ${styles.btnVar}`} onClick={() => handleAction('M+')}>M+</button>
                  </div>
                )}

                <div className={styles.mainPad}>
                  <button className={`${styles.btn} ${styles.btnKeyword}`} onClick={() => handleAction('C')}>clear</button>
                  <button className={`${styles.btn} ${styles.btnKeyword}`} onClick={() => handleAction('±')}>neg</button>
                  <button className={`${styles.btn} ${styles.btnKeyword}`} onClick={() => handleAction('%')}>mod</button>
                  <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('÷')}>/</button>

                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('7')}>7</button>
                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('8')}>8</button>
                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('9')}>9</button>
                  <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('×')}>*</button>

                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('4')}>4</button>
                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('5')}>5</button>
                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('6')}>6</button>
                  <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('-')}>-</button>

                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('1')}>1</button>
                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('2')}>2</button>
                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('3')}>3</button>
                  <button className={`${styles.btn} ${styles.btnOp}`} onClick={() => handleOperator('+')}>+</button>

                  <button className={`${styles.btn} ${styles.btnKeyword}`} onClick={() => handleAction('AC')}>reset</button>
                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('0')}>0</button>
                  <button className={`${styles.btn} ${styles.btnNum}`} onClick={() => handleNumber('.')}>.</button>
                  <button className={`${styles.btn} ${styles.btnRun}`} onClick={() => handleAction('=')}>Run()</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VSCodeHistory 
        history={calc.history.filter(h => h.theme === 'vscode')} 
        onClear={calc.clearHistory} 
        onClose={() => setShowHistory(false)} 
        isVisible={showHistory} 
        onReuse={calc.loadResult}
      />
    </div>
  );
};

export default VSCodeTheme;
