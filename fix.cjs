const fs = require('fs');

const fixTypeImport = (file, importText) => {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(`import { ${importText} }`, `import type { ${importText} }`);
  fs.writeFileSync(file, text);
};

const themes = ['AiTheme/AiTheme', 'AppleTheme/AppleTheme', 'CyberpunkTheme/CyberpunkTheme', 'GlassmorphismTheme/GlassTheme', 'RetroTheme/RetroTheme', 'VSCodeTheme/VSCodeTheme', 'WindowsTheme/WindowsTheme'];

themes.forEach(t => fixTypeImport(`src/themes/${t}.tsx`, 'ThemeProps'));
fixTypeImport('src/components/HistoryPanel.tsx', 'HistoryEntry');
fixTypeImport('src/components/ThemeSwitcher.tsx', 'ThemeId');

// Fix useCalculator.ts
let calcText = fs.readFileSync('src/hooks/useCalculator.ts', 'utf8');
calcText = calcText.replace('match, p1', '_match, p1');
fs.writeFileSync('src/hooks/useCalculator.ts', calcText);

// Fix App.tsx
let appText = fs.readFileSync('src/App.tsx', 'utf8');
appText = appText.replace(/  const renderTheme = \(\) => \{\s+const active = settings\.activeTheme;[\s\S]*?\};\s+/, '');
fs.writeFileSync('src/App.tsx', appText);

// Fix AiTheme unused Bot
let aiText = fs.readFileSync('src/themes/AiTheme/AiTheme.tsx', 'utf8');
aiText = aiText.replace('Bot, Sparkles, Wand2', 'Sparkles, Wand2');
fs.writeFileSync('src/themes/AiTheme/AiTheme.tsx', aiText);

// Fix VSCodeTheme unused VscCollapseAll
let vsText = fs.readFileSync('src/themes/VSCodeTheme/VSCodeTheme.tsx', 'utf8');
vsText = vsText.replace('FileCode2, TerminalSquare, VscCollapseAll, Minus, Square, X', 'FileCode2, TerminalSquare, Minus, Square, X');
fs.writeFileSync('src/themes/VSCodeTheme/VSCodeTheme.tsx', vsText);

console.log('Fixed lint issues');
