import React, { useCallback, useMemo, useState } from "react";

/**
 * PIXELS — Landing / Workspace Page
 * -----------------------------------------------------------------------
 * Dibangun SEPENUHNYA di atas @pxlkit/ui-kit (bukan div/Tailwind mentah).
 * Utility lokal/standalone — bukan SaaS, bukan cloud subscription.
 *
 * Instalasi:
 *   npm install @pxlkit/core @pxlkit/ui-kit @pxlkit/feedback tailwindcss
 *
 * Setup CSS (index.css):
 *   @import "tailwindcss";
 *   @import "@pxlkit/ui-kit/styles.css";
 *   @source "../node_modules/@pxlkit/ui-kit";
 *
 * Tema warna: kit ini men-dokumentasikan bahwa seluruh warna dikendalikan
 * lewat CSS custom properties (--retro-*), jadi kita override token-nya
 * ke palet slate-900 di root wrapper — bukan menulis ulang komponennya.
 */

import {
  PxlKitSurfaceProvider,
  PixelContainer,
  PixelBadge,
  PixelFlicker,
  PixelFileUpload,
  PixelButton,
  PixelStatCard,
  PixelStatGroup,
  PixelStepper,
  PixelDivider,
  PixelAlert,
} from "@pxlkit/ui-kit";
import { CheckCircle } from "@pxlkit/feedback";

const STATUS = {
  IDLE: "idle",
  READY: "ready",
  SCANNING: "scanning",
  DONE: "done",
};

// Override token warna resmi pxlkit ke tema slate-900 (lihat "Design Tokens"
// di docs — semua komponen membaca variabel ini, tidak perlu class custom).
const PIXELS_THEME_VARS = {
  "--retro-bg": "#0f172a", // slate-900
  "--retro-surface": "#1e293b", // slate-800
  "--retro-card": "#1e293b", // slate-800
  "--retro-border": "#334155", // slate-700
  "--retro-text": "#e2e8f0", // slate-200
  "--retro-muted": "#94a3b8", // slate-400
  "--retro-green": "#00FF88",
  "--retro-red": "#FF0055",
};

