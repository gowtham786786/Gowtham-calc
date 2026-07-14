import React from 'react';
import { HelpCircle, Mic, ArrowRight, X } from 'lucide-react';
import './VoiceHelperPanel.css';

interface VoiceHelperPanelProps {
  activeTheme: string;
  onClose: () => void;
}

const COMMAND_GROUPS = [
  {
    title: 'Basic Math',
    examples: [
      { text: 'five plus seven', result: '5 + 7' },
      { text: 'twenty divided by four', result: '20 ÷ 4' },
      { text: 'nine times six', result: '9 × 6' },
      { text: 'ten minus three', result: '10 - 3' }
    ]
  },
  {
    title: 'Advanced & Constants',
    examples: [
      { text: 'square root of sixteen', result: '√(16)' },
      { text: 'twenty percent of 250', result: '20% × 250' },
      { text: 'percentage of 250', result: '250%' },
      { text: 'three raised to the power of two', result: '3 ^ 2' },
      { text: 'pi times five', result: 'π × 5' }
    ]
  },
  {
    title: 'Controls & Stop',
    examples: [
      { text: 'clear', result: 'Resets display (AC)' },
      { text: 'delete', result: 'Backspace last character' },
      { text: 'equals / calculate', result: 'Evaluates math' },
      { text: 'stop / stop listening', result: 'Deactivates microphone' }
    ]
  }
];

export const VoiceHelperPanel: React.FC<VoiceHelperPanelProps> = ({ activeTheme, onClose }) => {
  return (
    <div className="voice-helper-backdrop" onClick={onClose}>
      <div 
        className={`voice-helper-theme-${activeTheme} voice-helper-panel`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="voice-helper-header">
          <HelpCircle size={20} className="voice-helper-header-icon" />
          <h3>Voice Assistant Guide</h3>
          <button 
            className="voice-helper-close-btn" 
            onClick={onClose} 
            aria-label="Close Guide"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="voice-helper-instruction">
          <Mic size={16} className="voice-helper-mic-indicator" />
          <span>Tap the microphone button and speak naturally. Use continuous pauses between words.</span>
        </div>

        <div className="voice-helper-groups">
          {COMMAND_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="voice-helper-group">
              <h4 className="voice-helper-group-title">{group.title}</h4>
              <ul className="voice-helper-list">
                {group.examples.map((ex, eIdx) => (
                  <li key={eIdx} className="voice-helper-item">
                    <div className="voice-helper-spoken">
                      <span className="voice-helper-quote">"</span>
                      <span className="voice-helper-text">{ex.text}</span>
                      <span className="voice-helper-quote">"</span>
                    </div>
                    <div className="voice-helper-mapping">
                      <ArrowRight size={12} className="voice-helper-arrow" />
                      <span className="voice-helper-result">{ex.result}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceHelperPanel;
