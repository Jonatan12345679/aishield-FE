export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-cyan-400/20 blur-xl animate-[pulse_2s_ease-in-out_infinite]" />

          <div className="relative w-full h-full grid grid-cols-4 grid-rows-4 gap-[3px] p-1">
            {Array.from({ length: 16 }).map((_, i) => {
              const delay = (i % 4) * 80 + Math.floor(i / 4) * 80
              return (
                <div
                  key={i}
                  className="bg-cyan-400 rounded-[1px]"
                  style={{
                    animation: 'pxl-blink 1.6s ease-in-out infinite',
                    animationDelay: `${delay}ms`,
                  }}
                />
              )
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-xs tracking-[0.3em] text-cyan-400 uppercase">
            Scanning Privacy Data
          </p>

          <div className="w-40 h-2 bg-cyan-950 border border-cyan-800/50 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 animate-[pxl-loadbar_1.8s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pxl-blink {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes pxl-loadbar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}