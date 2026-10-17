'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { WIDGET_THEMES } from '@/domain/themes';
import { WidgetTheme } from '@/domain/types';
import { Check } from 'lucide-react';
import { Panel, PanelHeader, Segmented } from './ui';

interface ThemeSelectorProps {
  selectedThemeId: string;
  onSelectTheme: (theme: WidgetTheme) => void;
}

const CATEGORIES = [
  { value: 'all', label: 'Hepsi' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Modern', label: 'Modern' },
  { value: 'Retro', label: 'Retro' },
  { value: 'Minimal', label: 'Minimal' },
  { value: 'Special', label: 'Özel' },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedThemeId, onSelectTheme }) => {
  const [category, setCategory] = useState('all');
  const themes = category === 'all' ? WIDGET_THEMES : WIDGET_THEMES.filter((t) => t.category === category);

  return (
    <Panel>
      <PanelHeader title="Tema" hint={`${WIDGET_THEMES.length} tema`} />
      <div className="space-y-4 p-5">
        <Segmented options={CATEGORIES} value={category} onChange={setCategory} />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {themes.map((theme) => {
            const selected = theme.id === selectedThemeId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelectTheme(theme)}
                className={clsx(
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                  selected ? 'border-accent/70 bg-accent/5' : 'border-line hover:border-line-strong hover:bg-raised'
                )}
              >
                <span
                  className="h-8 w-8 shrink-0 rounded-lg ring-1 ring-white/10"
                  style={{ background: `linear-gradient(135deg, ${theme.previewBadgeColor}, #000 140%)` }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{theme.nameTr}</span>
                  <span className="block truncate text-xs text-muted">{theme.descriptionTr}</span>
                </span>
                {selected && <Check className="h-4 w-4 shrink-0 text-accent" />}
              </button>
            );
          })}
        </div>
      </div>
    </Panel>
  );
};
