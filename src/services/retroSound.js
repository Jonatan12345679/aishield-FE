
let ctx = null
let muted = localStorage.getItem('aishield-muted') === '1'

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function unlockAudio() {
  getCtx()
}

export function isMuted() {
  return muted
}

export function setMuted(value) {
  muted = value
  localStorage.setItem('aishield-muted', value ? '1' : '0')
}

/**
 * Satu beep 8-bit.
 * @param {object} o - freq (Hz), duration (s), when (delay s), type, volume, slideTo
 */
function beep({ freq = 440, duration = 0.1, when = 0, type = 'square', volume = 0.06, slideTo = null }) {
  if (muted) return
  const ac = getCtx()
  if (!ac) return

  const t0 = ac.currentTime + when
  const osc = ac.createOscillator()
  const gain = ac.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration)

  gain.gain.setValueAtTime(volume, t0)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  osc.connect(gain).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export function playThreatAlert() {
  const seq = [880, 620, 880, 620, 990, 740]
  seq.forEach((f, i) =>
    beep({ freq: f, duration: 0.14, when: i * 0.15, type: 'square', volume: 0.07 })
  )
}

export function playSuccess() {
  beep({ freq: 523, duration: 0.09, when: 0 })    // C5
  beep({ freq: 659, duration: 0.09, when: 0.1 }) // E5
  beep({ freq: 784, duration: 0.16, when: 0.2 }) // G5
}

export function playBlip() {
  beep({ freq: 220, duration: 0.05, volume: 0.04 })
}