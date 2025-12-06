"use client";

import React, { useState } from 'react';
import type { Incident } from '@/types';
import INCIDENTS_DATA from '@/data/incidents.json';

interface TimelineEvent {
    date: string;
    title: string;
    title_ko?: string;
}

interface RelatedLink {
    type: 'video' | 'news';
    title: string;
    title_ko?: string;
    url: string;
    source: string;
}

export default function AdminPage() {
    const [incidents, setIncidents] = useState<Incident[]>(INCIDENTS_DATA as Incident[]);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editForm, setEditForm] = useState<Partial<Incident>>({});
    const [activeTab, setActiveTab] = useState<'basic' | 'timeline' | 'links'>('basic');

    const filteredIncidents = incidents.filter(inc =>
        inc.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.company_name_ko?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedIncidents = [...filteredIncidents].sort((a, b) => {
        const dateA = new Date(a.incident_date.replace(/\./g, '-'));
        const dateB = new Date(b.incident_date.replace(/\./g, '-'));
        return dateB.getTime() - dateA.getTime();
    });

    const handleEdit = (incident: Incident) => {
        setSelectedIncident(incident);
        setEditForm(incident);
        setIsEditing(true);
        setActiveTab('basic');
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = () => {
        if (!selectedIncident || !editForm) return;

        const updatedIncidents = incidents.map(inc =>
            inc.id === selectedIncident.id ? { ...inc, ...editForm } : inc
        );
        setIncidents(updatedIncidents);
        setIsEditing(false);
        setSelectedIncident(null);
        setEditForm({});
    };

    const handleAddNew = () => {
        const newId = Math.max(...incidents.map(i => i.id)) + 1;
        const newIncident: Incident = {
            id: newId,
            company_name: "New Company",
            company_name_ko: "새 회사",
            incident_date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
            severity: "warning",
            leaked_items: [],
            leaked_items_ko: [],
            description: "",
            description_ko: "",
            leaked_count: 0,
            original_url: "",
            fine_amount: "",
            fine_amount_ko: "",
            timeline: [],
            related_links: []
        };
        setIncidents([newIncident, ...incidents]);
        handleEdit(newIncident);
    };

    const handleDelete = (id: number) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            setIncidents(incidents.filter(inc => inc.id !== id));
        }
    };

    const exportJson = () => {
        const json = JSON.stringify(incidents, null, 4);
        navigator.clipboard.writeText(json);
        alert('JSON이 클립보드에 복사되었습니다!');
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    // Timeline helpers
    const addTimelineEvent = () => {
        const timeline = editForm.timeline || [];
        setEditForm({
            ...editForm,
            timeline: [...timeline, { date: '', title: '', title_ko: '' }]
        });
    };

    const updateTimelineEvent = (idx: number, field: keyof TimelineEvent, value: string) => {
        const timeline = [...(editForm.timeline || [])];
        timeline[idx] = { ...timeline[idx], [field]: value };
        setEditForm({ ...editForm, timeline });
    };

    const removeTimelineEvent = (idx: number) => {
        const timeline = (editForm.timeline || []).filter((_, i) => i !== idx);
        setEditForm({ ...editForm, timeline });
    };

    // Related links helpers
    const addRelatedLink = () => {
        const links = editForm.related_links || [];
        setEditForm({
            ...editForm,
            related_links: [...links, { type: 'news', title: '', title_ko: '', url: '', source: '' }]
        });
    };

    const updateRelatedLink = (idx: number, field: keyof RelatedLink, value: string) => {
        const links = [...(editForm.related_links || [])];
        links[idx] = { ...links[idx], [field]: value };
        setEditForm({ ...editForm, related_links: links });
    };

    const removeRelatedLink = (idx: number) => {
        const links = (editForm.related_links || []).filter((_, i) => i !== idx);
        setEditForm({ ...editForm, related_links: links });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">🔧 NotPublic Admin</h1>
                            <p className="text-slate-400 text-sm">데이터 관리 페이지</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href="/"
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition"
                            >
                                ← 메인으로
                            </a>
                            <button
                                onClick={handleAddNew}
                                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition"
                            >
                                + 새 사건 추가
                            </button>
                            <button
                                onClick={exportJson}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition"
                            >
                                📋 JSON 복사
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Edit Panel - Now at top when editing */}
                {isEditing && editForm && (
                    <div className="mb-8 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        {/* Edit Header */}
                        <div className="flex items-center justify-between bg-slate-700/50 px-6 py-4">
                            <h2 className="text-lg font-bold">
                                ✏️ 사건 수정: {editForm.company_name_ko || editForm.company_name}
                            </h2>
                            <button
                                onClick={() => { setIsEditing(false); setSelectedIncident(null); }}
                                className="text-slate-400 hover:text-white text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-700">
                            <button
                                onClick={() => setActiveTab('basic')}
                                className={`px-6 py-3 text-sm font-medium transition ${activeTab === 'basic'
                                    ? 'bg-slate-700 text-white border-b-2 border-blue-500'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                📋 기본 정보
                            </button>
                            <button
                                onClick={() => setActiveTab('timeline')}
                                className={`px-6 py-3 text-sm font-medium transition ${activeTab === 'timeline'
                                    ? 'bg-slate-700 text-white border-b-2 border-blue-500'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                📅 사건 경과 ({editForm.timeline?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('links')}
                                className={`px-6 py-3 text-sm font-medium transition ${activeTab === 'links'
                                    ? 'bg-slate-700 text-white border-b-2 border-blue-500'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                🔗 관련 링크 ({editForm.related_links?.length || 0})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'basic' && (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">회사명 (영문)</label>
                                        <input
                                            type="text"
                                            value={editForm.company_name || ''}
                                            onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">회사명 (한글)</label>
                                        <input
                                            type="text"
                                            value={editForm.company_name_ko || ''}
                                            onChange={(e) => setEditForm({ ...editForm, company_name_ko: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">날짜 (YYYY.MM.DD)</label>
                                        <input
                                            type="text"
                                            value={editForm.incident_date || ''}
                                            onChange={(e) => setEditForm({ ...editForm, incident_date: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">심각도</label>
                                        <select
                                            value={editForm.severity || 'warning'}
                                            onChange={(e) => setEditForm({ ...editForm, severity: e.target.value as 'critical' | 'warning' | 'info' })}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="critical">Critical (심각)</option>
                                            <option value="warning">Warning (경고)</option>
                                            <option value="info">Info (정보)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">유출 건수</label>
                                        <input
                                            type="number"
                                            value={editForm.leaked_count || 0}
                                            onChange={(e) => setEditForm({ ...editForm, leaked_count: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">과징금 (영문)</label>
                                        <input
                                            type="text"
                                            value={editForm.fine_amount || ''}
                                            onChange={(e) => setEditForm({ ...editForm, fine_amount: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">과징금 (한글)</label>
                                        <input
                                            type="text"
                                            value={editForm.fine_amount_ko || ''}
                                            onChange={(e) => setEditForm({ ...editForm, fine_amount_ko: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">설명 (영문)</label>
                                        <textarea
                                            value={editForm.description || ''}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            rows={2}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">설명 (한글)</label>
                                        <textarea
                                            value={editForm.description_ko || ''}
                                            onChange={(e) => setEditForm({ ...editForm, description_ko: e.target.value })}
                                            rows={2}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">유출 항목 (콤마로 구분)</label>
                                        <input
                                            type="text"
                                            value={editForm.leaked_items?.join(', ') || ''}
                                            onChange={(e) => setEditForm({
                                                ...editForm,
                                                leaked_items: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                            })}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Name, Email, Phone, Address"
                                        />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">유출 항목 한글 (콤마로 구분)</label>
                                        <input
                                            type="text"
                                            value={editForm.leaked_items_ko?.join(', ') || ''}
                                            onChange={(e) => setEditForm({
                                                ...editForm,
                                                leaked_items_ko: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                            })}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="이름, 이메일, 전화번호, 주소"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'timeline' && (
                                <div className="space-y-4">
                                    {(editForm.timeline || []).map((event, idx) => (
                                        <div key={idx} className="flex gap-3 items-start bg-slate-700/50 p-4 rounded-lg">
                                            <div className="flex-1 grid grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">날짜</label>
                                                    <input
                                                        type="text"
                                                        value={event.date}
                                                        onChange={(e) => updateTimelineEvent(idx, 'date', e.target.value)}
                                                        placeholder="2024.01.15"
                                                        className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-sm text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">제목 (영문)</label>
                                                    <input
                                                        type="text"
                                                        value={event.title}
                                                        onChange={(e) => updateTimelineEvent(idx, 'title', e.target.value)}
                                                        placeholder="Breach discovered"
                                                        className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-sm text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">제목 (한글)</label>
                                                    <input
                                                        type="text"
                                                        value={event.title_ko || ''}
                                                        onChange={(e) => updateTimelineEvent(idx, 'title_ko', e.target.value)}
                                                        placeholder="유출 발견"
                                                        className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-sm text-white"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeTimelineEvent(idx)}
                                                className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addTimelineEvent}
                                        className="w-full py-2 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-blue-500 hover:text-blue-400 transition"
                                    >
                                        + 타임라인 이벤트 추가
                                    </button>
                                </div>
                            )}

                            {activeTab === 'links' && (
                                <div className="space-y-4">
                                    {(editForm.related_links || []).map((link, idx) => (
                                        <div key={idx} className="bg-slate-700/50 p-4 rounded-lg">
                                            <div className="flex gap-3 items-start">
                                                <div className="flex-1 grid grid-cols-2 lg:grid-cols-5 gap-3">
                                                    <div>
                                                        <label className="block text-xs text-slate-400 mb-1">유형</label>
                                                        <select
                                                            value={link.type}
                                                            onChange={(e) => updateRelatedLink(idx, 'type', e.target.value)}
                                                            className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-sm text-white"
                                                        >
                                                            <option value="news">📰 뉴스</option>
                                                            <option value="video">🎬 영상</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-slate-400 mb-1">출처</label>
                                                        <input
                                                            type="text"
                                                            value={link.source}
                                                            onChange={(e) => updateRelatedLink(idx, 'source', e.target.value)}
                                                            placeholder="KBS뉴스"
                                                            className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-sm text-white"
                                                        />
                                                    </div>
                                                    <div className="lg:col-span-3">
                                                        <label className="block text-xs text-slate-400 mb-1">URL</label>
                                                        <input
                                                            type="text"
                                                            value={link.url}
                                                            onChange={(e) => updateRelatedLink(idx, 'url', e.target.value)}
                                                            placeholder="https://youtube.com/watch?v=..."
                                                            className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-sm text-white"
                                                        />
                                                    </div>
                                                    <div className="lg:col-span-2">
                                                        <label className="block text-xs text-slate-400 mb-1">제목 (영문)</label>
                                                        <input
                                                            type="text"
                                                            value={link.title}
                                                            onChange={(e) => updateRelatedLink(idx, 'title', e.target.value)}
                                                            placeholder="[KBS] Breaking News"
                                                            className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-sm text-white"
                                                        />
                                                    </div>
                                                    <div className="lg:col-span-2">
                                                        <label className="block text-xs text-slate-400 mb-1">제목 (한글)</label>
                                                        <input
                                                            type="text"
                                                            value={link.title_ko || ''}
                                                            onChange={(e) => updateRelatedLink(idx, 'title_ko', e.target.value)}
                                                            placeholder="[KBS] 속보"
                                                            className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-sm text-white"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeRelatedLink(idx)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addRelatedLink}
                                        className="w-full py-2 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-blue-500 hover:text-blue-400 transition"
                                    >
                                        + 관련 링크 추가
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Save Button */}
                        <div className="px-6 py-4 bg-slate-700/30 border-t border-slate-700">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition"
                            >
                                💾 저장
                            </button>
                        </div>
                    </div>
                )}

                {/* Search & Stats */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="사건 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                            🔍
                        </span>
                    </div>
                    <div className="bg-slate-800 px-4 py-3 rounded-lg border border-slate-700">
                        <span className="text-slate-400">총</span>
                        <span className="font-bold text-white ml-2">{incidents.length}건</span>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">회사명</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">날짜</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">심각도</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">유출량</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">타임라인</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">링크</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">액션</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {sortedIncidents.map((incident) => (
                                    <tr
                                        key={incident.id}
                                        className={`hover:bg-slate-700/50 transition ${selectedIncident?.id === incident.id ? 'bg-blue-900/30' : ''
                                            }`}
                                    >
                                        <td className="px-4 py-3 text-sm text-slate-400">
                                            #{incident.id}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-white">
                                                {incident.company_name_ko || incident.company_name}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                {incident.company_name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-300">
                                            {incident.incident_date}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(incident.severity)}`}>
                                                {incident.severity.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-300">
                                            {incident.leaked_count > 0
                                                ? new Intl.NumberFormat('ko-KR').format(incident.leaked_count)
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`${(incident.timeline?.length || 0) > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                                                {incident.timeline?.length || 0}개
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`${(incident.related_links?.length || 0) > 0 ? 'text-blue-400' : 'text-slate-500'}`}>
                                                {incident.related_links?.length || 0}개
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(incident)}
                                                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition"
                                                    title="수정"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(incident.id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded transition"
                                                    title="삭제"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="mt-8 grid grid-cols-4 gap-4">
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="text-3xl font-bold text-white">
                            {incidents.length}
                        </div>
                        <div className="text-slate-400 text-sm mt-1">총 사건 수</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="text-3xl font-bold text-red-400">
                            {incidents.filter(i => i.severity === 'critical').length}
                        </div>
                        <div className="text-slate-400 text-sm mt-1">Critical 사건</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="text-3xl font-bold text-amber-400">
                            {incidents.filter(i => i.severity === 'warning').length}
                        </div>
                        <div className="text-slate-400 text-sm mt-1">Warning 사건</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="text-3xl font-bold text-blue-400">
                            {new Intl.NumberFormat('ko-KR').format(
                                incidents.reduce((sum, i) => sum + (i.leaked_count || 0), 0)
                            )}
                        </div>
                        <div className="text-slate-400 text-sm mt-1">총 유출 건수</div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-amber-900/30 border border-amber-700/50 rounded-xl p-6">
                    <h3 className="text-amber-400 font-bold mb-2">⚠️ 사용 안내</h3>
                    <ul className="text-amber-200/80 text-sm space-y-1">
                        <li>• 이 페이지에서 수정한 내용은 <strong>브라우저에만 저장</strong>됩니다.</li>
                        <li>• 실제 데이터를 저장하려면 <strong>"JSON 복사"</strong> 버튼을 눌러 클립보드에 복사한 후</li>
                        <li>• <code className="bg-amber-900/50 px-1 rounded">src/data/incidents.json</code> 파일에 붙여넣기 하세요.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
