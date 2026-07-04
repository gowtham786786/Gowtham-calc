import React from 'react';
import type { HistoryEntry } from '../../hooks/useCalculator';
import styles from './WindowsHistory.module.css';
import { X, Trash2 } from 'lucide-react';

interface WindowsHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onClose: () => void;
  isVisible: boolean;
  onReuse: (result: string) => void;
}

const WindowsHistory: React.FC<WindowsHistoryProps> = ({ history, onClear, onClose, isVisible, onReuse }) => {
  return (
    <div className={`${styles.panel} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>History</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className={styles.iconBtn} onClick={onClear} disabled={history.length === 0}>
            <Trash2 size={16} />
          </button>
          <button className={styles.iconBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        {history.length === 0 ? (
          <div className={styles.empty}>No calculations yet in this theme</div>
        ) : (
          history.map((item, i) => (
            <div key={item.id || i} className={styles.historyItem} onClick={() => { onReuse(item.result); onClose(); }}>
              <div className={styles.equation}>{item.equation}</div>
              <div className={styles.result}>{item.result}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WindowsHistory;