import React, { useEffect } from 'react';
import type { HistoryEntry } from '../../hooks/useCalculator';
import styles from './AiHistory.module.css';
import { X, Trash2, BrainCircuit } from 'lucide-react';

interface AiHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onClose: () => void;
  isVisible: boolean;
  onReuse: (result: string) => void;
}

const AiHistory: React.FC<AiHistoryProps> = ({ history, onClear, onClose, isVisible, onReuse }) => {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('historyToggle', { detail: isVisible }));
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (isVisible) {
        window.dispatchEvent(new CustomEvent('historyToggle', { detail: false }));
      }
    };
  }, [isVisible]);

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} onClick={onClose}>
      <div className={`${styles.panel} ${isVisible ? styles.visible : ''}`} onClick={(e) => e.stopPropagation()}>
      
      <div className={styles.header}>
        <span className={styles.title}>History</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={styles.iconBtn} onClick={onClear} disabled={history.length === 0} title="Clear History" aria-label="Clear History">
            <Trash2 size={18} />
          </button>
          <button className={styles.iconBtn} onClick={onClose} title="Close" aria-label="Close">
            <X size={18} />
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
    </div>
  );};

export default AiHistory;