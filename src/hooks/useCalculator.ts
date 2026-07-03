import { useState, useEffect, useCallback } from 'react';

export type HistoryEntry = {
  equation: string;
  result: string;
};

export function useCalculator(themeId: string = 'default') {
  const [displayValue, setDisplayValue] = useState('0');
  const [equation, setEquation] = useState<string[]>([]);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isScientific, setIsScientific] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [newNumber, setNewNumber] = useState(true);

  // Load state from local storage on mount or theme switch
  useEffect(() => {
    const savedMemory = localStorage.getItem(`calc_memory_${themeId}`);
    const savedHistory = localStorage.getItem(`calc_history_${themeId}`);
    
    if (savedMemory) {
      setMemory(parseFloat(savedMemory));
    } else {
      setMemory(0);
    }
    
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  }, [themeId]);

  const saveMemory = (val: number) => {
    setMemory(val);
    localStorage.setItem(`calc_memory_${themeId}`, val.toString());
  };

  const saveHistory = (newHistory: HistoryEntry[]) => {
    const trimmed = newHistory.slice(0, 20); // Keep last 20
    setHistory(trimmed);
    localStorage.setItem(`calc_history_${themeId}`, JSON.stringify(trimmed));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(`calc_history_${themeId}`);
  };

  const handleNumber = useCallback((numStr: string) => {
    if (hasError) {
      setDisplayValue(numStr);
      setHasError(false);
      setEquation([]);
      setNewNumber(false);
      return;
    }
    if (newNumber) {
      setDisplayValue(numStr === '.' ? '0.' : numStr);
      setNewNumber(false);
    } else {
      if (numStr === '.' && displayValue.includes('.')) return;
      setDisplayValue(displayValue === '0' && numStr !== '.' ? numStr : displayValue + numStr);
    }
  }, [displayValue, newNumber, hasError]);

  const handleOperator = useCallback((op: string) => {
    if (hasError) return;
    
    // If we already have an operator and haven't typed a new number, swap the operator
    if (newNumber && equation.length > 0) {
      const lastToken = equation[equation.length - 1];
      if (['+', '-', '×', '÷', '^'].includes(lastToken)) {
        setEquation([...equation.slice(0, -1), op]);
        return;
      }
    }

    setEquation([...equation, displayValue, op]);
    setNewNumber(true);
  }, [displayValue, newNumber, equation, hasError]);

  const calculate = useCallback(() => {
    if (hasError) return;
    
    let exprTokens = [...equation];
    if (!newNumber) {
      exprTokens.push(displayValue);
    }

    if (exprTokens.length === 0) return;

    try {
      let exprStr = exprTokens.join(' ')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      // Simple factorial replacement (only works for integers before !)
      exprStr = exprStr.replace(/(\d+)!/g, (_match, p1) => {
        let n = parseInt(p1);
        if (n < 0) return 'NaN';
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res.toString();
      });
      
      // Replace scientific functions
      exprStr = exprStr.replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/mod/g, '%')
        .replace(/Rand/g, 'Math.random()')
        .replace(/10ˣ/g, '10**')
        .replace(/1\/x/g, '1/')
        .replace(/x³/g, '**3');

      // Add missing closing parentheses
      const openParen = (exprStr.match(/\(/g) || []).length;
      const closeParen = (exprStr.match(/\)/g) || []).length;
      if (openParen > closeParen) {
        exprStr += ')'.repeat(openParen - closeParen);
      }

      // Safe evaluation using new Function
      const result = new Function('return ' + exprStr)();

      if (!isFinite(result) || isNaN(result)) {
        throw new Error('Invalid calculation');
      }

      let resultStr = parseFloat(result.toFixed(10)).toString(); // Fix floating point issues
      
      const newEntry = {
        equation: exprTokens.join(' ') + ' =',
        result: resultStr
      };
      
      setDisplayValue(resultStr);
      setEquation([]);
      setNewNumber(true);
      saveHistory([newEntry, ...history]);

    } catch (e) {
      setDisplayValue('Error');
      setHasError(true);
      setEquation([]);
      setNewNumber(true);
    }
  }, [equation, displayValue, newNumber, hasError, history]);

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'AC':
        setDisplayValue('0');
        setEquation([]);
        setHasError(false);
        setNewNumber(true);
        break;
      case 'C':
        setDisplayValue('0');
        setHasError(false);
        setNewNumber(true);
        break;
      case 'Backspace':
        if (hasError) {
          setDisplayValue('0');
          setHasError(false);
          setNewNumber(true);
        } else if (!newNumber) {
          const newVal = displayValue.slice(0, -1);
          setDisplayValue(newVal === '' || newVal === '-' ? '0' : newVal);
          if (newVal === '' || newVal === '-') setNewNumber(true);
        }
        break;
      case '±':
        if (displayValue !== '0' && !hasError) {
          setDisplayValue(displayValue.startsWith('-') ? displayValue.slice(1) : '-' + displayValue);
        }
        break;
      case '%':
        if (!hasError) {
          const val = parseFloat(displayValue) / 100;
          setDisplayValue(val.toString());
          setNewNumber(true);
        }
        break;
      case '=':
      case 'Enter':
        calculate();
        break;
      case 'MC':
        saveMemory(0);
        break;
      case 'MR':
        setDisplayValue(memory.toString());
        setNewNumber(true);
        break;
      case 'M+':
        if (!hasError) saveMemory(memory + parseFloat(displayValue));
        break;
      case 'M-':
        if (!hasError) saveMemory(memory - parseFloat(displayValue));
        break;
      case 'MS':
        if (!hasError) saveMemory(parseFloat(displayValue));
        break;
      case '(':
      case ')':
      case 'sin(':
      case 'cos(':
      case 'tan(':
      case 'log(':
      case 'ln(':
      case '√(':
      case 'π':
      case 'e':
        if (hasError) return;
        setEquation([...equation, action]);
        break;
      case 'x²':
        if (hasError) return;
        setDisplayValue((parseFloat(displayValue) ** 2).toString());
        setNewNumber(true);
        break;
      case '!':
        if (hasError) return;
        setEquation([...equation, displayValue, '!']);
        setNewNumber(true);
        break;
      default:
        break;
    }
  }, [displayValue, equation, memory, hasError, calculate, newNumber]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.ctrlKey || e.metaKey) return;

      const key = e.key;
      if (/[0-9.]/.test(key)) {
        handleNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key === '*' ? '×' : key === '/' ? '÷' : key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleAction('=');
      } else if (key === 'Escape') {
        handleAction('AC');
      } else if (key === 'Backspace') {
        handleAction('Backspace');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleAction]);

  return {
    displayValue,
    equation: equation.join(' '),
    memory,
    history,
    isScientific,
    setIsScientific,
    handleNumber,
    handleOperator,
    handleAction,
    clearHistory
  };
}
