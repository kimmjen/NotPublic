"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { Incident } from '@/types';

interface IncidentDetailProps {
    incident: Incident;
    onClose: () => void;
}

export const IncidentDetail: React.FC<IncidentDetailProps> = ({ incident, onClose }) => {
    const { locale, t } = useLanguage();

    const displayName = locale === 'ko' && incident.company_name_ko ? incident.company_name_ko : incident.company_name;
    const displayDescription = locale === 'ko' && incident.description_ko ? incident.description_ko : incident.description;
    const displayItems = locale === 'ko' && incident.leaked_items_ko ? incident.leaked_items_ko : incident.leaked_items;
    const displayFine = locale === 'ko' && incident.fine_amount_ko ? incident.fine_amount_ko : incident.fine_amount;

    const formattedCount = new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(incident.leaked_count);

    return (
        <div className="glass-card rounded-xl p-6 border-t-4 border-t-blue-500 animate-fade-in shadow-2xl relative max-h-[calc(100vh-6rem)] overflow-y-auto">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                aria-label="Close details"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="mb-6">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">{t('IncidentDetail.report_label')}</span>
                <h2 className="text-2xl font-bold text-white mt-1 mb-2">{displayName} {t('IncidentDetail.analysis_title')}</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {incident.leaked_count > 0 && (
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            {locale === 'ko' ? '피해 규모' : 'Affected'}
                        </div>
                        <div className="text-xl font-bold text-red-300">{formattedCount}{locale === 'ko' ? '명' : ''}</div>
                    </div>
                )}
                {displayFine && (
                    <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            {locale === 'ko' ? '과징금' : 'Fine'}
                        </div>
                        <div className="text-lg font-bold text-amber-300">{displayFine}</div>
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    {locale === 'ko' ? '사건 개요' : 'Incident Summary'}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">{displayDescription}</p>
            </div>

            {/* Timeline Events */}
            {incident.timeline && incident.timeline.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                        {locale === 'ko' ? '사건 경과' : 'Timeline'}
                    </h3>
                    <div className="space-y-2 pl-4 border-l-2 border-purple-500/30">
                        {incident.timeline.map((event, idx) => (
                            <div key={idx} className="flex gap-3 text-sm">
                                <span className="text-purple-400 font-mono text-xs whitespace-nowrap">{event.date}</span>
                                <span className="text-slate-300">
                                    {locale === 'ko' && event.title_ko ? event.title_ko : event.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Exposed Data */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 mb-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    {t('IncidentDetail.exposed_data')}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {displayItems.map((item, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-500/10 text-red-300 text-xs rounded border border-red-500/20">
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Related Links */}
            {incident.related_links && incident.related_links.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        {locale === 'ko' ? '관련 뉴스 및 영상' : 'Related News & Videos'}
                    </h3>
                    <div className="space-y-2">
                        {incident.related_links.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/50 transition-colors group"
                            >
                                <span className="text-xl">
                                    {link.type === 'video' ? '🎬' : '📰'}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                                        {locale === 'ko' && link.title_ko ? link.title_ko : link.title}
                                    </div>
                                    <div className="text-xs text-slate-500">{link.source}</div>
                                </div>
                                <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Plan */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    {t('IncidentDetail.action_plan')}
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-300 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
                        {t('IncidentDetail.action_1')}
                    </li>
                    <li className="flex gap-3 text-slate-300 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
                        {t('IncidentDetail.action_2')}
                    </li>
                    <li className="flex gap-3 text-slate-300 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">3</span>
                        {t('IncidentDetail.action_3')}
                    </li>
                </ul>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-700/50 space-y-3">
                {incident.original_url && (
                    <a
                        href={incident.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg transition-colors text-center"
                    >
                        📰 {locale === 'ko' ? '원문 기사 보기' : 'View Original Article'}
                    </a>
                )}
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20">
                    {t('IncidentDetail.download_btn')}
                </button>
            </div>
        </div>
    );
};
