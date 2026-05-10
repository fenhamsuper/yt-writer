import React, { useState, useEffect, useRef } from 'react';
import { MODES, getModeById } from './utils/modes';
import { useGenerate } from './hooks/useGenerate';
import './App.css';

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">▶</span>
          <span className="logo-text">SCRIPT<span className="logo-accent">FORGE</span></span>
        </div>
        <p className="header-tagline">AI-Powered YouTube Script Generator</p>
      </div>
      <div className="header-glow" />
    </header>
  );
}

// ─── Mode Selector ────────────────────────────────────────────────────────────
function ModeSelector({ selectedMode, onSelect }) {
  return (
    <nav className="mode-selector" aria-label="Content type">
      {MODES.map((mode) => {
        const isActive = selectedMode === mode.id;
        return (
          <button
            key={mode.id}
            className={`mode-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(mode.id)}
            style={{
              '--mode-color': mode.color,
              '--mode-dim': mode.dimColor,
            }}
            aria-pressed={isActive}
          >
            <span className="mode-btn-icon">{mode.icon}</span>
            <span className="mode-btn-label">{mode.shortLabel}</span>
            {isActive && <span className="mode-btn-dot" />}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────
function GeneratorForm({ mode, onSubmit, isLoading, isStreaming, onAbort }) {
  const modeConfig = getModeById(mode);
  const [formData, setFormData] = useState({
    topic: '',
    tone: '',
    length: '',
    keywords: '',
    targetAudience: '',
    additionalContext: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const topicRef = useRef(null);

  // Focus topic on mode change
  useEffect(() => {
    topicRef.current?.focus();
  }, [mode]);

  // Reset form on mode change
  useEffect(() => {
    setFormData(prev => ({ ...prev, tone: '', length: '' }));
  }, [mode]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.topic.trim() || isStreaming) return;
    onSubmit({ mode, ...formData });
  };

  return (
    <form className="generator-form" onSubmit={handleSubmit}>
      {/* Mode Info Banner */}
      <div
        className="mode-banner"
        style={{
          '--mode-color': modeConfig.color,
          '--mode-dim': modeConfig.dimColor,
        }}
      >
        <span className="mode-banner-icon">{modeConfig.icon}</span>
        <div>
          <div className="mode-banner-title">{modeConfig.label}</div>
          <div className="mode-banner-desc">{modeConfig.description}</div>
        </div>
      </div>

      {/* Topic */}
      <div className="field">
        <label className="field-label" htmlFor="topic">
          Topic <span className="required">*</span>
        </label>
        <textarea
          id="topic"
          ref={topicRef}
          className="field-textarea"
          placeholder={modeConfig.placeholder}
          value={formData.topic}
          onChange={handleChange('topic')}
          rows={3}
          required
          maxLength={500}
          disabled={isStreaming}
        />
        <div className="field-count">{formData.topic.length}/500</div>
      </div>

      {/* Tone & Length Row */}
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="tone">Tone / Style</label>
          <select
            id="tone"
            className="field-select"
            value={formData.tone}
            onChange={handleChange('tone')}
            disabled={isStreaming}
          >
            <option value="">— Select tone —</option>
            {modeConfig.toneOptions.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="length">Length</label>
          <select
            id="length"
            className="field-select"
            value={formData.length}
            onChange={handleChange('length')}
            disabled={isStreaming}
          >
            <option value="">— Select length —</option>
            {modeConfig.lengthOptions.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        className="advanced-toggle"
        onClick={() => setShowAdvanced(v => !v)}
      >
        <span className={`toggle-arrow ${showAdvanced ? 'open' : ''}`}>›</span>
        Advanced Options
      </button>

      {showAdvanced && (
        <div className="advanced-fields">
          <div className="field">
            <label className="field-label" htmlFor="keywords">Keywords to Include</label>
            <input
              id="keywords"
              type="text"
              className="field-input"
              placeholder="comma separated, e.g. AI, future, technology"
              value={formData.keywords}
              onChange={handleChange('keywords')}
              disabled={isStreaming}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="targetAudience">Target Audience</label>
            <input
              id="targetAudience"
              type="text"
              className="field-input"
              placeholder="e.g. beginners, horror fans, entrepreneurs aged 25-40"
              value={formData.targetAudience}
              onChange={handleChange('targetAudience')}
              disabled={isStreaming}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="additionalContext">Additional Context</label>
            <textarea
              id="additionalContext"
              className="field-textarea"
              placeholder="Any extra details, references, or style notes..."
              value={formData.additionalContext}
              onChange={handleChange('additionalContext')}
              rows={2}
              disabled={isStreaming}
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="form-actions">
        {isStreaming ? (
          <button
            type="button"
            className="btn-abort"
            onClick={onAbort}
          >
            <span className="btn-icon">■</span>
            Stop Generating
          </button>
        ) : (
          <button
            type="submit"
            className="btn-generate"
            disabled={!formData.topic.trim() || isLoading}
            style={{ '--mode-color': modeConfig.color }}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Connecting...
              </>
            ) : (
              <>
                <span className="btn-icon">⚡</span>
                Generate {modeConfig.shortLabel} Script
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

// ─── Output Panel ─────────────────────────────────────────────────────────────
function OutputPanel({ content, error, isStreaming, mode, onReset }) {
  const modeConfig = getModeById(mode);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);

  // Auto-scroll during streaming
  useEffect(() => {
    if (isStreaming && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [content, isStreaming]);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scriptforge-${mode}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = content ? content.length : 0;

  if (error) {
    return (
      <div className="output-panel">
        <div className="output-error">
          <span className="error-icon">⚠</span>
          <div>
            <div className="error-title">Generation Failed</div>
            <div className="error-msg">{error}</div>
          </div>
          <button className="btn-retry" onClick={onReset}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="output-panel output-empty">
        <div
          className="empty-state"
          style={{ '--mode-color': modeConfig.color }}
        >
          <div className="empty-icon">{modeConfig.icon}</div>
          <div className="empty-title">Your script will appear here</div>
          <div className="empty-subtitle">
            Configure your options and hit Generate to create your {modeConfig.label.toLowerCase()}
          </div>
          <div className="empty-features">
            <span>✓ Real-time streaming</span>
            <span>✓ Copy to clipboard</span>
            <span>✓ Download as .txt</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="output-panel">
      {/* Output Header */}
      <div className="output-header">
        <div className="output-meta">
          <span
            className="output-mode-tag"
            style={{
              '--mode-color': modeConfig.color,
              '--mode-dim': modeConfig.dimColor,
            }}
          >
            {modeConfig.icon} {modeConfig.shortLabel}
          </span>
          <span className="output-stats">
            {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
          </span>
          {isStreaming && (
            <span className="streaming-indicator">
              <span className="streaming-dot" />
              Generating...
            </span>
          )}
        </div>
        <div className="output-actions">
          <button
            className="btn-icon-action"
            onClick={handleCopy}
            title="Copy to clipboard"
            disabled={isStreaming}
          >
            {copied ? '✓ Copied' : '⎘ Copy'}
          </button>
          <button
            className="btn-icon-action"
            onClick={handleDownload}
            title="Download as .txt"
            disabled={isStreaming}
          >
            ↓ Download
          </button>
          <button
            className="btn-icon-action btn-reset"
            onClick={onReset}
            title="Clear and start over"
          >
            ⟳ New
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="output-content" ref={outputRef}>
        <pre className="output-text">
          {content}
          {isStreaming && <span className="cursor-blink">▌</span>}
        </pre>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <p>ScriptForge · Powered by Claude AI · Built for YouTube Creators</p>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedMode, setSelectedMode] = useState('horror');
  const { generate, abort, reset, isLoading, isStreaming, content, error } = useGenerate();

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    reset();
  };

  return (
    <div className="app">
      <Header />

      <main className="main">
        <ModeSelector selectedMode={selectedMode} onSelect={handleModeSelect} />

        <div className="workspace">
          <div className="workspace-left">
            <GeneratorForm
              mode={selectedMode}
              onSubmit={generate}
              isLoading={isLoading}
              isStreaming={isStreaming}
              onAbort={abort}
            />
          </div>

          <div className="workspace-right">
            <OutputPanel
              content={content}
              error={error}
              isStreaming={isStreaming}
              mode={selectedMode}
              onReset={reset}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
