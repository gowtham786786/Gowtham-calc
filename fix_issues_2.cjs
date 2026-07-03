const fs = require('fs');

const insertHistoryBtn = (theme, insertText, searchRegex, importText) => {
  const path = `src/themes/${theme}/${theme}.tsx`;
  if (!fs.existsSync(path)) return;
  
  let content = fs.readFileSync(path, 'utf8');
  
  // Add History to lucide-react import
  if (content.includes('lucide-react') && !content.includes('History')) {
    content = content.replace(/import {([^}]+)} from 'lucide-react';/, (match, p1) => {
      return `import {${p1}, History} from 'lucide-react';`;
    });
  } else if (!content.includes('History')) {
    content = content.replace(/(import .*;\n)/, `$1import { History } from 'lucide-react';\n`);
  }

  // Add onOpenHistory to destructured props
  if (!content.includes('onOpenHistory')) {
    content = content.replace(/= \({ calc(.*?)}/g, '= ({ calc$1, onOpenHistory }');
  }

  // Insert button
  if (!content.includes('onOpenHistory}')) {
    content = content.replace(searchRegex, `$1${insertText}`);
  }
  
  fs.writeFileSync(path, content);
};

// 1. AppleTheme
insertHistoryBtn(
  'AppleTheme',
  `\n        <button className={styles.sciToggle} onClick={onOpenHistory} title="History">\n          <History size={16} />\n        </button>`,
  /(<div className=\{styles\.header\}>[\s\S]*?)(<\/div>)/,
);

// 2. WindowsTheme
insertHistoryBtn(
  'WindowsTheme',
  `\n          <button className={styles.btnSecondary} onClick={onOpenHistory} title="History">\n            <History size={16} />\n          </button>`,
  /(<button className=\{styles\.btnSecondary\} onClick=\{\(\) => setIsScientific\(!isScientific\)\}>[\s\S]*?<\/button>)/,
);

// 3. VSCodeTheme
insertHistoryBtn(
  'VSCodeTheme',
  `\n            <div className={styles.tab} onClick={onOpenHistory}><History size={14} style={{marginRight: 6}} /> history.log</div>`,
  /(<div className=\{styles\.tab\}\s+onClick=\{\(\) => setIsScientific\(!isScientific\)\}\s*>[\s\S]*?<\/div>)/,
);

// 4. GlassTheme
insertHistoryBtn(
  'GlassmorphismTheme/GlassTheme',
  `\n          <button className={styles.advToggle} style={{marginLeft: 'auto'}} onClick={onOpenHistory}>\n            <History size={16} />\n          </button>`,
  /(<button className=\{styles\.advToggle\} onClick=\{\(\) => setIsScientific\(!isScientific\)\}>[\s\S]*?<\/button>)/,
);
// Fix the path name issue (GlassTheme folder is GlassmorphismTheme)
const glassPath = 'src/themes/GlassmorphismTheme/GlassTheme.tsx';
let glass = fs.readFileSync(glassPath, 'utf8');
if (!glass.includes('onOpenHistory}')) {
  glass = glass.replace(
    /(<button className=\{styles\.advToggle\} onClick=\{\(\) => setIsScientific\(!isScientific\)\}>[\s\S]*?<\/button>)/,
    `$1\n          <button className={styles.advToggle} style={{marginLeft: '8px', width: '32px', height: '32px', padding: 0, justifyContent: 'center'}} onClick={onOpenHistory}>\n            <History size={16} />\n          </button>`
  );
  if (!glass.includes('onOpenHistory')) {
    glass = glass.replace(/= \({ calc(.*?)}/g, '= ({ calc$1, onOpenHistory }');
  }
  if (!glass.includes('History')) {
    glass = glass.replace(/(import .*;\n)/, `$1import { History } from 'lucide-react';\n`);
  }
  fs.writeFileSync(glassPath, glass);
}

// 5. CyberpunkTheme
insertHistoryBtn(
  'CyberpunkTheme',
  `\n          <button className={styles.sciToggle} onClick={onOpenHistory} title="History">\n            <History size={14} />\n          </button>`,
  /(<button \s+className=\{\`\$\{styles\.sciToggle\}[\s\S]*?<\/button>)/,
);

// 6. AiTheme
insertHistoryBtn(
  'AiTheme',
  `\n          <button className={styles.sciToggle} onClick={onOpenHistory} title="History">\n            <History size={16} />\n          </button>`,
  /(<button \s+className=\{\`\$\{styles\.sciToggle\}[\s\S]*?<\/button>)/,
);

// 7. RetroTheme
insertHistoryBtn(
  'RetroTheme',
  `\n          <div \n            className={styles.switch}\n            onClick={onOpenHistory}\n            style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px'}}\n          >\n            <History size={14} color="#f0f0f0" />\n          </div>`,
  /(<div className=\{styles\.modeToggle\}>[\s\S]*?)(<\/div>)/,
);

console.log('Script 2 executed successfully!');
