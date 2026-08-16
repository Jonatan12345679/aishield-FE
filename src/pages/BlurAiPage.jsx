import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  ArrowRight,
  Car,
  Download,
  IdCard,
  Image as ImageIcon,
  QrCode,
  Receipt,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Upload,
} from 'lucide-react'

import {
  PixelCard,
  PixelButton,
  PixelBadge,
  PixelAlert,
  PixelSection,
  PixelDivider,
  PixelSkeleton,
} from '@pxlkit/ui-kit'


import { PxlKitIcon, PixelToast } from '@pxlkit/core'

import { CheckCircle } from '@pxlkit/feedback'

import Header from '@/components/layout/Header'
import { blurAiApi } from '@/services/blurAiApi'

import '@/assets/styles/BlurAiPage.css'

const STATUS = {
  IDLE: 'idle',
  READY: 'ready',
  DONE: 'done',
}

const DETECTION_META = {
  ktp: { label: 'KTP', longLabel: 'KTP · IDENTITY CARD', color: '#00ffff', icon: IdCard },
  qr: { label: 'QR CODE', longLabel: 'QR CODE', color: '#ff00ff', icon: QrCode },
  plat_nomor: { label: 'PLAT NOMOR', longLabel: 'PLAT NOMOR · VEHICLE PLATE', color: '#ffcc00', icon: Car },
  struk: { label: 'STRUK', longLabel: 'STRUK · RECEIPT', color: '#00ff66', icon: Receipt },
}

const CAPABILITIES = [
  { key: 'ktp', description: 'Identity documents that expose full name, NIK, and address.' },
  { key: 'qr', description: 'QR codes that can embed sensitive links, payments, or contact data.' },
  { key: 'plat_nomor', description: 'Vehicle registration plates left visible in the background.' },
  { key: 'struk', description: 'Receipts and invoices that reveal purchases and account details.' },
]

function detectionMeta(cls) {
  return (
    DETECTION_META[cls] ?? {
      label: cls.replace(/_/g, ' ').toUpperCase(),
      longLabel: cls.replace(/_/g, ' ').toUpperCase(),
      color: '#00ffff',
      icon: ShieldCheck,
    }
  )
}

const formatConfidence = (value) => `${(value * 100).toFixed(1)}%`

function PixelLoader({ label }) {
  return (
    <div className="pixel-loader-wrap">
      <div className="pixel-ring" role="status" aria-label={label}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
      <div className="font-pixel-display text-[10px] text-[#00ffcc] tracking-widest animate-pixel-blink">
        {label}
      </div>
    </div>
  )
}

function PixelMeter({ value, color }) {
  const totalSegments = 10
  const filled = Math.round((value ?? 0) * totalSegments)
  return (
    <div className="pixel-meter" aria-hidden="true">
      {Array.from({ length: totalSegments }).map((_, i) => (
        <span
          key={i}
          className="pixel-meter-seg"
          style={{ backgroundColor: i < filled ? color : 'transparent', borderColor: color }}
        />
      ))}
    </div>
  )
}

