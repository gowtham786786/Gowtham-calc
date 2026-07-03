import React from 'react';
import type { HistoryEntry } from '../../hooks/useCalculator';
import styles from './AiHistory.module.css';
import { X, Trash2, BrainCircuit } from 'lucide-react';

interface AiHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const AiHistory: React.FC<AiHistoryProps> = ({ history, onClear, onClose, isVisible }) => {
  return (
    <div className={`${styles.panel} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}><BrainCircuit size={16} color="#a5b4fc" /> Memory Core</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={styles.iconBtn} onClick={onClear} disabled={history.length === 0}>
            <Trash2 size={14} />
          </button>
          <button className={styles.iconBtn} onClick={onClose}>
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        {history.length === 0 ? (
          <div className={styles.empty}>Neural pathways clear</div>
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

export default AiHistory;