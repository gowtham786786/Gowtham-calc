const smallNumbers: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19
};

const tens: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90
};

const scales: Record<string, number> = {
  hundred: 100, thousand: 1000, million: 1000000
};

export function parseWordNumberBlock(words: string[]): string | null {
  if (words.length === 0) return null;

  if (words.length === 1 && /^-?\d+(\.\d+)?$/.test(words[0])) {
    return words[0];
  }

  const pointIndex = words.indexOf('point') !== -1 ? words.indexOf('point') : words.indexOf('dot');
  if (pointIndex !== -1) {
    const before = words.slice(0, pointIndex);
    const after = words.slice(pointIndex + 1);

    const beforeVal = before.length > 0 ? parseWordNumberBlock(before) : '0';
    let afterVal = '';
    for (const w of after) {
      if (smallNumbers[w] !== undefined) {
        afterVal += smallNumbers[w];
      } else if (/^\d+$/.test(w)) {
        afterVal += w;
      }
    }
    const merged = `${beforeVal}.${afterVal || '0'}`;
    // If the beforeVal had a minus sign already due to 'negative', it will be retained
    return merged;
  }

  let total = 0;
  let current = 0;
  let hasValue = false;
  let isNegative = false;

  for (const word of words) {
    if (word === 'negative') {
      isNegative = true;
      continue;
    }
    if (smallNumbers[word] !== undefined) {
      current += smallNumbers[word];
      hasValue = true;
    } else if (tens[word] !== undefined) {
      current += tens[word];
      hasValue = true;
    } else if (scales[word] !== undefined) {
      const scale = scales[word];
      if (scale === 100) {
        current = current === 0 ? 100 : current * 100;
      } else {
        total += (current === 0 ? 1 : current) * scale;
        current = 0;
      }
      hasValue = true;
    } else if (/^-?\d+(\.\d+)?$/.test(word)) {
      const val = parseFloat(word);
      if (val < 0) {
        isNegative = true;
        current += Math.abs(val);
      } else {
        current += val;
      }
      hasValue = true;
    }
  }

  if (!hasValue) return null;
  const finalNum = total + current;
  return isNegative ? (-finalNum).toString() : finalNum.toString();
}

export type ParseResult =
  | { type: 'control'; command: 'clear' | 'backspace' | 'equals' }
  | { type: 'math'; tokens: string[] }
  | { type: 'unknown'; reason: string };