export default function PrivacyDetectionPage() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [latency, setLatency] = useState(null);

  const currentFile = files[0] ?? null;

  const handleFilesChange = useCallback((next) => {
    setFiles(next);
    setStatus(next.length ? STATUS.READY : STATUS.IDLE);
    setLatency(null);
  }, []);

  const onScan = useCallback(() => {
    if (!currentFile || status === STATUS.SCANNING) return;
    setStatus(STATUS.SCANNING);
    setLatency(null);
    const start = performance.now();
    // Simulasi pemrosesan lokal (deteksi entitas + sensor piksel).
    setTimeout(() => {
      setLatency(Math.round(performance.now() - start));
      setStatus(STATUS.DONE);
    }, 700 + Math.random() * 500);
  }, [currentFile, status]);

  // Step aktif pada PixelStepper mengikuti status nyata proses — bukan
  // sekadar dekorasi, tapi representasi alur yang sedang berjalan.
  const activeStep = useMemo(() => {
    if (status === STATUS.SCANNING) return 0; // deteksi + sensor berjalan
    if (status === STATUS.DONE) return 2; // pemrosesan lokal selesai
    return 0;
  }, [status]);

  const engineTone =
    status === STATUS.SCANNING ? "red" : status === STATUS.DONE ? "green" : "neutral";

  const engineTrend =
    status === STATUS.SCANNING
      ? "Engine aktif"
      : status === STATUS.DONE
      ? "Selesai"
      : "Menunggu gambar";

  return (
    <div className="dark min-h-screen w-full" style={PIXELS_THEME_VARS}>
      <PxlKitSurfaceProvider surface="pixel">
        <div style={{ background: "var(--retro-bg)", color: "var(--retro-text)" }}>
          {/* ============ HERO & BRAND (tanpa navbar) ============ */}
          <PixelContainer className="pt-24 pb-16 text-center">
            <PixelBadge tone="green">Local Pixel Redaction Utility</PixelBadge>

            <PixelFlicker duration={2200}>
              <h1 className="font-pixel mt-6 text-5xl sm:text-6xl leading-tight text-[var(--retro-text)]">
                PIXELS
              </h1>
            </PixelFlicker>

            <p className="font-mono mt-4 text-sm sm:text-base text-[var(--retro-muted)]">
              Protection Information Exploration in the Digital Era
            </p>

            <p className="font-body mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[var(--retro-muted)]">
              Utilitas pemindai data rahasia pada gambar yang mengaplikasikan
              sensor piksel secara otomatis, dijalankan langsung pada
              perangkat Anda.
            </p>
          </PixelContainer>

          {/* ============ WORKSPACE ============ */}
          <PixelContainer className="pb-20 max-w-2xl">
            <div className="border border-[var(--retro-border)] bg-[var(--retro-surface)] p-5 sm:p-8">
              <PixelStatGroup aria-label="Status mesin pemindai">
                <PixelStatCard
                  label="Engine"
                  value={
                    status === STATUS.SCANNING
                      ? "ACTIVE"
                      : status === STATUS.DONE
                      ? "COMPLETE"
                      : "IDLE"
                  }
                  tone={engineTone}
                  trend={engineTrend}
                />
                <PixelStatCard
                  label="Latency"
                  value={latency !== null ? `${latency} ms` : "-- ms"}
                  tone={latency !== null ? "green" : "neutral"}
                />
              </PixelStatGroup>

              <div className="mt-6">
                <PixelFileUpload
                  label="Unggah Gambar"
                  hint="PNG · JPG — diproses sepenuhnya secara lokal"
                  value={files}
                  onChange={handleFilesChange}
                  accept="image/*"
                  maxFiles={1}
                  maxSize={10 * 1024 * 1024}
                  tone="green"
                />
              </div>

              <div className="mt-6 flex flex-col items-center gap-3">
                <PixelButton
                  tone="green"
                  disabled={!currentFile}
                  loading={status === STATUS.SCANNING}
                  onClick={onScan}
                >
                  {status === STATUS.SCANNING ? "Memindai..." : "Mulai Pemindaian"}
                </PixelButton>

                {status === STATUS.DONE && (
                  <PixelAlert
                    tone="green"
                    icon={<CheckCircle width={16} height={16} />}
                    title="Pemindaian selesai"
                    message="Sensor piksel telah diterapkan pada gambar."
                  />
                )}
              </div>
            </div>
          </PixelContainer>

          <PixelContainer className="pb-4 max-w-2xl">
            <PixelDivider label="Alur Proses" tone="green" spacing="lg" />
          </PixelContainer>

          {/* ============ CORE UTILITY INFO — alur proses nyata ============ */}
          <PixelContainer className="pb-24 max-w-2xl">
            <PixelStepper active={activeStep}>
              <PixelStepper.Step
                label="Deteksi Otomatis"
                description="Memindai entitas data sensitif pada foto."
              />
              <PixelStepper.Step
                label="Sensor Piksel"
                description="Menutup area sensitif secara otomatis."
              />
              <PixelStepper.Step
                label="Pemrosesan Lokal"
                description="Performa analisis cepat dengan latensi minimal."
              />
            </PixelStepper>
          </PixelContainer>

          {/* ============ FOOTER (standalone, bukan footer SaaS) ============ */}
          <PixelContainer className="border-t border-[var(--retro-border)] py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <PixelBadge tone="neutral">PIXELS — Offline / Standalone Utility</PixelBadge>
              <p className="font-mono text-[11px] text-[var(--retro-muted)]">
                © {new Date().getFullYear()} PIXELS. Seluruh proses berjalan
                secara lokal.
              </p>
            </div>
          </PixelContainer>
        </div>
      </PxlKitSurfaceProvider>
    </div>
  );
}