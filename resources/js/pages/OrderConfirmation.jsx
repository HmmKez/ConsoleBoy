import Layout from '../components/Layout';
import { Link } from '@inertiajs/react';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

export default function OrderConfirmation({ order }) {
    return (
        <Layout>
            <div className="min-h-screen bg-[#0E0E0E] py-12 px-6">
                <div className="max-w-2xl mx-auto">

                    {/* Thank you header */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h1 className="font-bebas text-5xl tracking-widest text-white mb-2">
                            ORDER <span className="text-[#D0111A]">CONFIRMED!</span>
                        </h1>
                        <p className="font-barlow text-white/50 text-sm">
                            Thank you for your order! We'll process it right away.
                        </p>
                    </div>

                    {/* Order number + status */}
                    <div className="bg-[#141414] border border-white/7 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/40 mb-1">Order Number</div>
                                <div className="font-bebas text-2xl tracking-widest text-white">{order.order_number}</div>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <span className="font-barlow text-xs font-bold tracking-[2px] uppercase text-amber-400">
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <div className="font-barlow text-xs text-white/30">Placed on {order.created_at}</div>
                    </div>

                    {/* Order items */}
                    <div className="bg-[#141414] border border-white/7 p-6 mb-4">
                        <h3 className="font-bebas text-lg tracking-widest text-white mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                    <div>
                                        <div className="font-barlow text-sm font-bold text-white">{item.product_name}</div>
                                        <div className="font-barlow text-xs text-white/40">
                                            P {fmt(item.unit_price)} × {item.quantity}
                                        </div>
                                    </div>
                                    <div className="font-bebas text-lg text-white">P {fmt(item.subtotal)}</div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-4 pt-4 border-t border-white/7 space-y-2">
                            <div className="flex justify-between font-barlow text-sm text-white/60">
                                <span>Subtotal</span><span>P {fmt(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between font-barlow text-sm">
                                <span className="text-white/60">Shipping</span>
                                <span className={order.shipping_fee == 0 ? 'text-green-400' : 'text-white/60'}>
                                    {order.shipping_fee == 0 ? 'FREE' : `P ${fmt(order.shipping_fee)}`}
                                </span>
                            </div>
                            <div className="flex justify-between font-bebas text-2xl text-white border-t border-white/10 pt-2">
                                <span>TOTAL</span><span>P {fmt(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping + Payment */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#141414] border border-white/7 p-4">
                            <h3 className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-3">Delivery Address</h3>
                            {order.address && (
                                <div className="font-barlow text-sm text-white/60 space-y-0.5">
                                    <p>{order.address.street}</p>
                                    <p>{order.address.barangay}, {order.address.city}</p>
                                    <p>{order.address.province}, {order.address.zip_code}</p>
                                </div>
                            )}
                        </div>
                        <div className="bg-[#141414] border border-white/7 p-4">
                            <h3 className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-3">Payment Method</h3>
                            <div className="flex items-center gap-2 font-barlow text-sm text-white">
                                <span>{order.payment_method === 'Cash on Delivery' ? '🤝' : '🏦'}</span>
                                <span>{order.payment_method}</span>
                            </div>
                            {order.payment_method === 'Cash on Delivery' && (
                                <p className="font-barlow text-xs text-white/40 mt-2">
                                    Please prepare P {fmt(order.total)} upon delivery.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Link
                            href="/shop"
                            className="flex-1 text-center bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-sm font-bold tracking-[3px] uppercase py-3 transition-all"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 text-center border border-white/10 hover:border-white/30 text-white/50 hover:text-white font-barlow text-sm font-bold tracking-[3px] uppercase py-3 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>

                    <p className="text-center text-white/20 text-xs font-barlow mt-8">
                        Questions? Contact us at conchakent@gmail.com or 09505208091
                    </p>
                </div>
            </div>
        </Layout>
    );
}