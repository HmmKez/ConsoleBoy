import Layout from '../components/Layout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function Cart({ cartItems: initialItems }) {
    const [items, setItems]   = useState(initialItems ?? []);
    const [loading, setLoading] = useState(null);

    const subtotal = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
    const shipping  = subtotal > 0 && subtotal < 2000 ? 150 : 0;
    const total     = subtotal + shipping;

    const fmt = (n) =>
        Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

    async function updateQty(item, newQty) {
        if (newQty < 1 || newQty > item.product.stock) return;
        setLoading(item.id);
        try {
            await axios.patch(`/cart/${item.id}`, { quantity: newQty });
            setItems(prev =>
                prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
            );
            router.reload({ only: ['cartCount'] });
        } catch (err) {
            alert(err.response?.data?.message || 'Could not update.');
        } finally {
            setLoading(null);
        }
    }

    async function removeItem(item) {
        setLoading(item.id);
        try {
            await axios.delete(`/cart/${item.id}`);
            setItems(prev => prev.filter(i => i.id !== item.id));
            router.reload({ only: ['cartCount'] });
        } catch {
            alert('Could not remove item.');
        } finally {
            setLoading(null);
        }
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#0E0E0E] py-10 px-6">
                <h1 className="font-bebas text-4xl tracking-widest text-center text-white mb-8">
                    YOUR <span className="text-[#D0111A]">CART</span>
                </h1>

                <div className="max-w-5xl mx-auto">
                    <div className="bg-[#141414] border border-white/7 p-6">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className="font-bebas text-2xl tracking-widest text-white">CART</span>
                            <span className="font-barlow text-xs text-white/40 tracking-widest">
                                ({items.length} {items.length === 1 ? 'item' : 'items'})
                            </span>
                        </div>

                        {items.length === 0 ? (
                            /* Empty state */
                            <div className="flex flex-col items-center justify-center py-20 text-white/20">
                                <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <path d="M16 10a4 4 0 01-8 0"/>
                                </svg>
                                <p className="font-bebas text-2xl tracking-widest mb-4">Your cart is empty</p>
                                <Link
                                    href="/shop"
                                    className="bg-[#D0111A] text-white font-barlow text-xs font-bold tracking-[2px] uppercase px-6 py-3 hover:bg-[#9E0D14] transition-colors"
                                >
                                    Browse Shop
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Column headers */}
                                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 pb-3 border-b border-white/7 mb-2">
                                    {['Product', 'Unit Price', 'Quantity', 'Subtotal', ''].map((h, i) => (
                                        <div key={i} className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/30">
                                            {h}
                                        </div>
                                    ))}
                                </div>

                                {/* Items */}
                                <div className="divide-y divide-white/5">
                                    {items.map(item => (
                                        <div
                                            key={item.id}
                                            className={`grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 items-center py-4 transition-opacity ${loading === item.id ? 'opacity-50 pointer-events-none' : ''}`}
                                        >
                                            {/* Product — clickable */}
                                            <Link
                                                href={`/products/${item.product.id}`}
                                                className="flex items-center gap-3 group"
                                            >
                                                <div className="w-14 h-14 bg-[#1E1E1E] border border-white/7 group-hover:border-[#D0111A] flex items-center justify-center flex-shrink-0 overflow-hidden transition-colors">
                                                    {item.product.image_url
                                                        ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover"/>
                                                        : <span className="text-2xl">🎮</span>
                                                    }
                                                </div>
                                                <div>
                                                    <div className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-[#D0111A]">
                                                        {item.product.brand}
                                                    </div>
                                                    <div className="font-bebas text-base tracking-wide text-white group-hover:text-[#D0111A] transition-colors leading-tight">
                                                        {item.product.name.toUpperCase()}
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Unit price */}
                                            <div className="font-barlow text-sm text-white/70">
                                                P {fmt(item.product.price)}
                                            </div>

                                            {/* Quantity controls */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => updateQty(item, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-7 h-7 border border-white/15 text-white hover:border-[#D0111A] hover:text-[#D0111A] transition-colors disabled:opacity-30 font-bold text-sm"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center font-bebas text-lg text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item, item.quantity + 1)}
                                                    disabled={item.quantity >= item.product.stock}
                                                    className="w-7 h-7 border border-white/15 text-white hover:border-[#D0111A] hover:text-[#D0111A] transition-colors disabled:opacity-30 font-bold text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="font-barlow text-sm text-white">
                                                P {fmt(Number(item.product.price) * item.quantity)}
                                            </div>

                                            {/* Remove button — clearly visible */}
                                            <button
                                                onClick={() => removeItem(item)}
                                                className="flex items-center gap-1.5 border border-white/15 hover:border-[#D0111A] text-white/40 hover:text-[#D0111A] transition-colors px-3 py-1.5 font-barlow text-[9px] font-bold tracking-[2px] uppercase"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6l-1 14H6L5 6"/>
                                                    <path d="M10 11v6M14 11v6"/>
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary + Checkout */}
                                <div className="flex justify-end mt-8 pt-6 border-t border-white/7">
                                    <div className="w-72">
                                        <div className="flex justify-between text-sm text-white/60 font-barlow mb-2">
                                            <span>Subtotal</span>
                                            <span>P {fmt(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-barlow mb-4">
                                            <span className="text-white/60">Shipping</span>
                                            <span className={shipping === 0 ? 'text-green-400' : 'text-white/60'}>
                                                {shipping === 0 ? 'FREE' : `P ${fmt(shipping)}`}
                                            </span>
                                        </div>
                                        {shipping === 0 && subtotal > 0 && (
                                            <p className="text-[10px] text-green-400/60 font-barlow text-right mb-3 -mt-2">
                                                Free shipping applied!
                                            </p>
                                        )}
                                        {shipping > 0 && (
                                            <p className="text-[10px] text-white/30 font-barlow text-right mb-3 -mt-2">
                                                Free shipping on orders over P 2,000
                                            </p>
                                        )}
                                        <div className="flex justify-between font-bebas text-2xl text-white border-t border-white/10 pt-3 mb-6">
                                            <span>TOTAL</span>
                                            <span>P {fmt(total)}</span>
                                        </div>

                                        <Link
                                            href="/checkout"
                                            className="flex items-center justify-center gap-2 w-full bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-sm font-bold tracking-[3px] uppercase py-3 transition-all hover:shadow-[0_0_20px_rgba(208,17,26,0.4)]"
                                        >
                                            Proceed to Checkout →
                                        </Link>

                                        <Link
                                            href="/shop"
                                            className="flex items-center justify-center gap-2 w-full mt-3 border border-white/10 hover:border-white/30 text-white/40 hover:text-white font-barlow text-xs font-bold tracking-[2px] uppercase py-2.5 transition-colors"
                                        >
                                            ← Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}