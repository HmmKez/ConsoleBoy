import AdminLayout from '../../components/AdminLayout';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

const STATUS_STYLES = {
    Pending: 'text-amber-400 border-amber-400/40 bg-amber-400/8',
    Paid: 'text-blue-400 border-blue-400/40 bg-blue-400/8',
    Shipped: 'text-purple-400 border-purple-400/40 bg-purple-400/8',
    Completed: 'text-green-400 border-green-400/40 bg-green-400/8',
};

const STATUSES = ['Pending', 'Paid', 'Shipped', 'Completed'];

function paymentLabel(order) {
    return order.payment_channel ? `${order.payment_method} / ${order.payment_channel}` : order.payment_method;
}

function OrderDetailPanel({ orderId, onClose }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shipmentForm, setShipmentForm] = useState({ tracking_courier: '', tracking_number: '' });
    const [shipmentError, setShipmentError] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState('');

    useEffect(() => {
        axios.get(`/admin/orders/${orderId}`)
            .then((res) => {
                setOrder(res.data);
                setShipmentForm({
                    tracking_courier: res.data.tracking_courier || '',
                    tracking_number: res.data.tracking_number || '',
                });
            })
            .finally(() => setLoading(false));
    }, [orderId]);

    async function updateStatus(status) {
        setShipmentError('');
        setUpdatingStatus(status);

        try {
            const { data } = await axios.patch(`/admin/orders/${orderId}/status`, {
                status,
                tracking_courier: shipmentForm.tracking_courier,
                tracking_number: shipmentForm.tracking_number,
            });

            setOrder((prev) => ({
                ...prev,
                status: data.status,
                tracking_courier: data.tracking_courier,
                tracking_number: data.tracking_number,
            }));

            router.reload({ only: ['orders'] });
        } catch (err) {
            setShipmentError(err.response?.data?.message || err.response?.data?.errors?.tracking_number?.[0] || 'Could not update order.');
        } finally {
            setUpdatingStatus('');
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 flex h-full w-[520px] flex-col overflow-y-auto border-l border-white/10 bg-[#141414]">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/7 bg-[#141414] px-6 py-4">
                    <h2 className="font-bebas text-xl tracking-widest text-white">Order Details</h2>
                    <button onClick={onClose} className="text-xl text-white/40 hover:text-white">×</button>
                </div>

                {loading ? (
                    <div className="flex flex-1 items-center justify-center font-barlow text-sm text-white/30">Loading...</div>
                ) : !order ? (
                    <div className="flex flex-1 items-center justify-center font-barlow text-sm text-white/30">Order not found</div>
                ) : (
                    <div className="flex-1 space-y-5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="mb-1 font-barlow text-[9px] font-bold uppercase tracking-[3px] text-white/30">Order Number</div>
                                <div className="font-bebas text-2xl tracking-widest text-white">{order.order_number}</div>
                                <div className="mt-1 font-barlow text-xs text-white/30">{order.created_at}</div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 border px-3 py-1.5 font-barlow text-[9px] font-bold uppercase tracking-[2px] ${STATUS_STYLES[order.status]}`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {order.status}
                            </span>
                        </div>

                        <div className="border border-white/7 bg-[#1E1E1E] p-4">
                            <div className="mb-3 font-barlow text-[9px] font-bold uppercase tracking-[3px] text-white/30">Update Status</div>
                            <div className="grid grid-cols-2 gap-2">
                                {STATUSES.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => updateStatus(status)}
                                        disabled={updatingStatus !== ''}
                                        className={`py-2 font-barlow text-[10px] font-bold uppercase tracking-[1.5px] transition-colors ${
                                            order.status === status
                                                ? `border ${STATUS_STYLES[status]}`
                                                : 'border border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                                        } disabled:opacity-60`}
                                    >
                                        {updatingStatus === status ? 'Saving...' : status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border border-white/7 bg-[#1E1E1E] p-4">
                            <div className="mb-3 font-barlow text-[9px] font-bold uppercase tracking-[3px] text-[#D0111A]">Shipment Tracking</div>
                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block font-barlow text-[10px] font-bold uppercase tracking-[2px] text-white/45">Courier</label>
                                    <input
                                        value={shipmentForm.tracking_courier}
                                        onChange={(e) => setShipmentForm((prev) => ({ ...prev, tracking_courier: e.target.value }))}
                                        placeholder="LBC, J&T, Ninja Van"
                                        className="w-full border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#D0111A]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-barlow text-[10px] font-bold uppercase tracking-[2px] text-white/45">Tracking Number</label>
                                    <input
                                        value={shipmentForm.tracking_number}
                                        onChange={(e) => setShipmentForm((prev) => ({ ...prev, tracking_number: e.target.value }))}
                                        placeholder="Enter courier tracking number"
                                        className="w-full border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#D0111A]"
                                    />
                                </div>
                                <p className="font-barlow text-[11px] leading-relaxed text-white/35">
                                    When marking an order as shipped, add the courier and tracking number so customers can manually track it from their account.
                                </p>
                                {shipmentError && <p className="font-barlow text-[11px] text-[#D0111A]">{shipmentError}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 font-barlow text-[9px] font-bold uppercase tracking-[3px] text-[#D0111A]">Customer</div>
                            <div className="space-y-1 border border-white/7 bg-[#1E1E1E] p-4">
                                <div className="font-barlow text-sm font-bold text-white">{order.customer?.name}</div>
                                <div className="font-barlow text-xs text-white/50">{order.customer?.email}</div>
                                {order.customer?.phone && <div className="font-barlow text-xs text-white/50">{order.customer.phone}</div>}
                            </div>
                        </div>

                        {order.address && (
                            <div>
                                <div className="mb-2 font-barlow text-[9px] font-bold uppercase tracking-[3px] text-[#D0111A]">Delivery Address</div>
                                <div className="space-y-0.5 border border-white/7 bg-[#1E1E1E] p-4 font-barlow text-sm text-white/60">
                                    <p>{order.address.street}</p>
                                    <p>{order.address.barangay}, {order.address.city}</p>
                                    <p>{order.address.province} {order.address.zip_code}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="mb-2 font-barlow text-[9px] font-bold uppercase tracking-[3px] text-[#D0111A]">Order Items</div>
                            <div className="divide-y divide-white/5 border border-white/7 bg-[#1E1E1E]">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between px-4 py-3">
                                        <div>
                                            <div className="font-barlow text-sm font-bold text-white">{item.product_name}</div>
                                            <div className="font-barlow text-xs text-white/40">P {fmt(item.unit_price)} x {item.quantity}</div>
                                        </div>
                                        <div className="font-bebas text-base text-white">P {fmt(item.subtotal)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2 border border-white/7 bg-[#1E1E1E] p-4">
                            <div className="flex justify-between font-barlow text-sm text-white/60">
                                <span>Subtotal</span><span>P {fmt(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between font-barlow text-sm text-white/60">
                                <span>Shipping</span>
                                <span className={order.shipping_fee == 0 ? 'text-green-400' : ''}>
                                    {order.shipping_fee == 0 ? 'FREE' : `P ${fmt(order.shipping_fee)}`}
                                </span>
                            </div>
                            <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-bebas text-xl text-white">
                                <span>TOTAL</span><span>P {fmt(order.total)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 border border-white/7 bg-[#1E1E1E] p-4">
                            <div>
                                <div className="font-barlow text-sm font-bold text-white">{paymentLabel(order)}</div>
                                <div className="font-barlow text-xs text-white/40">Payment method</div>
                            </div>
                        </div>

                        {order.order_note && (
                            <div>
                                <div className="mb-2 font-barlow text-[9px] font-bold uppercase tracking-[3px] text-[#D0111A]">Order Note</div>
                                <div className="border-l-2 border-[#D0111A] bg-[#1E1E1E] px-4 py-3 font-barlow text-sm text-white/60">{order.order_note}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminOrders({ orders, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [statusFilter, setStatus] = useState(filters?.status ?? '');
    const [viewingId, setViewingId] = useState(null);

    function applyFilters(overrides = {}) {
        router.get('/admin/orders', { search, status: statusFilter, ...overrides }, { preserveScroll: true, replace: true });
    }

    return (
        <AdminLayout title="Order Management">
            <div className="mb-5 flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        placeholder="Search orders or customers..."
                        className="w-full border border-white/10 bg-[#141414] px-4 py-2 pl-9 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#D0111A]"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30">⌕</span>
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                    className="border border-white/10 bg-[#141414] px-3 py-2 font-barlow text-xs uppercase tracking-widest text-white/70 outline-none"
                >
                    <option value="">All Statuses</option>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <span className="ml-auto font-barlow text-xs text-white/30">{orders.total} orders</span>
            </div>

            <div className="overflow-x-auto border border-white/7 bg-[#141414]">
                <table className="w-full min-w-[1040px]">
                    <thead>
                        <tr className="border-b border-white/7">
                            {['Order #', 'Customer', 'Total', 'Payment', 'Tracking', 'Status', 'Date', ''].map((h) => (
                                <th key={h} className="px-5 py-3 text-left font-barlow text-[9px] font-bold uppercase tracking-[3px] text-white/25">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.data.map((order) => (
                            <tr key={order.id} className="transition-colors hover:bg-white/2">
                                <td className="px-5 py-3 font-barlow text-xs font-bold text-white">{order.order_number}</td>
                                <td className="px-5 py-3">
                                    <div className="font-barlow text-sm text-white">{order.customer}</div>
                                    <div className="font-barlow text-[10px] text-white/30">{order.email}</div>
                                </td>
                                <td className="px-5 py-3 font-bebas text-sm text-white">P {fmt(order.total)}</td>
                                <td className="px-5 py-3 font-barlow text-xs text-white/50">{paymentLabel(order)}</td>
                                <td className="px-5 py-3 font-barlow text-xs text-white/45">
                                    {order.tracking_number ? `${order.tracking_courier}: ${order.tracking_number}` : 'Not set'}
                                </td>
                                <td className="px-5 py-3">
                                    <span className={`inline-flex items-center gap-1 border px-2 py-1 font-barlow text-[9px] font-bold uppercase tracking-[2px] ${STATUS_STYLES[order.status]}`}>
                                        <span className="h-1 w-1 rounded-full bg-current" />
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 font-barlow text-xs text-white/30">{order.created_at}</td>
                                <td className="px-5 py-3">
                                    <button
                                        onClick={() => setViewingId(order.id)}
                                        className="border border-white/15 px-3 py-1 font-barlow text-[9px] font-bold uppercase tracking-[1px] text-white/50 transition-colors hover:border-[#D0111A] hover:text-[#D0111A]"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-white/7 px-5 py-3">
                        <span className="font-barlow text-xs text-white/30">
                            Showing {orders.from}-{orders.to} of {orders.total}
                        </span>
                        <div className="flex gap-1">
                            {orders.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`min-w-[30px] border font-barlow text-xs font-bold transition-colors ${
                                        link.active
                                            ? 'border-[#D0111A] bg-[#D0111A] text-white'
                                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-30'
                                    } h-7`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {viewingId && <OrderDetailPanel orderId={viewingId} onClose={() => setViewingId(null)} />}
        </AdminLayout>
    );
}
