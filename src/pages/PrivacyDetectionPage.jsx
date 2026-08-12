import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  PxlKitSurfaceProvider,
  PixelContainer,
  PixelBadge,
  PixelFileUpload,
  PixelButton,
  PixelDivider,
} from '@pxlkit/ui-kit'

import {
  ArrowRight,
  Download,
  Image as ImageIcon,
  LockKeyhole,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Upload,
} from 'lucide-react'

import Header from '@/components/layout/Header'

import {
  scanPrivacy,
  blurPrivacy,
} from '@/api/privacyApi'

const STATUS = {
  IDLE: 'idle',
  READY: 'ready',
  PROCESSING: 'processing',
  DONE: 'done',
}

const THEME = {
  '--retro-bg': '#020617',
  '--retro-surface': '#0b1120',
  '--retro-card': '#111827',
  '--retro-border': '#1e293b',
  '--retro-text': '#e2e8f0',
  '--retro-muted': '#64748b',
  '--retro-green': '#00ff88',
  '--retro-red': '#ff0055',
}

export default function PrivacyDetectionPage() {
    const [files, setFiles] = useState([])
    const [status, setStatus] = useState(STATUS.IDLE)

    const [previewUrl, setPreviewUrl] = useState(null)
    const [scanResultUrl, setScanResultUrl] = useState(null)
    const [blurResultUrl, setBlurResultUrl] = useState(null)
    const [error, setError] = useState(null)

    const currentFile = files[0] ?? null


    /*
    |--------------------------------------------------------------------------
    | IMAGE PREVIEW
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }

        if (scanResultUrl) {
          URL.revokeObjectURL(scanResultUrl)
        }

        if (blurResultUrl) {
          URL.revokeObjectURL(blurResultUrl)
        }
      }
    }, [
      previewUrl,
      scanResultUrl,
      blurResultUrl,
    ])


    /*
    |--------------------------------------------------------------------------
    | FILE UPLOAD
    |--------------------------------------------------------------------------
    */

    const handleFilesChange = useCallback((nextFiles) => {
      // Bersihkan hasil sebelumnya
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      if (scanResultUrl) {
        URL.revokeObjectURL(scanResultUrl)
      }

      if (blurResultUrl) {
        URL.revokeObjectURL(blurResultUrl)
      }

      setFiles(nextFiles)

      // Reset hasil scan / blur ketika upload gambar baru
      setScanResultUrl(null)
      setBlurResultUrl(null)
      setError(null)

      if (nextFiles.length) {
        const file = nextFiles[0]

        const url = URL.createObjectURL(file)

        setPreviewUrl(url)
        setStatus(STATUS.READY)
      } else {
        setPreviewUrl(null)
        setStatus(STATUS.IDLE)
      }
    }, [
      previewUrl,
      scanResultUrl,
      blurResultUrl,
    ])


    /*
    |--------------------------------------------------------------------------
    | AI DETECTION
    |--------------------------------------------------------------------------
    */

    const handleDetection = useCallback(async () => {
      if (!currentFile || status === STATUS.PROCESSING) {
        return
      }

      try {
        setStatus(STATUS.PROCESSING)
        setError(null)

        // Kirim gambar ke backend:
        // POST /scan
        const result = await scanPrivacy(currentFile)

        // Hapus hasil scan sebelumnya
        if (scanResultUrl) {
          URL.revokeObjectURL(scanResultUrl)
        }

        // result.url berasal dari Blob hasil /scan
        setScanResultUrl(result.url)

        setStatus(STATUS.DONE)

      } catch (error) {

        console.error('Privacy scan error:', error)

        setError(
          error.message ||
          'Gagal melakukan privacy detection.'
        )

        setStatus(STATUS.READY)
      }
    }, [
      currentFile,
      status,
      scanResultUrl,
    ])


    /*
    |--------------------------------------------------------------------------
    | AI BLUR
    |--------------------------------------------------------------------------
    */

    const handleBlur = useCallback(async () => {
      if (!currentFile || status === STATUS.PROCESSING) {
        return
      }

      try {
        setStatus(STATUS.PROCESSING)
        setError(null)

        // Kirim gambar ke backend:
        // POST /blur
        const result = await blurPrivacy(currentFile)

        // Hapus hasil blur sebelumnya
        if (blurResultUrl) {
          URL.revokeObjectURL(blurResultUrl)
        }

        // result.url berasal dari Blob hasil /blur
        setBlurResultUrl(result.url)

        setStatus(STATUS.DONE)

      } catch (error) {

        console.error('Privacy blur error:', error)

        setError(
          error.message ||
          'Gagal melakukan privacy blur.'
        )

        setStatus(STATUS.READY)
      }
    }, [
      currentFile,
      status,
      blurResultUrl,
    ])


    /*
    |--------------------------------------------------------------------------
    | RESET
    |--------------------------------------------------------------------------
    */

    const reset = useCallback(() => {

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      if (scanResultUrl) {
        URL.revokeObjectURL(scanResultUrl)
      }

      if (blurResultUrl) {
        URL.revokeObjectURL(blurResultUrl)
      }

      setFiles([])
      setPreviewUrl(null)
      setScanResultUrl(null)
      setBlurResultUrl(null)
      setError(null)
      setStatus(STATUS.IDLE)

    }, [
      previewUrl,
      scanResultUrl,
      blurResultUrl,
    ])


    /*
    |--------------------------------------------------------------------------
    | STATISTICS
    |--------------------------------------------------------------------------
    |
    | Karena sekarang /scan mengembalikan IMAGE,
    | bukan JSON detections, kita tidak lagi menggunakan:
    |
    | detections.reduce(...)
    |
    | Untuk sementara statistik berdasarkan status hasil.
    |
    |--------------------------------------------------------------------------
    */

    const statistics = useMemo(() => {

      return {
        detected: scanResultUrl ? 1 : 0,
        confidence: scanResultUrl ? 100 : 0,
      }

    }, [scanResultUrl])



  return (
    <div
      className="dark min-h-screen bg-slate-950"
      style={THEME}
    >
      <PxlKitSurfaceProvider surface="pixel">

        {/* ================================================================
            HEADER
        ================================================================ */}

        <Header />

        <main>

          {/* ================================================================
              HERO
          ================================================================ */}

          <section className="relative overflow-hidden">

            <div className="pointer-events-none absolute inset-0">

              <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />

              <div className="absolute -left-32 top-40 h-[350px] w-[350px] rounded-full bg-emerald-500/5 blur-[100px]" />

              <div
                className="
                  absolute inset-0
                  opacity-[0.025]
                  [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
                  [background-size:64px_64px]
                "
              />

            </div>

            <PixelContainer className="relative pb-14 pt-16 sm:pb-20 sm:pt-24">

              <div className="max-w-4xl">

                <div className="flex flex-wrap items-center gap-3">

                  <PixelBadge tone="green">
                    PRIVACY ENGINE
                  </PixelBadge>

                  <span className="font-mono text-[9px] tracking-[0.2em] text-slate-600">
                    AI-POWERED IMAGE PROTECTION
                  </span>

                </div>

                <h1 className="mt-7 font-pixel text-4xl leading-[1.15] text-slate-100 sm:text-6xl lg:text-7xl">

                  Your image.
                  <br />

                  <span className="text-cyan-400">
                    Your privacy.
                  </span>

                </h1>

                <p className="mt-7 max-w-2xl font-mono text-xs leading-6 text-slate-500 sm:text-sm">
                  Detect sensitive information inside an image,
                  identify what needs protection, and automatically
                  prepare it for safe sharing.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">

                  <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#00ff88]" />

                    <span className="font-mono text-[9px] tracking-wider text-emerald-400">
                      DETECTION ENGINE READY
                    </span>

                  </div>

                  <span className="text-slate-800">
                    /
                  </span>

                  <span className="font-mono text-[9px] text-slate-600">
                    KTP · QR · PLATE · STRUK
                  </span>

                </div>

              </div>

            </PixelContainer>

          </section>


          {/* ================================================================
              SCANNER WORKSPACE
          ================================================================ */}

          <PixelContainer className="pb-20">

            <div className="overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl shadow-black/30">

              {/* Workspace Header */}

              <div className="flex flex-col gap-4 border-b border-slate-800 bg-slate-900/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center border border-cyan-500/20 bg-cyan-500/5">
                    <ScanLine
                      size={17}
                      className="text-cyan-400"
                    />
                  </div>

                  <div>

                    <div className="font-mono text-xs font-bold tracking-wider text-slate-200">
                      PRIVACY SCANNER
                    </div>

                    <div className="mt-0.5 font-mono text-[9px] text-slate-600">
                      IMAGE ANALYSIS WORKSPACE
                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-2">

                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      status === STATUS.PROCESSING
                        ? "bg-amber-400 animate-pulse"
                        : "bg-emerald-400"
                    }`}
                  />

                  <span
                    className={`font-mono text-[9px] tracking-widest ${
                      status === STATUS.PROCESSING
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {status === STATUS.PROCESSING
                      ? "PROCESSING"
                      : "ENGINE ONLINE"}
                  </span>

                </div>

              </div>


              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">


                {/* ==========================================================
                    IMAGE WORKSPACE
                ========================================================== */}

                <div className="min-w-0 border-b border-slate-800 lg:border-b-0 lg:border-r">

                  {!currentFile ? (

                    <div className="flex min-h-[540px] items-center justify-center p-6 sm:p-10">

                      <div className="w-full max-w-xl">

                        <div className="mb-7 text-center">

                          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border border-cyan-500/20 bg-cyan-500/5">

                            <ImageIcon
                              size={25}
                              className="text-cyan-400"
                            />

                          </div>

                          <h2 className="font-mono text-sm font-bold tracking-wider text-slate-200">
                            DROP YOUR IMAGE
                          </h2>

                          <p className="mx-auto mt-2 max-w-sm font-mono text-[10px] leading-5 text-slate-600">
                            Upload an image and let the AI identify
                            privacy-sensitive information automatically.
                          </p>

                        </div>


                        <PixelFileUpload
                          label="Upload Image"
                          hint="PNG · JPG · JPEG · MAX 10 MB"
                          value={files}
                          onChange={handleFilesChange}
                          accept="image/png,image/jpeg,image/jpg"
                          maxFiles={1}
                          maxSize={10 * 1024 * 1024}
                          tone="green"
                        />


                        <div className="mt-5 flex items-center justify-center gap-2">

                          <ShieldCheck
                            size={12}
                            className="text-slate-600"
                          />

                          <span className="font-mono text-[8px] text-slate-600">
                            IMAGE ENTERS THE PROTECTION PIPELINE
                          </span>

                        </div>

                      </div>

                    </div>

                  ) : (

                    <div className="p-4 sm:p-6">


                      {/* Image toolbar */}

                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="min-w-0">

                          <div className="font-mono text-[8px] tracking-[0.2em] text-slate-600">
                            SOURCE IMAGE
                          </div>

                          <div className="mt-1 truncate font-mono text-xs text-slate-300">
                            {currentFile.name}
                          </div>

                        </div>


                        <button
                          type="button"
                          onClick={reset}
                          className="flex shrink-0 items-center gap-2 self-start border border-slate-800 px-3 py-2 font-mono text-[8px] tracking-wider text-slate-500 transition hover:border-slate-600 hover:text-slate-200"
                        >
                          <RotateCcw size={12} />
                          REPLACE
                        </button>

                      </div>


                      {/* ==================================================
                          IMAGE RESULT
                      ================================================== */}

                      <div className="relative overflow-hidden border border-slate-800 bg-black">

                        <div className="relative aspect-[16/10] w-full">


                          {/* SOURCE IMAGE */}

                          <img
                            src={previewUrl}
                            alt="Uploaded source"
                            className="absolute inset-0 h-full w-full object-contain"
                          />


                          {/* ==================================================
                              SCAN RESULT
                              
                              Backend /scan mengembalikan gambar yang sudah
                              memiliki bounding box.
                          ================================================== */}

                          {scanResultUrl && (

                            <img
                              src={scanResultUrl}
                              alt="Privacy detection result"
                              className="absolute inset-0 h-full w-full object-contain"
                            />

                          )}


                          {/* ==================================================
                              BLUR RESULT

                              Kalau /blur berhasil, hasil blur ditampilkan
                              di atas source image.
                          ================================================== */}

                          {blurResultUrl && (

                            <img
                              src={blurResultUrl}
                              alt="Privacy blurred result"
                              className="absolute inset-0 h-full w-full object-contain"
                            />

                          )}


                          {/* Processing overlay */}

                          {status === STATUS.PROCESSING && (

                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">

                              <div className="text-center">

                                <div className="mx-auto h-10 w-10 animate-spin border-2 border-slate-700 border-t-cyan-400" />

                                <div className="mt-5 font-mono text-[10px] font-bold tracking-[0.2em] text-cyan-400">
                                  ANALYZING IMAGE
                                </div>

                                <div className="mt-2 font-mono text-[8px] text-slate-600">
                                  AI DETECTING SENSITIVE ENTITIES
                                </div>

                              </div>

                            </div>

                          )}

                        </div>

                      </div>


                      {/* ==================================================
                          IMAGE STATUS
                      ================================================== */}

                      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                        <div className="flex items-center gap-3">

                          <PixelBadge
                            tone={
                              blurResultUrl
                                ? "green"
                                : scanResultUrl
                                ? "green"
                                : "neutral"
                            }
                          >

                            {blurResultUrl
                              ? "PROTECTED"
                              : scanResultUrl
                              ? "DETECTED"
                              : "READY TO SCAN"}

                          </PixelBadge>


                          {scanResultUrl && (

                            <span className="font-mono text-[9px] text-emerald-400">
                              Privacy regions identified
                            </span>

                          )}

                        </div>


                        {/* ==================================================
                            ACTION BUTTONS
                        ================================================== */}

                        <div className="flex flex-wrap items-center gap-2">


                          {!scanResultUrl && (

                            <PixelButton
                              tone="green"
                              disabled={!currentFile || status === STATUS.PROCESSING}
                              loading={status === STATUS.PROCESSING}
                              onClick={handleDetection}
                            >

                              <ScanLine size={14} />

                              {status === STATUS.PROCESSING
                                ? "SCANNING..."
                                : "DETECT PRIVACY"}

                            </PixelButton>

                          )}


                          {scanResultUrl && !blurResultUrl && (

                            <PixelButton
                              tone="green"
                              disabled={status === STATUS.PROCESSING}
                              loading={status === STATUS.PROCESSING}
                              onClick={handleBlur}
                            >

                              <ShieldCheck size={14} />

                              {status === STATUS.PROCESSING
                                ? "PROTECTING..."
                                : "BLUR PRIVACY"}

                            </PixelButton>

                          )}


                          {blurResultUrl && (

                            <a
                              href={blurResultUrl}
                              download={`privacy-protected-${currentFile.name}`}
                              className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/5 px-4 py-2 font-mono text-[9px] font-bold tracking-wider text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-500/10"
                            >

                              <Download size={13} />

                              DOWNLOAD

                            </a>

                          )}

                        </div>

                      </div>


                      {/* Error */}

                      {error && (

                        <div className="mt-4 border border-rose-500/20 bg-rose-500/5 p-3">

                          <div className="font-mono text-[9px] font-bold text-rose-400">
                            PRIVACY ENGINE ERROR
                          </div>

                          <div className="mt-1 font-mono text-[8px] leading-5 text-rose-300/70">
                            {error}
                          </div>

                        </div>

                      )}

                    </div>

                  )}

                </div>


                {/* ==========================================================
                    ANALYSIS PANEL
                ========================================================== */}

                <aside className="bg-slate-950/70">


                  <div className="border-b border-slate-800 px-5 py-4">

                    <div className="font-mono text-[8px] tracking-[0.2em] text-slate-600">
                      ANALYSIS
                    </div>

                    <div className="mt-1 font-mono text-sm text-slate-200">
                      Detection Results
                    </div>

                  </div>


                  <div className="p-5">


                    {/* Statistics */}

                    <div className="grid grid-cols-2 gap-2">

                      <AnalysisStat
                        label="SCAN"
                        value={
                          scanResultUrl
                            ? "DONE"
                            : "--"
                        }
                      />

                      <AnalysisStat
                        label="PROTECTION"
                        value={
                          blurResultUrl
                            ? "DONE"
                            : "--"
                        }
                      />

                    </div>


                    {/* ==================================================
                        PIPELINE STATUS
                    ================================================== */}

                    <div className="mt-8">

                      <div className="mb-3 font-mono text-[8px] tracking-[0.2em] text-slate-600">
                        PROTECTION PIPELINE
                      </div>


                      <div className="space-y-2">


                        {/* STEP 01 */}

                        <div
                          className={`border p-3 ${
                            currentFile
                              ? "border-cyan-500/20 bg-cyan-500/5"
                              : "border-slate-800"
                          }`}
                        >

                          <div className="flex items-center gap-3">

                            <div className="font-mono text-[9px] text-cyan-400">
                              01
                            </div>

                            <div className="flex-1">

                              <div className="font-mono text-[9px] font-bold text-slate-200">
                                IMAGE UPLOAD
                              </div>

                              <div className="mt-1 font-mono text-[8px] text-slate-600">
                                Source image loaded
                              </div>

                            </div>

                            {currentFile && (
                              <span className="text-emerald-400">
                                ✓
                              </span>
                            )}

                          </div>

                        </div>


                        {/* STEP 02 */}

                        <div
                          className={`border p-3 ${
                            scanResultUrl
                              ? "border-cyan-500/20 bg-cyan-500/5"
                              : "border-slate-800"
                          }`}
                        >

                          <div className="flex items-center gap-3">

                            <div className="font-mono text-[9px] text-cyan-400">
                              02
                            </div>

                            <div className="flex-1">

                              <div className="font-mono text-[9px] font-bold text-slate-200">
                                AI DETECTION
                              </div>

                              <div className="mt-1 font-mono text-[8px] text-slate-600">
                                Locate sensitive regions
                              </div>

                            </div>

                            {scanResultUrl && (
                              <span className="text-emerald-400">
                                ✓
                              </span>
                            )}

                          </div>

                        </div>


                        {/* STEP 03 */}

                        <div
                          className={`border p-3 ${
                            blurResultUrl
                              ? "border-emerald-500/20 bg-emerald-500/5"
                              : "border-slate-800"
                          }`}
                        >

                          <div className="flex items-center gap-3">

                            <div className="font-mono text-[9px] text-emerald-400">
                              03
                            </div>

                            <div className="flex-1">

                              <div className="font-mono text-[9px] font-bold text-slate-200">
                                PRIVACY PROTECTION
                              </div>

                              <div className="mt-1 font-mono text-[8px] text-slate-600">
                                Blur sensitive information
                              </div>

                            </div>

                            {blurResultUrl && (
                              <span className="text-emerald-400">
                                ✓
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>


                    {/* ==================================================
                        RESULT INFO
                    ================================================== */}

                    <div className="mt-8">

                      <PixelDivider
                        label="RESULT"
                        tone="green"
                        spacing="sm"
                      />


                      {!scanResultUrl && !blurResultUrl && (

                        <div className="mt-4 border border-dashed border-slate-800 p-5">

                          <div className="font-mono text-[9px] leading-5 text-slate-600">

                            Waiting for analysis.

                            <br />

                            Detection results will appear here.

                          </div>

                        </div>

                      )}


                      {scanResultUrl && !blurResultUrl && (

                        <div className="mt-4 border border-cyan-500/20 bg-cyan-500/5 p-4">

                          <div className="flex items-start gap-3">

                            <ScanLine
                              size={15}
                              className="mt-0.5 text-cyan-400"
                            />

                            <div>

                              <div className="font-mono text-[9px] font-bold text-cyan-400">
                                PRIVACY DETECTED
                              </div>

                              <div className="mt-2 font-mono text-[8px] leading-5 text-slate-500">
                                Sensitive regions have been identified.
                                Continue to protection to blur the
                                detected privacy information.
                              </div>

                            </div>

                          </div>

                        </div>

                      )}


                      {blurResultUrl && (

                        <div className="mt-4 border border-emerald-500/20 bg-emerald-500/5 p-4">

                          <div className="flex items-start gap-3">

                            <ShieldCheck
                              size={15}
                              className="mt-0.5 text-emerald-400"
                            />

                            <div>

                              <div className="font-mono text-[9px] font-bold text-emerald-400">
                                IMAGE PROTECTED
                              </div>

                              <div className="mt-2 font-mono text-[8px] leading-5 text-slate-500">
                                Privacy-sensitive information has been
                                automatically blurred and the image is
                                ready to be shared.
                              </div>

                            </div>

                          </div>

                        </div>

                      )}

                    </div>


                    {/* DOWNLOAD */}

                    {blurResultUrl && (

                      <div className="mt-6">

                        <a
                          href={blurResultUrl}
                          download={`privacy-protected-${currentFile.name}`}
                          className="flex w-full items-center justify-between border border-emerald-500/20 bg-emerald-500/5 p-4 text-left transition hover:border-emerald-400/40 hover:bg-emerald-500/10"
                        >

                          <div className="flex items-center gap-3">

                            <div className="flex h-8 w-8 items-center justify-center border border-emerald-500/20">

                              <Download
                                size={14}
                                className="text-emerald-400"
                              />

                            </div>

                            <div>

                              <div className="font-mono text-[10px] font-bold text-slate-200">
                                DOWNLOAD PROTECTED IMAGE
                              </div>

                              <div className="mt-1 font-mono text-[8px] text-slate-600">
                                Ready for safe sharing
                              </div>

                            </div>

                          </div>

                          <ArrowRight
                            size={14}
                            className="text-emerald-400"
                          />

                        </a>

                      </div>

                    )}

                  </div>

                </aside>

              </div>

            </div>

          </PixelContainer>


          {/* ================================================================
              DETECTION CAPABILITIES
          ================================================================ */}

          <PixelContainer className="pb-20">

            <div className="mb-8 max-w-2xl">

              <PixelBadge tone="green">
                DETECTION CAPABILITIES
              </PixelBadge>

              <h2 className="mt-4 font-pixel text-2xl text-slate-100 sm:text-3xl">

                What can we

                <span className="text-cyan-400">
                  {" "}protect?
                </span>

              </h2>

              <p className="mt-3 font-mono text-[10px] leading-5 text-slate-500">
                AI SHIELD CAN IDENTIFY VISUAL INFORMATION THAT SHOULD
                NOT BE EXPOSED PUBLICLY.
              </p>

            </div>


            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <ProtectionType
                number="01"
                title="KTP"
                tag="IDENTITY"
                description="Identity documents containing personal information."
              />

              <ProtectionType
                number="02"
                title="QR CODE"
                tag="CODE"
                description="QR codes containing potentially sensitive data."
              />

              <ProtectionType
                number="03"
                title="PLAT NOMOR"
                tag="VEHICLE"
                description="Vehicle registration information exposed in images."
              />

              <ProtectionType
                number="04"
                title="STRUK BELANJA"
                tag="FINANCIAL"
                description="Receipts containing financial information."
              />

            </div>

          </PixelContainer>


          {/* ================================================================
              AI PIPELINE
          ================================================================ */}

          <PixelContainer className="pb-20">

            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

              <div className="max-w-2xl">

                <PixelBadge tone="green">
                  AI PIPELINE
                </PixelBadge>

                <h2 className="mt-4 font-pixel text-2xl text-slate-100 sm:text-3xl">

                  From image to

                  <span className="text-emerald-400">
                    {" "}protection.
                  </span>

                </h2>

              </div>

              <div className="font-mono text-[8px] tracking-wider text-slate-600">
                UPLOAD → DETECT → PROTECT
              </div>

            </div>


            <div className="grid grid-cols-1 gap-px overflow-hidden border border-slate-800 bg-slate-800 md:grid-cols-3">

              <AiStep
                number="01"
                title="UPLOAD"
                description="The original image enters the privacy protection pipeline."
              />

              <AiStep
                number="02"
                title="DETECT"
                description="The AI scans the image and returns visual detection results."
              />

              <AiStep
                number="03"
                title="PROTECT"
                description="Sensitive regions are automatically blurred and prepared for sharing."
              />

            </div>

          </PixelContainer>


          {/* ================================================================
              FINAL CTA
          ================================================================ */}

          <PixelContainer className="pb-20">

            <div className="flex flex-col items-start justify-between gap-6 border-y border-slate-800 py-8 sm:flex-row sm:items-center">

              <div>

                <div className="font-mono text-[9px] tracking-[0.2em] text-emerald-400">
                  READY WHEN YOU ARE
                </div>

                <h3 className="mt-2 font-pixel text-xl text-slate-200">
                  Protect before you share.
                </h3>

              </div>


              <button
                type="button"
                onClick={() => {
                  document
                    .querySelector('input[type="file"]')
                    ?.click()
                }}
                className="flex items-center gap-3 border border-cyan-500/30 bg-cyan-500/5 px-5 py-3 font-mono text-[9px] font-bold tracking-wider text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-500/10"
              >

                <Upload size={14} />

                SCAN AN IMAGE

                <ArrowRight size={13} />

              </button>

            </div>

          </PixelContainer>


          {/* ================================================================
              FOOTER
          ================================================================ */}

          <PixelContainer className="border-t border-slate-800 py-7">

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">

              <div className="flex items-center gap-2">

                <ShieldCheck
                  size={14}
                  className="text-cyan-400"
                />

                <span className="font-mono text-[9px] tracking-wider text-slate-500">
                  AI SHIELD / PRIVACY DETECTION
                </span>

              </div>

              <div className="font-mono text-[8px] tracking-wider text-slate-700">
                PROTECT BEFORE YOU SHARE.
              </div>

            </div>

          </PixelContainer>

        </main>

      </PxlKitSurfaceProvider>
    </div>
  )

}


/*
|--------------------------------------------------------------------------
| ANALYSIS STAT
|--------------------------------------------------------------------------
*/

function AnalysisStat({
  label,
  value,
}) {
  return (
    <div className="border border-slate-800 bg-slate-900/40 p-3">

      <div className="font-mono text-[8px] tracking-widest text-slate-600">
        {label}
      </div>

      <div className="mt-2 font-pixel text-xl text-slate-200">
        {value}
      </div>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| PROTECTION TYPE
|--------------------------------------------------------------------------
*/

function ProtectionType({
  number,
  title,
  tag,
  description,
}) {
  return (
    <div className="group relative overflow-hidden border border-slate-800 bg-slate-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40">

      <div className="flex items-center justify-between">

        <span className="font-pixel text-[10px] text-cyan-500/70">
          {number}
        </span>

        <span className="border border-slate-800 px-2 py-1 font-mono text-[8px] text-slate-600">
          {tag}
        </span>

      </div>


      <div className="mt-8">

        <h3 className="font-pixel text-lg text-slate-200 transition-colors group-hover:text-cyan-400">
          {title}
        </h3>

        <p className="mt-3 font-mono text-[9px] leading-5 text-slate-600">
          {description}
        </p>

      </div>


      <div className="mt-6 flex items-center gap-2">

        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

        <span className="font-mono text-[8px] tracking-widest text-emerald-500">
          READY TO DETECT
        </span>

      </div>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| AI STEP
|--------------------------------------------------------------------------
*/

function AiStep({
  number,
  title,
  description,
}) {
  return (
    <div className="relative bg-slate-950 p-6">

      <div className="flex items-center justify-between">

        <span className="font-pixel text-xs text-cyan-400">
          {number}
        </span>

        {number !== '04' && (
          <ArrowRight
            size={13}
            className="hidden text-slate-700 lg:block"
          />
        )}

      </div>


      <div className="mt-10">

        <h3 className="font-mono text-xs font-bold tracking-widest text-slate-200">
          {title}
        </h3>

        <p className="mt-3 font-mono text-[9px] leading-5 text-slate-600">
          {description}
        </p>

      </div>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| METRIC
|--------------------------------------------------------------------------
*/

function Metric({
  value,
  label,
}) {
  return (
    <div className="flex flex-col justify-between border border-slate-800 bg-slate-950/70 p-4">

      <span className="font-pixel text-lg text-emerald-400">
        {value}
      </span>

      <span className="mt-8 font-mono text-[8px] tracking-widest text-slate-500">
        {label}
      </span>

    </div>
  )
}
