import AdminLayout from '../../components/AdminLayout';
import { useState, useRef } from 'react';
import axios from 'axios';

const PAGE_LABELS = {
    home:  'Home Page',
    about: 'About Page',
    shop:  'Shop Page',
};

const TYPE_COLORS = {
    image:    'border-blue-500/30 text-blue-400 bg-blue-500/10',
    textarea: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    text:     'border-white/20 text-white/40 bg-white/5',
};

// ── Single content field ──────────────────────────────────────────────────────
function ContentField({ item }) {
    const [value, setValue]       = useState(item.value ?? '');
    const [preview, setPreview]   = useState(item.value ?? '');
    const [file, setFile]         = useState(null);
    const [loading, setLoading]   = useState(false);
    const [status, setStatus]     = useState(null); // null | 'saving' | 'saved' | 'error'
    const [errMsg, setErrMsg]     = useState('');
    const fileRef                 = useRef();

    function handleFileChange(e) {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        const url = URL.createObjectURL(f);
        setPreview(url);
        setStatus(null);
    }

    async function save() {
        setLoading(true);
        setStatus('saving');
        setErrMsg('');

        try {
            const fd = new FormData();
            fd.append('page', item.page);
            fd.append('key',  item.key);

            if (item.type === 'image') {
                if (file) {
                    fd.append('image', file);
                } else {
                    // No new file selected, send current value
                    fd.append('value', value);
                }
            } else {
                fd.append('value', value);
            }

            const res = await axios.post('/admin/content/update', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success) {
                // Update preview with the saved URL
                if (item.type === 'image' && res.data.value) {
                    setPreview(res.data.value);
                    setValue(res.data.value);
                }
                setFile(null);
                setStatus('saved');
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus('error');
                setErrMsg(res.data.message || 'Unknown error');
            }
        } catch (err) {
            console.error('Save error:', err);
            setStatus('error');
            setErrMsg(
                err.response?.data?.message ||
                err.message ||
                'Request failed'
            );
        } finally {
            setLoading(false);
        }
    }

    const btnClass = `w-full py-2 font-barlow text-[10px] font-bold tracking-[2px] uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5
        ${status === 'saved'  ? 'bg-green-600 text-white' :
          status === 'error'  ? 'bg-red-700 text-white'   :
                                'bg-[#D0111A] hover:bg-[#9E0D14] text-white'}`;

    return (
        <div className="bg-[#1A1A1A] border border-white/7 p-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <div className="font-barlow text-xs font-bold text-white">{item.label}</div>
                    <div className="font-barlow text-[9px] text-white/25 tracking-[1px] uppercase mt-0.5">
                        {item.page} / {item.key}
                    </div>
                </div>
                <span className={`font-barlow text-[9px] font-bold tracking-[2px] uppercase px-2 py-0.5 border flex-shrink-0 ${TYPE_COLORS[item.type] || TYPE_COLORS.text}`}>
                    {item.type}
                </span>
            </div>

            {/* Field */}
            {item.type === 'image' ? (
                <div className="space-y-2">
                    {/* Preview */}
                    <div
                        className="w-full h-40 bg-[#141414] border-2 border-dashed border-white/10 hover:border-[#D0111A] transition-colors overflow-hidden flex items-center justify-center cursor-pointer"
                        onClick={() => fileRef.current?.click()}
                    >
                        {preview ? (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-full h-full object-cover"
                                onError={e => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div className="text-center text-white/20">
                                <div className="text-3xl mb-1">🖼️</div>
                                <div className="font-barlow text-[10px]">Click to upload</div>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Current URL input */}
                    <input
                        type="text"
                        value={value}
                        onChange={e => { setValue(e.target.value); setPreview(e.target.value); setFile(null); }}
                        placeholder="Or paste image URL..."
                        className="w-full bg-[#141414] border border-white/10 focus:border-[#D0111A] text-white/60 text-xs px-3 py-2 outline-none transition-colors placeholder-white/15"
                    />

                    {file && (
                        <div className="font-barlow text-[10px] text-amber-400 flex items-center gap-1">
                            ⚠ New file selected: {file.name}
                        </div>
                    )}

                    <button onClick={save} disabled={loading} className={btnClass}>
                        {status === 'saving' && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
                        {status === 'saved'  ? '✓ Saved!'        :
                         status === 'error'  ? '✕ Failed'        :
                         status === 'saving' ? 'Saving...'       :
                         file               ? 'Upload & Save'    : 'Save URL'}
                    </button>
                </div>
            ) : item.type === 'textarea' ? (
                <div className="space-y-2">
                    <textarea
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        rows={3}
                        className="w-full bg-[#141414] border border-white/10 focus:border-[#D0111A] text-white text-sm px-3 py-2 outline-none resize-y transition-colors placeholder-white/20"
                    />
                    <button onClick={save} disabled={loading} className={btnClass}>
                        {status === 'saving' && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
                        {status === 'saved' ? '✓ Saved!' : status === 'error' ? '✕ Failed' : status === 'saving' ? 'Saving...' : 'Save'}
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="w-full bg-[#141414] border border-white/10 focus:border-[#D0111A] text-white text-sm px-3 py-2 outline-none transition-colors"
                    />
                    <button onClick={save} disabled={loading} className={btnClass}>
                        {status === 'saving' && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
                        {status === 'saved' ? '✓ Saved!' : status === 'error' ? '✕ Failed' : status === 'saving' ? 'Saving...' : 'Save'}
                    </button>
                </div>
            )}

            {/* Error message */}
            {status === 'error' && errMsg && (
                <div className="mt-2 bg-red-500/10 border border-red-500/30 px-3 py-2">
                    <p className="text-red-400 text-[10px] font-barlow">{errMsg}</p>
                </div>
            )}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminContent({ content }) {
    const [activePage, setActivePage] = useState('home');

    const pages = Object.keys(content);
    const items = (content[activePage] || []);

    const imageItems = items.filter(i => i.type === 'image');
    const textItems  = items.filter(i => i.type !== 'image');

    return (
        <AdminLayout title="Site Content">

            {/* Page tabs */}
            <div className="flex border-b border-white/7 mb-6">
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setActivePage(page)}
                        className={`px-6 py-3 font-barlow text-xs font-bold tracking-[2px] uppercase transition-colors border-b-2 -mb-px
                            ${activePage === page
                                ? 'text-white border-[#D0111A]'
                                : 'text-white/30 border-transparent hover:text-white/60'}`}
                    >
                        {PAGE_LABELS[page] || page}
                    </button>
                ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="font-bebas text-xl tracking-widest text-white">
                        Editing: {PAGE_LABELS[activePage]}
                    </h2>
                    <p className="font-barlow text-[10px] text-white/30 mt-0.5">
                        Each field saves independently. Click Save on each field after editing.
                    </p>
                </div>
                
                <a
                    href={activePage === 'home' ? '/' : `/${activePage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 border border-white/15 text-white/40 hover:border-[#D0111A] hover:text-[#D0111A] font-barlow text-[10px] font-bold tracking-[2px] uppercase px-4 py-2 transition-colors"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Preview Page
                </a>
            </div>

            {/* Images section */}
            {imageItems.length > 0 && (
                <div className="mb-6">
                    <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-3 flex items-center gap-2">
                        <span className="w-4 h-px bg-[#D0111A]"/> Images
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {imageItems.map(item => (
                            <ContentField key={`${item.page}-${item.key}`} item={item} />
                        ))}
                    </div>
                </div>
            )}

            {/* Text section */}
            {textItems.length > 0 && (
                <div>
                    <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-3 flex items-center gap-2">
                        <span className="w-4 h-px bg-[#D0111A]"/> Text Content
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {textItems.map(item => (
                            <ContentField key={`${item.page}-${item.key}`} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}