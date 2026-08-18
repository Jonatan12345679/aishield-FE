import { useCallback, useEffect, useState } from 'react'
import { ShieldBan, ShieldCheck } from 'lucide-react'
import { aiShieldApi } from '@/services/aiShieldApi'
import { useWebSocket } from '@/hooks/useWebSocket'
import '@/assets/styles/TopAttackers.css'

export default function TopAttackers() {
  const [attackers, setAttackers] = useState(null)
  const [error, setError] = useState(null)
  const [busyIp, setBusyIp] = useState(null)
  const { lastMessage } = useWebSocket()

  const fetchData = useCallback(() => {
    aiShieldApi
      .getTopAttackers()
      .then((res) => {
        setAttackers(res.attackers)
        setError(null)
      })
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 8000)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (lastMessage?.type === 'new_events') fetchData()
  }, [lastMessage, fetchData])

  async function toggleBlock(ip, isBlocked) {
    setBusyIp(ip)
    try {
      if (isBlocked) await aiShieldApi.unblockIp(ip)
      else await aiShieldApi.blockIp(ip)
      fetchData()
    } catch {
      // biarkan polling yang recover
    } finally {
      setBusyIp(null)
    }
  }

  const max = attackers?.length ? attackers[0].count : 1
  const blockedCount = attackers?.filter((a) => a.is_blocked).length ?? 0

  return (
    <div className="top-attackers">
      <span className="top-attackers__corner top-attackers__corner--tl" />
      <span className="top-attackers__corner top-attackers__corner--tr" />
      <span className="top-attackers__corner top-attackers__corner--bl" />
      <span className="top-attackers__corner top-attackers__corner--br" />

      <div className="top-attackers__header">
        <div className="top-attackers__header-left">
          <span className="top-attackers__status-dot" />
          <span>TOP.ATTACKERS</span>
        </div>
        <div className="top-attackers__window-controls">
          <span className="top-attackers__window-btn" />
          <span className="top-attackers__window-btn" />
        </div>
      </div>

      <div className="top-attackers__body">
        {error && (
          <div className="top-attackers__error">&gt; {error}</div>
        )}

        {!error && !attackers && (
          <div className="top-attackers__empty">
            <span className="top-attackers__empty-text">SCANNING...</span>
          </div>
        )}

        {!error && attackers && attackers.length === 0 && (
          <div className="top-attackers__empty">
            <span className="top-attackers__empty-icon">◇</span>
            <span className="top-attackers__empty-text">NO KNOWN ATTACKERS</span>
            <span className="top-attackers__empty-sub">trigger simulasi serangan dulu</span>
          </div>
        )}

        {!error && attackers && attackers.length > 0 && (
          <div className="top-attackers__list">
            {attackers.map((a, idx) => (
              <div key={a.ip} className={`top-attackers__row ${a.is_blocked ? 'top-attackers__row--blocked' : ''}`}>
                <span className={`top-attackers__rank top-attackers__rank--${idx + 1}`}>
                  #{idx + 1}
                </span>
                <div className="top-attackers__info">
                  <span className="top-attackers__ip">{a.ip}</span>
                  <div className="top-attackers__bar">
                    <div
                      className="top-attackers__bar-fill"
                      style={{ width: `${(a.count / max) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="top-attackers__count">{a.count}</span>
                <button
                  className={`top-attackers__btn ${a.is_blocked ? 'top-attackers__btn--unblock' : ''}`}
                  onClick={() => toggleBlock(a.ip, a.is_blocked)}
                  disabled={busyIp === a.ip}
                  title={a.is_blocked ? 'Lepas block' : 'Block IP ini'}
                >
                  {a.is_blocked ? <ShieldCheck size={12} /> : <ShieldBan size={12} />}
                  <span>{a.is_blocked ? 'OK' : 'BLOCK'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="top-attackers__footer">
        <span>BLOCKLIST ACTIVE: {blockedCount}</span>
        <span>RESPOND.MODE</span>
      </div>
    </div>
  )
}