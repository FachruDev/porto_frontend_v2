"use client"

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
      {/* Deep dark base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-950 to-black" />
      
      {/* Subtle organic overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-stone-700/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-stone-700/15 via-transparent to-transparent" />
      
      {/* Gentle animated gradients - slow & calm */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-float-gentle rounded-full bg-stone-700/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/3 h-80 w-80 animate-float-slower rounded-full bg-stone-600/8 blur-3xl" />
      
      {/* Subtle noise texture for organic feel */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Minimal line pattern - like wood grain */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(120, 113, 108, 0.3) 2px, rgba(120, 113, 108, 0.3) 3px)',
          backgroundSize: '60px 100%',
        }}
      />
      
      {/* Vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/20 via-transparent to-stone-950/20" />
      
      <style>{`
        @keyframes float-gentle {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
          }
          50% { 
            transform: translate(20px, -15px) scale(1.05);
          }
        }
        @keyframes float-slower {
          0%, 100% { 
            transform: translate(0, 0);
          }
          50% { 
            transform: translate(-15px, 10px);
          }
        }
        .animate-float-gentle {
          animation: float-gentle 25s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}