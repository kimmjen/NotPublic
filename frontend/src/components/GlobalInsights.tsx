"use client";

import React from 'react';
import { useT } from '@/context/LanguageContext';

export const GlobalInsights = () => {
    const t = useT();

    const cases = [
        {
            country: "EU",
            flag: "🇪🇺",
            title: t('GlobalInsights.cases.eu.title'),
            description: t('GlobalInsights.cases.eu.desc'),
            stat: "€1.2B Fine (Meta)"
        },
        {
            country: "USA",
            flag: "🇺🇸",
            title: t('GlobalInsights.cases.usa.title'),
            description: t('GlobalInsights.cases.usa.desc'),
            stat: "$700M Settlement"
        },
        {
            country: "Japan",
            flag: "🇯🇵",
            title: t('GlobalInsights.cases.japan.title'),
            description: t('GlobalInsights.cases.japan.desc'),
            stat: "Strict Liability"
        },
        {
            country: "Singapore",
            flag: "🇸🇬",
            title: t('GlobalInsights.cases.singapore.title'),
            description: t('GlobalInsights.cases.singapore.desc'),
            stat: "72h Reporting"
        }
    ];

    return (
        <section className="py-16 border-t border-slate-800/50">
            <div className="flex items-center gap-3 mb-8">
                <span className="flex h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                <h2 className="text-2xl font-bold text-white tracking-tight">{t('GlobalInsights.title')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cases.map((item, index) => (
                    <div key={index} className="glass-card p-6 rounded-xl hover:bg-slate-800/50 transition-colors group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 transform origin-left">{item.flag}</div>
                        <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4 min-h-[80px]">
                            {item.description}
                        </p>
                        <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                            {item.stat}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
