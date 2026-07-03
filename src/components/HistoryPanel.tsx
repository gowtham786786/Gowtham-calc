import React from 'react';
import { X, Trash2 } from 'lucide-react';
import type { HistoryEntry } from '../hooks/useCalculator';
import styles from './Panel.module.css';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClear: () => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>History</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close">
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.content}>
          {history.length === 0 ? (
            <div className={styles.emptyState}>No history yet.</div>
          ) : (
            <div className={styles.historyList}>
              {history.map((entry, idx) => (
                <div key={idx} className={styles.historyItem}>
                  <div className={styles.historyEquation}>{entry.equation}</div>
                  <div className={styles.historyResult}>{entry.result}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className={styles.footer}>
            <button onClick={onClear} className={styles.clearBtn}>
              <Trash2 size={18} />
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
