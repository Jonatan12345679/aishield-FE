import { useMemo } from 'react'
import '@/assets/styles/LandingPage.css'
import imgAiShield from '@/assets/img/module-aishield.png'
import imgBlurai from '@/assets/img/module-blurai.png'

const LINK_AISHIELD = '/aishield'
const LINK_BLURAI = '/blurai'

const PALETTE = ['#2de1a0', '#b06df5', '#facc15', '#ff5c8a', '#22d3ee']

const MODULES = [
  {
    variant: 'green',
    moduleNo: 'MODULE-01',
    tag: 'ISOLATION FOREST',
    img: imgAiShield,
    alt: 'Gambar AI Shield',
    title: 'AISHIELD',
    sub: 'NETWORK ANOMALY & CYBER THREAT DETECTION',
    desc: 'Real-time Network Anomaly & Threat Detection Engine using Isolation Forest.',
    cta: 'LAUNCH AISHIELD',
    href: LINK_AISHIELD,
  },
  {
    variant: 'purple',
    moduleNo: 'MODULE-02',
    tag: 'YOLO CV',
    img: imgBlurai, 
    alt: 'Gambar BLURAI',
    title: 'BLURAI',
    sub: 'PII & SENSITIVE DATA DETECTION',
    desc: 'Computer Vision PII & Object Redaction Powered by YOLO.',
    cta: 'LAUNCH SCANNER',
    href: LINK_BLURAI,
  },
]

function PixelField({ count = 56 }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (Math.random() * 98).toFixed(2),
        top: (Math.random() * 96).toFixed(2),
        size: 3 + Math.round(Math.random() * 3),
        color: PALETTE[i % PALETTE.length],
        delay: (Math.random() * 4).toFixed(2),
        dur: (2 + Math.random() * 3).toFixed(2),
      })),
    [count]
  )

  return (
    <div className="pixel-field" aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          style={{
            left: d.left + '%',
            top: d.top + '%',
            width: d.size,
            height: d.size,
            background: d.color,
            boxShadow: '0 0 6px ' + d.color,
            animationDelay: d.delay + 's',
            animationDuration: d.dur + 's',
          }}
        />
      ))}
    </div>
  )
}

function ModuleCard({ variant, moduleNo, tag, img, alt, title, sub, desc, cta, href }) {
  return (
    <article className={'card ' + variant}>
      <div className="card-top">
        <span className="mod-badge">{moduleNo}</span>
        <span className="mod-tag">{tag}</span>
      </div>

      <div className="frame">
        {img ? (
          <img src={img} alt={alt} loading="lazy" />
        ) : (
          <div
            style={{
              aspectRatio: '4/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3a4a63',
              fontSize: 11,
            }}
          >
            gambar belum di-import
          </div>
        )}
      </div>

      <h2>{title}</h2>
      <div className="sub">{sub}</div>
      <p className="desc">{desc}</p>

      <a className="btn" href={href}>
        {cta} <span className="arrow">▶</span>
      </a>
    </article>
  )
}

export default function LandingPage() {
  return (
    <div className="pxl-root">
      <PixelField />
      <div className="scanlines" aria-hidden="true" />

      <header className="topbar">
        <span className="brand">AEGIS AI</span>
        <span className="status">
          SYS.STATUS: <b>ONLINE</b>
        </span>
      </header>

      <main>
        <section className="hero">
          <span className="badge">[ CYBER & PRIVACY SECURITY SUITE v1.0 ]</span>
          <h1>
          SELECT SECURITY MODULE
            <span className="cursor" aria-hidden="true" />
          </h1>
          <p>
            Two engines. One mission — <span className="hl-cyan">detect network anomalies</span> &{' '}
            <span className="hl-pink">protect visual privacy</span>.
          </p>
        </section>

        <section className="cards">
          {MODULES.map((m) => (
            <ModuleCard key={m.moduleNo} {...m} />
          ))}
        </section>
      </main>

      <footer className="footer">
        <span className="coin">Info Loker ▸</span> © 2026 <b>AEGIS AI</b> — AISHIELD × BLURAI
      </footer>
    </div>
  )
}