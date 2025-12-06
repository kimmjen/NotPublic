"use client";

import React from 'react';
import { useLayout } from '@/context/LayoutContext';
import { useLanguage } from '@/context/LanguageContext';

export const LayoutSwitcher: React.FC = () => {
    const { layout, setLayout, layouts } = useLayout();
    const { locale } = useLanguage();

    const isLight = layout === 'editorial';

    const handleLayoutChange = (newLayout: typeof layout) => {
        setLayout(newLayout);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={`flex items-center gap-1 p-1 rounded-lg border ${isLight
            ? 'bg-slate-100 border-slate-200'
            : 'bg-slate-800/50 border-slate-700/50'
            }`}>
            {layouts.map((l) => (
                <button
                    key={l.id}
                    onClick={() => handleLayoutChange(l.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${layout === l.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isLight
                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                    title={locale === 'ko' ? l.name_ko : l.name}
                >
                    <span className="mr-1">{l.icon}</span>
                    <span className="hidden sm:inline">{locale === 'ko' ? l.name_ko : l.name}</span>
                </button>
            ))}
        </div>
    );
};
