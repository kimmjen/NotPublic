"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLayout } from '@/context/LayoutContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LayoutSwitcher } from '@/components/LayoutSwitcher';
import { LawsModal } from '@/components/LawsModal';
import { GlassLayout, CrisisLayout, EditorialLayout } from '@/layouts';
import type { Incident } from '@/types';

import INCIDENT_DATA from '@/data/incidents.json';
import IMPACT_DATA from '@/data/impact.json';

// Incident Data (Imported from crawler)
const ALL_INCIDENTS: Incident[] = (INCIDENT_DATA as any[]).map(item => ({
    ...item,
    severity: item.severity as "critical" | "warning" | "info"
}));

export default function Home() {
    const { t } = useLanguage();
    const { layout } = useLayout();

    return (
        <>
            {/* Header - Common across layouts */}
            <header className={`sticky top-0 z-50 border-b ${layout === 'editorial'
                ? 'bg-white border-slate-200'
                : 'glass border-white/5'
                }`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className={`text-2xl font-extrabold tracking-tighter flex items-center gap-1 ${layout === 'editorial' ? 'text-slate-900' : 'text-white'
                            }`}>
                            {t('Header.title')}
                            <span className="text-red-500 text-3xl leading-none">.</span>
                        </h1>
                        <p className={`text-xs font-medium tracking-wide mt-0.5 uppercase ${layout === 'editorial' ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                            {t('Header.subtitle')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <LawsModal />
                        <LayoutSwitcher />
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            {/* Layout Content */}
            {layout === 'glass' && (
                <GlassLayout incidents={ALL_INCIDENTS} />
            )}
            {layout === 'crisis' && (
                <CrisisLayout
                    incidents={ALL_INCIDENTS}
                    impactData={IMPACT_DATA as any}
                />
            )}
            {layout === 'editorial' && (
                <EditorialLayout
                    incidents={ALL_INCIDENTS}
                    impactData={IMPACT_DATA as any}
                />
            )}
        </>
    );
}
