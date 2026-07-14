const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src', 'themes');
const themes = ['AiTheme', 'AppleTheme', 'CyberpunkTheme', 'GlassmorphismTheme', 'RetroTheme', 'VSCodeTheme', 'WindowsTheme'];

for (const theme of themes) {
  let historyBaseName = theme.replace('Theme', '') + 'History';
  if (theme === 'GlassmorphismTheme') historyBaseName = 'GlassHistory';
  
  const tsxPath = path.join(themesDir, theme, `${historyBaseName}.tsx`);
  const cssPath = path.join(themesDir, theme, `${historyBaseName}.module.css`);

  // --- FIX CSS ---
  if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    
    // 1. Change z-index to 9999 to cover Voice widget
    css = css.replace(/z-index:\s*\d+;/g, 'z-index: 9999;');

    // 2. Add .overlay class if it doesn't exist
    if (!css.includes('.overlay {')) {
      const overlayCss = `
.overlay {
  position: absolute;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
.overlay.visible {
  opacity: 1;
  pointer-events: auto;
}
`;
      css += overlayCss;
    }
    
    fs.writeFileSync(cssPath, css);
  }

  // --- FIX TSX ---
  if (fs.existsSync(tsxPath)) {
    let tsx = fs.readFileSync(tsxPath, 'utf8');

    // 1. Add useEffect import if missing
    if (!tsx.includes('useEffect')) {
      tsx = tsx.replace(/import React(.*?)(?=\s*from 'react';|;)/, (match) => {
        if (match === 'import React') return 'import React, { useEffect }';
        if (match.includes('{')) {
          if (!match.includes('useEffect')) {
            return match.replace('{', '{ useEffect, ');
          }
          return match;
        }
        return 'import React, { useEffect }';
      });
      // Fallback if the regex above didn't catch it
      if (!tsx.includes('useEffect')) {
         tsx = tsx.replace("import React from 'react';", "import React, { useEffect } from 'react';");
      }
    }

    // 2. Add Escape key listener inside the component
    // Find the component definition
    const compMatch = tsx.match(/(const \w+History: React\.FC<.*> = \([^)]+\) => {)/);
    if (compMatch && !tsx.includes('keydown')) {
      const effectCode = `
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('historyToggle', { detail: isVisible }));
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
       window.removeEventListener('keydown', handleKeyDown);
       window.dispatchEvent(new CustomEvent('historyToggle', { detail: false }));
    };
  }, [isVisible, onClose]);
`;
      tsx = tsx.replace(compMatch[1], compMatch[1] + effectCode);
    }

    // 3. Wrap .panel with .overlay and add stopPropagation
    if (!tsx.includes('styles.overlay')) {
      const returnMatch = tsx.match(/return\s*\(\s*(<div[^>]*styles\.panel[^>]*>)/);
      if (returnMatch) {
        const panelDiv = returnMatch[1];
        let newPanelDiv = panelDiv;
        if (!newPanelDiv.includes('stopPropagation')) {
           newPanelDiv = newPanelDiv.replace('>', ' onClick={(e) => e.stopPropagation()}>');
        }

        const overlayDiv = `<div className={\`\${styles.overlay} \${isVisible ? styles.visible : ''}\`} onClick={onClose}>\n      ${newPanelDiv}`;
        
        tsx = tsx.replace(panelDiv, overlayDiv);

        const lastDivMatch = tsx.lastIndexOf('</div>\n  );');
        if (lastDivMatch !== -1) {
          tsx = tsx.substring(0, lastDivMatch) + '</div>\n    </div>\n  );' + tsx.substring(lastDivMatch + 12);
        } else {
           const altLastDivMatch = tsx.lastIndexOf('</div>\n    </div>\n  );');
           if (altLastDivMatch === -1) {
             const finalMatch = tsx.lastIndexOf('</div>');
             tsx = tsx.substring(0, finalMatch) + '</div>\n    </div>' + tsx.substring(finalMatch + 6);
           }
        }
      }
    }

    // 4. Ensure close (X) button is clearly visible in the header next to Trash
    const headerRegex = /<div className={styles\.header}>[\s\S]*?<\/div>\s*<div className={styles\.content}>/;
    const newHeader = `
      <div className={styles.header}>
        <span className={styles.title}>History</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={styles.iconBtn} onClick={onClear} disabled={history.length === 0} title="Clear History" aria-label="Clear History">
            <Trash2 size={18} />
          </button>
          <button className={styles.iconBtn} onClick={onClose} title="Close" aria-label="Close">
            <X size={18} />
          </button>
        </div>
      </div>
      <div className={styles.content}>`;
    
    tsx = tsx.replace(headerRegex, newHeader);
    
    if (!tsx.includes('Trash2')) {
      tsx = tsx.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, Trash2 } from 'lucide-react';");
    }
    if (!tsx.includes('X')) {
      tsx = tsx.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, X } from 'lucide-react';");
    }

    fs.writeFileSync(tsxPath, tsx);
  }
}

console.log("History components patched successfully!");
