import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { PxlKitIcon } from "@pxlkit/core";
import { PixelBadge, PixelButton } from "@pxlkit/ui-kit";
import { Lock } from "@pxlkit/ui";
import "@/assets/styles/NotFoundPage.css";

function randomHex(length = 8) {
  let out=""
  for (let i = 0; i < length; i++) {
    out += Math.floor(Math.random() * 16).toString(16);
  }
  return out.toUpperCase();
}

export default function NotFoundPage() {
  const location = useLocation();

  const traceId = useMemo(() => `0x${randomHex(8)}`, []);
  const sectorId = useMemo(() => `0x${randomHex(8)}`, []);

  return (
    <section className="notfound">
      <div className="notfound__grid-bg" />
      <div className="notfound__scanlines" />

      <div className="notfound__container">
        <span className="notfound__corner notfound__corner--tl" />
        <span className="notfound__corner notfound__corner--tr" />
        <span className="notfound__corner notfound__corner--bl" />
        <span className="notfound__corner notfound__corner--br" />

        <div className="notfound__header">
          <div className="notfound__header-left">
            <span className="notfound__header-dot" />
            <span>SYSTEM.ERR</span>
          </div>
          <div className="notfound__window-controls">
            <span className="notfound__window-btn" />
            <span className="notfound__window-btn" />
            <span className="notfound__window-btn" />
          </div>
        </div>

        <div className="notfound__body">  
          <PixelBadge tone="red" variant="outline" className="font-accent notfound__badge">
            ACCESS DENIED
          </PixelBadge>

          <div className="notfound__lock">
            <PxlKitIcon icon={Lock} size={48} color="#FF0055" />
          </div>

          <h1 className="notfound__title" data-text="404">
            404
          </h1>
          <p className="notfound__subtitle">ROUTE NOT FOUND</p>

          <p className="notfound__desc">
            HALAMAN TIDAK DITEMUKAN — data pada rute ini mungkin sudah
            disensor oleh sistem atau rute tidak valid.
          </p>

          <div className="notfound__terminal">
            <div className="notfound__terminal-header">
              <span>[DEBUG.LOG]</span>
              <span className="notfound__terminal-indicator">●</span>
            </div>
            <div className="notfound__terminal-body">
              <p className="notfound__terminal-line notfound__terminal-line--error">
                &gt; ERROR: route "{location.pathname}" not found in registry
              </p>
              <p className="notfound__terminal-line">
                &gt; trace: {traceId} → sector {sectorId} unknown
              </p>
              <p className="notfound__terminal-line">
                &gt; suggestion: return to a known route
                <span className="notfound__cursor">_</span>
              </p>
            </div>
          </div>

          <Link to="/" className="notfound__home-link">
            <PixelButton tone="green">Kembali ke Home</PixelButton>
          </Link>
        </div>
      </div>
    </section>
  );
} 