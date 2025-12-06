"use client";

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TimelineCard } from '@/components/TimelineCard';
import { ImpactStats } from '@/components/ImpactStats';
import { IncidentDetail } from '@/components/IncidentDetail';
import { GlobalInsights } from '@/components/GlobalInsights';
import { LawsTimeline } from '@/components/LawsTimeline';
import type { Incident, LawEvent } from '@/types';

import LAWS_DATA from '@/data/laws.json';

const ITEMS_PER_PAGE = 15;

interface GlassLayoutProps {
    incidents: Incident[];
}

export const GlassLayout: React.FC<GlassLayoutProps> = ({ incidents }) => {
    const { t } = useLanguage();
    const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const sortedIncidents = useMemo(() =>
        [...incidents].sort((a, b) => {
            const dateA = new Date(a.incident_date.replace(/\./g, '-'));
            const dateB = new Date(b.incident_date.replace(/\./g, '-'));
            return dateB.getTime() - dateA.getTime();
        }), [incidents]);

    const handleIncidentClick = (id: number) => {
        setSelectedIncidentId(prev => prev === id ? null : id);
    };

    const totalPages = Math.ceil(sortedIncidents.length / ITEMS_PER_PAGE);
    const paginatedIncidents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedIncidents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, sortedIncidents]);

    const selectedIncident = sortedIncidents.find(i => i.id === selectedIncidentId);
    const totalLeaked = sortedIncidents.reduce((acc, curr) => acc + curr.leaked_count, 0);
    const affectedCount = sortedIncidents.length;

    return (
        <main className="min-h-screen pb-20 bg-slate-900">
            {/* Emergency Ticker */}
            <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-b border-red-700/50 text-red-100 px-4 py-3 text-sm font-medium text-center relative overflow-hidden">
                <div className="animate-pulse flex items-center justify-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    {t('Ticker.warning', { count: new Intl.NumberFormat('en-US', { notation: "compact" }).format(totalLeaked) })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 pt-8">

                {/* Statistics Section */}
                <ImpactStats totalLeaked={totalLeaked} affectedCount={affectedCount} />

                <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-8 relative mb-24 items-start">
                    {/* Timeline Column */}
                    <div className={`transition-all duration-500 ease-in-out ${selectedIncidentId ? 'lg:col-span-5' : 'lg:col-span-8 lg:col-start-3'}`}>
                        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-transparent before:opacity-20 before:transition-all before:duration-500">

                            {paginatedIncidents.map((incident, index) => (
                                <div
                                    key={incident.id}
                                    className={`relative pl-12 animate-fade-in transition-all duration-500`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className={`absolute left-5 top-8 -translate-x-1/2 rounded-full border-[3px] w-4 h-4 z-10 transition-colors duration-300
                                ${selectedIncidentId === incident.id ? 'bg-blue-500 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'bg-slate-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}
                            `}></div>

                                    <TimelineCard
                                        incident={incident}
                                        isActive={selectedIncidentId === incident.id}
                                        onClick={() => handleIncidentClick(incident.id)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-12 flex justify-center items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                            >
                                ← Prev
                            </button>
                            <span className="text-slate-400 text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                            >
                                Next →
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 text-sm">{t('Timeline.end_text')}</p>
                        </div>
                    </div>

                    {/* Detail Column */}
                    <div className={`
                fixed inset-0 z-40 lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-8rem)]
                bg-slate-900/95 lg:bg-transparent p-6 lg:p-0 overflow-y-auto lg:overflow-visible transition-all duration-500 ease-in-out
                ${selectedIncidentId ? 'translate-x-0 opacity-100 lg:col-span-7' : 'translate-x-full opacity-0 lg:translate-x-10 lg:hidden'}
            `}>
                        {selectedIncident && (
                            <IncidentDetail
                                incident={selectedIncident}
                                onClose={() => setSelectedIncidentId(null)}
                            />
                        )}
                    </div>
                </div>

                {/* Global Insights Section */}
                <GlobalInsights />

                {/* Laws Timeline Section */}
                <div className="mt-12">
                    <LawsTimeline laws={LAWS_DATA as LawEvent[]} />
                </div>

            </div>
        </main>
    );
};
