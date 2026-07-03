const fs = require('fs');

// 1. Fix useCalculator.ts (Ctrl + Zoom bug)
let calcTs = fs.readFileSync('src/hooks/useCalculator.ts', 'utf8');
if (!calcTs.includes('if (e.ctrlKey || e.metaKey) return;')) {
  calcTs = calcTs.replace(
    'if (document.activeElement?.tagName === \'INPUT\') return;',
    'if (document.activeElement?.tagName === \'INPUT\') return;\n      if (e.ctrlKey || e.metaKey) return;'
  );
  fs.writeFileSync('src/hooks/useCalculator.ts', calcTs);
}

// 2. Fix index.css (scrolling bug)
let indexCss = fs.readFileSync('src/index.css', 'utf8');
indexCss = indexCss.replace(/padding: 16px;\s+transition: opacity/g, 'transition: opacity');
if (!indexCss.includes('min-height: 100%;')) {
  indexCss = indexCss.replace(
    '.theme-wrapper > div {\n  margin: auto;\n  flex-shrink: 0;\n}',
    '.theme-wrapper > div {\n  margin: auto;\n  flex-shrink: 0;\n  width: 100%;\n  min-height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n}'
  );
  fs.writeFileSync('src/index.css', indexCss);
}

// 3. Fix App.tsx (Pass onOpenHistory)
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
if (!appTsx.includes('onOpenHistory: () => void;')) {
  appTsx = appTsx.replace(
    'settings: ReturnType<typeof useSettings>;\n}',
    'settings: ReturnType<typeof useSettings>;\n  onOpenHistory: () => void;\n}'
  );
  const themes = ['AppleTheme', 'GlassTheme', 'VSCodeTheme', 'WindowsTheme', 'CyberpunkTheme', 'AiTheme', 'RetroTheme'];
  themes.forEach(t => {
    appTsx = appTsx.replace(
      new RegExp(`<${t} calc={calc} settings={settings} />`, 'g'),
      `<${t} calc={calc} settings={settings} onOpenHistory={() => setShowHistory(true)} />`
    );
  });
  fs.writeFileSync('src/App.tsx', appTsx);
}

// 4. Fix wrappers in 6 themes so they expand and scroll correctly
const themesToFix = ['AiTheme/AiTheme', 'CyberpunkTheme/CyberpunkTheme', 'GlassmorphismTheme/GlassTheme', 'RetroTheme/RetroTheme', 'VSCodeTheme/VSCodeTheme', 'WindowsTheme/WindowsTheme'];
themesToFix.forEach(t => {
  const cssPath = `src/themes/${t}.module.css`;
  let css = fs.readFileSync(cssPath, 'utf8');
  css = css.replace(/position: absolute;\n\s*top: 0;\n\s*left: 0;\n\s*width: 100%;\n\s*height: 100%;/, 'width: 100%;\n  min-height: 100%;');
  // GlassTheme also has it
  css = css.replace(/position: absolute;\s*top: 0;\s*left: 0;\s*width: 100vw;\s*height: 100vh;/, 'width: 100%;\n  min-height: 100%;');
  fs.writeFileSync(cssPath, css);
});

console.log('Script executed successfully!');
