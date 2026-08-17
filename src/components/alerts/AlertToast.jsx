import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import '@/assets/styles/AlertToast.css'

export default function AlertToast({ title, message, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), 3600)
    return () => clearTimeout(exitTimer)
  }, [])

  const tone = title.includes('⚠') || title.toUpperCase().includes('THREAT')
    ? 'threat'
    : title.toLowerCase().includes('reset')
    ? 'reset'
    : 'info'

  const icons = {
    threat: AlertTriangle,
    reset: CheckCircle2,
    info: Info,
  }
  const Icon = icons[tone]

  return (
    <div className={`alert-toast alert-toast--${tone} ${isExiting ? 'alert-toast--exiting' : ''}`}>
      <span className="alert-toast__corner alert-toast__corner--tl" />
      <span className="alert-toast__corner alert-toast__corner--tr" />
      <span className="alert-toast__corner alert-toast__corner--bl" />
      <span className="alert-toast__corner alert-toast__corner--br" />

      <div className="alert-toast__header">
        <span>{title}</span>
        <button
          className="alert-toast__close"
          onClick={() => {
            setIsExiting(true)
            setTimeout(() => onDismiss?.(), 200)
          }}
          aria-label="Close"
        >
          
        </button>
      </div>

      <div className="alert-toast__body">
        <div className="alert-toast__icon">
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div className="alert-toast__content">
          <p className="alert-toast__message">{message}</p>
          <div className="alert-toast__progress">
            <div className="alert-toast__progress-bar" />
          </div>
        </div>
      </div>
    </div>
  )
}