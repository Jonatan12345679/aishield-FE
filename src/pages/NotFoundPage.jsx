import { Link } from "react-router-dom";
import { PxlKitIcon } from "@pxlkit/core";
import { PixelBadge, PixelButton } from "@pxlkit/ui-kit";
import { Lock } from "@pxlkit/ui";

export default function NotFoundPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <PixelBadge tone="red" variant="outline" className="font-accent mb-6">
        ACCESS DENIED
      </PixelBadge>

      <PxlKitIcon icon={Lock} size={56} color="#FF0055" />

      <h1
        className="font-pixel text-4xl md:text-6xl mt-6"
        style={{ color: "#FF0055" }}
      >
        404
      </h1>

      <p className="font-accent text-neutral-400 mt-4 max-w-md">
        HALAMAN TIDAK DITEMUKAN — data pada rute ini mungkin sudah disensor oleh
        sistem.
      </p>

      <div
        className="pixel-box mt-8 p-4 text-left w-full max-w-md"
        style={{ background: "#0e111a" }}
      >
        <p className="terminal-body" style={{ color: "#FF0055" }}>
          &gt; ERROR: route not found in registry
        </p>
        <p className="terminal-body text-neutral-500">
          &gt; suggestion: return to a known route
        </p>
      </div>

      <Link to="/" className="mt-8 inline-block">
        <PixelButton tone="green">Kembali ke Home</PixelButton>
      </Link>
    </section>
  );
}
