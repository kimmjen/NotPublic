"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { formatNumber, formatAffectedCount, formatDate } from '@/utils/format';
import type { Incident, LawEvent } from '@/types';

import LAWS_DATA from '@/data/laws.json';

interface EditorialLayoutProps {
    incidents: Incident[];
    impactData: {
        total_leaked_records: { value: number };
        per_capita_leaks: { value: number };
        yearly_leaks: Array<{ year: number; count: number; major_incidents: string[] }>;
    };
}

export const EditorialLayout: React.FC<EditorialLayoutProps> = ({ incidents, impactData }) => {
    const { locale, t } = useLanguage();
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

    const sortedIncidents = [...incidents].sort((a, b) => {
        const dateA = new Date(a.incident_date.replace(/\./g, '-'));
        const dateB = new Date(b.incident_date.replace(/\./g, '-'));
        return dateB.getTime() - dateA.getTime();
    });

    const years = [...new Set(sortedIncidents.map(i => parseInt(i.incident_date.split('.')[0])))];

    const filteredIncidents = selectedYear
        ? sortedIncidents.filter(i => parseInt(i.incident_date.split('.')[0]) === selectedYear)
        : sortedIncidents;

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900">
            {/* Editorial Header */}
            <header className="bg-white border-b-4 border-slate-900">
                <div className="container mx-auto px-6 py-8">
                    <div className="text-center">
                        <div className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">
                            {locale === 'ko' ? '탐사보도 특별기획' : 'INVESTIGATIVE REPORT'}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                            {locale === 'ko'
                                ? '대한민국 개인정보'
                                : 'Korea Personal Data'}
                        </h1>
                        <h2 className="text-3xl md:text-5xl font-black text-red-600 leading-tight">
                            {locale === 'ko'
                                ? '유출 재난 보고서'
                                : 'Breach Disaster Report'}
                        </h2>
                        <div className="mt-4 text-slate-500 text-sm">
                            2011 - 2026 | {sortedIncidents.length} {locale === 'ko' ? '건의 사건' : 'Incidents'}
                        </div>
                    </div>
                </div>
            </header>

            {/* Key Statistics */}
            <section className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-3 divide-x divide-slate-200">
                        <div className="text-center px-4">
                            <div className="text-4xl md:text-5xl font-black text-red-600">
                                {formatNumber(impactData.total_leaked_records.value, locale)}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                                {locale === 'ko' ? '총 유출량' : 'Total Leaked'}
                            </div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-4xl md:text-5xl font-black text-slate-900">
                                {impactData.per_capita_leaks.value}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                                {locale === 'ko' ? '1인당 유출 (회)' : 'Per Capita'}
                            </div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-4xl md:text-5xl font-black text-slate-900">
                                {sortedIncidents.length}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                                {locale === 'ko' ? '주요 사건' : 'Major Cases'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Year Filter */}
            <section className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4 overflow-x-auto">
                        <span className="text-sm font-bold text-slate-500 shrink-0">
                            {locale === 'ko' ? '연도별' : 'BY YEAR'}
                        </span>
                        <button
                            onClick={() => setSelectedYear(null)}
                            className={`px-3 py-1 rounded text-sm font-medium transition ${selectedYear === null
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {locale === 'ko' ? '전체' : 'All'}
                        </button>
                        {years.sort((a, b) => b - a).map(year => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-3 py-1 rounded text-sm font-medium transition ${selectedYear === year
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content - Two Column Layout */}
            <main className="container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Incident List - Left Column */}
                    <div className="lg:col-span-2 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                        {filteredIncidents.map((incident) => (
                            <article
                                key={incident.id}
                                onClick={() => setSelectedIncident(incident)}
                                className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${selectedIncident?.id === incident.id
                                    ? 'border-red-500 ring-2 ring-red-500/20 shadow-lg'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${incident.severity === 'critical'
                                            ? 'bg-red-100 text-red-700'
                                            : incident.severity === 'warning'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {incident.severity.toUpperCase()}
                                        </span>
                                        <span className="text-slate-400 text-xs ml-2">
                                            {formatDate(incident.incident_date, locale)}
                                        </span>
                                    </div>
                                    <div className="text-lg font-bold text-red-600">
                                        {formatAffectedCount(incident.leaked_count, locale)}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900">
                                    {locale === 'ko' && incident.company_name_ko
                                        ? incident.company_name_ko
                                        : incident.company_name}
                                </h3>

                                <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                                    {locale === 'ko' && incident.description_ko
                                        ? incident.description_ko
                                        : incident.description}
                                </p>
                            </article>
                        ))}
                    </div>

                    {/* Incident Detail - Right Column */}
                    <div className="lg:col-span-3">
                        {selectedIncident ? (
                            <div className="bg-white border border-slate-200 rounded-xl shadow-lg sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto">
                                {/* Detail Header */}
                                <div className="border-b border-slate-200 p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className={`inline-block px-3 py-1 text-sm font-bold rounded ${selectedIncident.severity === 'critical'
                                                ? 'bg-red-100 text-red-700'
                                                : selectedIncident.severity === 'warning'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {selectedIncident.severity.toUpperCase()}
                                            </span>
                                            <span className="text-slate-400 text-sm ml-3">
                                                {formatDate(selectedIncident.incident_date, locale)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setSelectedIncident(null)}
                                            className="text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mt-3">
                                        {locale === 'ko' && selectedIncident.company_name_ko
                                            ? selectedIncident.company_name_ko
                                            : selectedIncident.company_name}
                                    </h2>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50">
                                    {selectedIncident.leaked_count > 0 && (
                                        <div className="p-4 bg-white rounded-lg border border-red-200">
                                            <div className="text-red-500 text-xs font-bold uppercase tracking-wider mb-1">
                                                {locale === 'ko' ? '피해 규모' : 'Affected'}
                                            </div>
                                            <div className="text-2xl font-black text-red-600">
                                                {formatAffectedCount(selectedIncident.leaked_count, locale)}
                                            </div>
                                        </div>
                                    )}
                                    {selectedIncident.fine_amount && (
                                        <div className="p-4 bg-white rounded-lg border border-amber-200">
                                            <div className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                                                {locale === 'ko' ? '과징금/처분' : 'Fine/Action'}
                                            </div>
                                            <div className="text-lg font-bold text-amber-700">
                                                {locale === 'ko' && selectedIncident.fine_amount_ko
                                                    ? selectedIncident.fine_amount_ko
                                                    : selectedIncident.fine_amount}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="p-6 border-b border-slate-200">
                                    <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">
                                        {locale === 'ko' ? '사건 개요' : 'Summary'}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {locale === 'ko' && selectedIncident.description_ko
                                            ? selectedIncident.description_ko
                                            : selectedIncident.description}
                                    </p>
                                </div>

                                {/* Timeline */}
                                {selectedIncident.timeline && selectedIncident.timeline.length > 0 && (
                                    <div className="p-6 border-b border-slate-200">
                                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                                            {locale === 'ko' ? '사건 경과' : 'Timeline'}
                                        </h3>
                                        <div className="space-y-3 border-l-2 border-slate-200 pl-4">
                                            {selectedIncident.timeline.map((event, idx) => (
                                                <div key={idx} className="flex gap-4">
                                                    <span className="text-sm font-mono text-slate-400 whitespace-nowrap">
                                                        {event.date}
                                                    </span>
                                                    <span className="text-slate-700">
                                                        {locale === 'ko' && event.title_ko
                                                            ? event.title_ko
                                                            : event.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Leaked Items */}
                                <div className="p-6 border-b border-slate-200">
                                    <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
                                        {locale === 'ko' ? '유출 정보' : 'Leaked Data'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(locale === 'ko' && selectedIncident.leaked_items_ko
                                            ? selectedIncident.leaked_items_ko
                                            : selectedIncident.leaked_items
                                        ).map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Related Links */}
                                {selectedIncident.related_links && selectedIncident.related_links.length > 0 && (
                                    <div className="p-6">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
                                            {locale === 'ko' ? '관련 자료' : 'Related Links'}
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedIncident.related_links.map((link, idx) => (
                                                <a
                                                    key={idx}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                                                >
                                                    <span className="text-xl">
                                                        {link.type === 'video' ? '🎬' : '📰'}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-slate-900 group-hover:text-blue-600 truncate">
                                                            {locale === 'ko' && link.title_ko
                                                                ? link.title_ko
                                                                : link.title}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {link.source}
                                                        </div>
                                                    </div>
                                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center sticky top-32">
                                <div className="text-6xl mb-4">📋</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {locale === 'ko' ? '사건을 선택하세요' : 'Select an Incident'}
                                </h3>
                                <p className="text-slate-500">
                                    {locale === 'ko'
                                        ? '왼쪽 목록에서 사건을 클릭하면 상세 정보가 표시됩니다'
                                        : 'Click on an incident from the list to view details'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Laws Timeline Section */}
            <section className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                            <span className="text-xl">⚖️</span>
                            {locale === 'ko' ? '개인정보보호법 연혁' : 'Privacy Law History'}
                        </h3>
                        <div className="space-y-4">
                            {(LAWS_DATA as LawEvent[]).map((law, idx) => (
                                <div key={idx} className="flex gap-4 border-b border-slate-100 pb-4 last:border-b-0">
                                    <div className="text-xs font-mono text-slate-400 w-24 shrink-0">{law.date}</div>
                                    <div>
                                        <div className="font-bold text-slate-900">
                                            {locale === 'ko' ? law.title_ko : law.title}
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            {locale === 'ko' ? law.description_ko : law.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <div className="text-2xl font-black mb-2">NotPublic</div>
                    <div className="text-slate-400 text-sm">
                        {locale === 'ko'
                            ? '대한민국 개인정보 유출 상황판'
                            : 'Korea Data Breach Dashboard'}
                    </div>
                </div>
            </footer>
        </div>
    );
};
