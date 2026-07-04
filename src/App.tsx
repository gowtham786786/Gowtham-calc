import { useState, useEffect } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { useSettings } from './hooks/useSettings';
import ThemeSwitcher from './components/ThemeSwitcher';
import SettingsPanel from './components/SettingsPanel';
import HistoryPanel from './components/HistoryPanel';
// Theme imports (we will build these next)
import AppleTheme from './themes/AppleTheme/AppleTheme';
import GlassTheme from './themes/GlassmorphismTheme/GlassTheme';
import VSCodeTheme from './themes/VSCodeTheme/VSCodeTheme';
import WindowsTheme from './themes/WindowsTheme/WindowsTheme';
import CyberpunkTheme from './themes/CyberpunkTheme/CyberpunkTheme';
import AiTheme from './themes/AiTheme/AiTheme';
import RetroTheme from './themes/RetroTheme/RetroTheme';

import './index.css';

export interface ThemeProps {
  settings: ReturnType<typeof useSettings>;
  }

function App() {
  const settings = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const globalCalc = useCalculator('global');
  // Audio utility
  useEffect(() => {
    if (!settings.soundEnabled) return;
    const playSound = (e: KeyboardEvent | MouseEvent) => {
      // Only play sound on calculator buttons or valid keys
      if (e.type === 'keydown' && !/^[0-9.+\-*/%=]|Enter|Backspace|Escape$/.test((e as KeyboardEvent).key)) {
        return;
      }
      
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (err) {
        // Ignore audio errors (e.g. autoplay policies)
      }
    };

    window.addEventListener('keydown', playSound);
    // Note: click sounds are handled in components for precision, or globally via a capturing listener on buttons
    const handleMouseClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'BUTTON') {
        playSound(e);
      }
    };
    window.addEventListener('click', handleMouseClick, true);

    return () => {
      window.removeEventListener('keydown', playSound);
      window.removeEventListener('click', handleMouseClick, true);
    };
  }, [settings.soundEnabled]);

return (
    <div className="app-container">
      <ThemeSwitcher 
        activeTheme={settings.activeTheme} 
        onSelectTheme={settings.changeTheme} 
        onOpenSettings={() => setShowSettings(true)}
        onOpenHistory={() => setShowHistory(true)}
      />

      <div className="theme-container">
        <ThemeWrapper currentTheme="apple" activeTheme={settings.activeTheme}>
          <AppleTheme settings={settings} />
        </ThemeWrapper>
        
        <ThemeWrapper currentTheme="glass" activeTheme={settings.activeTheme}>
          <GlassTheme settings={settings} />
        </ThemeWrapper>

        <ThemeWrapper currentTheme="vscode" activeTheme={settings.activeTheme}>
          <VSCodeTheme settings={settings} />
        </ThemeWrapper>

        <ThemeWrapper currentTheme="windows" activeTheme={settings.activeTheme}>
          <WindowsTheme settings={settings} />
        </ThemeWrapper>

        <ThemeWrapper currentTheme="cyberpunk" activeTheme={settings.activeTheme}>
          <CyberpunkTheme settings={settings} />
        </ThemeWrapper>

        <ThemeWrapper currentTheme="ai" activeTheme={settings.activeTheme}>
          <AiTheme settings={settings} />
        </ThemeWrapper>

        <ThemeWrapper currentTheme="retro" activeTheme={settings.activeTheme}>
          <RetroTheme settings={settings} />
        </ThemeWrapper>
      </div>

      {showSettings && (
        <SettingsPanel 
          settings={settings} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      {showHistory && (
        <HistoryPanel 
          history={globalCalc.history}
          onClear={globalCalc.clearHistory}
          onClose={() => setShowHistory(false)} 
        />
      )}

    </div>
  );
}

// A wrapper component that delays unmounting to allow for CSS transitions.
// It ensures that only ONE theme is in the DOM (when stable), but temporarily mounts two during the 300ms transition.
// The prompt says "Only ONE ... is mounted in the DOM at any time."
// If I strictly mount exactly 1, there is NO DOM crossfade possible because the old component is instantly removed.
// I'll try to unmount strictly: if not active, return null. The fade-in will still work.
function ThemeWrapper({ children, currentTheme, activeTheme }: { children: React.ReactNode, currentTheme: string, activeTheme: string }) {
  const [shouldRender, setRender] = useState(activeTheme === currentTheme);
  const [isVisible, setIsVisible] = useState(activeTheme === currentTheme);

  useEffect(() => {
    if (activeTheme === currentTheme) {
      setRender(true);
      // Small delay to allow the DOM to mount before triggering fade-in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    } else {
      setIsVisible(false);
      // Wait for fade out to complete before unmounting
      const timer = setTimeout(() => setRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [activeTheme, currentTheme]);

  return (
    <div 
      className={`theme-wrapper ${isVisible ? 'active' : ''}`} 
      style={{ display: shouldRender ? 'block' : 'none' }}
    >
      {children}
    </div>
  );
}

export default App;
