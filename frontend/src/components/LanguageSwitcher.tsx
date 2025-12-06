"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useLayout } from '@/context/LayoutContext';

export const LanguageSwitcher = () => {
    const { locale, setLocale } = useLanguage();
    const { layout } = useLayout();
    const otherLocale = locale === 'en' ? 'ko' : 'en';
    const label = locale === 'en' ? '한국어' : 'English';

    const isLight = layout === 'editorial';

    return (
        <button
            onClick={() => setLocale(otherLocale)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${isLight
                    ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
        >
            <span className="text-sm">{locale === 'en' ? '🇰🇷' : '🇺🇸'}</span>
            {label}
        </button>
    );
};
