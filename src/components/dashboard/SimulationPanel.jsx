import { useState } from 'react'
import { Zap, Search, KeyRound, Activity, FileUp } from 'lucide-react'
import { aiShieldApi } from '@/services/aiShieldApi'
import '@/assets/styles/SimulationPanel.css'

const ATTACK_BUTTONS = [
  { type: 'normal', label: 'Normal Traffic', tone: 'green', icon: Activity },
  { type: 'port_scan', label: 'Port Scan', tone: 'cyan', icon: Search },
  { type: 'brute_force', label: 'Brute Force', tone: 'yellow', icon: KeyRound },
  { type: 'ddos', label: 'DDoS', tone: 'rose', icon: Zap },
  { type: 'data_exfiltration', label: 'Data Exfil', tone: 'purple', icon: FileUp },
]

export default function SimulationPanel( {onResult}) {
  const [runningType, setRunningType] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleTrigger(attackType) {
    if (runningType) return // cegah spam klik pas masih ada simulasi jalan

    setRunningType(attackType)
    setError(null)
    setLastResult(null)

    try {
      const result = await aiShieldApi.triggerSimulation(attackType)
      setLastResult(result)
      onResult?.(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setRunningType(null)
    }
  }

  const isAnyRunning = runningType !== null

  return (
    <div className={`sim-panel ${isAnyRunning ? 'sim-panel--running' : ''}`}>
      <span className="sim-panel__corner sim-panel__corner--tl" />
      <span className="sim-panel__corner sim-panel__corner--tr" />
      <span className="sim-panel__corner sim-panel__corner--bl" />
      <span className="sim-panel__corner sim-panel__corner--br" />

      <div className="sim-panel__header">
        <div className="sim-panel__header-left">
          <span className="sim-panel__status-dot" />
          <span>SIMULATION.PANEL</span>
        </div>
        <div className="sim-panel__window-controls">
          <span className="sim-panel__window-btn" />
          <span className="sim-panel__window-btn" />
          <span className="sim-panel__window-btn" />
        </div>
      </div>

      <div className="sim-panel__desc">
        <span className="sim-panel__desc-prefix">&gt;</span>
        Trigger simulated network traffic to test AI anomaly detection
      </div>

      <div className="sim-panel__buttons">
        {ATTACK_BUTTONS.map((btn) => {
          const Icon = btn.icon
          const isThisRunning = runningType === btn.type
          return (
            <button
              key={btn.type}
              className={`sim-btn sim-btn--${btn.tone} ${
                isThisRunning ? 'sim-btn--running' : ''
              }`}
              onClick={() => handleTrigger(btn.type)}
              disabled={isAnyRunning}
            >
              {isThisRunning ? (
                <>
                  <div className="sim-btn__loader">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span>RUNNING...</span>
                </>
              ) : (
                <>
                  <Icon size={14} />
                  <span>{btn.label}</span>
                </>
              )}
            </button>
          )
        })}
      </div>

      <div className="sim-panel__console">
        <div className="sim-panel__console-header">
          <span>[CONSOLE.OUT]</span>
          <span className="sim-panel__console-indicator">●</span>
        </div>
        <div className="sim-panel__console-body">
          {error && (
            <div className="sim-panel__console-error">
              <span className="sim-panel__console-prefix">&gt;</span>
              <span>[FATAL]</span>
              <span className="sim-panel__console-msg">
                Trigger failed: {error}
              </span>
            </div>
          )}

          {!error && lastResult && (
            <>
              <div className="sim-panel__console-line">
                <span className="sim-panel__console-prefix">&gt;</span>
                <span className="sim-panel__console-key">TYPE</span>
                <span className="sim-panel__console-val">
                  {lastResult.attack_type?.toUpperCase()}
                </span>
              </div>
              <div className="sim-panel__console-line">
                <span className="sim-panel__console-prefix">&gt;</span>
                <span className="sim-panel__console-key">GENERATED</span>
                <span className="sim-panel__console-val">
                  {lastResult.total_generated} events
                </span>
              </div>
              <div className="sim-panel__console-line">
                <span className="sim-panel__console-prefix">&gt;</span>
                <span className="sim-panel__console-key">DETECTED</span>
                <span className="sim-panel__console-val sim-panel__console-val--highlight">
                  {lastResult.anomalies_detected} anomalies
                </span>
              </div>
              <div className="sim-panel__console-line">
                <span className="sim-panel__console-prefix">&gt;</span>
                <span className="sim-panel__console-key">DURATION</span>
                <span className="sim-panel__console-val">
                  {lastResult.duration_sec}s
                </span>
              </div>
              <div className="sim-panel__console-line sim-panel__console-line--success">
                <span className="sim-panel__console-prefix">&gt;</span>
                <span>SIMULATION COMPLETE ✓</span>
              </div>
            </>
          )}

          {!error && !lastResult && !isAnyRunning && (
            <div className="sim-panel__console-idle">
              <span className="sim-panel__console-prefix">&gt;</span>
                  Awaiting command...
              <span className="sim-panel__console-cursor">_</span>
            </div>
          )}

          {isAnyRunning && (
            <div className="sim-panel__console-line">
              <span className="sim-panel__console-prefix">&gt;</span>
              <span>Executing {runningType.replace('_', ' ')} simulation</span>
              <span className="sim-panel__console-dots">...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}