import React from 'react';
import type { HistoryEntry } from '../../hooks/useCalculator';
import styles from './VSCodeHistory.module.css';
import { X, Trash2 } from 'lucide-react';

interface VSCodeHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const VSCodeHistory: React.FC<VSCodeHistoryProps> = ({ history, onClear, onClose, isVisible }) => {
  return (
    <div className={`${styles.panel} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>EXPLORER: HISTORY</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className={styles.iconBtn} onClick={onClear} disabled={history.length === 0} title="Clear All">
            <Trash2 size={14} />
          </button>
          <button className={styles.iconBtn} onClick={onClose} title="Close">
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        {history.length === 0 ? (
          <div className={styles.empty}>No history found.</div>
        ) : (
          history.map((item, i) => (
            <div key={i} className={styles.historyItem}>
              <div className={styles.equation}>// {item.equation}</div>
              <div className={styles.result}>{item.result}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VSCodeHistory;