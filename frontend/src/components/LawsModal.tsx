"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLayout } from '@/context/LayoutContext';
import type { LawEvent } from '@/types';

import LAWS_DATA from '@/data/laws.json';

const laws = LAWS_DATA as LawEvent[];

export const LawsModal: React.FC = () => {
    const { locale } = useLanguage();
    const { layout } = useLayout();
    const [isOpen, setIsOpen] = useState(false);

    const isLight = layout === 'editorial';

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
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium ${isLight
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                    }`}
            >
                <span>⚖️</span>
                <span className="hidden sm:inline">
                    {locale === 'ko' ? '법률 연혁' : 'Laws'}
                </span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <div
                        className="relative bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span className="text-2xl">⚖️</span>
                                        {locale === 'ko' ? '개인정보보호법 연혁' : 'Privacy Law History'}
                                    </h2>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {locale === 'ko'
                                            ? '사고가 터질 때마다 법이 강화됩니다. 그런데도 유출은 계속됩니다.'
                                            : 'Laws strengthen after each breach. Yet leaks continue.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-2"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Timeline Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-4">
                                {laws.map((law, idx) => (
                                    <div
                                        key={idx}
                                        className="relative pl-8 pb-4 border-l-2 border-slate-700 last:border-l-transparent last:pb-0"
                                    >
                                        {/* Dot */}
                                        <div className={`absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full ${getTypeColor(law.type)} border-2 border-slate-900`} />

                                        {/* Content */}
                                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${getTypeColor(law.type).replace('bg-', 'text-')}`}>
                                                        {getTypeLabel(law.type)}
                                                    </span>
                                                    <span className="text-slate-500 text-xs font-mono">{law.date}</span>
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
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-700 p-4 bg-amber-500/10">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">💡</span>
                                <p className="text-sm text-amber-300">
                                    {locale === 'ko'
                                        ? '2011년 5천만원이던 과태료가 2023년 "전체 매출액의 3%"로 강화되었지만, 유출은 계속됩니다.'
                                        : 'Fines increased from ₩50M (2011) to 3% of total revenue (2023), yet breaches continue.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
