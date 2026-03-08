'use client';

import React, { useState, useEffect } from 'react';
import { Accessibility, X, Type, Contrast, Sun, MousePointer2, RefreshCcw, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

type AccSettings = {
  fontSize: number;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  stopAnimations: boolean;
  readableFont: boolean;
};

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccSettings>({
    fontSize: 100,
    highContrast: false,
    grayscale: false,
    highlightLinks: false,
    stopAnimations: false,
    readableFont: false,
  });

  const toggleSetting = (key: keyof AccSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFontSize = (delta: number) => {
    setSettings(prev => ({ ...prev, fontSize: Math.min(Math.max(prev.fontSize + delta, 80), 150) }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      highContrast: false,
      grayscale: false,
      highlightLinks: false,
      stopAnimations: false,
      readableFont: false,
    });
  };

  useEffect(() => {
    const body = document.body;
    
    // Apply classes based on settings
    body.classList.toggle('acc-high-contrast', settings.highContrast);
    body.classList.toggle('acc-grayscale', settings.grayscale);
    body.classList.toggle('acc-highlight-links', settings.highlightLinks);
    body.classList.toggle('acc-stop-animations', settings.stopAnimations);
    body.classList.toggle('acc-readable-font', settings.readableFont);
    
    body.style.fontSize = settings.fontSize !== 100 ? `${settings.fontSize}%` : '';

    return () => {
      body.classList.remove('acc-high-contrast', 'acc-grayscale', 'acc-highlight-links', 'acc-stop-animations', 'acc-readable-font');
      body.style.fontSize = '';
    };
  }, [settings]);

  return (
    <div className="fixed bottom-6 left-6 z-[200]">
      {/* Trigger Button - Smaller size */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-12 w-12 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110",
          isOpen ? "bg-foreground text-white" : "bg-primary text-white"
        )}
        style={{ fontStyle: 'normal' }}
        aria-label="Accessibility Menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Accessibility className="h-6 w-6" />}
      </button>

      {/* Accessibility Menu */}
      {isOpen && (
        <div className="absolute bottom-14 left-0 w-64 md:w-72 glass-card rounded-[28px] p-5 shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-300">
          <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-3">
            <h2 className="text-lg font-black tracking-tighter text-primary flex items-center gap-2" style={{ fontStyle: 'normal' }}>
              <Eye className="h-4 w-4" /> Accessibility
            </h2>
            <button onClick={resetSettings} className="p-1.5 hover:bg-black/5 rounded-full text-muted-foreground transition-colors" title="Reset Settings">
              <RefreshCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/5">
              <span className="text-[10px] font-bold tracking-tight" style={{ fontStyle: 'normal' }}>Font Size</span>
              <div className="flex gap-1.5">
                <button onClick={() => updateFontSize(-10)} className="h-7 w-7 rounded-full bg-white shadow-sm flex items-center justify-center font-black" style={{ fontStyle: 'normal' }}>-</button>
                <button onClick={() => updateFontSize(10)} className="h-7 w-7 rounded-full bg-white shadow-sm flex items-center justify-center font-black" style={{ fontStyle: 'normal' }}>+</button>
              </div>
            </div>

            <button 
              onClick={() => toggleSetting('highContrast')}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-[9px] tracking-widest text-left",
                settings.highContrast ? "bg-primary text-white shadow-lg" : "bg-white hover:bg-black/5 border border-black/5"
              )}
              style={{ fontStyle: 'normal' }}
            >
              <Contrast className="h-3.5 w-3.5 shrink-0" /> High Contrast
            </button>

            <button 
              onClick={() => toggleSetting('grayscale')}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-[9px] tracking-widest text-left",
                settings.grayscale ? "bg-primary text-white shadow-lg" : "bg-white hover:bg-black/5 border border-black/5"
              )}
              style={{ fontStyle: 'normal' }}
            >
              <Sun className="h-3.5 w-3.5 shrink-0" /> Black & White
            </button>

            <button 
              onClick={() => toggleSetting('highlightLinks')}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-[9px] tracking-widest text-left",
                settings.highlightLinks ? "bg-primary text-white shadow-lg" : "bg-white hover:bg-black/5 border border-black/5"
              )}
              style={{ fontStyle: 'normal' }}
            >
              <MousePointer2 className="h-3.5 w-3.5 shrink-0" /> Highlight Links
            </button>

            <button 
              onClick={() => toggleSetting('stopAnimations')}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-[9px] tracking-widest text-left",
                settings.stopAnimations ? "bg-primary text-white shadow-lg" : "bg-white hover:bg-black/5 border border-black/5"
              )}
              style={{ fontStyle: 'normal' }}
            >
              <RefreshCcw className="h-3.5 w-3.5 shrink-0" /> Stop Animations
            </button>

            <button 
              onClick={() => toggleSetting('readableFont')}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-[9px] tracking-widest text-left",
                settings.readableFont ? "bg-primary text-white shadow-lg" : "bg-white hover:bg-black/5 border border-black/5"
              )}
              style={{ fontStyle: 'normal' }}
            >
              <Type className="h-3.5 w-3.5 shrink-0" /> Readable Font
            </button>
          </div>
          
          <p className="mt-3 text-[8px] text-center text-muted-foreground font-medium opacity-60" style={{ fontStyle: 'normal' }}>
            Site compliant with WCAG 2.1 AA standards
          </p>
        </div>
      )}
    </div>
  );
}