export function parseSpeechToTokens(text: string): ParseResult {
  let cleanText = text.replace(/['"]/g, ' ').toLowerCase().trim();

  if (/^(clear|reset|all clear|ac)$/.test(cleanText)) {
    return { type: 'control', command: 'clear' };
  }
  if (/^(delete|backspace|remove|undo|erase)$/.test(cleanText)) {
    return { type: 'control', command: 'backspace' };
  }
  if (/^(equals|equal|equals to|is equals to|is equal to|what's the answer|what is the answer|calculate|solve|give me the answer|evaluate)$/.test(cleanText)) {
    return { type: 'control', command: 'equals' };
  }

  // 1. Convert spoken operator words to symbols BEFORE filler-word stripping
  const operatorMap: Record<string, string> = {
    'minus': '-',
    'subtract': '-',
    'plus': '+',
    'add': '+',
    'times': '×',
    'multiplied by': '×',
    'into': '×',
    'divided by': '÷',
    'over': '÷',
    'percent': '%'
  };
  
  Object.keys(operatorMap).forEach(op => {
    cleanText = cleanText.replace(new RegExp(`\\b${op}\\b`, 'g'), ` ${operatorMap[op]} `);
  });

  const fillers = [
    "please", "okay", "final", "the answer", "is equals to", "equals to", "equal to", "equals", "equal",
    "what's the answer", "what is the answer", "what's", "what is", "calculate", "solve", "give me", 
    "evaluate", "can you", "could you", "i want to", "um", "so", "now", "and", "the", "is", "a"
  ];
  fillers.forEach(filler => {
    cleanText = cleanText.replace(new RegExp(`\\b${filler}\\b`, 'g'), ' ');
  });

  // 2. Strip stray punctuation properly
  cleanText = cleanText.replace(/[?!()]/g, ' '); // Strip ? ! ( )
  cleanText = cleanText.replace(/(\d),(\d)/g, '$1$2'); // Remove commas between digits (thousands separators)
  cleanText = cleanText.replace(/,/g, ' '); // Replace any remaining stray commas with spaces
  cleanText = cleanText.replace(/\.(?!\d)/g, ' '); // Replace any period NOT followed by a digit
  
  // Isolate operators so things like "2-2" or "2+2" are split correctly
  cleanText = cleanText.replace(/([+*\/×÷=^%])/g, ' $1 ');
  cleanText = cleanText.replace(/(\d)-(\d)/g, '$1 - $2'); // split minus between numbers

  cleanText = cleanText.trim();

  if (cleanText.length === 0) {
    return { type: 'unknown', reason: "Didn't catch that clearly, please try again" };
  }

  const words = cleanText.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return { type: 'unknown', reason: "Didn't catch that clearly, please try again" };
  }

  const tokens: string[] = [];
  let currentNumWords: string[] = [];

  const pushCurrentNum = () => {
    if (currentNumWords.length > 0) {
      const numStr = parseWordNumberBlock(currentNumWords);
      if (numStr !== null) {
        tokens.push(numStr);
      }
      currentNumWords = [];
    }
  };

  const isNumWord = (w: string) => {
    return smallNumbers[w] !== undefined ||
           tens[w] !== undefined ||
           scales[w] !== undefined ||
           w === 'point' ||
           w === 'dot' ||
           /^-?\d+(\.\d+)?$/.test(w);
  };

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (word === 'pi' || word === 'π') {
      pushCurrentNum();
      tokens.push('π');
      continue;
    }
    if (word === 'e') {
      pushCurrentNum();
      tokens.push('e');
      continue;
    }
    if (word === 'percent' || word === 'percentage' || word === '%') {
      pushCurrentNum();
      tokens.push('÷', '100');
      if (i + 1 < words.length && words[i + 1] === 'of') {
        tokens.push('×');
        i++;
      } else if (i + 1 < words.length && isNumWord(words[i + 1])) {
        // Implicit "of" if followed directly by a number (e.g. "50 percent 200")
        tokens.push('×');
      }
      continue;
    }
    if (word === 'square' && i + 1 < words.length && words[i + 1] === 'root') {
      pushCurrentNum();
      tokens.push('√(');
      i++;
      if (i + 1 < words.length && words[i + 1] === 'of') i++;
      continue;
    }
    if (word === 'root' || word === '√') {
      pushCurrentNum();
      tokens.push('√(');
      if (i + 1 < words.length && words[i + 1] === 'of') i++;
      continue;
    }
    if (word === 'of') {
      continue;
    }

    if (word === 'plus' || word === 'add' || word === '+') {
      pushCurrentNum();
      tokens.push('+');
      continue;
    }
    if (word === 'times' || word === 'multiply' || word === 'multiplied' || word === 'into' || word === '*' || word === 'x' || word === '×') {
      pushCurrentNum();
      tokens.push('×');
      if (word === 'multiplied' && i + 1 < words.length && words[i + 1] === 'by') i++;
      continue;
    }
    if (word === 'divide' || word === 'divided' || word === 'over' || word === '/' || word === '÷') {
      pushCurrentNum();
      tokens.push('÷');
      if (word === 'divided' && i + 1 < words.length && words[i + 1] === 'by') i++;
      continue;
    }
    if (word === 'power' || word === 'raised' || word === '^') {
      pushCurrentNum();
      tokens.push('^');
      if (word === 'raised' && i + 1 < words.length && words[i + 1] === 'to') i++;
      continue;
    }

    // Minus vs Negative check
    if (word === 'minus' || word === 'subtract' || word === 'take' || word === 'less' || word === '-' || word === 'negative') {
      const lastToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
      // If we are currently building a number, it's definitely a subtraction dividing two numbers
      const isBuildingNumber = currentNumWords.length > 0;
      const isAfterOperator = !lastToken || ['+', '-', '×', '÷', '^', '√('].includes(lastToken);

      if (!isBuildingNumber && (isAfterOperator || word === 'negative')) {
        currentNumWords.push('negative');
      } else {
        pushCurrentNum();
        tokens.push('-');
      }
      continue;
    }

    if (isNumWord(word)) {
      currentNumWords.push(word);
    } else {
      pushCurrentNum();
    }
  }

  pushCurrentNum();

  // Deduplicate stutters & reject garbled multi-number blocks
  const dedupedTokens: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const isNum = !isNaN(parseFloat(t)) && isFinite(Number(t)) || ['π', 'e'].includes(t);
    
    if (isNum && dedupedTokens.length > 0) {
      const prev = dedupedTokens[dedupedTokens.length - 1];
      const prevIsNum = !isNaN(parseFloat(prev)) && isFinite(Number(prev)) || ['π', 'e'].includes(prev);
      
      if (prevIsNum) {
        if (prev === t) {
          // Stutter (e.g. 99 99) -> skip duplicate
          continue; 
        } else {
          // Malformed expressions: Two different numbers appear with no operator between them (e.g. 99 599)
          return { type: 'unknown', reason: "Didn't catch that clearly, please try again" };
        }
      }
    }
    dedupedTokens.push(t);
  }

  // Trim trailing operators
  while (dedupedTokens.length > 0) {
    const last = dedupedTokens[dedupedTokens.length - 1];
    if (['+', '-', '×', '÷', '^', '√('].includes(last)) {
      dedupedTokens.pop();
    } else {
      break;
    }
  }
  
  // Trim leading operators
  while (dedupedTokens.length > 0) {
    const first = dedupedTokens[0];
    if (['+', '×', '÷', '^', '%'].includes(first)) {
      dedupedTokens.shift();
    } else {
      break;
    }
  }

  // Detect and reject adjacent binary operators (e.g. `+ +` or `* +`)
  for (let i = 0; i < dedupedTokens.length - 1; i++) {
    const t1 = dedupedTokens[i];
    const t2 = dedupedTokens[i + 1];
    const isOp1 = ['+', '-', '×', '÷', '^'].includes(t1);
    const isOp2 = ['+', '-', '×', '÷', '^', '%'].includes(t2);
    
    if (isOp1 && isOp2) {
      // (Negative signs were already collapsed into the number by the parser, so two operators here is invalid)
      return { type: 'unknown', reason: "Didn't catch that clearly, please try again" };
    }
  }

  const hasValidMathToken = dedupedTokens.some(t =>
    !isNaN(parseFloat(t)) || ['+', '-', '×', '÷', '^', '√(', 'π', 'e'].includes(t)
  );

  if (dedupedTokens.length === 0 || !hasValidMathToken) {
    return { type: 'unknown', reason: "Didn't catch that clearly, please try again" };
  }

  return { type: 'math', tokens: dedupedTokens };
}
