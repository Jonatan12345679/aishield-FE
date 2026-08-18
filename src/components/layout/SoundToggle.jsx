import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { isMuted, setMuted, unlockAudio, playBlip } from '@/services/retroSound'

export default function SoundToggle() {
  const [muted, setMutedState] = useState(isMuted())
  
  useEffect(() => {
    const unlock = () => unlockAudio()
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  function toggle() {
    const next = !muted
    setMuted(next)
    setMutedState(next)
    if (!next) playBlip() // konfirmasi bunyi saat di-unmute
  }

  return (
    <button
      className={`sound-toggle ${muted ? 'sound-toggle--muted' : ''}`}
      onClick={toggle}
      title={muted ? 'UNMUTE: nyalakan sound alert' : 'MUTE: matikan sound alert'}
      aria-label="Toggle sound alert"
    >
      {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
    </button>
  )
}