"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { Incident } from '@/types';

interface TimelineCardProps {
    incident: Incident;
    isActive?: boolean;
    onClick?: () => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ incident, isActive, onClick }) => {
    const { locale, t } = useLanguage();
    const { severity, company_name, company_name_ko, incident_date, leaked_items, leaked_items_ko, description, description_ko, leaked_count } = incident;

    // Use Korean content if available and locale is Korean
    const displayName = locale === 'ko' && company_name_ko ? company_name_ko : company_name;
    const displayDescription = locale === 'ko' && description_ko ? description_ko : description;
    const displayItems = locale === 'ko' && leaked_items_ko ? leaked_items_ko : leaked_items;

    const severityConfig = {
        critical: {
            badgeBg: 'bg-red-500/10',
            badgeText: 'text-red-400',
            border: 'border-red-500/50',
            icon: '🚨',
            label: locale === 'ko' ? '심각' : 'CRITICAL',
        },
        warning: {
            badgeBg: 'bg-amber-500/10',
            badgeText: 'text-amber-400',
            border: 'border-amber-500/50',
            icon: '⚠️',
            label: locale === 'ko' ? '경고' : 'WARNING',
        },
        info: {
            badgeBg: 'bg-blue-500/10',
            badgeText: 'text-blue-400',
            border: 'border-blue-500/50',
            icon: 'ℹ️',
            label: locale === 'ko' ? '정보' : 'INFO',
        },
    };

    const config = severityConfig[severity];
    const formattedCount = new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US', { notation: "compact", maximumFractionDigits: 1 }).format(leaked_count);

    return (
        <div
            onClick={onClick}
            className={`
                glass-card p-6 rounded-xl transition-all duration-300 border-l-[3px] group cursor-pointer
                ${config.border}
                ${isActive ? 'ring-2 ring-blue-500/50 shadow-2xl scale-[1.02] bg-slate-800/80' : 'hover:scale-[1.01] hover:shadow-xl opacity-90 hover:opacity-100'}
            `}
        >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg shadow-sm border border-slate-700">
                        <span className="text-xl leading-none" role="img" aria-label={config.label}>
                            {config.icon}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100 tracking-tight group-hover:text-blue-400 transition-colors">
                            {displayName}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badgeBg} ${config.badgeText} border border-opacity-20 uppercase tracking-widest`}>
                                {config.label}
                            </span>
                            {leaked_count > 0 && (
                                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700/50">
                                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                                    {formattedCount} {t('Timeline.records')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xs font-medium text-slate-400">{t('Timeline.detected_on')}</span>
                    <span className="text-sm font-semibold text-slate-300 tabular-nums">{incident_date}</span>
                </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm mb-5 leading-relaxed border-t border-slate-700/50 pt-3 line-clamp-2">
                {displayDescription}
            </p>

            {/* Leaked Items Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
                {displayItems.slice(0, 5).map((item, index) => (
                    <span
                        key={index}
                        className="px-2.5 py-1 bg-slate-800/80 text-slate-300 text-xs font-medium rounded-md border border-slate-700/50 shadow-sm"
                    >
                        {item}
                    </span>
                ))}
                {displayItems.length > 5 && (
                    <span className="px-2.5 py-1 text-slate-400 text-xs">
                        +{displayItems.length - 5} {locale === 'ko' ? '더보기' : 'more'}
                    </span>
                )}
            </div>

            {/* Action Footer */}
            <div className="flex justify-end pt-2">
                <button className={`text-xs font-semibold flex items-center gap-1.5 transition-all
                    ${isActive ? 'text-blue-300' : 'text-blue-400 group-hover:text-blue-300'}
                `}>
                    {isActive ? t('Timeline.viewing_defense') : t('Timeline.view_defense')}
                    <svg className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
