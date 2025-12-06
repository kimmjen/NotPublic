"use client";

import React from 'react';
import { useT } from '@/context/LanguageContext';

interface ImpactStatsProps {
    totalLeaked: number;
    affectedCount: number;
}

export const ImpactStats: React.FC<ImpactStatsProps> = ({ totalLeaked, affectedCount }) => {
    const t = useT();
    const formattedLeaked = new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(totalLeaked);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-white">
            <div className="glass-card p-4 rounded-xl text-center">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t('ImpactStats.leaked_label')}</div>
                <div className="text-3xl font-bold text-red-400 tabular-nums">{formattedLeaked}+</div>
            </div>

            <div className="glass-card p-4 rounded-xl text-center">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t('ImpactStats.companies_label')}</div>
                <div className="text-3xl font-bold text-slate-100 tabular-nums">{affectedCount}</div>
            </div>

            <div className="glass-card p-4 rounded-xl text-center">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t('ImpactStats.risk_label')}</div>
                <div className="text-3xl font-bold text-amber-400 flex justify-center items-center gap-2">
                    {t('ImpactStats.risk_high')}
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                </div>
            </div>
        </div>
    );
};
