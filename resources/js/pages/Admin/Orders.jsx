import AdminLayout from '../../components/AdminLayout';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState, useEffect } from 'react';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

const STATUS_STYLES = {
    Pending:   'text-amber-400  border-amber-400/40  bg-amber-400/8',
    Paid:      'text-blue-400   border-blue-400/40   bg-blue-400/8',
    Shipped:   'text-purple-400 border-purple-400/40 bg-purple-400/8',
    Completed: 'text-green-400  border-green-400/40  bg-green-400/8',
};

const STATUSES = ['Pending', 'Paid', 'Shipped', 'Completed'];

function OrderDetailPanel({ orderId, onClose }) {
    const [order, setOrder]   = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/admin/orders/${orderId}`)
            .then(res => setOrder(res.data))
            .finally(() => setLoading(false));
    }, [orderId]);

    async function updateStatus(status) {
        await axios.patch(`/admin/orders/${orderId}/status`, { status });
        setOrder(prev => ({ ...prev, status }));
        router.reload({ only: ['orders'] });
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
            <div className="relative w-[480px] bg-[#141414] border-l border-white/10 h-full overflow-y-auto flex flex-col z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/7 sticky top-0 bg-[#141414] z-10">
                    <h2 className="font-bebas text-xl tracking-widest text-white">Order Details</h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-white/30 font-barlow text-sm">Loading...</div>
                ) : !order ? (
                    <div className="flex-1 flex items-center justify-center text-white/30 font-barlow text-sm">Order not found</div>
                ) : (
                    <div className="flex-1 p-6 space-y-5">
                        {/* Order # and current status */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/30 mb-1">Order Number</div>
                                <div className="font-bebas text-2xl tracking-widest text-white">{order.order_number}</div>
                                <div className="font-barlow text-xs text-white/30 mt-1">{order.created_at}</div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 font-barlow text-[9px] font-bold tracking-[2px] uppercase px-3 py-1.5 border ${STATUS_STYLES[order.status]}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current"/>
                                {order.status}
                            </span>
                        </div>

                        {/* Update status */}
                        <div className="bg-[#1E1E1E] border border-white/7 p-4">
                            <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/30 mb-3">Update Status</div>
                            <div className="grid grid-cols-2 gap-2">
                                {STATUSES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => updateStatus(s)}
                                        className={`py-2 font-barlow text-[10px] font-bold tracking-[1.5px] uppercase border transition-colors
                                            ${order.status === s
                                                ? `${STATUS_STYLES[s]} border-current`
                                                : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Customer */}
                        <div>
                            <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-2">Customer</div>
                            <div className="bg-[#1E1E1E] border border-white/7 p-4 space-y-1">
                                <div className="font-barlow text-sm font-bold text-white">{order.customer?.name}</div>
                                <div className="font-barlow text-xs text-white/50">{order.customer?.email}</div>
                                {order.customer?.phone && <div className="font-barlow text-xs text-white/50">{order.customer.phone}</div>}
                            </div>
                        </div>

                        {/* Delivery address */}
                        {order.address && (
                            <div>
                                <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-2">Delivery Address</div>
                                <div className="bg-[#1E1E1E] border border-white/7 p-4 font-barlow text-sm text-white/60 space-y-0.5">
                                    <p>{order.address.street}</p>
                                    <p>{order.address.barangay}, {order.address.city}</p>
                                    <p>{order.address.province} {order.address.zip_code}</p>
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        <div>
                            <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-2">Order Items</div>
                            <div className="bg-[#1E1E1E] border border-white/7 divide-y divide-white/5">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between px-4 py-3">
                                        <div>
                                            <div className="font-barlow text-sm font-bold text-white">{item.product_name}</div>
                                            <div className="font-barlow text-xs text-white/40">₱{fmt(item.unit_price)} × {item.quantity}</div>
                                        </div>
                                        <div className="font-bebas text-base text-white">₱{fmt(item.subtotal)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="bg-[#1E1E1E] border border-white/7 p-4 space-y-2">
                            <div className="flex justify-between font-barlow text-sm text-white/60">
                                <span>Subtotal</span><span>₱{fmt(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between font-barlow text-sm text-white/60">
                                <span>Shipping</span>
                                <span className={order.shipping_fee == 0 ? 'text-green-400' : ''}>
                                    {order.shipping_fee == 0 ? 'FREE' : `₱${fmt(order.shipping_fee)}`}
                                </span>
                            </div>
                            <div className="flex justify-between font-bebas text-xl text-white border-t border-white/10 pt-2 mt-2">
                                <span>TOTAL</span><span>₱{fmt(order.total)}</span>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="flex items-center gap-3 bg-[#1E1E1E] border border-white/7 p-4">
                            <span className="text-xl">{order.payment_method === 'Cash on Delivery' ? '🤝' : '🏦'}</span>
                            <div>
                                <div className="font-barlow text-sm font-bold text-white">{order.payment_method}</div>
                                <div className="font-barlow text-xs text-white/40">Payment method</div>
                            </div>
                        </div>

                        {order.order_note && (
                            <div>
                                <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-2">Order Note</div>
                                <div className="bg-[#1E1E1E] border-l-2 border-[#D0111A] px-4 py-3 font-barlow text-sm text-white/60">{order.order_note}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminOrders({ orders, filters }) {
    const [search, setSearch]       = useState(filters?.search ?? '');
    const [statusFilter, setStatus] = useState(filters?.status ?? '');
    const [viewingId, setViewingId] = useState(null);

    function applyFilters(overrides = {}) {
        router.get('/admin/orders', { search, status: statusFilter, ...overrides }, { preserveScroll: true, replace: true });
    }

    return (
        <AdminLayout title="Order Management">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-xs">
                    <input
                        type="text" value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        placeholder="Search orders or customers..."
                        className="w-full bg-[#141414] border border-white/10 focus:border-[#D0111A] text-white text-sm px-4 py-2 pl-9 outline-none transition-colors placeholder-white/20"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
                </div>
                <select
                    value={statusFilter}
                    onChange={e => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                    className="bg-[#141414] border border-white/10 text-white/70 font-barlow text-xs tracking-widest uppercase px-3 py-2 outline-none"
                >
                    <option value="">All Statuses</option>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <span className="ml-auto font-barlow text-xs text-white/30">{orders.total} orders</span>
            </div>

            {/* Table */}
            <div className="bg-[#141414] border border-white/7">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/7">
                            {['Order #','Customer','Total','Payment','Status','Date',''].map(h => (
                                <th key={h} className="px-5 py-3 text-left font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/25">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.data.map(order => (
                            <tr key={order.id} className="hover:bg-white/2 transition-colors">
                                <td className="px-5 py-3 font-barlow text-xs font-bold text-white">{order.order_number}</td>
                                <td className="px-5 py-3">
                                    <div className="font-barlow text-sm text-white">{order.customer}</div>
                                    <div className="font-barlow text-[10px] text-white/30">{order.email}</div>
                                </td>
                                <td className="px-5 py-3 font-bebas text-sm text-white">₱{fmt(order.total)}</td>
                                <td className="px-5 py-3 font-barlow text-xs text-white/50">{order.payment_method}</td>
                                <td className="px-5 py-3">
                                    <span className={`inline-flex items-center gap-1 font-barlow text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 border ${STATUS_STYLES[order.status]}`}>
                                        <span className="w-1 h-1 rounded-full bg-current"/>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 font-barlow text-xs text-white/30">{order.created_at}</td>
                                <td className="px-5 py-3">
                                    <button
                                        onClick={() => setViewingId(order.id)}
                                        className="px-3 py-1 border border-white/15 text-white/50 font-barlow text-[9px] font-bold tracking-[1px] uppercase hover:border-[#D0111A] hover:text-[#D0111A] transition-colors"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/7">
                        <span className="font-barlow text-xs text-white/30">
                            Showing {orders.from}–{orders.to} of {orders.total}
                        </span>
                        <div className="flex gap-1">
                            {orders.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`min-w-[30px] h-7 font-barlow text-xs font-bold border transition-colors
                                        ${link.active ? 'bg-[#D0111A] border-[#D0111A] text-white' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-30'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Order detail slide-in panel */}
            {viewingId && (
                <OrderDetailPanel
                    orderId={viewingId}
                    onClose={() => setViewingId(null)}
                />
            )}
        </AdminLayout>
    );
}