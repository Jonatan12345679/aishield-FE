import { useCallback, useEffect, useRef, useState } from 'react'
import { ScanSearch, KeyRound, Zap, FileUp } from 'lucide-react'
import Header from '@/components/layout/Header'
import RiskGauge from '@/components/dashboard/RiskGauge'
import StatCards from '@/components/dashboard/StatCards'
import AnomalyChart from '@/components/dashboard/AnomalyChart'
import LogStream from '@/components/dashboard/LogStream'
import ThreatTimeline from '@/components/dashboard/ThreatTimeline'
import SimulationPanel from '@/components/dashboard/SimulationPanel'
import AlertBanner from '@/components/alerts/AlertBanner'
import AlertToast from '@/components/alerts/AlertToast'
import '@/assets/styles/AiShieldPage.css'
import { useWebSocket } from '@/hooks/useWebSocket' 

const HERO_CHIPS = [
  { label: 'PORT SCAN', tone: 'cyan', icon: ScanSearch },
  { label: 'BRUTE FORCE', tone: 'yellow', icon: KeyRound },
  { label: 'DDOS', tone: 'rose', icon: Zap },
  { label: 'EXFILTRATION', tone: 'purple', icon: FileUp },
]

export default function AiShieldPage() {
  const [isThreatActive, setIsThreatActive] = useState(false)
  const [alertData, setAlertData] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((title, message) => {
    setToast({ title, message, key: Date.now() })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const { lastMessage } = useWebSocket()
  const localSimRef = useRef(false)

  const handleSimStart = useCallback(() => {
  localSimRef.current = true
}, [])


  const handleSimulationResult = useCallback(
    (result) => {
      const isAttack = result.attack_type !== 'normal'
      const hasAnomalies = result.anomalies_detected > 0
      setTimeout(() => (localSimRef.current = false), 3000)

 
      if (isAttack && hasAnomalies) {
        setIsThreatActive(true)
        setAlertData({
          message: `${result.total_generated} event "${result.attack_type}" digenerate, ${result.anomalies_detected} terdeteksi sebagai anomali`,
          attackType: result.attack_type,
          totalGenerated: result.total_generated,
          anomaliesDetected: result.anomalies_detected,
          durationSec: result.duration_sec,
        })
 
        showToast(
          '⚠ SIMULATION COMPLETE',
          `${result.anomalies_detected}/${result.total_generated} event terdeteksi sebagai anomali`
        )
      } else {
        setIsThreatActive(false)
        setAlertData(null)
        showToast('Simulation Complete', `${result.total_generated} normal traffic event digenerate`)
      }
    },
    [showToast]
  )

  useEffect(() => {
  if (!lastMessage || lastMessage.type !== 'simulation_complete') return
  if (localSimRef.current) return // simulasi lokal, sudah di-handle onResult

  const { attack_type, total_generated, anomalies_detected, duration_sec } = lastMessage

  if (anomalies_detected > 0) {
    setIsThreatActive(true)
    setAlertData({
      message: `SESI LAIN: ${total_generated} event "${attack_type}" digenerate, ${anomalies_detected} terdeteksi sebagai anomali`,
      attackType: attack_type,
      totalGenerated: total_generated,
      anomaliesDetected: anomalies_detected,
      durationSec: duration_sec,
    })
    showToast('⚠ REALTIME ALERT', `${anomalies_detected}/${total_generated} anomali terdeteksi dari sesi lain`)
  }
}, [lastMessage, showToast])

  return (
    <div className="aishield-page">
      <div className="aishield-page__grid-bg" />
      <div className="aishield-page__scanlines" />

      <div className="aishield-page__container">
        <Header isThreatActive={isThreatActive} />

        <main className="aishield-page__main">
          <section className="aishield-hero">
            <div
              className={`aishield-hero__badge ${
                isThreatActive ? 'aishield-hero__badge--threat' : ''
              }`}
            >
              <span className="aishield-hero__badge-inner">
                <span className="aishield-hero__badge-arrow">▸</span>
                <span>{isThreatActive ? 'THREAT DETECTED' : 'SYSTEM READY'}</span>
                <span className="aishield-hero__badge-arrow">◂</span>
              </span>
            </div>

            <h1 className="aishield-hero__title">
              AI <span>SHIELD</span>
            </h1>
            <h2 className="aishield-hero__subtitle">CYBER SECURITY DASHBOARD</h2>

            <p className="aishield-hero__tagline">
              &gt; DETECT NETWORK ANOMALIES. PROTECT YOUR SYSTEM._
              <span className="aishield-hero__cursor">_</span>
            </p>

            <div className="aishield-hero__chips">
              {HERO_CHIPS.map((chip) => {
                const Icon = chip.icon
                return (
                  <span
                    key={chip.label}
                    className={`aishield-hero__chip aishield-hero__chip--${chip.tone}`}
                  >
                    <Icon size={12} />
                    {chip.label}
                  </span>
                )
              })}
            </div>
          </section>

          {alertData && <AlertBanner data={alertData} onDismiss={() => setAlertData(null)} />}

          {/* gauge risiko, angka statistik, panel simulasi */}
          <div className="aishield-row aishield-row--3col">
            <RiskGauge />
            <div className="aishield-row__cell">
              <StatCards />
            </div>
            <SimulationPanel
             onStart={handleSimStart} 
             onResult={handleSimulationResult} 
             />
          </div>

          {/* chart distribusi serangan + log event realtime */}
          <div className="aishield-row aishield-row--2col">
            <AnomalyChart />
            <LogStream anomalyOnly={false} limit={20} />
          </div>

          {/* timeline deteksi */}
          <ThreatTimeline />
        </main>

        <footer className="aishield-page__footer">
          <span>AISHIELD.OS v1.0.0</span>
          <span className="aishield-page__footer-separator">|</span>
          <span>
            SECURE CONNECTION:{' '}
            <span className="aishield-page__footer-accent">ACTIVE</span>
          </span>
          <span className="aishield-page__footer-separator">|</span>
          <span>© 2026 Aegis AI Team</span>
        </footer>
      </div>

     {toast && (
      <AlertToast key={toast.key} title={toast.title} message={toast.message} />
)}
    </div>
  )
}