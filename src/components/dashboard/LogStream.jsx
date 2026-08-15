import { useEffect, useState, useRef } from 'react'
import { api } from '../../lib/api'
import '@/assets/styles/LogStream.css'

const RISK_LABEL = {
  low: 'LOW',
  medium: 'MED',
  high: 'HIGH',
  critical: 'CRIT',
}

const RISK_COLORS = {
  low: '#4ade80',
  medium: '#facc15',
  high: '#fb923c',
  critical: '#ff5c8a',
}

const REFRESH_INTERVAL_MS = 5000

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('id-ID', { hour12: false })
}

export default function LogStream({ anomalyOnly = false, limit = 20 }) {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    function fetchEvents() {
      api
        .getEvents({ page: 1, pageSize: limit, anomalyOnly })
        .then((res) => {
          if (!cancelled) {
            setEvents(res.events)
            setLastRefresh(new Date())
            setError(null)
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err.message)
        })
    }

    fetchEvents()
    const interval = setInterval(fetchEvents, REFRESH_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [anomalyOnly, limit])

  return (
    <div className="log-stream">
      <span className="log-stream__corner log-stream__corner--tl" />
      <span className="log-stream__corner log-stream__corner--tr" />
      <span className="log-stream__corner log-stream__corner--bl" />
      <span className="log-stream__corner log-stream__corner--br" />

      <div className="log-stream__header">
        <div className="log-stream__header-left">
          <span className="log-stream__status-dot" />
          <span className="log-stream__title">LIVE.EVENT.LOG</span>
        </div>
        <div className="log-stream__header-right">
          <span className="log-stream__live-badge">
            <span className="log-stream__live-pulse" />
            LIVE
          </span>
          <div className="log-stream__window-controls">
            <span className="log-stream__window-btn" />
            <span className="log-stream__window-btn" />
            <span className="log-stream__window-btn" />
          </div>
        </div>
      </div>

      <div className="log-stream__columns">
        <span className="log-col log-col--time">TIME</span>
        <span className="log-col log-col--flow">SRC → DST</span>
        <span className="log-col log-col--attack">TYPE</span>
        <span className="log-col log-col--risk">RISK</span>
        <span className="log-col log-col--score">SCORE</span>
      </div>

      <div className="log-stream__body" ref={bodyRef}>
        {error && (
          <div className="log-stream__error">
            <span className="log-stream__error-tag">[!] FATAL</span>
            <p>Gagal narik data: <span className="error-msg">{error}</span></p>
          </div>
        )}

        {!error && !events && (
          <div className="log-stream__empty">
            <div className="log-stream__loader">
              <span />
              <span />
              <span />
            </div>
            <span className="log-stream__empty-text">CONNECTING TO LOG STREAM...</span>
          </div>
        )}

        {!error && events && events.length === 0 && (
          <div className="log-stream__empty">
            <span className="log-stream__empty-icon">◈</span>
            <span className="log-stream__empty-text">NO EVENTS RECORDED</span>
            <span className="log-stream__empty-sub">Monitoring aktif...</span>
          </div>
        )}

        {!error && events && events.length > 0 && (
          <>
            {events.map((e, idx) => (
              <div key={e.id} className={`log-row ${idx % 2 === 0 ? 'log-row--even' : ''}`}>
                <span className="log-col log-col--time log-row__time">
                  {formatTime(e.timestamp)}
                </span>
                <span className="log-col log-col--flow log-row__flow">
                  <span className="log-ip">{e.src_ip}</span>
                  <span className="log-arrow">→</span>
                  <span className="log-ip">{e.dst_ip}</span>
                  <span className="log-port">:{e.dst_port}</span>
                  <span className="log-protocol">[{e.protocol}]</span>
                </span>
                <span className="log-col log-col--attack log-row__attack">
                  {e.attack_type !== 'none' 
                    ? e.attack_type.replace(/_/g, ' ').toUpperCase() 
                    : <span className="log-none">—</span>
                  }
                </span>
                <span className="log-col log-col--risk">
                  <span 
                    className={`log-badge log-badge--${e.risk_level}`}
                    style={{ '--risk-color': RISK_COLORS[e.risk_level] }}
                  >
                    {RISK_LABEL[e.risk_level]}
                  </span>
                </span>
                <span className="log-col log-col--score log-row__score">
                  {e.anomaly_score != null ? e.anomaly_score.toFixed(3) : '—'}
                </span>
              </div>
            ))}
            <div className="log-row log-row--cursor">
              <span className="log-cursor">█</span>
            </div>  
          </>
        )}
      </div>

      <div className="log-stream__footer">
        <div className="log-stream__footer-left">
          <span className="log-stream__footer-item">
            MODE: {anomalyOnly ? 'ANOMALY ONLY' : 'ALL EVENTS'}
          </span>
          <span className="log-stream__footer-item">
            LIMIT: {limit}
          </span>
        </div>
        <div className="log-stream__footer-right">
          <span className="log-stream__footer-item">
            REFRESH: {REFRESH_INTERVAL_MS / 1000}s
          </span>
          {lastRefresh && (
            <span className="log-stream__footer-item log-stream__footer-item--accent">
              LAST: {formatTime(lastRefresh.toISOString())}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}