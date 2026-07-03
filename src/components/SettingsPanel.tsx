import React from 'react';
import { X, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import styles from './Panel.module.css';

interface SettingsPanelProps {
  settings: ReturnType<typeof useSettings>;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Settings</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close">
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingName}>Theme Mode</span>
              <span className={styles.settingDesc}>Switch between Light and Dark</span>
            </div>
            <button 
              onClick={settings.toggleDarkMode} 
              className={styles.toggleBtn}
              aria-label="Toggle Dark Mode"
            >
              {settings.isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingName}>Sound Effects</span>
              <span className={styles.settingDesc}>Button click sounds</span>
            </div>
            <button 
              onClick={settings.toggleSound} 
              className={styles.toggleBtn}
              aria-label="Toggle Sound"
            >
              {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>

          {/* Decimal precision setting */}
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingName}>Decimal Precision</span>
              <span className={styles.settingDesc}>Max digits after decimal</span>
            </div>
            <select 
              className={styles.selectInput}
              value={settings.decimalPrecision}
              onChange={(e) => settings.changePrecision(Number(e.target.value))}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
