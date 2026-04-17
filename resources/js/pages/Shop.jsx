import Layout from '../components/Layout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const BRANDS     = ['PlayStation', 'Xbox', 'Nintendo'];
const CATEGORIES = ['Console', 'Controller', 'Game', 'Accessory', 'Other'];

function ProductCard({ product }) {
    const price = Number(product.price);
    return (
        <Link
            href={`/products/${product.id}`}
            className="group bg-[#1A1A1A] border border-white/7 hover:border-[#D0111A] transition-colors overflow-hidden block"
        >
            <div className="aspect-square bg-[#1E1E1E] flex items-center justify-center relative overflow-hidden">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <span className="text-6xl">🎮</span>
                )}
                <div className="absolute top-3 left-3">
                    <span className="bg-[#D0111A] text-white font-barlow text-[9px] font-bold tracking-[2px] uppercase px-2 py-1">
                        NEW
                    </span>
                </div>
            </div>
            <div className="p-4 border-t border-white/7">
                <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-1">
                    {product.brand}
                </div>
                <div className="font-barlow text-base font-bold text-white mb-3 leading-tight">
                    {product.name}
                </div>
                <div className="font-bebas text-xl tracking-wide text-white">
                    PHP {price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </div>
            </div>
        </Link>
    );
}

export default function Shop(props) {
    const content = props.content || {};
    const safeFilters = {
        brand:     '',
        category:  '',
        sort:      'low',
        search:    '',
        max_price: 50000,
        in_stock:  '',
        ...(props.filters || {}),
    };

    const products    = props.products    || { data: [], links: [], last_page: 1, from: 0, to: 0, total: 0 };
    const activeBrand = props.activeBrand || '';

    const [search, setSearch]     = useState(safeFilters.search);
    const [sort, setSort]         = useState(safeFilters.sort);
    const [category, setCategory] = useState(safeFilters.category);
    const [maxPrice, setMaxPrice] = useState(safeFilters.max_price);
    const [inStock, setInStock]   = useState(safeFilters.in_stock === '1');

    function applyFilters(overrides = {}) {
        const params = {
            brand:     activeBrand,
            category,
            sort,
            search,
            max_price: maxPrice,
            in_stock:  inStock ? '1' : '',
            ...overrides,
        };
        Object.keys(params).forEach(k => {
            if (params[k] === '' || params[k] === null || params[k] === undefined) {
                delete params[k];
            }
        });
        router.get('/shop', params, { preserveScroll: true, replace: true });
    }

    function switchBrand(brand) {
        router.get('/shop', {
            brand,
            category,
            sort,
            search,
            max_price: maxPrice,
        }, { preserveScroll: true, replace: true });
    }

    function clearAll() {
        setSearch('');
        setSort('low');
        setCategory('');
        setMaxPrice(50000);
        setInStock(false);
        router.get('/shop', {}, { preserveScroll: true, replace: true });
    }

    return (
        <Layout>
            {/* Brand header — original arrows style */}
            <div className="relative h-36 flex items-center justify-center overflow-hidden bg-[#141414]">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url('${content.hero_image || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1400&q=80'}')` }}
                />
                <div className="relative z-10 flex items-center gap-8">
                    <button
                        onClick={() => {
                            const idx = BRANDS.indexOf(activeBrand);
                            switchBrand(idx <= 0 ? '' : BRANDS[idx - 1]);
                        }}
                        className="text-white/50 hover:text-white text-3xl font-bold transition-colors"
                    >
                        ‹
                    </button>
                    <h1 className="font-bebas text-5xl tracking-[4px] text-white min-w-[200px] text-center">
                        {activeBrand ? activeBrand.toUpperCase() : 'ALL PRODUCTS'}
                    </h1>
                    <button
                        onClick={() => {
                            if (!activeBrand) {
                                switchBrand(BRANDS[0]);
                            } else {
                                const idx = BRANDS.indexOf(activeBrand);
                                switchBrand(idx >= BRANDS.length - 1 ? '' : BRANDS[idx + 1]);
                            }
                        }}
                        className="text-white/50 hover:text-white text-3xl font-bold transition-colors"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="flex min-h-screen bg-[#0E0E0E]">

                {/* ── ENHANCED SIDEBAR ── */}
                <aside className="w-48 flex-shrink-0 bg-[#0A0A0A] border-r border-white/7 flex flex-col">

                    <div className="flex-1 overflow-y-auto p-4 space-y-5">

                        {/* Category */}
                        <div>
                            <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-3">
                                Type
                            </div>
                            <div className="space-y-1">
                                <button
                                    onClick={() => { setCategory(''); applyFilters({ category: '' }); }}
                                    className={`w-full text-left font-barlow text-xs px-2 py-1.5 transition-colors border-l-2
                                        ${!category
                                            ? 'border-[#D0111A] text-white bg-[#D0111A]/5'
                                            : 'border-transparent text-white/40 hover:text-white hover:border-white/20'}`}
                                >
                                    All
                                </button>
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => { setCategory(cat); applyFilters({ category: cat }); }}
                                        className={`w-full text-left font-barlow text-xs px-2 py-1.5 transition-colors border-l-2 flex items-center justify-between group
                                            ${category === cat
                                                ? 'border-[#D0111A] text-white bg-[#D0111A]/5'
                                                : 'border-transparent text-white/40 hover:text-white hover:border-white/20'}`}
                                    >
                                        <span>{cat}</span>
                                        {category === cat && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#D0111A] flex-shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price range */}
                        <div>
                            <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-3">
                                Price Range
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="50000"
                                step="1000"
                                value={maxPrice}
                                onChange={e => setMaxPrice(Number(e.target.value))}
                                onMouseUp={() => applyFilters({ max_price: maxPrice })}
                                onTouchEnd={() => applyFilters({ max_price: maxPrice })}
                                className="w-full accent-[#D0111A] cursor-pointer"
                            />
                            <div className="flex justify-between font-barlow text-[10px] mt-1">
                                <span className="text-white/30">₱0</span>
                                <span className="text-white/60">₱{Number(maxPrice).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-3">
                                Sort By
                            </div>
                            <div className="space-y-1">
                                {[
                                    { val: 'low',  label: 'Price: Low to High' },
                                    { val: 'high', label: 'Price: High to Low' },
                                    { val: 'name', label: 'Name A–Z' },
                                ].map(({ val, label }) => (
                                    <button
                                        key={val}
                                        onClick={() => { setSort(val); applyFilters({ sort: val }); }}
                                        className={`w-full text-left font-barlow text-xs px-2 py-1.5 transition-colors border-l-2
                                            ${sort === val
                                                ? 'border-[#D0111A] text-white bg-[#D0111A]/5'
                                                : 'border-transparent text-white/40 hover:text-white hover:border-white/20'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div>
                            <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-3">
                                Availability
                            </div>
                            <button
                                onClick={() => {
                                    const next = !inStock;
                                    setInStock(next);
                                    applyFilters({ in_stock: next ? '1' : '' });
                                }}
                                className="w-full text-left font-barlow text-xs px-2 py-1.5 transition-colors border-l-2 flex items-center gap-2 group border-transparent text-white/40 hover:text-white hover:border-white/20"
                            >
                                <span className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors
                                    ${inStock ? 'bg-[#D0111A] border-[#D0111A]' : 'border-white/25'}`}
                                >
                                    {inStock && <span className="text-[8px] text-white font-bold leading-none">✓</span>}
                                </span>
                                <span className={inStock ? 'text-white' : ''}>In Stock</span>
                            </button>
                            <button
                                onClick={() => {}}
                                className="w-full text-left font-barlow text-xs px-2 py-1.5 transition-colors border-l-2 flex items-center gap-2 border-transparent text-white/40 hover:text-white hover:border-white/20 mt-1"
                            >
                                <span className="w-3.5 h-3.5 border border-white/25 flex items-center justify-center flex-shrink-0" />
                                <span>Pre-Order</span>
                            </button>
                        </div>

                        {/* Search */}
                        <div>
                            <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-3">
                                Search
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                                    placeholder="Search..."
                                    className="w-full bg-[#141414] border border-white/10 focus:border-[#D0111A] text-white text-xs px-3 py-2 pr-7 outline-none transition-colors placeholder-white/20"
                                />
                                <button
                                    onClick={() => applyFilters()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors text-xs"
                                >
                                    🔍
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Clear all */}
                    <div className="p-4 border-t border-white/7">
                        <button
                            onClick={clearAll}
                            className="w-full border border-white/10 hover:border-[#D0111A] text-white/30 hover:text-[#D0111A] font-barlow text-[9px] font-bold tracking-[2px] uppercase py-2 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </aside>

                {/* ── PRODUCTS AREA — original layout ── */}
                <div className="flex-1 p-8">

                    {/* Top controls bar — original */}
                    <div className="flex items-center gap-4 mb-6">
                        <select
                            value={sort}
                            onChange={e => { setSort(e.target.value); applyFilters({ sort: e.target.value }); }}
                            className="ml-auto bg-[#1E1E1E] border border-white/7 text-white/70 font-barlow text-xs tracking-widest uppercase px-4 py-2 outline-none focus:border-[#D0111A] cursor-pointer"
                        >
                            <option value="low">Low to High</option>
                            <option value="high">High to Low</option>
                            <option value="name">Name A–Z</option>
                        </select>
                    </div>

                    {/* Product grid — original 3-col */}
                    {products.data && products.data.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1">
                            {products.data.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-white/20">
                            <div className="text-6xl mb-4">🎮</div>
                            <div className="font-bebas text-2xl tracking-widest mb-2">No products found</div>
                            <button
                                onClick={clearAll}
                                className="mt-4 border border-white/15 text-white/40 hover:border-[#D0111A] hover:text-[#D0111A] font-barlow text-xs font-bold tracking-[2px] uppercase px-4 py-2 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination — original */}
                    {products.last_page > 1 && (
                        <div className="flex items-center justify-center gap-1 mt-8">
                            <span className="font-barlow text-xs text-white/30 mr-4">
                                Showing {products.from}–{products.to} of {products.total} products
                            </span>
                            {(products.links ?? []).map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`min-w-[32px] h-8 font-barlow text-xs font-bold border transition-colors
                                        ${link.active
                                            ? 'bg-[#D0111A] border-[#D0111A] text-white'
                                            : 'bg-none border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}