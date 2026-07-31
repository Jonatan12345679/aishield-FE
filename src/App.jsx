import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/layout/Header';
import RiskGauge from '@/components/dashboard/RiskGauge';
import StatCards from '@/components/dashboard/StatCards';
import AnomalyChart from '@/components/dashboard/AnomalyChart';
import LogStream from '@/components/dashboard/LogStream';
import ThreatTimeline from '@/components/dashboard/ThreatTimeline';
import SimulationPanel from '@/components/dashboard/SimulationPanel';
import AlertBanner from '@/components/alerts/AlertBanner';
import AlertToast from '@/components/alerts/AlertToast';  

function App() {
  const [riskScore, setRiskScore] = useState(95)
  const [isThreatActive, setIsThreatActive] = useState(false)
  const [alertData, setAlertData] = useState(null)
  const [toast, setToast] = useState(null)
  const [stats, setStats] = useState({
    totalLogs: 12847,
    normalCount: 12802,
    threatCount: 45,
    avgResponse: '23ms'
  })
  const [logs, setLogs] = useState([
    { id: 1, type: 'normal', msg: 'User login from 192.168.1.45 — Jakarta, ID', time: '22:38:12' },
    { id: 2, type: 'normal', msg: 'File access: /docs/report_q3.pdf', time: '22:37:45' },
    { id: 3, type: 'normal', msg: 'API call: /api/v1/users/profile (200 OK)', time: '22:37:21' },
    { id: 4, type: 'normal', msg: 'User logout: session_8f2a9c', time: '22:36:58' },
    { id: 5, type: 'normal', msg: 'Database query: SELECT * FROM events LIMIT 100', time: '22:36:30' },
  ])
  const [timeline, setTimeline] = useState([
    { id: 1, time: '22:30:15', title: 'System Scan Complete', desc: 'Full security scan finished. No threats found.', type: 'safe' },
    { id: 2, time: '22:15:42', title: 'Threat Blocked', desc: 'Brute force attempt from 103.147.92.11 blocked.', type: 'threat' },
    { id: 3, time: '21:45:00', title: 'Model Update', desc: 'ML model v2.1.4 deployed. Accuracy: 97.3%', type: 'info' },
  ])

  const addLog = useCallback((type, msg) => {
    const newLog = {
      id: Date.now(),
      type,
      msg,
      time: new Date().toLocaleTimeString('id-ID', { hour12: false })
    }
    setLogs(prev => [newLog, ...prev].slice(0, 50))
  }, [])

  const showToast = useCallback((title, message) => {
    setToast({ title, message })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const simulateNormal = useCallback(() => {
    showToast('Simulation Started', 'Generating normal activity patterns...')
    addLog('normal', 'Simulated: Normal user behavior pattern detected')
    setStats(prev => ({
      ...prev,
      totalLogs: prev.totalLogs + 5,
      normalCount: prev.normalCount + 5
    }))
    if (riskScore < 95) {
      setRiskScore(prev => Math.min(95, prev + 5))
    }
  }, [riskScore, addLog, showToast])

  const simulateThreat = useCallback(() => {
    if (isThreatActive) return
    setIsThreatActive(true)
    setRiskScore(28)
    
    addLog('threat', 'CRITICAL: Anomalous login from 185.220.101.42 — Moscow, RU')
    
    setStats(prev => ({
      ...prev,
      totalLogs: prev.totalLogs + 1,
      threatCount: prev.threatCount + 1
    }))

    setAlertData({
      message: 'Anomalous login pattern detected from IP 185.220.101.42',
      oldScore: 95,
      newScore: 28,
      explanations: [
        { label: 'Time Anomaly', value: 'Login at 03:47 AM', percent: 92 },
        { label: 'Geo Distance', value: '8,247 km from last', percent: 88 },
        { label: 'Failed Attempts', value: '12x in 30 seconds', percent: 95 },
      ]
    })

    setTimeline(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString('id-ID', { hour12: false }),
      title: 'THREAT DETECTED',
      desc: 'AI detected anomalous pattern. Risk score dropped from 95 to 28.',
      type: 'threat'
    }, ...prev])

    showToast('⚠ THREAT DETECTED', 'Anomaly identified by AI model. Check dashboard.')
  }, [isThreatActive, addLog, showToast])

  const resetDashboard = useCallback(() => {
    setIsThreatActive(false)
    setRiskScore(95)
    setAlertData(null)
    showToast('Dashboard Reset', 'System restored to normal state.')
  }, [showToast])

  // Auto-add random logs
  useEffect(() => {
    if (isThreatActive) return
    const interval = setInterval(() => {
      const msgs = [
        'User login from 192.168.1.12 — Jakarta, ID',
        'File download: /assets/presentation.pptx',
        'API call: /api/v1/analytics/dashboard (200 OK)',
        'Database backup completed successfully',
        'SSL certificate verified: *.aishield.id',
      ]
      addLog('normal', msgs[Math.floor(Math.random() * msgs.length)])
      setStats(prev => ({
        ...prev,
        totalLogs: prev.totalLogs + 1,
        normalCount: prev.normalCount + 1
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [isThreatActive, addLog])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header isThreatActive={isThreatActive} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Alert Banner */}
        {alertData && <AlertBanner data={alertData} />}
        
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RiskGauge score={riskScore} isThreatActive={isThreatActive} />
          <StatCards stats={stats} />
          <SimulationPanel 
            onSimulateNormal={simulateNormal}
            onSimulateThreat={simulateThreat}
            onReset={resetDashboard}
            isThreatActive={isThreatActive}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnomalyChart isThreatActive={isThreatActive} />
          <LogStream logs={logs} />
        </div>

        {/* Timeline */}
        <ThreatTimeline events={timeline} />
      </main>

      {/* Toast */}
      {toast && <AlertToast title={toast.title} message={toast.message} />}
    </div>
  )
}

export default App