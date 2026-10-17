import { WidgetTheme } from './types';

/**
 * 15 Production-Grade Streamer Themes
 * Optimized for OBS Studio Browser Source & Streamlabs
 * Full hardware acceleration and transparency support.
 */
export const WIDGET_THEMES: WidgetTheme[] = [
  // 1. Kick Signature Electric
  {
    id: 'kick-electric',
    name: 'Kick Electric',
    nameTr: 'Kick Elektrik Yeşili',
    description: 'Official Kick electric green and obsidian black gaming vibe',
    descriptionTr: 'Resmi Kick neon yeşili ve obsidian siyah modern oyuncu teması',
    category: 'Gaming',
    previewBadgeColor: '#53FC18',
    soundPreset: 'sub-alert',
    styles: {
      container: 'bg-black/85 border-2 border-[#53FC18] shadow-[0_0_25px_rgba(83,252,24,0.35)] backdrop-blur-md rounded-2xl p-5',
      title: 'text-[#53FC18] font-black uppercase tracking-wider text-sm flex items-center gap-2 drop-shadow-[0_0_8px_rgba(83,252,24,0.5)]',
      counterText: 'text-white font-extrabold text-4xl drop-shadow-md',
      goalText: 'text-zinc-400 font-semibold text-2xl',
      progressTrack: 'bg-zinc-900/90 border border-zinc-800 rounded-full h-4 overflow-hidden p-0.5',
      progressFill: 'bg-gradient-to-r from-[#53FC18] to-[#40c713] shadow-[0_0_15px_#53FC18] rounded-full h-full transition-all duration-500 ease-out',
      badge: 'bg-[#53FC18] text-black font-black text-xs px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(83,252,24,0.6)] uppercase',
      statsText: 'text-zinc-400 text-xs font-medium',
      accentGlow: 'rgba(83, 252, 24, 0.4)'
    }
  },

  // 2. Cyberpunk Neon
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    nameTr: 'Siberpunk Neon',
    description: 'Vibrant cyan and magenta electric glow with futuristic neon typography',
    descriptionTr: 'Canlı camgöbeği ve macenta neon ışıklarıyla fütüristik siber tema',
    category: 'Modern',
    previewBadgeColor: '#00f0ff',
    soundPreset: 'arcade-powerup',
    styles: {
      container: 'bg-[#0a0017]/90 border-2 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.4)] backdrop-blur-md rounded-xl p-5',
      title: 'text-[#ff007f] font-black uppercase tracking-widest text-sm drop-shadow-[0_0_10px_#ff007f]',
      counterText: 'text-[#00f0ff] font-extrabold text-4xl drop-shadow-[0_0_12px_#00f0ff]',
      goalText: 'text-[#ff007f]/70 font-bold text-2xl',
      progressTrack: 'bg-[#180033] border border-[#ff007f]/50 rounded-lg h-4 overflow-hidden',
      progressFill: 'bg-gradient-to-r from-[#00f0ff] via-[#b000ff] to-[#ff007f] shadow-[0_0_20px_#00f0ff] h-full transition-all duration-500',
      badge: 'bg-[#ff007f] text-white font-bold text-xs px-2.5 py-1 rounded shadow-[0_0_12px_#ff007f] tracking-wide',
      statsText: 'text-[#00f0ff]/70 text-xs font-mono',
      accentGlow: 'rgba(0, 240, 255, 0.5)'
    }
  },

  // 3. Retro 8-Bit Arcade
  {
    id: 'retro-arcade-8bit',
    name: '8-Bit Arcade',
    nameTr: '8-Bit Atari Salonu',
    description: 'Nostalgic pixelated styling, coin arcade vibes and blocky progress',
    descriptionTr: 'Nostaljik pikselli yazı tipi, arcade atari havası ve bloklu sayaç',
    category: 'Retro',
    previewBadgeColor: '#fbbf24',
    soundPreset: 'retro-coin',
    styles: {
      container: 'bg-[#1a1423]/95 border-4 border-[#fbbf24] shadow-[6px_6px_0px_0px_#f59e0b] rounded-none p-5 font-mono',
      title: 'text-[#fbbf24] font-black uppercase tracking-wider text-sm flex items-center gap-1.5',
      counterText: 'text-[#38bdf8] font-black text-3xl tracking-wider',
      goalText: 'text-[#f59e0b] font-black text-2xl',
      progressTrack: 'bg-black border-2 border-[#fbbf24] h-5 p-0.5',
      progressFill: 'bg-[#fbbf24] repeating-linear-gradient(45deg,#fbbf24,#fbbf24_10px,#f59e0b_10px,#f59e0b_20px) h-full transition-all duration-300',
      badge: 'bg-[#f59e0b] text-black font-black text-xs px-2 py-0.5 rounded-none uppercase border-2 border-black',
      statsText: 'text-[#fbbf24]/80 text-xs font-mono uppercase tracking-wide',
      accentGlow: 'rgba(251, 191, 36, 0.5)'
    }
  },

  // 4. Glassmorphism Clean
  {
    id: 'glassmorphism-clean',
    name: 'Clean Glass',
    nameTr: 'Buzlu Cam (Glassmorphism)',
    description: 'Ultra-modern frosted glass, smooth blur backdrop, and refined minimalism',
    descriptionTr: 'Ultra modern buzlu cam arka plan, pürüzsüz estetik ve zarif minimalizm',
    category: 'Minimal',
    previewBadgeColor: '#ffffff',
    soundPreset: 'chime',
    styles: {
      container: 'bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl rounded-3xl p-5 text-white',
      title: 'text-white/90 font-medium tracking-wider text-xs uppercase flex items-center gap-2',
      counterText: 'text-white font-semibold text-4xl tracking-tight',
      goalText: 'text-white/50 font-normal text-2xl',
      progressTrack: 'bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm',
      progressFill: 'bg-gradient-to-r from-white/80 via-white to-white/90 shadow-[0_0_15px_rgba(255,255,255,0.7)] rounded-full h-full transition-all duration-500',
      badge: 'bg-white/20 text-white font-medium text-xs px-2.5 py-1 rounded-full backdrop-blur-md border border-white/30',
      statsText: 'text-white/60 text-xs',
      accentGlow: 'rgba(255, 255, 255, 0.3)'
    }
  },

  // 5. Synthwave Sunset
  {
    id: 'synthwave-sunset',
    name: 'Synthwave 80s',
    nameTr: '80ler Synthwave',
    description: 'Outrun aesthetics with sunset purple, hot orange, and nostalgic synth grid',
    descriptionTr: '80ler retro dalgası, mor ve sıcak turuncu gün batımı geçişleri',
    category: 'Special',
    previewBadgeColor: '#f97316',
    soundPreset: 'arcade-powerup',
    styles: {
      container: 'bg-gradient-to-br from-[#1e0836]/90 via-[#2e0854]/90 to-[#4c0d45]/90 border-2 border-[#ec4899] shadow-[0_0_25px_rgba(236,72,153,0.4)] backdrop-blur-md rounded-2xl p-5',
      title: 'text-[#f43f5e] font-black uppercase tracking-widest text-xs italic drop-shadow-[0_0_8px_#f43f5e]',
      counterText: 'text-[#f59e0b] font-black text-4xl drop-shadow-[0_0_10px_#f59e0b]',
      goalText: 'text-[#ec4899]/80 font-bold text-2xl',
      progressTrack: 'bg-[#0f021e] border border-[#ec4899]/40 rounded-full h-4 overflow-hidden p-0.5',
      progressFill: 'bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f97316] shadow-[0_0_15px_#ec4899] rounded-full h-full transition-all duration-500',
      badge: 'bg-gradient-to-r from-[#ec4899] to-[#f97316] text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-md uppercase',
      statsText: 'text-[#ec4899]/70 text-xs font-medium',
      accentGlow: 'rgba(236, 72, 153, 0.4)'
    }
  },

  // 6. Tactical Esports HUD
  {
    id: 'tactical-esports-hud',
    name: 'Tactical HUD',
    nameTr: 'Taktiksel Espor HUD',
    description: 'Military sci-fi corner brackets, telemetry readouts and tactical brackets',
    descriptionTr: 'Askeri bilimkurgu HUD arayüzü, köşeli braketler ve espor telemetrisi',
    category: 'Gaming',
    previewBadgeColor: '#06b6d4',
    soundPreset: 'sub-alert',
    styles: {
      container: 'bg-[#050f14]/90 border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.25)] rounded-sm p-4 relative font-mono before:absolute before:top-0 before:left-0 before:w-3 before:h-3 before:border-t-2 before:border-l-2 before:border-cyan-400 after:absolute after:bottom-0 after:right-0 after:w-3 after:h-3 after:border-b-2 after:border-r-2 after:border-cyan-400',
      title: 'text-cyan-400 font-bold uppercase tracking-widest text-xs flex items-center gap-1.5',
      counterText: 'text-cyan-300 font-bold text-3xl tracking-wider',
      goalText: 'text-cyan-600 font-medium text-2xl',
      progressTrack: 'bg-cyan-950/80 border border-cyan-700/50 rounded-none h-3 overflow-hidden p-0.5',
      progressFill: 'bg-gradient-to-r from-cyan-500 to-teal-400 shadow-[0_0_12px_rgba(6,182,212,0.6)] h-full transition-all duration-500',
      badge: 'bg-cyan-900/80 border border-cyan-400 text-cyan-300 font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider',
      statsText: 'text-cyan-500/80 text-[11px] font-mono',
      accentGlow: 'rgba(6, 182, 212, 0.4)'
    }
  },

  // 7. Lofi Pastel Cozy
  {
    id: 'lofi-pastel-cozy',
    name: 'Lofi Pastel Cozy',
    nameTr: 'Lofi Pastel & Sıcak',
    description: 'Gentle lavender, warm peach, soft rounded curves and chill vibes',
    descriptionTr: 'Sakin lavanta ve sıcak şeftali pastel tonları, yumuşak hatlar',
    category: 'Minimal',
    previewBadgeColor: '#c084fc',
    soundPreset: 'chime',
    styles: {
      container: 'bg-[#1f1a2e]/85 border border-purple-400/30 shadow-[0_10px_30px_rgba(192,132,252,0.15)] backdrop-blur-md rounded-3xl p-5 text-purple-100',
      title: 'text-purple-300 font-medium tracking-wide text-xs uppercase flex items-center gap-1.5',
      counterText: 'text-purple-200 font-bold text-4xl',
      goalText: 'text-purple-400/60 font-medium text-2xl',
      progressTrack: 'bg-purple-950/60 rounded-full h-3.5 overflow-hidden p-0.5 border border-purple-800/40',
      progressFill: 'bg-gradient-to-r from-purple-400 via-pink-300 to-amber-200 rounded-full h-full shadow-[0_0_12px_rgba(216,180,254,0.4)] transition-all duration-500',
      badge: 'bg-purple-500/20 text-purple-200 border border-purple-400/40 font-medium text-xs px-3 py-1 rounded-full',
      statsText: 'text-purple-300/70 text-xs font-light',
      accentGlow: 'rgba(192, 132, 252, 0.3)'
    }
  },

  // 8. Royal Gold VIP
  {
    id: 'royal-gold-vip',
    name: 'Royal Gold VIP',
    nameTr: 'Kraliyet Altını VIP',
    description: 'Metallic gilded gold, crown prestige, and opulent luxury streamer styling',
    descriptionTr: 'Göz alıcı metalik altın işlemeler, kraliyet tacı ve VIP yayıncı stili',
    category: 'Special',
    previewBadgeColor: '#eab308',
    soundPreset: 'sub-alert',
    styles: {
      container: 'bg-gradient-to-b from-[#1c180e]/95 to-[#0f0c07]/95 border-2 border-[#eab308] shadow-[0_0_25px_rgba(234,179,8,0.3)] rounded-2xl p-5',
      title: 'text-[#facc15] font-black uppercase tracking-widest text-xs flex items-center gap-2 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]',
      counterText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 font-black text-4xl drop-shadow-md',
      goalText: 'text-amber-600/80 font-bold text-2xl',
      progressTrack: 'bg-[#292211] border border-amber-600/60 rounded-full h-4 overflow-hidden p-0.5',
      progressFill: 'bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-500 shadow-[0_0_15px_#facc15] rounded-full h-full transition-all duration-500',
      badge: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs px-2.5 py-1 rounded-lg shadow-md uppercase',
      statsText: 'text-amber-300/70 text-xs font-medium',
      accentGlow: 'rgba(234, 179, 8, 0.4)'
    }
  },

  // 9. Manga Speedline
  {
    id: 'manga-speedline',
    name: 'Manga Ink & Action',
    nameTr: 'Manga Çizgi Roman',
    description: 'High-contrast black & white comic styling with ink borders and action weight',
    descriptionTr: 'Yüksek kontrastlı siyah-beyaz çizgi roman ve manga aksiyon stili',
    category: 'Special',
    previewBadgeColor: '#ffffff',
    soundPreset: 'retro-coin',
    styles: {
      container: 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-none p-5 text-black',
      title: 'text-black font-black uppercase tracking-tighter text-sm italic flex items-center gap-1.5',
      counterText: 'text-black font-black text-4xl tracking-tight italic',
      goalText: 'text-zinc-500 font-black text-2xl italic',
      progressTrack: 'bg-zinc-200 border-3 border-black rounded-none h-4 overflow-hidden p-0.5',
      progressFill: 'bg-black rounded-none h-full transition-all duration-400',
      badge: 'bg-black text-white font-black text-xs px-2 py-0.5 rounded-none uppercase italic border border-black',
      statsText: 'text-black font-bold text-xs uppercase',
      accentGlow: 'rgba(0, 0, 0, 0.5)'
    }
  },

  // 10. Inferno Lava
  {
    id: 'inferno-lava',
    name: 'Inferno Lava',
    nameTr: 'Cehennem Lavı',
    description: 'Blazing molten magma gradient with hot embers pulse and intense fire energy',
    descriptionTr: 'Alev alev yanan lav gradyanı, akkor köz parıltısı ve yüksek enerji',
    category: 'Gaming',
    previewBadgeColor: '#ef4444',
    soundPreset: 'arcade-powerup',
    styles: {
      container: 'bg-gradient-to-b from-[#1f0909]/95 to-[#0d0202]/95 border-2 border-[#ef4444] shadow-[0_0_28px_rgba(239,68,68,0.4)] backdrop-blur-md rounded-2xl p-5',
      title: 'text-[#f97316] font-black uppercase tracking-wider text-xs flex items-center gap-2 drop-shadow-[0_0_8px_#f97316]',
      counterText: 'text-[#ef4444] font-black text-4xl drop-shadow-[0_0_12px_#ef4444]',
      goalText: 'text-amber-500/70 font-bold text-2xl',
      progressTrack: 'bg-[#290a0a] border border-red-700/60 rounded-full h-4 overflow-hidden p-0.5',
      progressFill: 'bg-gradient-to-r from-[#ef4444] via-[#f97316] to-[#facc15] shadow-[0_0_18px_#ef4444] rounded-full h-full transition-all duration-500',
      badge: 'bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md uppercase',
      statsText: 'text-orange-400/80 text-xs font-semibold',
      accentGlow: 'rgba(239, 68, 68, 0.5)'
    }
  },

  // 11. Matrix Terminal Hacker
  {
    id: 'matrix-terminal',
    name: 'Matrix Terminal',
    nameTr: 'Matrix Hacker Terminali',
    description: 'Classic green phosphor CRT terminal with monospace bracket meter and blinking cursor',
    descriptionTr: 'Klasik yeşil fosforlu hacker terminali, monospaced sayaç ve konsol stili',
    category: 'Retro',
    previewBadgeColor: '#22c55e',
    soundPreset: 'retro-coin',
    styles: {
      container: 'bg-black/95 border-2 border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.35)] rounded-md p-4 font-mono',
      title: 'text-[#22c55e] font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 before:content-[">_"] before:font-black',
      counterText: 'text-[#4ade80] font-bold text-3xl drop-shadow-[0_0_8px_#22c55e]',
      goalText: 'text-[#16a34a] font-medium text-2xl',
      progressTrack: 'bg-[#052e16] border border-[#22c55e]/60 rounded-none h-3 overflow-hidden p-0.5',
      progressFill: 'bg-[#22c55e] shadow-[0_0_10px_#22c55e] h-full transition-all duration-300',
      badge: 'bg-[#22c55e]/20 border border-[#22c55e] text-[#22c55e] font-mono text-[11px] px-2 py-0.5 rounded-none uppercase',
      statsText: 'text-[#22c55e]/80 text-[11px] font-mono',
      accentGlow: 'rgba(34, 197, 94, 0.4)'
    }
  },

  // 12. Glitch Cyber
  {
    id: 'glitch-cyber',
    name: 'Glitch Cyberpunk',
    nameTr: 'Glitch Siber Bozulma',
    description: 'Digital artifact styling, chromatic aberration text and edgy urban aesthetics',
    descriptionTr: 'Dijital glitç bozulma efekti, kromatik ayrışma ve keskin sokak tarzı',
    category: 'Gaming',
    previewBadgeColor: '#06b6d4',
    soundPreset: 'arcade-powerup',
    styles: {
      container: 'bg-[#090b10]/95 border-2 border-cyan-400 shadow-[-4px_4px_0px_0px_#f43f5e] rounded-lg p-5 relative',
      title: 'text-cyan-400 font-black uppercase tracking-widest text-xs flex items-center gap-1.5',
      counterText: 'text-white font-black text-4xl drop-shadow-[-2px_2px_0px_#f43f5e]',
      goalText: 'text-cyan-600 font-bold text-2xl',
      progressTrack: 'bg-[#121620] border border-cyan-500/40 rounded-none h-3.5 overflow-hidden',
      progressFill: 'bg-gradient-to-r from-cyan-400 to-[#f43f5e] shadow-[0_0_12px_#06b6d4] h-full transition-all duration-400',
      badge: 'bg-[#f43f5e] text-white font-black text-xs px-2.5 py-0.5 rounded-none shadow-sm uppercase tracking-wider',
      statsText: 'text-zinc-400 text-xs font-mono',
      accentGlow: 'rgba(6, 182, 212, 0.4)'
    }
  },

  // 13. Frostbite Arctic
  {
    id: 'frostbite-arctic',
    name: 'Frostbite Arctic',
    nameTr: 'Kutup Buzulu (Frostbite)',
    description: 'Sub-zero crystal cyan, frozen glacier aesthetic with crisp frosty glow',
    descriptionTr: 'Sıfırın altında buzul mavisi, dondurucu kristal parlaklığı ve kış teması',
    category: 'Modern',
    previewBadgeColor: '#38bdf8',
    soundPreset: 'chime',
    styles: {
      container: 'bg-[#081826]/90 border-2 border-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.35)] backdrop-blur-md rounded-2xl p-5',
      title: 'text-sky-300 font-black uppercase tracking-wider text-xs flex items-center gap-2 drop-shadow-[0_0_6px_#38bdf8]',
      counterText: 'text-white font-extrabold text-4xl drop-shadow-[0_0_10px_#7dd3fc]',
      goalText: 'text-sky-500/80 font-bold text-2xl',
      progressTrack: 'bg-sky-950/80 border border-sky-500/40 rounded-full h-4 overflow-hidden p-0.5',
      progressFill: 'bg-gradient-to-r from-sky-400 via-cyan-200 to-sky-300 shadow-[0_0_15px_#38bdf8] rounded-full h-full transition-all duration-500',
      badge: 'bg-sky-400 text-sky-950 font-black text-xs px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(56,189,248,0.5)] uppercase',
      statsText: 'text-sky-300/80 text-xs font-medium',
      accentGlow: 'rgba(56, 189, 248, 0.4)'
    }
  },

  // 14. Miami Sunset
  {
    id: 'miami-sunset',
    name: 'Miami Sunset',
    nameTr: 'Miami Gün Batımı',
    description: 'Vibrant coral pink to warm sunny amber gradient with tropical evening vibes',
    descriptionTr: 'Canlı mercan pembesi ve altın sarısı geçişleriyle tropikal akşam havası',
    category: 'Modern',
    previewBadgeColor: '#fb7185',
    soundPreset: 'chime',
    styles: {
      container: 'bg-[#180a1c]/90 border border-rose-400/50 shadow-[0_0_24px_rgba(251,113,133,0.3)] backdrop-blur-md rounded-2xl p-5',
      title: 'text-rose-400 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5',
      counterText: 'text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-400 to-amber-300 font-black text-4xl',
      goalText: 'text-rose-500/60 font-semibold text-2xl',
      progressTrack: 'bg-[#29102b] border border-rose-500/30 rounded-full h-3.5 overflow-hidden p-0.5',
      progressFill: 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 shadow-[0_0_14px_#fb7185] rounded-full h-full transition-all duration-500',
      badge: 'bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full uppercase',
      statsText: 'text-rose-300/70 text-xs font-medium',
      accentGlow: 'rgba(251, 113, 133, 0.35)'
    }
  },

  // 15. Compact Streamer Pill
  {
    id: 'compact-streamer-pill',
    name: 'Compact Streamer Pill',
    nameTr: 'Ultra Kompakt Kapsül',
    description: 'Slim low-profile horizontal badge designed for crowded stream layouts and cam borders',
    descriptionTr: 'Kamera köşesi veya dar ekranlar için ultra ince yer kaplamayan kapsül widget',
    category: 'Minimal',
    previewBadgeColor: '#53FC18',
    soundPreset: 'sub-alert',
    styles: {
      container: 'bg-black/90 border border-zinc-700 shadow-xl backdrop-blur-lg rounded-full px-5 py-2.5 flex items-center gap-4',
      title: 'text-zinc-300 font-bold uppercase text-[11px] tracking-wide whitespace-nowrap',
      counterText: 'text-[#53FC18] font-black text-2xl',
      goalText: 'text-zinc-500 font-medium text-lg',
      progressTrack: 'bg-zinc-800 rounded-full h-2 w-28 overflow-hidden',
      progressFill: 'bg-[#53FC18] rounded-full h-full transition-all duration-500 shadow-[0_0_8px_#53FC18]',
      badge: 'bg-[#53FC18] text-black font-black text-[10px] px-2 py-0.5 rounded-full uppercase',
      statsText: 'text-zinc-400 text-[10px]',
      accentGlow: 'rgba(83, 252, 24, 0.3)'
    }
  }
];

export function getThemeById(id?: string): WidgetTheme {
  const found = WIDGET_THEMES.find(t => t.id === id);
  return found || WIDGET_THEMES[0];
}
