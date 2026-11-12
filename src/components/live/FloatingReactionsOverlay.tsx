import React, { useEffect, useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';

export type ReactionType = 'heart' | 'like' | 'clap';

export interface ReactionParticle {
  id: string;
  type: ReactionType;
  icon: string;
  x: number; // percentage horizontally (0 - 100)
  startY?: number; // percentage from bottom (0 - 100)
  size: number;
  rotation: number;
  color: string;
  sway: number; // horizontal sway distance in px
  duration: number; // duration in seconds
}

interface FloatingReactionsOverlayProps {
  activeStreamId?: string;
  userReactions?: ReactionParticle[];
  comboCount?: number;
  comboType?: ReactionType | null;
}

export const FloatingReactionsOverlay: React.FC<FloatingReactionsOverlayProps> = ({
  activeStreamId,
  userReactions = [],
  comboCount = 0,
  comboType = null,
}) => {
  const { flyingGifts } = usePlatform();
  const [ambientParticles, setAmbientParticles] = useState<ReactionParticle[]>([]);

  // Organic background stream reactions (simulate active lively audience)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.35) {
        const types: ReactionType[] = ['heart', 'like', 'clap'];
        const chosenType = types[Math.floor(Math.random() * types.length)];

        const heartIcons = ['❤️', '💖', '💕', '💓'];
        const likeIcons = ['👍', '🔥', '✨', '⚡'];
        const clapIcons = ['👏', '🙌', '🎉', '🥂'];

        let icon = '❤️';
        let color = '#f43f5e';

        if (chosenType === 'heart') {
          icon = heartIcons[Math.floor(Math.random() * heartIcons.length)];
          color = ['#f43f5e', '#ec4899', '#fb7185'][Math.floor(Math.random() * 3)];
        } else if (chosenType === 'like') {
          icon = likeIcons[Math.floor(Math.random() * likeIcons.length)];
          color = ['#38bdf8', '#fbbf24', '#f59e0b'][Math.floor(Math.random() * 3)];
        } else {
          icon = clapIcons[Math.floor(Math.random() * clapIcons.length)];
          color = ['#10b981', '#a855f7', '#6366f1'][Math.floor(Math.random() * 3)];
        }

        const newParticle: ReactionParticle = {
          id: `ambient-${Date.now()}-${Math.random()}`,
          type: chosenType,
          icon,
          x: Math.floor(70 + Math.random() * 26), // right side 70-96%
          startY: Math.floor(10 + Math.random() * 15),
          size: Math.floor(20 + Math.random() * 16),
          rotation: Math.floor(-25 + Math.random() * 50),
          color,
          sway: Math.floor(-30 + Math.random() * 60),
          duration: 2.5 + Math.random() * 0.8,
        };

        setAmbientParticles((prev) => [...prev.slice(-25), newParticle]);
      }
    }, 900);

    return () => clearInterval(interval);
  }, [activeStreamId]);

  // Clean old ambient particles
  useEffect(() => {
    if (ambientParticles.length === 0) return;
    const cleanup = setTimeout(() => {
      setAmbientParticles((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(cleanup);
  }, [ambientParticles]);

  const allVisibleParticles = [...ambientParticles, ...userReactions];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 select-none">
      {/* Floating Particles Layer */}
      {allVisibleParticles.map((p) => (
        <div
          key={p.id}
          className="absolute will-change-transform"
          style={{
            left: `${p.x}%`,
            bottom: `${p.startY || 12}%`,
            animation: `floatRise ${p.duration}s cubic-bezier(0.2, 0.6, 0.35, 1) forwards`,
            fontSize: `${p.size}px`,
            filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.65))',
            transform: `rotate(${p.rotation}deg)`,
            '--sway-x': `${p.sway}px`,
          } as React.CSSProperties}
        >
          <span>{p.icon}</span>
        </div>
      ))}

      {/* Interactive Combo Multiplier Badge */}
      {comboCount > 1 && (
        <div
          key={`combo-${comboCount}`}
          className="absolute bottom-28 right-8 z-40 pointer-events-none animate-combo-pop"
        >
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-indigo-600 text-white font-black text-sm shadow-2xl border border-white/20">
              <span>{comboType === 'heart' ? '❤️' : comboType === 'like' ? '👍' : '👏'}</span>
              <span className="tabular-nums tracking-wider text-base">x{comboCount}</span>
              <span className="text-[10px] uppercase tracking-widest text-amber-200">
                {comboCount >= 20 ? 'MEGA!' : comboCount >= 10 ? 'SUPER!' : 'COMBO'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* High-Impact Flying Gift Banners */}
      <div className="absolute top-6 left-6 space-y-3 z-40 max-w-sm pointer-events-none">
        {flyingGifts.map((fg) => (
          <div
            key={fg.id}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-950/95 via-purple-950/90 to-slate-900/95 border border-rose-500/40 shadow-2xl backdrop-blur-md"
            style={{
              animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-2xl shadow-lg animate-pulse">
              {fg.gift.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{fg.sender}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  SENT GIFT
                </span>
              </div>
              <p className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-rose-200">
                {fg.gift.name} ({fg.gift.coinValue} Coins)
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatRise {
          0% {
            opacity: 0.95;
            transform: translateY(0) translateX(0) scale(0.6) rotate(0deg);
          }
          30% {
            opacity: 1;
            transform: translateY(-90px) translateX(var(--sway-x, 15px)) scale(1.15) rotate(10deg);
          }
          70% {
            opacity: 0.85;
            transform: translateY(-240px) translateX(calc(var(--sway-x, 15px) * -1)) scale(1.05) rotate(-10deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-380px) translateX(calc(var(--sway-x, 15px) * 0.5)) scale(1.3) rotate(15deg);
          }
        }
        @keyframes bounceIn {
          0% { transform: translateX(-40px) scale(0.85); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes comboPop {
          0% { transform: scale(0.7) translateY(10px); opacity: 0.6; }
          50% { transform: scale(1.25) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-combo-pop {
          animation: comboPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};
