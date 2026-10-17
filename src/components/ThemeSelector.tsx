'use client';

import React, { useState } from 'react';
import { WIDGET_THEMES } from '@/domain/themes';
import { WidgetTheme } from '@/domain/types';
import { Check, Palette, Sparkles } from 'lucide-react';

interface ThemeSelectorProps {
  selectedThemeId: string;
  onSelectTheme: (theme: WidgetTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemeId,
  onSelectTheme,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('Hepsi');

  const categories = ['Hepsi', 'Gaming', 'Modern', 'Retro', 'Minimal', 'Special'];

  const filteredThemes = filterCategory === 'Hepsi'
    ? WIDGET_THEMES
    : WIDGET_THEMES.filter(t => t.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="bg-kick-card border border-kick-border rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-kick-green" />
            Sayaç Temaları ({WIDGET_THEMES.length} Farklı Seçenek)
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Yayın tarzınıza ve ekran düzeninize en uygun temayı tek tıkla seçin.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 rounded-xl border border-zinc-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterCategory === cat
                  ? 'bg-kick-green text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              {cat === 'Special' ? 'Özel' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 15 Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredThemes.map((theme) => {
          const isSelected = theme.id === selectedThemeId;

          return (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme)}
              className={`group relative cursor-pointer rounded-xl p-4 transition-all duration-200 border-2 text-left ${
                isSelected
                  ? 'border-kick-green bg-kick-green/10 shadow-[0_0_20px_rgba(83,252,24,0.2)]'
                  : 'border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900/90'
              }`}
            >
              {/* Selected Tag */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-kick-green text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> SEÇİLİ
                </div>
              )}

              {/* Theme Header */}
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                  style={{ backgroundColor: theme.previewBadgeColor }}
                />
                <h3 className="font-bold text-white text-sm group-hover:text-kick-green transition-colors">
                  {theme.nameTr}
                </h3>
              </div>

              {/* Mini Preview Box */}
              <div className="my-2.5 p-3 rounded-lg bg-black/60 border border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5 font-bold">
                  <span className="text-white text-lg">15</span>
                  <span className="text-zinc-500 text-xs">/ 20</span>
                </div>
                <div className="w-20 bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '75%',
                      backgroundColor: theme.previewBadgeColor,
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-400">75%</span>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                {theme.descriptionTr}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
