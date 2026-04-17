import AdminLayout from '../../components/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

const TYPE_STYLES = {
    order:    { color: 'text-blue-400   border-blue-400/40   bg-blue-400/10',   icon: '📦' },
    product:  { color: 'text-purple-400 border-purple-400/40 bg-purple-400/10', icon: '🎮' },
    auth:     { color: 'text-green-400  border-green-400/40  bg-green-400/10',  icon: '🔐' },
    content:  { color: 'text-amber-400  border-amber-400/40  bg-amber-400/10',  icon: '📝' },
    customer: { color: 'text-pink-400   border-pink-400/40   bg-pink-400/10',   icon: '👤' },
};

const ACTION_STYLES = {
    created:        'text-green-400',
    updated:        'text-blue-400',
    deleted:        'text-red-400',
    login:          'text-green-400',
    logout:         'text-white/40',
    register:       'text-purple-400',
    admin_login:    'text-green-400',
    admin_logout:   'text-white/40',
    status_updated: 'text-amber-400',
};

export default function AdminLogs({ logs, filters }) {
    const [search, setSearch]   = useState(filters?.search ?? '');
    const [type, setType]       = useState(filters?.type   ?? '');
    const [expanded, setExpanded] = useState(null);

    function applyFilters(overrides = {}) {
        router.get('/admin/logs',
            { search, type, ...overrides },
            { preserveScroll: true, replace: true }
        );
    }

    async function clearOld() {
        if (!confirm('Clear all logs older than 30 days?')) return;
        await axios.delete('/admin/logs/clear');
        router.reload();
    }

    const types = ['order', 'product', 'auth', 'content', 'customer'];

    return (
        <AdminLayout title="Activity Logs">

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        placeholder="Search logs..."
                        className="w-full bg-[#141414] border border-white/10 focus:border-[#D0111A] text-white text-sm px-4 py-2 pl-9 outline-none transition-colors placeholder-white/20"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
                </div>

                {/* Type filter pills */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => { setType(''); applyFilters({ type: '' }); }}
                        className={`font-barlow text-[10px] font-bold tracking-[2px] uppercase px-3 py-1.5 border transition-colors
                            ${!type ? 'bg-[#D0111A] border-[#D0111A] text-white' : 'border-white/15 text-white/40 hover:border-white/30 hover:text-white'}`}
                    >
                        All
                    </button>
                    {types.map(t => {
                        const s = TYPE_STYLES[t];
                        return (
                            <button
                                key={t}
                                onClick={() => { setType(t); applyFilters({ type: t }); }}
                                className={`font-barlow text-[10px] font-bold tracking-[2px] uppercase px-3 py-1.5 border transition-colors
                                    ${type === t ? `${s.color} border-current` : 'border-white/15 text-white/40 hover:border-white/30 hover:text-white'}`}
                            >
                                {s.icon} {t}
                            </button>
                        );
                    })}
                </div>

                <span className="ml-auto font-barlow text-xs text-white/30">
                    {logs.total} entries
                </span>

                <button
                    onClick={clearOld}
                    className="border border-red-500/30 text-red-400/60 hover:text-red-400 hover:border-red-500/60 font-barlow text-[10px] font-bold tracking-[2px] uppercase px-3 py-1.5 transition-colors"
                >
                    Clear Old Logs
                </button>
            </div>

            {/* Logs list */}
            <div className="bg-[#141414] border border-white/7">
                {logs.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-white/20">
                        <div className="text-4xl mb-3">📋</div>
                        <p className="font-bebas text-xl tracking-widest">No logs found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {logs.data.map(log => {
                            const typeStyle = TYPE_STYLES[log.type] || { color: 'text-white/40 border-white/20 bg-white/5', icon: '•' };
                            const isExpanded = expanded === log.id;

                            return (
                                <div key={log.id} className="hover:bg-white/2 transition-colors">
                                    <div
                                        className="flex items-start gap-4 px-5 py-4 cursor-pointer"
                                        onClick={() => setExpanded(isExpanded ? null : log.id)}
                                    >
                                        {/* Type badge */}
                                        <span className={`inline-flex items-center gap-1 font-barlow text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 border flex-shrink-0 mt-0.5 ${typeStyle.color}`}>
                                            {typeStyle.icon} {log.type}
                                        </span>

                                        {/* Main content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`font-barlow text-[10px] font-bold tracking-[2px] uppercase ${ACTION_STYLES[log.action] || 'text-white/40'}`}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </span>
                                                {log.admin && (
                                                    <span className="font-barlow text-[9px] text-white/25">by Admin: {log.admin}</span>
                                                )}
                                                {log.user && (
                                                    <span className="font-barlow text-[9px] text-white/25">by: {log.user}</span>
                                                )}
                                            </div>
                                            <p className="font-barlow text-sm text-white/70 truncate">{log.description}</p>
                                        </div>

                                        {/* Time + IP */}
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-barlow text-[10px] text-white/25">{log.time_ago}</div>
                                            {log.ip_address && (
                                                <div className="font-barlow text-[9px] text-white/15 mt-0.5">{log.ip_address}</div>
                                            )}
                                        </div>

                                        {/* Expand arrow */}
                                        <span className={`text-white/20 text-xs flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    </div>

                                    {/* Expanded detail */}
                                    {isExpanded && (
                                        <div className="px-5 pb-4 ml-28">
                                            <div className="bg-[#1E1E1E] border border-white/7 p-4 space-y-2">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/25 mb-1">Full Timestamp</div>
                                                        <div className="font-barlow text-xs text-white/60">{log.created_at}</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/25 mb-1">IP Address</div>
                                                        <div className="font-barlow text-xs text-white/60">{log.ip_address || '—'}</div>
                                                    </div>
                                                </div>

                                                {log.meta && Object.keys(log.meta).length > 0 && (
                                                    <div>
                                                        <div className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/25 mb-2">Metadata</div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {Object.entries(log.meta).map(([k, v]) => (
                                                                <div key={k} className="flex items-center gap-2">
                                                                    <span className="font-barlow text-[9px] uppercase tracking-[1px] text-white/30">{k}:</span>
                                                                    <span className="font-barlow text-xs text-white/60">{String(v)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/7">
                        <span className="font-barlow text-xs text-white/30">
                            Showing {logs.from}–{logs.to} of {logs.total}
                        </span>
                        <div className="flex gap-1">
                            {logs.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`min-w-[30px] h-7 font-barlow text-xs font-bold border transition-colors px-2
                                        ${link.active
                                            ? 'bg-[#D0111A] border-[#D0111A] text-white'
                                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}