import React from 'react';
import type { HistoryEntry } from '../../hooks/useCalculator';
import styles from './AppleHistory.module.css';
import { X, Trash2 } from 'lucide-react';

interface AppleHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onClose: () => void;
  isVisible: boolean;
  onReuse: (result: string) => void;
}

const AppleHistory: React.FC<AppleHistoryProps> = ({ history, onClear, onClose, isVisible, onReuse }) => {
  return (
    <div className={`${styles.sheetOverlay} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <button className={styles.iconBtn} onClick={onClose}>
            <X size={20} />
          </button>
          <span className={styles.title}>History</span>
          <button className={styles.iconBtn} onClick={onClear} disabled={history.length === 0}>
            <Trash2 size={20} />
          </button>
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
    </div>
  );
};

export default AppleHistory;
