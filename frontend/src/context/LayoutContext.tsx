"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LayoutType = 'glass' | 'crisis' | 'editorial';

interface LayoutContextType {
    layout: LayoutType;
    setLayout: (layout: LayoutType) => void;
    layouts: { id: LayoutType; name: string; name_ko: string; icon: string }[];
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const LAYOUTS = [
    { id: 'glass' as LayoutType, name: 'Glass Dark', name_ko: '글래스 다크', icon: '🌙' },
    { id: 'crisis' as LayoutType, name: 'Crisis Center', name_ko: '위기 상황판', icon: '🚨' },
    { id: 'editorial' as LayoutType, name: 'Editorial', name_ko: '탐사보도', icon: '📰' },
];

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [layout, setLayoutState] = useState<LayoutType>('glass');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('layout') as LayoutType;
        if (saved && LAYOUTS.some(l => l.id === saved)) {
            setLayoutState(saved);
        }
    }, []);

    const setLayout = (newLayout: LayoutType) => {
        setLayoutState(newLayout);
        localStorage.setItem('layout', newLayout);
    };

    if (!mounted) {
        return <div className="min-h-screen bg-slate-900" />;
    }

    return (
        <LayoutContext.Provider value={{ layout, setLayout, layouts: LAYOUTS }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within LayoutProvider');
    }
    return context;
}
