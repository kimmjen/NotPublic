"use client";

import React, { useState } from 'react';
import { TimelineCard } from '@/components/TimelineCard';
import { IncidentDetail } from '@/components/IncidentDetail';
import { LawsTimeline } from '@/components/LawsTimeline';
import { useLanguage } from '@/context/LanguageContext';
import { formatNumber, formatAffectedCount } from '@/utils/format';
import type { Incident, LawEvent } from '@/types';

import LAWS_DATA from '@/data/laws.json';

interface CrisisLayoutProps {
    incidents: Incident[];
    impactData: {
        total_leaked_records: { value: number };
        per_capita_leaks: { value: number };
        shocking_stats: Array<{ title: string; title_ko: string; value: string }>;
    };
}

export const CrisisLayout: React.FC<CrisisLayoutProps> = ({ incidents, impactData }) => {
    const { locale, t } = useLanguage();
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const sortedIncidents = [...incidents].sort((a, b) => {
        const dateA = new Date(a.incident_date.replace(/\./g, '-'));
        const dateB = new Date(b.incident_date.replace(/\./g, '-'));
        return dateB.getTime() - dateA.getTime();
    });

    const totalPages = Math.ceil(sortedIncidents.length / itemsPerPage);
    const currentIncidents = sortedIncidents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalLeaked = impactData.total_leaked_records.value;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Red Glow Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" />

                <div className="relative container mx-auto px-4 py-12">
                    {/* Emergency Alert Banner */}
                    <div className="mb-8 p-4 bg-red-900/50 border border-red-500/50 rounded-lg animate-pulse">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🚨</span>
                            <div>
                                <div className="text-red-400 text-sm font-bold uppercase tracking-wider">
                                    {locale === 'ko' ? '개인정보 유출 경보' : 'DATA BREACH ALERT'}
                                </div>
                                <div className="text-white text-lg font-bold">
                                    {locale === 'ko'
                                        ? `국민 1인당 ${impactData.per_capita_leaks.value}회 유출`
                                        : `${impactData.per_capita_leaks.value}x per capita leaks`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Giant Counter */}
                    <div className="text-center mb-12">
                        <div className="text-red-500 text-sm font-bold uppercase tracking-widest mb-2">
                            {locale === 'ko' ? '10년간 누적 유출' : '10 YEARS CUMULATIVE'}
                        </div>
                        <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                            {formatNumber(totalLeaked, locale)}
                        </div>
                        <div className="text-slate-400 text-xl mt-2">
                            {locale === 'ko' ? '개인정보 유출' : 'RECORDS LEAKED'}
                        </div>
                    </div>

                    {/* Shocking Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {impactData.shocking_stats.slice(0, 4).map((stat, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-slate-900/80 border border-red-500/30 rounded-lg text-center"
                            >
                                <div className="text-2xl md:text-3xl font-bold text-red-400">{stat.value}</div>
                                <div className="text-xs text-slate-400 mt-1">
                                    {locale === 'ko' ? stat.title_ko : stat.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Incident List */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <h2 className="text-xl font-bold text-white">
                                {locale === 'ko' ? '사고 현황' : 'INCIDENT STATUS'}
                            </h2>
                            <span className="text-slate-500 text-sm">
                                ({sortedIncidents.length} {locale === 'ko' ? '건' : 'cases'})
                            </span>
                        </div>

                        <div className="space-y-3">
                            {currentIncidents.map((incident) => (
                                <div
                                    key={incident.id}
                                    onClick={() => setSelectedIncident(incident)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${incident.severity === 'critical'
                                        ? 'bg-red-900/20 border-red-500/50 hover:bg-red-900/30'
                                        : incident.severity === 'warning'
                                            ? 'bg-amber-900/20 border-amber-500/50 hover:bg-amber-900/30'
                                            : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-white">
                                                {locale === 'ko' && incident.company_name_ko
                                                    ? incident.company_name_ko
                                                    : incident.company_name}
                                            </div>
                                            <div className="text-sm text-slate-400">{incident.incident_date}</div>
                                        </div>
                                        <div className={`text-lg font-bold ${incident.severity === 'critical' ? 'text-red-400' :
                                            incident.severity === 'warning' ? 'text-amber-400' : 'text-slate-400'
                                            }`}>
                                            {formatAffectedCount(incident.leaked_count, locale)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded ${currentPage === i + 1
                                        ? 'bg-red-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:col-span-3">
                        {selectedIncident ? (
                            <IncidentDetail
                                incident={selectedIncident}
                                onClose={() => setSelectedIncident(null)}
                            />
                        ) : (
                            <div className="p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg text-center">
                                <div className="text-slate-500">
                                    {locale === 'ko'
                                        ? '사건을 선택하세요'
                                        : 'Select an incident'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Laws Timeline */}
            <div className="container mx-auto px-4 py-8 pb-20">
                <LawsTimeline laws={LAWS_DATA as LawEvent[]} />
            </div>

            {/* Breaking News Ticker */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-900 via-red-800 to-red-900 py-2 overflow-hidden z-50">
                <div className="animate-marquee">
                    {/* Double the items for seamless loop */}
                    {[...sortedIncidents, ...sortedIncidents].map((incident, idx) => (
                        <div key={idx} className="inline-flex items-center mx-6 shrink-0">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                            <span className="text-red-300 font-mono text-xs mr-2">
                                {incident.incident_date.split('.')[0]}
                            </span>
                            <span className="font-bold text-white mr-2">
                                {locale === 'ko' && incident.company_name_ko
                                    ? incident.company_name_ko
                                    : incident.company_name}
                            </span>
                            <span className="text-red-200 font-semibold">
                                {formatAffectedCount(incident.leaked_count, locale)}
                            </span>
                            <span className="mx-4 text-red-500/50">|</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
