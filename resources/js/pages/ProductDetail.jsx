import Layout from '../components/Layout';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthModal from '../components/AuthModal';
import axios from 'axios';

export default function ProductDetail({ product, related }) {
    const { props } = usePage();
    const user = props.auth?.user;

    const [qty, setQty]             = useState(1);
    const [authModal, setAuthModal] = useState(null);
    const [added, setAdded]         = useState(false);
    const [selectedColor, setSelectedColor] = useState(
        product.colors && product.colors.length > 0 ? product.colors[0] : null
    );

    const price = Number(product.price);
    const perks  = product.perks  ?? [];
    const colors = product.colors ?? [];

    function handleAddToCart() {
        if (!user) { setAuthModal('login'); return; }
        axios.post('/cart', { product_id: product.id, quantity: qty })
            .then(res => {
                if (res.data.success) {
                    setAdded(true);
                    router.reload({ only: ['cartCount'] });
                    setTimeout(() => setAdded(false), 2000);
                }
            })
            .catch(err => {
                if (err.response && err.response.status !== 200) {
                    alert(err.response?.data?.message || 'Could not add to cart.');
                }
            });
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#0E0E0E] px-8 py-8 max-w-6xl mx-auto">
                <Link href="/shop" className="inline-flex items-center gap-2 font-barlow text-xs font-bold tracking-[2px] uppercase text-white/40 hover:text-white transition-colors mb-8">
                    ‹ Go Back
                </Link>

                <div className="grid grid-cols-2 gap-12 mb-16">
                    {/* Left — Images */}
                    <div>
                        <div className="bg-[#1A1A1A] border border-white/7 aspect-square flex items-center justify-center mb-3 overflow-hidden">
                            {product.image_url
                                ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover"/>
                                : <span className="text-8xl">🎮</span>
                            }
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {[0, 1, 2].map(i => (
                                <div key={i} className={`bg-[#1A1A1A] border aspect-square flex items-center justify-center overflow-hidden cursor-pointer ${i === 0 ? 'border-[#D0111A]' : 'border-white/7'}`}>
                                    {product.image_url
                                        ? <img src={product.image_url} alt="" className="w-full h-full object-cover"/>
                                        : <span className="text-2xl">🎮</span>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Info */}
                    <div>
                        <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-2">
                            {product.brand} · {product.category}
                        </div>
                        <h1 className="font-bebas text-4xl tracking-widest text-white leading-tight mb-3">
                            {product.name.toUpperCase()}
                        </h1>

                        {/* Stars */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-[#D0111A]">{'★★★★'.split('').map((s,i)=><span key={i}>{s}</span>)}<span className="text-white/20">★</span></div>
                            <span className="font-barlow text-xs text-white/40">(24 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="font-bebas text-4xl text-white mb-5">
                            P {price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </div>

                        {/* Colors — dynamic */}
                        {colors.length > 0 && (
                            <div className="mb-5">
                                <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/40 mb-2">
                                    Color — <span className="text-white">{selectedColor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {colors.map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(color)}
                                            title={color}
                                            className={`w-7 h-7 border-2 transition-colors rounded-sm`}
                                            style={{
                                                background: color.startsWith('#') ? color : undefined,
                                                borderColor: selectedColor === color ? 'white' : 'transparent',
                                            }}
                                        >
                                            {!color.startsWith('#') && (
                                                <span className="text-[10px] text-white font-bold">{color[0]}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Qty + Add to Cart */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center border border-white/15 bg-[#1A1A1A]">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 text-white hover:bg-white/10 transition-colors font-bold text-lg">−</button>
                                <span className="w-10 text-center font-bebas text-xl text-white">{qty}</span>
                                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 text-white hover:bg-white/10 transition-colors font-bold text-lg">+</button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 flex items-center justify-center gap-2 font-barlow text-sm font-bold tracking-[2px] uppercase py-3 transition-all
                                    ${added ? 'bg-green-600 text-white' : 'bg-[#D0111A] hover:bg-[#9E0D14] text-white hover:shadow-[0_0_20px_rgba(208,17,26,0.4)]'}`}
                            >
                                {added ? '✓ Added!' : '🛒 Add to Cart'}
                            </button>
                            <button className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/40 hover:text-[#D0111A] hover:border-[#D0111A] transition-colors">♡</button>
                        </div>

                        {/* Stock notices */}
                        {product.stock === 0 && <p className="text-red-400 font-barlow text-xs mb-3">Out of stock</p>}
                        {product.stock > 0 && product.stock <= 5 && (
                            <p className="text-amber-400 font-barlow text-xs mb-3">⚠ Only {product.stock} left in stock!</p>
                        )}

                        {/* Perks — dynamic */}
                        {perks.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mb-5">
                                {perks.map((perk, i) => (
                                    <div key={i} className="bg-[#1A1A1A] border border-white/7 px-3 py-2">
                                        <div className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/70">
                                            {perk.label}
                                        </div>
                                        {perk.value && (
                                            <div className="font-barlow text-[9px] text-white/30">{perk.value}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div>
                                <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/40 mb-2">Description</div>
                                <p className="text-sm text-white/50 leading-relaxed">{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related */}
                {related && related.length > 0 && (
                    <div>
                        <h2 className="font-bebas text-3xl tracking-widest text-white mb-1">
                            YOU MAY ALSO <span className="text-[#D0111A]">LIKE</span>
                        </h2>
                        <p className="text-white/30 text-xs font-barlow mb-6">We give you the best of the best!</p>
                        <div className="grid grid-cols-4 gap-1">
                            {related.map(p => (
                                <Link key={p.id} href={`/products/${p.id}`} className="group bg-[#1A1A1A] border border-white/7 hover:border-[#D0111A] transition-colors overflow-hidden block">
                                    <div className="aspect-square bg-[#1E1E1E] flex items-center justify-center overflow-hidden">
                                        {p.image_url
                                            ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                            : <span className="text-4xl">🎮</span>
                                        }
                                    </div>
                                    <div className="p-3 border-t border-white/7">
                                        <div className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-[#D0111A] mb-1">{p.brand}</div>
                                        <div className="font-barlow text-sm font-bold text-white mb-1 leading-tight">{p.name}</div>
                                        <div className="font-bebas text-base text-white">PHP {Number(p.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {authModal && (
                <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />
            )}
        </Layout>
    );
}