import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Loader2, AlertCircle, HelpCircle } from 'lucide-react';
import { parseSpeechToTokens } from '../utils/voiceAssistant';
import { VoiceHelperPanel } from './VoiceHelperPanel';
import './voiceAssistant.css';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface VoiceAssistantProps {
  activeTheme: string;
}

type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ activeTheme }) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSupported = typeof window !== 'undefined' && !!SpeechRecognition && !!window.speechSynthesis;

  const [state, setState] = useState<AssistantState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  
  useEffect(() => {
    const handleToggle = (e: any) => setIsHidden(e.detail);
    window.addEventListener('historyToggle', handleToggle);
    return () => window.removeEventListener('historyToggle', handleToggle);
  }, []);
  
  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef<boolean>(true);
  const accumulatedTranscriptRef = useRef<string>('');
  const currentSessionFinalRef = useRef<string>('');
  const stateRef = useRef<AssistantState>('idle');

  // Keep stateRef in sync with state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setState('listening');
      setErrorMsg('');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      currentSessionFinalRef.current = finalTranscript;

      const currentSessionText = (finalTranscript + interimTranscript).trim();
      const fullText = (accumulatedTranscriptRef.current + ' ' + currentSessionText).trim();
      setTranscript(fullText);

      // Check if a stop/calculate command is spoken
      const lowercaseTranscript = fullText.toLowerCase();
      if (
        /\b(equals|calculate|stop listening|stop)\b/.test(lowercaseTranscript)
      ) {
        isManuallyStoppedRef.current = true;
        recognition.stop();
        setState('processing');
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted') return; // ignore aborts
      
      let friendlyError = 'Speech error';
      if (event.error === 'no-speech') {
        friendlyError = 'No speech detected';
      } else if (event.error === 'audio-capture') {
        friendlyError = 'No microphone found';
      } else if (event.error === 'not-allowed') {
        friendlyError = 'Microphone permission denied';
      } else if (event.error === 'network') {
        friendlyError = 'Network error occurred';
      }

      setErrorMsg(friendlyError);
      setState('error');
      speak(friendlyError);
    };

    recognition.onend = () => {
      if (!isManuallyStoppedRef.current && (stateRef.current === 'listening' || stateRef.current === 'processing')) {
        // Append the current session's final results to the accumulator
        accumulatedTranscriptRef.current = (accumulatedTranscriptRef.current + ' ' + currentSessionFinalRef.current).trim();
        currentSessionFinalRef.current = ''; // reset for next session
        try {
          recognition.start();
        } catch (e) {
          console.error('Failed to auto-restart speech recognition:', e);
          setState('error');
          setErrorMsg('Microphone connection lost');
        }
      } else {
        setState(prev => {
          if (prev === 'listening') {
            return 'processing';
          }
          return prev;
        });
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported]);

  // Handle auto-reset error state after 1.5 seconds
  useEffect(() => {
    if (state === 'error') {
      const timer = setTimeout(() => {
        setState('idle');
        setErrorMsg('');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Execute commands when transitioning to processing state
  useEffect(() => {
    if (state !== 'processing') return;

    if (!transcript.trim()) {
      setState('idle');
      return;
    }

    const lowercaseTranscript = transcript.toLowerCase();
    if (/\b(stop listening|stop)\b/.test(lowercaseTranscript)) {
      accumulatedTranscriptRef.current = '';
      setState('idle');
      return;
    }

    const adapter = (window as any).__calc_adapters?.[activeTheme];
    if (!adapter) {
      console.warn(`No calculator adapter found for theme "${activeTheme}"`);
      setErrorMsg('Calculator connection error');
      setState('error');
      speak('Calculator connection error');
      return;
    }

    const parseResult = parseSpeechToTokens(transcript);

    const runCommands = async () => {
      if (parseResult.type === 'control') {
        if (parseResult.command === 'clear') {
          adapter.onClear();
          await delay(50);
          accumulatedTranscriptRef.current = '';
          speak('Calculator cleared');
        } else if (parseResult.command === 'backspace') {
          adapter.onBackspace();
          await delay(50);
          accumulatedTranscriptRef.current = '';
          setState('idle');
        } else if (parseResult.command === 'equals') {
          adapter.onEquals();
          await delay(50);
          const ans = adapter.getDisplayValue();
          accumulatedTranscriptRef.current = '';
          speak(`The answer is ${ans}`);
        }
      } else if (parseResult.type === 'math') {
        try {
          // Process the entire expression synchronously
          const ans = adapter.onSequence(parseResult.tokens);
          accumulatedTranscriptRef.current = '';
          
          if (ans === 'Error') {
            setErrorMsg('Invalid calculation');
            setState('error');
            speak('Invalid calculation');
          } else {
            speak(`The answer is ${ans}`);
          }
        } catch (err) {
          setErrorMsg('Calculation failed');
          setState('error');
          speak('Calculation failed');
        }
      } else if (parseResult.type === 'unknown') {
        accumulatedTranscriptRef.current = '';
        const msg = parseResult.reason || "I didn't understand that";
        setErrorMsg(msg);
        setState('error');
        speak(msg);
      }
    };

    runCommands();
  }, [state, transcript, activeTheme]);

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set speaking state synchronously to break processing loops immediately
    setState('speaking');

    utterance.onend = () => {
      setState('idle');
    };

    utterance.onerror = () => {
      setState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleMicClick = () => {
    if (!isSupported) return;

    if (state === 'listening') {
      isManuallyStoppedRef.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setState('processing');
    } else if (state === 'speaking') {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setState('idle');
    } else if (state === 'idle' || state === 'error') {
      isManuallyStoppedRef.current = false;
      accumulatedTranscriptRef.current = '';
      currentSessionFinalRef.current = '';
      setTranscript('');
      setErrorMsg('');
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      } catch (e) {
        console.error('Failed to start speech recognition:', e);
        setErrorMsg('Microphone start failed');
        setState('error');
      }
    }
  };

  const renderIcon = () => {
    switch (state) {
      case 'listening':
        return <Mic size={24} className="mic-icon animate-pulse" />;
      case 'processing':
        return <Loader2 size={24} className="mic-icon animate-spin" />;
      case 'speaking':
        return <Volume2 size={24} className="mic-icon" />;
      case 'error':
        return <AlertCircle size={24} className="mic-icon" />;
      case 'idle':
      default:
        return <Mic size={24} className="mic-icon" />;
    }
  };

  return (
    <div style={{ display: isHidden ? 'none' : 'block' }}>
      <div className={`voice-assistant-theme-${activeTheme} voice-assistant-overlay`}>
        <div className="voice-assistant-positioner">
          <div className="voice-assistant-container">
            <button
              className="voice-assistant-button"
              data-state={state}
              onClick={handleMicClick}
              disabled={!isSupported}
              title={isSupported ? "Tap to speak math command" : "Voice recognition not supported"}
              aria-label="Voice Assistant"
            >
              {renderIcon()}
            </button>
            
            <button
              className="voice-assistant-help-button"
              onClick={() => setShowGuide(true)}
              title="Voice Assistant Help Guide"
              aria-label="Voice Assistant Guide"
            >
              <HelpCircle size={18} />
            </button>

            <div className="voice-assistant-status-box">
              {isSupported ? (
                <>
                  {errorMsg && <span className="voice-assistant-error-text">{errorMsg}</span>}
                  {!errorMsg && transcript && (
                    <span className="voice-assistant-transcript-text">
                      {state === 'idle' || state === 'speaking' || state === 'error' || state === 'processing' 
                        ? `Heard: "${transcript}"` 
                        : transcript}
                    </span>
                  )}
                  {!errorMsg && !transcript && (
                    <span className="voice-assistant-hint-text">
                      {state === 'listening' ? 'Listening...' : 'Tap mic to speak'}
                    </span>
                  )}
                </>
              ) : (
                <span className="voice-assistant-unsupported-text">Voice control unsupported</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showGuide && (
        <VoiceHelperPanel activeTheme={activeTheme} onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
};
export default VoiceAssistant;
