import React from 'react';
import type { HistoryEntry } from '../../hooks/useCalculator';
import styles from './GlassHistory.module.css';
import { X, Trash2 } from 'lucide-react';

interface GlassHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const GlassHistory: React.FC<GlassHistoryProps> = ({ history, onClear, onClose, isVisible }) => {
  return (
    <div className={`${styles.panel} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.header}>
        <button className={styles.iconBtn} onClick={onClose}>
          <X size={18} />
        </button>
        <span className={styles.title}>History</span>
        <button className={styles.iconBtn} onClick={onClear} disabled={history.length === 0}>
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className={styles.content}>
        {history.length === 0 ? (
          <div className={styles.empty}>No History</div>
        ) : (
          history.map((item, i) => (
            <div key={i} className={styles.historyItem}>
              <div className={styles.equation}>{item.equation}</div>
              <div className={styles.result}>{item.result}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GlassHistory;