export default function BlurAiPage() {
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState(STATUS.IDLE)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [scanResult, setScanResult] = useState(null)
  const [blurResult, setBlurResult] = useState(null)
  const [error, setError] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)

  const workspaceRef = useRef(null)
  const fileInputRef = useRef(null)

  const currentFile = files[0] ?? null
  const loading = pendingAction !== null

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const resetResults = useCallback(() => {
    setScanResult(null)
    setBlurResult(null)
    setError(null)
  }, [])

  const handleFilesChange = useCallback(
    (e) => {
      const nextFiles = Array.from(e.target.files || [])
      if (!nextFiles.length) return
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setFiles(nextFiles)
      resetResults()
      if (nextFiles.length) {
        setPreviewUrl(URL.createObjectURL(nextFiles[0]))
        setStatus(STATUS.READY)
      } else {
        setPreviewUrl(null)
        setStatus(STATUS.IDLE)
      }
    },
    [previewUrl, resetResults]
  )

  const handleDetection = useCallback(async () => {
    if (!currentFile || loading) return
    try {
      setPendingAction('scan')
      setError(null)
      const start = Date.now()
      const result = await blurAiApi.scanPrivacy(currentFile)
      const elapsed = Date.now() - start
      if (elapsed < 1200) await delay(1200 - elapsed)
      setScanResult(result)
      setStatus(STATUS.DONE)
    } catch (err) {
      setError(err.message || 'Gagal melakukan privacy detection.')
      setStatus(STATUS.READY)
    } finally {
      setPendingAction(null)
    }
  }, [currentFile, loading])

  const handleBlur = useCallback(async () => {
    if (!currentFile || loading) return
    try {
      setPendingAction('blur')
      setError(null)
      const start = Date.now()
      const result = await blurAiApi.blurPrivacy(currentFile)
      const elapsed = Date.now() - start
      if (elapsed < 1200) await delay(1200 - elapsed)
      setBlurResult(result)
      setStatus(STATUS.DONE)
    } catch (err) {
      setError(err.message || 'Gagal melakukan privacy blur.')
      setStatus(STATUS.READY)
    } finally {
      setPendingAction(null)
    }
  }, [currentFile, loading])

  const handleDownload = useCallback(() => {
    if (!blurResult?.image || !currentFile) return
    const link = document.createElement('a')
    link.href = blurResult.image
    link.download = `privacy-protected-${currentFile.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [blurResult, currentFile])

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFiles([])
    setPreviewUrl(null)
    resetResults()
    setStatus(STATUS.IDLE)
  }, [previewUrl, resetResults])

  const triggerSelectFile = () => fileInputRef.current?.click()
  const scrollToUpload = useCallback(() => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.requestAnimationFrame(() => fileInputRef.current?.click())
  }, [])

  const detections = scanResult?.detections ?? []
  const avgConfidence = useMemo(() => {
    if (!detections.length) return null
    const sum = detections.reduce((acc, d) => acc + d.confidence, 0)
    return sum / detections.length
  }, [detections])

  const activeStep = blurResult ? 3 : scanResult ? 2 : currentFile ? 1 : 0
  const displayedImage = blurResult?.image || scanResult?.image || previewUrl

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 selection:bg-[#00ffcc] selection:text-[#05070a] relative pixel-root">
      <div className="fixed inset-0 pixel-dither pointer-events-none z-0" />
      <div className="fixed inset-0 scanline-bg pointer-events-none z-50" />

      <Header className="relative z-10" />

      <PixelToast
        visible={!!error}
        title="ERROR"
        message={error || ''}
        position="top-right"
        duration={4000}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* HERO */}
        <section className="py-12 mb-16 text-center">
          <div className="pixel-frame inline-block mb-8 pixel-accent-cyan">
            <div className="pixel-frame-inner px-4 py-1.5">
              <span className="font-pixel-display text-[10px] text-[#00ffcc] animate-pixel-blink">
                ▸ SYSTEM READY ◂
              </span>
            </div>
          </div>

          <h1 className="font-pixel-display text-3xl sm:text-4xl lg:text-5xl uppercase mb-6 text-white pixel-title-shadow glitch-hover leading-relaxed">
            BLUR<span className="text-[#0a4237]">AI</span>
          </h1>

          <h1 className="font-pixel-display text-xl sm:text-2xl lg:text-3xl uppercase mb-6 text-white pixel-title-shadow glitch-hover leading-relaxed">
            PRIVACY<br className="sm:hidden" /> SCANNER
          </h1>

          <p className="font-pixel-body text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            &gt; DETECT SENSITIVE DATA. PROTECT YOUR IMAGES._
          </p>

          <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto">
            {Object.entries(DETECTION_META).map(([key, meta]) => {
              const Icon = meta.icon
              return (
                <PixelBadge
                  key={key}
                  className="pixel-chip flex items-center gap-2 cursor-default font-pixel-display text-[9px]"
                  style={{ backgroundColor: '#0d131d', color: meta.color, boxShadow: `4px 4px 0 0 ${meta.color}` }}
                >
                  <Icon size={12} />
                  <span>{meta.label}</span>
                </PixelBadge>
              )
            })}
          </div>
        </section>

        {/* WORKSPACE */}
        <div ref={workspaceRef} className="mb-20">
          <div className="pixel-frame pixel-accent-cyan">
            <div className="pixel-frame-inner">
              <div className="pixel-titlebar">
                <div className="flex items-center gap-3">
                  <ScanLine size={18} className="text-[#00ffcc]" />
                  <span className="font-pixel-display text-[10px] tracking-widest uppercase">WORK_SPACE.EXE</span>
                </div>
                <div className="font-pixel-body text-sm flex items-center gap-2">
                  <span className={`pixel-dot ${loading ? 'pixel-dot-busy' : 'pixel-dot-ok'}`} />
                  <span>{loading ? 'PROCESSING...' : 'ENGINE ONLINE'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 sm:p-8">
                {/* LEFT: VIEWPORT */}
                <div className="lg:col-span-8 flex flex-col justify-center">
                  {!currentFile ? (
                    <button
                      type="button"
                      onClick={triggerSelectFile}
                      className="pixel-slot w-full min-h-95 flex flex-col items-center justify-center text-center group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleFilesChange}
                        className="hidden"
                      />
                      <div className="pixel-slot-icon mb-6 group-hover:-translate-y-1 transition-transform">
                        <ImageIcon size={28} className="text-[#00ffcc]" />
                      </div>
                      <h3 className="font-pixel-display text-xs mb-3 text-white">
                        &gt; INSERT IMAGE CARTRIDGE &lt;
                      </h3>
                      <p className="font-pixel-body text-slate-400 mb-6 text-lg">PNG · JPG · JPEG — MAX 10MB</p>
                      <PixelButton tone="cyan" size="sm" iconLeft={<Upload size={14} />}>
                        BROWSE FILE
                      </PixelButton>
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pixel-strip px-3 py-2">
                        <span className="font-pixel-body text-lg truncate text-slate-300 max-w-62.5 sm:max-w-md">
                          FILE: {currentFile.name}
                        </span>
                        <PixelButton
                          onClick={reset}
                          tone="red"
                          size="sm"
                          className="text-[9px] py-1 px-2 font-pixel-display"
                          iconLeft={<RotateCcw size={12} />}
                        >
                          CLEAR
                        </PixelButton>
                      </div>

                      <div className="relative pixel-screen min-h-80 max-h-125 flex items-center justify-center">
                        <span className="pixel-corner pixel-corner-tl" />
                        <span className="pixel-corner pixel-corner-tr" />
                        <span className="pixel-corner pixel-corner-bl" />
                        <span className="pixel-corner pixel-corner-br" />
                        <img
                          src={displayedImage}
                          alt="Preview"
                          className="max-h-120 w-auto object-contain pixel-render"
                        />
                        {loading && (
                          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4">
                            <PixelLoader label={pendingAction === 'blur' ? '> BLURRING DATA...' : '> SCANNING PIXELS...'} />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 justify-between items-center pt-2">
                        <div className="font-pixel-display text-[10px] uppercase">
                          STATUS:{' '}
                          <span className="text-[#00ff66] animate-pixel-blink">
                            {blurResult ? '[PROTECTED]' : scanResult ? '[DETECTED]' : '[READY]'}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          {!scanResult && (
                            <PixelButton
                              disabled={loading}
                              onClick={handleDetection}
                              tone="cyan"
                              size="sm"
                              className="font-pixel-display text-[9px]"
                              iconLeft={<ScanLine size={14} />}
                            >
                              DETECT
                            </PixelButton>
                          )}
                          {scanResult && !blurResult && (
                            <PixelButton
                              disabled={loading}
                              onClick={handleBlur}
                              tone="green"
                              size="sm"
                              className="font-pixel-display text-[9px]"
                              iconLeft={<ShieldCheck size={14} />}
                            >
                              BLUR PRIVACY
                            </PixelButton>
                          )}
                          {blurResult && (
                            <PixelButton
                              onClick={handleDownload}
                              tone="green"
                              size="sm"
                              className="font-pixel-display text-[9px]"
                              iconLeft={<Download size={14} />}
                            >
                              DOWNLOAD
                            </PixelButton>
                          )}
                        </div>
                      </div>

                      {error && (
                        <PixelAlert className="pixel-frame pixel-accent-red mt-4">
                          <div className="pixel-frame-inner flex justify-between items-center px-3 py-2">
                            <span className="font-pixel-body text-lg text-red-300">ERR: {error}</span>
                            <PixelButton
                              onClick={scanResult ? handleBlur : handleDetection}
                              tone="red"
                              size="sm"
                              className="font-pixel-display text-[9px]"
                            >
                              RETRY
                            </PixelButton>
                          </div>
                        </PixelAlert>
                      )}
                    </div>
                  )}
                </div>

                {/* RIGHT: HUD SIDEBAR */}
                <div className="lg:col-span-4">
                  <div className="pixel-hud h-full flex flex-col justify-between p-4">
                    <div>
                      <h2 className="font-pixel-display text-[10px] tracking-widest text-slate-400 pb-3 mb-4 pixel-hr">
                        [ ANALYSIS HUD ]
                      </h2>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="pixel-stat">
                          <div className="font-pixel-body text-slate-500 text-sm">FOUND</div>
                          <div className="font-pixel-display text-lg text-white">
                            {detections.length ? detections.length : '0'}
                          </div>
                        </div>
                        <div className="pixel-stat">
                          <div className="font-pixel-body text-slate-500 text-sm">AVG CONF</div>
                          <div className="font-pixel-display text-lg text-[#00ff66] mb-1">
                            {avgConfidence !== null ? formatConfidence(avgConfidence) : '0%'}
                          </div>
                          <PixelMeter value={avgConfidence ?? 0} color="#00ff66" />
                        </div>
                      </div>

                      <PixelDivider className="pixel-divider mb-6" />

                      <div className="mb-6">
                        <div className="font-pixel-display text-[9px] text-slate-500 mb-2 tracking-widest">PROGRESS:</div>
                        {loading ? (
                          <PixelSkeleton className="pixel-skeleton h-24 w-full" />
                        ) : (
                          <div className="space-y-2">
                            {['1. SELECT FILE', '2. SCAN PRIVACY', '3. BLUR & PROTECT'].map((step, idx) => (
                              <div
                                key={step}
                                className={`pixel-step font-pixel-body text-lg ${activeStep > idx ? 'pixel-step-done' : ''}`}
                              >
                                {activeStep > idx ? (
                                  <PxlKitIcon icon={CheckCircle} size={18} appearance="solid" color="#00ff66" />
                                ) : null}
                                {step}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {detections.length > 0 && (
                        <div>
                          <div className="font-pixel-display text-[9px] text-[#00ffcc] mb-2 pixel-hr-dashed pb-1 tracking-widest">
                            DETECTED CLASSES:
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto pixel-scroll">
                            {detections.map((detection, index) => {
                              const meta = detectionMeta(detection.class)
                              const Icon = meta.icon
                              return (
                                <div
                                  key={`${detection.class}-${index}`}
                                  className="pixel-detect-row"
                                  style={{ borderColor: meta.color }}
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon size={14} style={{ color: meta.color }} />
                                    <span className="font-pixel-display text-[9px] text-white uppercase">{meta.label}</span>
                                  </div>
                                  <span className="font-pixel-body text-lg" style={{ color: meta.color }}>
                                    {formatConfidence(detection.confidence)}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pixel-hr pt-4 font-pixel-body text-lg text-slate-500">
                      {blurResult ? (
                        <span className="text-[#00ff66]">&gt; STATUS: PROTECTED &amp; READY</span>
                      ) : scanResult ? (
                        <span className="text-[#00ffcc]">&gt; STATUS: REGIONS IDENTIFIED</span>
                      ) : (
                        <span className="animate-pixel-blink">&gt; AWAITING INPUT... _</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CAPABILITIES */}
        <PixelSection className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-pixel-display text-lg uppercase text-white mb-3 tracking-widest">
              &gt; DETECTION CAPABILITIES &lt;
            </h2>
            <p className="font-pixel-body text-lg text-slate-400">TARGETED CLASSES · DESTRUCTIVE SCAN</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITIES.map(({ key, description }) => {
              const meta = detectionMeta(key)
              const Icon = meta.icon
              return (
                <div key={key} className="pixel-frame hover:-translate-y-1.5 transition-transform duration-150" style={{ '--accent': meta.color }}>
                  <div className="pixel-frame-inner p-4 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="pixel-icon-box" style={{ borderColor: meta.color, color: meta.color }}>
                          <Icon size={18} />
                        </div>
                        <h3 className="font-pixel-display text-[10px] text-white uppercase tracking-wider">{meta.label}</h3>
                      </div>
                      <p className="font-pixel-body text-lg text-slate-400 leading-relaxed">{description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </PixelSection>
      </main>
    </div>
  )
}