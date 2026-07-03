import React from 'react';
import { 
  Smartphone, 
  Layers, 
  Code2, 
  LayoutGrid, 
  Zap, 
  Sparkles, 
  Calculator,
  Settings,
  History
} from 'lucide-react';
import type { ThemeId } from '../hooks/useSettings';
import styles from './ThemeSwitcher.module.css';

interface ThemeSwitcherProps {
  activeTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
}

const THEMES: { id: ThemeId; label: string; icon: React.ElementType }[] = [
  { id: 'apple', label: 'Apple', icon: Smartphone },
  { id: 'glass', label: 'Glass', icon: Layers },
  { id: 'vscode', label: 'VS Code', icon: Code2 },
  { id: 'windows', label: 'Windows', icon: LayoutGrid },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: Zap },
  { id: 'ai', label: 'AI Smart', icon: Sparkles },
  { id: 'retro', label: 'Retro', icon: Calculator },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  activeTheme, 
  onSelectTheme,
  onOpenSettings,
  onOpenHistory
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.topActions}>
        <button onClick={onOpenHistory} className={styles.actionBtn} aria-label="History">
          <History size={20} />
        </button>
        <div className={styles.themeScroll}>
          {THEMES.map(theme => {
            const Icon = theme.icon;
            const isActive = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`${styles.themeCard} ${isActive ? styles.active : ''}`}
                title={theme.label}
              >
                <div className={`${styles.iconWrapper} ${styles[`icon-${theme.id}`]}`}>
                  <Icon size={20} />
                </div>
                <span className={styles.label}>{theme.label}</span>
              </button>
            );
          })}
        </div>
        <button onClick={onOpenSettings} className={styles.actionBtn} aria-label="Settings">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
