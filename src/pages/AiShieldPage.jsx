import { useCallback, useState } from 'react'
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
  const [timeline, setTimeline] = useState([
    {
      id: 1,
      time: '22:30:15',
      title: 'System Scan Complete',
      desc: 'Full security scan finished. No threats found.',
      type: 'safe',
    },
  ])

  const showToast = useCallback((title, message) => {
    setToast({ title, message })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const simulateNormal = useCallback(() => {
    showToast('Simulation Started', 'Generating normal activity patterns...')
  }, [showToast])

  const simulateThreat = useCallback(() => {
    if (isThreatActive) return
    setIsThreatActive(true)

    setAlertData({
      message: 'Anomalous login pattern detected from IP 185.220.101.42',
      oldScore: 95,
      newScore: 28,
      explanations: [
        { label: 'Time Anomaly', value: 'Login at 03:47 AM', percent: 92 },
        { label: 'Geo Distance', value: '8,247 km from last', percent: 88 },
        { label: 'Failed Attempts', value: '12x in 30 seconds', percent: 95 },
      ],
    })

    setTimeline((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString('id-ID', { hour12: false }),
        title: 'THREAT DETECTED',
        desc: 'AI detected anomalous pattern. Risk score dropped from 95 to 28.',
        type: 'threat',
      },
      ...prev,
    ])

    showToast('⚠ THREAT DETECTED', 'Anomaly identified by AI model. Check dashboard.')
  }, [isThreatActive, showToast])

  const resetDashboard = useCallback(() => {
    setIsThreatActive(false)
    setAlertData(null)
    showToast('Dashboard Reset', 'System restored to normal state.')
  }, [showToast])

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
              onSimulateNormal={simulateNormal}
              onSimulateThreat={simulateThreat}
              onReset={resetDashboard}
              isThreatActive={isThreatActive}
            />
          </div>

          {/* chart distribusi serangan + log event realtime */}
          <div className="aishield-row aishield-row--2col">
            <AnomalyChart />
            <LogStream anomalyOnly={false} limit={20} />
          </div>

          {/* timeline deteksi */}
          <ThreatTimeline events={timeline} />
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

      {toast && <AlertToast title={toast.title} message={toast.message} />}
    </div>
  )
}