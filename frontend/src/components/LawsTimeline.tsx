"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { LawEvent } from '@/types';

interface LawsTimelineProps {
    laws: LawEvent[];
}

export const LawsTimeline: React.FC<LawsTimelineProps> = ({ laws }) => {
    const { locale } = useLanguage();
    const [expanded, setExpanded] = useState(false);

    const displayLaws = expanded ? laws : laws.slice(0, 4);

    const getTypeColor = (type: LawEvent['type']) => {
        switch (type) {
            case 'enacted': return 'bg-green-500';
            case 'amended': return 'bg-blue-500';
            case 'enforcement': return 'bg-red-500';
            case 'ruling': return 'bg-purple-500';
            default: return 'bg-slate-500';
        }
    };

    const getTypeLabel = (type: LawEvent['type']) => {
        if (locale === 'ko') {
            switch (type) {
                case 'enacted': return '제정';
                case 'amended': return '개정';
                case 'enforcement': return '집행';
                case 'ruling': return '판결';
                default: return type;
            }
        }
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="text-xl">⚖️</span>
                        {locale === 'ko' ? '개인정보보호법 연혁' : 'Privacy Law History'}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        {locale === 'ko'
                            ? '사고가 터질 때마다 법이 강화됩니다'
                            : 'Laws strengthen after each major breach'}
                    </p>
                </div>
                <div className="text-xs text-slate-500">
                    2011 - 2026
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                {displayLaws.map((law, idx) => (
                    <div
                        key={idx}
                        className="relative pl-8 pb-4 border-l-2 border-slate-700 last:border-l-transparent last:pb-0"
                    >
                        {/* Dot */}
                        <div className={`absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full ${getTypeColor(law.type)} border-2 border-slate-900`} />

                        {/* Content */}
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                    <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${getTypeColor(law.type)}/20 text-white border ${getTypeColor(law.type).replace('bg-', 'border-')}/50`}>
                                        {getTypeLabel(law.type)}
                                    </span>
                                    <span className="text-slate-500 text-xs ml-2">{law.date}</span>
                                </div>
                            </div>
                            <h4 className="font-bold text-white mb-1">
                                {locale === 'ko' ? law.title_ko : law.title}
                            </h4>
                            <p className="text-sm text-slate-400">
                                {locale === 'ko' ? law.description_ko : law.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Expand Button */}
            {laws.length > 4 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-4 w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                    {expanded
                        ? (locale === 'ko' ? '접기 ▲' : 'Show Less ▲')
                        : (locale === 'ko' ? `${laws.length - 4}개 더 보기 ▼` : `Show ${laws.length - 4} More ▼`)}
                </button>
            )}

            {/* Key Insight */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                        <div className="font-bold text-amber-400 text-sm">
                            {locale === 'ko' ? '핵심 포인트' : 'Key Insight'}
                        </div>
                        <p className="text-sm text-slate-300 mt-1">
                            {locale === 'ko'
                                ? '2011년 5천만원이던 과태료가 2023년 "전체 매출액의 3%"로 강화되었습니다. 그런데도 유출은 계속됩니다.'
                                : 'Fines increased from ₩50M (2011) to "3% of total revenue" (2023). Yet breaches continue.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
