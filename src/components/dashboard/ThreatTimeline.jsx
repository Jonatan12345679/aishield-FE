import { useEffect, useState } from 'react'
import { aiShieldApi } from '@/services/aiShieldApi'
import { useWebSocket } from '@/hooks/useWebSocket'
import '@/assets/styles/ThreatTimeline.css'

const REFRESH_INTERVAL_MS = 8000
const LIMIT = 15

function formatEntry(event) {
  const attackLabel =
    event.attack_type === 'none'
      ? 'ANOMALY DETECTED'
      : event.attack_type.replace('_', ' ').toUpperCase()

  return {
    id: event.id,
    time: new Date(event.timestamp).toLocaleTimeString('id-ID', { hour12: false }),
    title: attackLabel,
    desc: `${event.src_ip} → ${event.dst_ip}:${event.dst_port} · risk ${event.risk_level} · score ${
      event.anomaly_score?.toFixed(3) ?? '-'
    }`,
    type: event.risk_level === 'critical' || event.risk_level === 'high' ? 'threat' : 'info',
    risk: event.risk_level,
    isNew: false, // akan di-set true untuk entry paling baru
  }
}

export default function ThreatTimeline() {
  const [entries, setEntries] = useState(null)
  const [error, setError] = useState(null)
  const { lastMessage } = useWebSocket()

  function fetchTimeline(markNew = false) {
    aiShieldApi
      .getEvents({ page: 1, pageSize: LIMIT, anomalyOnly: true })
      .then((res) => {
        const formatted = res.events.map(formatEntry)
        // tandai entry paling baru sebagai "new" untuk animasi highlight
        if (markNew && formatted.length > 0) {
          formatted[0].isNew = true
        }
        setEntries(formatted)
        setError(null)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    fetchTimeline()
    const interval = setInterval(() => fetchTimeline(false), REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  // WebSocket trigger - refetch + tandai entry paling baru sebagai "new"
  useEffect(() => {
    if (!lastMessage || lastMessage.type !== 'new_events') return
    fetchTimeline(true)
  }, [lastMessage])

  return (
    <div className="timeline">
      <span className="timeline__corner timeline__corner--tl" />
      <span className="timeline__corner timeline__corner--tr" />
      <span className="timeline__corner timeline__corner--bl" />
      <span className="timeline__corner timeline__corner--br" />

      <div className="timeline__header">
        <div className="timeline__header-left">
          <span className="timeline__status-dot" />
          <span>THREAT.TIMELINE</span>
        </div>
        <div className="timeline__header-right">
          <span className="timeline__live-badge">
            <span className="timeline__live-pulse" />
            LIVE
          </span>
          <div className="timeline__window-controls">
            <span className="timeline__window-btn" />
            <span className="timeline__window-btn" />
            <span className="timeline__window-btn" />
          </div>
        </div>
      </div>

      <div className="timeline__columns">
        <span className="timeline__col timeline__col--time">TIME</span>
        <span className="timeline__col timeline__col--type">TYPE</span>
        <span className="timeline__col timeline__col--detail">DETAILS</span>
      </div>

      <div className="timeline__body">
        {error && (
          <div className="timeline__error">
            <span className="timeline__error-tag">[!] ERR</span>
            <p>Gagal narik timeline: <span className="error-msg">{error}</span></p>
          </div>
        )}

        {!error && !entries && (
          <div className="timeline__empty">
            <div className="timeline__loader">
              <span />
              <span />
              <span />
            </div>
            <span className="timeline__empty-text">FETCHING HISTORY...</span>
          </div>
        )}

        {!error && entries && entries.length === 0 && (
          <div className="timeline__empty">
            <span className="timeline__empty-icon">◇</span>
            <span className="timeline__empty-text">NO ANOMALY DETECTED</span>
            <span className="timeline__empty-sub">Timeline bersih dari ancaman</span>
          </div>
        )}

        {!error && entries && entries.length > 0 && (
          <div className="timeline__entries">
            {entries.map((entry, idx) => (
              <div
                key={entry.id}
                className={`timeline__entry timeline__entry--${entry.type} ${
                  entry.isNew ? 'timeline__entry--new' : ''
                } ${idx === 0 ? 'timeline__entry--first' : ''}`}
              >
                <div className="timeline__entry-line">
                  <span className="timeline__entry-dot" />
                </div>

                <div className="timeline__entry-content">
                  <div className="timeline__entry-head">
                    <span className="timeline__entry-time">{entry.time}</span>
                    <span className={`timeline__entry-badge timeline__entry-badge--${entry.type}`}>
                      {entry.type === 'threat' ? '⚠' : 'ℹ'}
                    </span>
                    <span className="timeline__entry-title">{entry.title}</span>
                    {entry.isNew && (
                      <span className="timeline__entry-new-tag">NEW</span>
                    )}
                  </div>
                  <p className="timeline__entry-desc">{entry.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="timeline__footer">
        <span>
          ENTRIES: <span className="timeline__footer-accent">{entries?.length ?? 0}</span> / {LIMIT}
        </span>
        <span>REFRESH: {REFRESH_INTERVAL_MS / 1000}s</span>
      </div>
    </div>
  )
}