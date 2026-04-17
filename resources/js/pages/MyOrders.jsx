import Layout from '../components/Layout';
import { Link } from '@inertiajs/react';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

const STATUS_STYLES = {
    Pending: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
    Paid: 'text-blue-400 border-blue-400/40 bg-blue-400/10',
    Shipped: 'text-purple-400 border-purple-400/40 bg-purple-400/10',
    Completed: 'text-green-400 border-green-400/40 bg-green-400/10',
};

const paymentLabel = (order) => order.payment_channel
    ? `${order.payment_method} / ${order.payment_channel}`
    : order.payment_method;

export default function MyOrders({ orders }) {
    return (
        <Layout>
            <div className="min-h-screen bg-[#0E0E0E] px-6 py-10">
                <div className="mx-auto max-w-6xl">
                    <h1 className="mb-2 font-bebas text-4xl tracking-widest text-white">
                        MY <span className="text-[#D0111A]">ORDERS</span>
                    </h1>
                    <p className="mb-8 font-barlow text-sm text-white/40">Track and view your order history</p>

                    {orders.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center border border-white/7 bg-[#141414] py-20 text-center">
                            <div className="mb-4 text-5xl">📦</div>
                            <p className="mb-2 font-bebas text-2xl tracking-widest text-white/30">No orders yet</p>
                            <p className="mb-6 font-barlow text-sm text-white/20">You haven't placed any orders yet.</p>
                            <Link href="/shop" className="bg-[#D0111A] px-6 py-3 font-barlow text-xs font-bold uppercase tracking-[2px] text-white transition-colors hover:bg-[#9E0D14]">
                                Browse Shop
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-white/7 bg-[#141414]">
                            <table className="w-full min-w-[980px]">
                                <thead>
                                    <tr className="border-b border-white/7">
                                        {['Order #', 'Date', 'Items', 'Total', 'Payment', 'Tracking', 'Status', ''].map((h) => (
                                            <th key={h} className="px-5 py-3 text-left font-barlow text-[9px] font-bold uppercase tracking-[3px] text-white/25">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.data.map((order) => (
                                        <tr key={order.id} className="transition-colors hover:bg-white/2">
                                            <td className="px-5 py-4 font-barlow text-sm font-bold text-white">{order.order_number}</td>
                                            <td className="px-5 py-4 font-barlow text-xs text-white/50">{order.created_at}</td>
                                            <td className="px-5 py-4 font-barlow text-xs text-white/50">{order.items_count} item{order.items_count !== 1 ? 's' : ''}</td>
                                            <td className="px-5 py-4 font-bebas text-base text-white">P {fmt(order.total)}</td>
                                            <td className="px-5 py-4 font-barlow text-xs text-white/50">{paymentLabel(order)}</td>
                                            <td className="px-5 py-4 font-barlow text-xs text-white/50">
                                                {order.tracking_number
                                                    ? `${order.tracking_courier}: ${order.tracking_number}`
                                                    : 'Not available yet'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 border px-2 py-1 font-barlow text-[9px] font-bold uppercase tracking-[2px] ${STATUS_STYLES[order.status]}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Link
                                                    href={`/my-orders/${order.id}`}
                                                    className="border border-white/15 px-3 py-1.5 font-barlow text-[9px] font-bold uppercase tracking-[1px] text-white/50 transition-colors hover:border-[#D0111A] hover:text-[#D0111A]"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
