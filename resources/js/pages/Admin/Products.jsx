import AdminLayout from '../../components/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

// Accessories removed from brands — use Category for that
const BRANDS     = ['PlayStation', 'Xbox', 'Nintendo'];
const CATEGORIES = ['Console', 'Controller', 'Game', 'Accessory', 'Other'];

const DEFAULT_PERKS = [
    { label: 'Free Shipping', value: 'On orders over ₱2,000' },
    { label: '1-Year Warranty', value: 'Official coverage' },
    { label: '100% Authentic', value: 'Authorized dealer' },
    { label: '7-Day Returns', value: 'Hassle-free policy' },
];

// ── Perk Editor ──────────────────────────────────────────────────────────────
function PerkEditor({ perks, onChange }) {
    function addPerk() {
        onChange([...perks, { label: '', value: '' }]);
    }
    function removePerk(i) {
        onChange(perks.filter((_, idx) => idx !== i));
    }
    function updatePerk(i, field, val) {
        onChange(perks.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
    }
    function addPreset(preset) {
        if (!perks.find(p => p.label === preset.label)) {
            onChange([...perks, { ...preset }]);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/50">
                    Product Perks / Badges
                </label>
                <button
                    type="button"
                    onClick={addPerk}
                    className="font-barlow text-[9px] font-bold tracking-[1px] uppercase text-[#D0111A] hover:text-white transition-colors"
                >
                    + Add Perk
                </button>
            </div>

            {/* Preset quick-add */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {DEFAULT_PERKS.map(p => (
                    <button
                        key={p.label}
                        type="button"
                        onClick={() => addPreset(p)}
                        className={`font-barlow text-[9px] font-bold tracking-[1px] uppercase px-2 py-1 border transition-colors
                            ${perks.find(x => x.label === p.label)
                                ? 'border-[#D0111A] text-[#D0111A] bg-[#D0111A]/10'
                                : 'border-white/15 text-white/40 hover:border-white/30 hover:text-white'
                            }`}
                    >
                        {perks.find(x => x.label === p.label) ? '✓ ' : '+ '}{p.label}
                    </button>
                ))}
            </div>

            {/* Custom perks */}
            {perks.length > 0 && (
                <div className="space-y-2">
                    {perks.map((perk, i) => (
                        <div key={i} className="flex items-center gap-2 bg-[#1A1A1A] border border-white/7 px-3 py-2">
                            <input
                                type="text"
                                placeholder="Label (e.g. Free Shipping)"
                                value={perk.label}
                                onChange={e => updatePerk(i, 'label', e.target.value)}
                                className="flex-1 bg-transparent text-white text-xs outline-none placeholder-white/20 border-b border-white/10 focus:border-[#D0111A] pb-0.5"
                            />
                            <input
                                type="text"
                                placeholder="Value (e.g. On orders over ₱2,000)"
                                value={perk.value}
                                onChange={e => updatePerk(i, 'value', e.target.value)}
                                className="flex-1 bg-transparent text-white/60 text-xs outline-none placeholder-white/20 border-b border-white/10 focus:border-[#D0111A] pb-0.5"
                            />
                            <button
                                type="button"
                                onClick={() => removePerk(i)}
                                className="text-white/20 hover:text-red-400 transition-colors text-sm flex-shrink-0"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {perks.length === 0 && (
                <p className="font-barlow text-[10px] text-white/20 italic">
                    No perks added yet. Use presets above or click + Add Perk.
                </p>
            )}
        </div>
    );
}

// ── Color Editor ─────────────────────────────────────────────────────────────
function ColorEditor({ colors, onChange }) {
    const [input, setInput] = useState('');

    const PRESETS = [
        { name: 'White',  hex: '#E8E8E8' },
        { name: 'Black',  hex: '#1A1A1A' },
        { name: 'Red',    hex: '#D0111A' },
        { name: 'Blue',   hex: '#1A4ED8' },
        { name: 'Gray',   hex: '#6B7280' },
        { name: 'Silver', hex: '#C0C0C0' },
    ];

    function addColor(val) {
        const trimmed = val.trim();
        if (trimmed && !colors.includes(trimmed)) {
            onChange([...colors, trimmed]);
        }
        setInput('');
    }

    function removeColor(i) {
        onChange(colors.filter((_, idx) => idx !== i));
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/50">
                    Colors Available
                </label>
            </div>

            {/* Color presets */}
            <div className="flex flex-wrap gap-2 mb-3">
                {PRESETS.map(p => (
                    <button
                        key={p.name}
                        type="button"
                        title={p.name}
                        onClick={() => addColor(p.hex)}
                        className={`w-7 h-7 border-2 transition-all rounded-sm flex items-center justify-center
                            ${colors.includes(p.hex) ? 'border-[#D0111A] scale-110' : 'border-transparent hover:border-white/50'}`}
                        style={{ background: p.hex }}
                    >
                        {colors.includes(p.hex) && (
                            <span className="text-[10px] font-bold" style={{ color: p.hex === '#E8E8E8' || p.hex === '#C0C0C0' ? '#000' : '#fff' }}>✓</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Custom hex input */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Custom color (e.g. #FF5733 or 'Cosmic Blue')"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addColor(input))}
                    className="flex-1 bg-[#1E1E1E] border border-white/10 focus:border-[#D0111A] text-white text-xs px-3 py-2 outline-none transition-colors placeholder-white/20"
                />
                <button
                    type="button"
                    onClick={() => addColor(input)}
                    className="font-barlow text-[9px] font-bold tracking-[1px] uppercase border border-white/15 text-white/50 px-3 py-2 hover:border-[#D0111A] hover:text-[#D0111A] transition-colors"
                >
                    Add
                </button>
            </div>

            {/* Selected colors */}
            {colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {colors.map((color, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-[#1A1A1A] border border-white/10 px-2 py-1">
                            {color.startsWith('#') && (
                                <span className="w-4 h-4 rounded-sm border border-white/20 flex-shrink-0" style={{ background: color }}/>
                            )}
                            <span className="font-barlow text-[10px] text-white/70">{color}</span>
                            <button
                                type="button"
                                onClick={() => removeColor(i)}
                                className="text-white/20 hover:text-red-400 transition-colors text-xs ml-1"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Product Modal ─────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSaved }) {
    const isEdit = !!product;

    const [form, setForm] = useState({
        name:         product?.name        ?? '',
        brand:        product?.brand       ?? 'PlayStation',
        category:     product?.category    ?? 'Console',
        description:  product?.description ?? '',
        price:        product?.price       ?? '',
        stock:        product?.stock       ?? '',
        is_available: product?.is_available ?? true,
    });
    const [perks, setPerks]     = useState(product?.perks   ?? []);
    const [colors, setColors]   = useState(product?.colors  ?? []);
    const [image, setImage]     = useState(null);
    const [preview, setPreview] = useState(product?.image_url ?? null);
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);
    const [tab, setTab]         = useState('basic'); // 'basic' | 'display'

    function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }

    function handleImage(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const fd = new FormData();
        fd.append('name',         form.name);
        fd.append('brand',        form.brand);
        fd.append('category',     form.category);
        fd.append('description',  form.description);
        fd.append('price',        form.price);
        fd.append('stock',        form.stock);
        fd.append('is_available', form.is_available ? '1' : '0');
        fd.append('perks',        JSON.stringify(perks));
        fd.append('colors',       JSON.stringify(colors));
        if (image) fd.append('image', image);
        if (isEdit) fd.append('_method', 'POST');

        try {
            const url = isEdit ? `/admin/products/${product.id}` : '/admin/products';
            await axios.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            onSaved();
            onClose();
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                setTab('basic');
            } else {
                alert(err.response?.data?.message || 'Something went wrong.');
            }
        } finally {
            setLoading(false);
        }
    }

    const inp = (name, label, type = 'text', placeholder = '') => (
        <div>
            <label className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/50 block mb-1">{label}</label>
            <input
                type={type}
                value={form[name]}
                placeholder={placeholder}
                onChange={e => setF(name, e.target.value)}
                className={`w-full bg-[#1E1E1E] border text-white text-sm px-3 py-2.5 outline-none transition-colors
                    ${errors[name] ? 'border-[#D0111A]' : 'border-white/10 focus:border-[#D0111A]'}`}
            />
            {errors[name] && <p className="text-[#D0111A] text-[10px] mt-1">{errors[name][0]}</p>}
        </div>
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-[#141414] border border-white/10 border-t-2 border-t-[#D0111A] w-[660px] max-h-[92vh] overflow-hidden flex flex-col">

                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/7 flex-shrink-0">
                    <div>
                        <h2 className="font-bebas text-xl tracking-widest text-white">
                            {isEdit ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="font-barlow text-[10px] text-white/30 tracking-wide mt-0.5">
                            {isEdit ? `Editing: ${product.name}` : 'Fill in the details below'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/30 hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center">
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/7 flex-shrink-0">
                    {[
                        { id: 'basic',   label: 'Basic Info' },
                        { id: 'display', label: 'Display & Perks' },
                    ].map(t => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setTab(t.id)}
                            className={`px-6 py-3 font-barlow text-xs font-bold tracking-[2px] uppercase transition-colors border-b-2 -mb-px
                                ${tab === t.id
                                    ? 'text-white border-[#D0111A]'
                                    : 'text-white/30 border-transparent hover:text-white/60'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">

                        {/* ── TAB 1: Basic Info ── */}
                        {tab === 'basic' && (
                            <div className="space-y-5">

                                {/* Image upload */}
                                <div>
                                    <label className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/50 block mb-2">
                                        Product Image
                                    </label>
                                    <div className="flex gap-4">
                                        {/* Preview */}
                                        <div
                                            className="w-32 h-32 bg-[#1E1E1E] border-2 border-dashed border-white/10 hover:border-[#D0111A] flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors overflow-hidden"
                                            onClick={() => document.getElementById('prod-img-input').click()}
                                        >
                                            {preview
                                                ? <img src={preview} alt="Preview" className="w-full h-full object-cover"/>
                                                : <div className="text-center"><div className="text-3xl mb-1">📸</div><div className="font-barlow text-[9px] text-white/30">IMAGE</div></div>
                                            }
                                        </div>
                                        <div className="flex flex-col justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('prod-img-input').click()}
                                                className="bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-xs font-bold tracking-[2px] uppercase px-4 py-2 transition-colors"
                                            >
                                                Upload Image
                                            </button>
                                            <p className="font-barlow text-[10px] text-white/30">PNG, JPG, WEBP — max 5MB</p>
                                            {preview && (
                                                <button
                                                    type="button"
                                                    onClick={() => { setPreview(null); setImage(null); }}
                                                    className="font-barlow text-[9px] text-red-400/60 hover:text-red-400 transition-colors text-left"
                                                >
                                                    Remove image
                                                </button>
                                            )}
                                        </div>
                                        <input id="prod-img-input" type="file" accept="image/*" onChange={handleImage} className="hidden"/>
                                    </div>
                                </div>

                                {/* Product name */}
                                {inp('name', 'Product Name *', 'text', 'e.g. PlayStation 5 Pro Console')}

                                {/* Brand + Category */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/50 block mb-1">Brand *</label>
                                        <select
                                            value={form.brand}
                                            onChange={e => setF('brand', e.target.value)}
                                            className="w-full bg-[#1E1E1E] border border-white/10 focus:border-[#D0111A] text-white text-sm px-3 py-2.5 outline-none transition-colors"
                                        >
                                            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/50 block mb-1">Category *</label>
                                        <select
                                            value={form.category}
                                            onChange={e => setF('category', e.target.value)}
                                            className="w-full bg-[#1E1E1E] border border-white/10 focus:border-[#D0111A] text-white text-sm px-3 py-2.5 outline-none transition-colors"
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Price + Stock */}
                                <div className="grid grid-cols-2 gap-4">
                                    {inp('price', 'Price (₱) *', 'number', '0.00')}
                                    {inp('stock', 'Current Stock *', 'number', '0')}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/50 block mb-1">Product Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setF('description', e.target.value)}
                                        rows={4}
                                        placeholder="Write a short product description..."
                                        className="w-full bg-[#1E1E1E] border border-white/10 focus:border-[#D0111A] text-white text-sm px-3 py-2.5 outline-none resize-none transition-colors placeholder-white/20"
                                    />
                                </div>

                                {/* Availability + Status */}
                                <div className="flex items-center justify-between py-3 px-4 bg-[#1E1E1E] border border-white/7">
                                    <div>
                                        <div className="font-barlow text-sm font-bold text-white">Status</div>
                                        <div className="font-barlow text-[10px] text-white/40">
                                            {form.is_available ? 'Visible in the store' : 'Hidden from customers'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-barlow text-xs font-bold tracking-wide ${form.is_available ? 'text-green-400' : 'text-white/30'}`}>
                                            {form.is_available ? 'Available' : 'Unavailable'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setF('is_available', !form.is_available)}
                                            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0
                                                ${form.is_available ? 'bg-green-500' : 'bg-white/20'}`}
                                        >
                                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                                                ${form.is_available ? 'translate-x-6' : 'translate-x-1'}`}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── TAB 2: Display & Perks ── */}
                        {tab === 'display' && (
                            <div className="space-y-6">
                                <div className="bg-[#1E1E1E] border border-white/7 p-4 rounded-sm">
                                    <p className="font-barlow text-[10px] text-white/40 leading-relaxed">
                                        Perks appear as badges on the product detail page (e.g. Free Shipping, Warranty).
                                        Colors let customers see available variants.
                                    </p>
                                </div>

                                <PerkEditor perks={perks} onChange={setPerks} />

                                <div className="border-t border-white/7 pt-6">
                                    <ColorEditor colors={colors} onChange={setColors} />
                                </div>

                                {/* Live preview */}
                                {(perks.length > 0 || colors.length > 0) && (
                                    <div className="border-t border-white/7 pt-6">
                                        <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/30 mb-3">Preview</div>

                                        {colors.length > 0 && (
                                            <div className="mb-4">
                                                <div className="font-barlow text-[9px] uppercase tracking-[2px] text-white/40 mb-2">Colors</div>
                                                <div className="flex gap-2">
                                                    {colors.map((c, i) => (
                                                        <div key={i} className="flex items-center gap-1.5">
                                                            {c.startsWith('#') && (
                                                                <div className="w-6 h-6 border-2 border-white rounded-sm" style={{ background: c }}/>
                                                            )}
                                                            <span className="font-barlow text-[10px] text-white/50">{c}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {perks.length > 0 && (
                                            <div>
                                                <div className="font-barlow text-[9px] uppercase tracking-[2px] text-white/40 mb-2">Perks</div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {perks.map((p, i) => (
                                                        <div key={i} className="bg-[#1A1A1A] border border-white/7 px-3 py-2">
                                                            <div className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/70">{p.label || '—'}</div>
                                                            {p.value && <div className="font-barlow text-[9px] text-white/30">{p.value}</div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer actions */}
                    <div className="flex gap-3 px-6 py-4 border-t border-white/7 flex-shrink-0 bg-[#141414]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-white/15 text-white/50 font-barlow text-xs font-bold tracking-[2px] uppercase py-3 hover:border-white/30 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-xs font-bold tracking-[2px] uppercase py-3 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading
                                ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</>
                                : (isEdit ? '✓ Update Product' : '+ Add Product')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main Products Page ────────────────────────────────────────────────────────
export default function AdminProducts({ products, filters }) {
    const [modal, setModal]   = useState('closed');
    const [search, setSearch] = useState(filters?.search ?? '');

    function applyFilters(overrides = {}) {
        router.get('/admin/products', { search, ...overrides }, { preserveScroll: true, replace: true });
    }

    async function toggleAvailability(product) {
        try {
            await axios.patch(`/admin/products/${product.id}/availability`);
            router.reload({ only: ['products'] });
        } catch {
            alert('Could not update availability.');
        }
    }

    function confirmDelete(product) {
        if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
            router.delete(`/admin/products/${product.id}`, { preserveScroll: true });
        }
    }

    return (
        <AdminLayout title="Product Management">

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <input
                        type="text" value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        placeholder="Search products..."
                        className="w-full bg-[#141414] border border-white/10 focus:border-[#D0111A] text-white text-sm px-4 py-2 pl-9 outline-none transition-colors placeholder-white/20"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
                </div>
                <select
                    defaultValue={filters?.brand ?? ''}
                    onChange={e => applyFilters({ brand: e.target.value })}
                    className="bg-[#141414] border border-white/10 text-white/70 font-barlow text-xs tracking-widest uppercase px-3 py-2 outline-none focus:border-[#D0111A]"
                >
                    <option value="">All Brands</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <span className="ml-auto font-barlow text-xs text-white/30">{products.total} products</span>
                <button
                    onClick={() => setModal('add')}
                    className="flex items-center gap-2 bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-xs font-bold tracking-[2px] uppercase px-4 py-2 transition-colors"
                >
                    + Add Product
                </button>
            </div>

            {/* Table */}
            <div className="bg-[#141414] border border-white/7 overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="border-b border-white/7">
                            {['Product','Brand','Price','Stock','Perks','Available','Actions'].map(h => (
                                <th key={h} className="px-5 py-3 text-left font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/25">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products.data.length === 0 ? (
                            <tr><td colSpan={7} className="px-5 py-12 text-center font-barlow text-sm text-white/30">No products found</td></tr>
                        ) : products.data.map(product => (
                            <tr key={product.id} className="hover:bg-white/2 transition-colors">
                                {/* Product */}
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#1E1E1E] border border-white/7 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {product.image_url
                                                ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover"/>
                                                : <span>🎮</span>
                                            }
                                        </div>
                                        <div>
                                            <div className="font-barlow text-sm font-bold text-white">{product.name}</div>
                                            <div className="font-barlow text-[10px] text-white/30">{product.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 font-barlow text-xs text-white/60">{product.brand}</td>
                                <td className="px-5 py-3 font-bebas text-sm text-white">₱{fmt(product.price)}</td>
                                <td className="px-5 py-3">
                                    <span className={`font-bebas text-lg ${
                                        product.stock === 0 ? 'text-red-500' :
                                        product.stock <= 3  ? 'text-red-400' :
                                        product.stock <= 10 ? 'text-amber-400' : 'text-white'
                                    }`}>{product.stock}</span>
                                </td>
                                {/* Perks count */}
                                <td className="px-5 py-3">
                                    {product.perks && product.perks.length > 0 ? (
                                        <span className="font-barlow text-[9px] font-bold tracking-[1px] uppercase text-[#D0111A] border border-[#D0111A]/30 bg-[#D0111A]/10 px-2 py-0.5">
                                            {product.perks.length} perk{product.perks.length !== 1 ? 's' : ''}
                                        </span>
                                    ) : (
                                        <span className="font-barlow text-[10px] text-white/20">—</span>
                                    )}
                                </td>
                                {/* Toggle */}
                                <td className="px-5 py-3">
                                    <button
                                        onClick={() => toggleAvailability(product)}
                                        className={`w-10 h-6 rounded-full transition-colors relative ${product.is_available ? 'bg-green-500' : 'bg-white/20'}`}
                                    >
                                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${product.is_available ? 'translate-x-5' : 'translate-x-1'}`}/>
                                    </button>
                                </td>
                                {/* Actions */}
                                <td className="px-5 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setModal(product)}
                                            className="px-3 py-1.5 border border-blue-500/30 text-blue-400 font-barlow text-[9px] font-bold tracking-[1px] uppercase hover:bg-blue-500/10 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(product)}
                                            className="px-3 py-1.5 border border-red-500/30 text-red-400 font-barlow text-[9px] font-bold tracking-[1px] uppercase hover:bg-red-500/10 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.last_page > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/7">
                        <span className="font-barlow text-xs text-white/30">
                            Showing {products.from}–{products.to} of {products.total}
                        </span>
                        <div className="flex gap-1">
                            {products.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`min-w-[30px] h-7 font-barlow text-xs font-bold border transition-colors px-2
                                        ${link.active ? 'bg-[#D0111A] border-[#D0111A] text-white' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {modal !== 'closed' && (
                <ProductModal
                    product={modal === 'add' ? null : modal}
                    onClose={() => setModal('closed')}
                    onSaved={() => router.reload({ only: ['products'] })}
                />
            )}
        </AdminLayout>
    );
}