import React from 'react';
import type { HistoryEntry } from '../../hooks/useCalculator';
import styles from './CyberpunkHistory.module.css';
import { X, Trash2 } from 'lucide-react';

interface CyberpunkHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onClose: () => void;
  isVisible: boolean;
  onReuse: (result: string) => void;
}

const CyberpunkHistory: React.FC<CyberpunkHistoryProps> = ({ history, onClear, onClose, isVisible, onReuse }) => {
  return (
    <div className={`${styles.panel} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.header}>
        <button className={styles.iconBtn} onClick={onClose}>
          <X size={18} />
        </button>
        <span className={styles.title}>SYS.HISTORY</span>
        <button className={styles.iconBtn} onClick={onClear} disabled={history.length === 0}>
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className={styles.content}>
        {history.length === 0 ? (
          <div className={styles.empty}>[NO_DATA_FOUND]</div>
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

export default CyberpunkHistory;