import { useState, useEffect, useCallback, useRef } from 'react';

export type HistoryEntry = {
  id: string;
  equation: string;
  result: string;
  theme: string;
  timestamp: number;
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
    
    if (savedMemory) {
      setMemory(parseFloat(savedMemory));
    } else {
      setMemory(0);
    }
    
    const loadGlobalHistory = () => {
      const savedHistory = localStorage.getItem('calc_history_global');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          setHistory([]);
        }
      } else {
        setHistory([]);
      }
    };

    loadGlobalHistory();

    window.addEventListener('calc_history_update', loadGlobalHistory);
    return () => window.removeEventListener('calc_history_update', loadGlobalHistory);
  }, [themeId]);

  const saveMemory = (val: number) => {
    setMemory(val);
    localStorage.setItem(`calc_memory_${themeId}`, val.toString());
  };

  const saveHistory = (newHistory: HistoryEntry[]) => {
    const trimmed = newHistory.slice(0, 100); // Keep last 100 entries globally
    setHistory(trimmed);
    localStorage.setItem('calc_history_global', JSON.stringify(trimmed));
    window.dispatchEvent(new Event('calc_history_update'));
  };

  const clearHistory = () => {
    const globalHistStr = localStorage.getItem('calc_history_global');
    let currentGlobal = globalHistStr ? JSON.parse(globalHistStr) : [];
    const newHistory = currentGlobal.filter((item: HistoryEntry) => item.theme !== themeId);
    setHistory(newHistory);
    localStorage.setItem('calc_history_global', JSON.stringify(newHistory));
    window.dispatchEvent(new Event('calc_history_update'));
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
  }, [displayValue, newNumber, hasError, themeId]);

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
  }, [displayValue, newNumber, equation, hasError, themeId]);

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
        .replace(/10\^/g, '10**')
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
        id: crypto.randomUUID(),
        equation: exprTokens.join(' ') + ' =',
        result: resultStr,
        theme: themeId,
        timestamp: Date.now()
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
  }, [equation, displayValue, newNumber, hasError, history, themeId]);

  const handleSequence = useCallback((tokens: string[]) => {
    if (hasError || tokens.length === 0) return;
    
    let currentEq = [...equation];
    let currentDisp = displayValue;
    let isNewNum = newNumber;
    
    for (const token of tokens) {
      if (/[0-9.]/.test(token) || ['π', 'e'].includes(token)) {
        if (isNewNum) {
          currentDisp = token === '.' ? '0.' : token;
          isNewNum = false;
        } else {
          if (token === '.' && currentDisp.includes('.')) continue;
          currentDisp = currentDisp === '0' && token !== '.' ? token : currentDisp + token;
        }
      } else if (['+', '-', '×', '÷', '^', '%', '√('].includes(token)) {
        if (isNewNum && currentEq.length > 0) {
          const lastToken = currentEq[currentEq.length - 1];
          if (['+', '-', '×', '÷', '^'].includes(lastToken)) {
            currentEq = [...currentEq.slice(0, -1), token];
            continue;
          }
        }
        currentEq = [...currentEq, currentDisp, token];
        isNewNum = true;
      } else if (token === '!') {
        currentEq = [...currentEq, currentDisp, '!'];
        isNewNum = true;
      }
    }
    
    let exprTokens = [...currentEq];
    if (!isNewNum) {
      exprTokens.push(currentDisp);
    }

    if (exprTokens.length === 0) return;

    try {
      let exprStr = exprTokens.join(' ')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      exprStr = exprStr.replace(/(\d+)!/g, (_match, p1) => {
        let n = parseInt(p1);
        if (n < 0) return 'NaN';
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res.toString();
      });
      
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
        .replace(/10\^/g, '10**')
        .replace(/1\/x/g, '1/')
        .replace(/x³/g, '**3');

      const openParen = (exprStr.match(/\(/g) || []).length;
      const closeParen = (exprStr.match(/\)/g) || []).length;
      if (openParen > closeParen) {
        exprStr += ')'.repeat(openParen - closeParen);
      }

      const result = new Function('return ' + exprStr)();

      if (!isFinite(result) || isNaN(result)) {
        throw new Error('Invalid calculation');
      }

      let resultStr = parseFloat(result.toFixed(10)).toString();
      
      const newEntry = {
        id: crypto.randomUUID(),
        equation: exprTokens.join(' ') + ' =',
        result: resultStr,
        theme: themeId,
        timestamp: Date.now()
      };
      
      setDisplayValue(resultStr);
      setEquation([]);
      setNewNumber(true);
      saveHistory([newEntry, ...history]);
      
      return resultStr;
    } catch (e) {
      setDisplayValue('Error');
      setHasError(true);
      setEquation([]);
      setNewNumber(true);
      return 'Error';
    }
  }, [equation, displayValue, newNumber, hasError, history, themeId]);

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

  const loadResult = useCallback((val: string) => {
    if (hasError) return;
    setDisplayValue(val);
    setNewNumber(false);
  }, [hasError]);

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

  const adapterRef = useRef<any>(null);
  useEffect(() => {
    adapterRef.current = {
      onInput: (value: string) => {
        if (/[0-9.]/.test(value)) {
          handleNumber(value);
        } else if (['+', '-', '*', '/', '×', '÷', '^'].includes(value)) {
          const op = value === '*' ? '×' : value === '/' ? '÷' : value;
          handleOperator(op);
        } else {
          handleAction(value);
        }
      },
      onClear: () => handleAction('AC'),
      onBackspace: () => handleAction('Backspace'),
      onEquals: () => handleAction('='),
      onSequence: (tokens: string[]) => handleSequence(tokens),
      getDisplayValue: () => displayValue,
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!(window as any).__calc_adapters) {
        (window as any).__calc_adapters = {};
      }
      (window as any).__calc_adapters[themeId] = {
        onInput: (value: string) => adapterRef.current?.onInput(value),
        onClear: () => adapterRef.current?.onClear(),
        onBackspace: () => adapterRef.current?.onBackspace(),
        onEquals: () => adapterRef.current?.onEquals(),
        onSequence: (tokens: string[]) => adapterRef.current?.onSequence(tokens),
        getDisplayValue: () => adapterRef.current?.getDisplayValue() || '0',
      };
      return () => {
        if ((window as any).__calc_adapters) {
          delete (window as any).__calc_adapters[themeId];
        }
      };
    }
  }, [themeId]);

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
    handleSequence,
    clearHistory,
    loadResult
  };
}
