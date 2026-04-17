import Layout from '../components/Layout';
import { Link } from '@inertiajs/react';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

const STATUS_STYLES = {
    Pending:   'text-amber-400  border-amber-400/40  bg-amber-400/10',
    Paid:      'text-blue-400   border-blue-400/40   bg-blue-400/10',
    Shipped:   'text-purple-400 border-purple-400/40 bg-purple-400/10',
    Completed: 'text-green-400  border-green-400/40  bg-green-400/10',
};

export default function MyOrders({ orders }) {
    return (
        <Layout>
            <div className="min-h-screen bg-[#0E0E0E] py-10 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-bebas text-4xl tracking-widest text-white mb-2">
                        MY <span className="text-[#D0111A]">ORDERS</span>
                    </h1>
                    <p className="font-barlow text-sm text-white/40 mb-8">Track and view your order history</p>

                    {orders.data.length === 0 ? (
                        <div className="bg-[#141414] border border-white/7 flex flex-col items-center justify-center py-20 text-center">
                            <div className="text-5xl mb-4">📦</div>
                            <p className="font-bebas text-2xl tracking-widest text-white/30 mb-2">No orders yet</p>
                            <p className="font-barlow text-sm text-white/20 mb-6">You haven't placed any orders yet.</p>
                            <Link href="/shop" className="bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-xs font-bold tracking-[2px] uppercase px-6 py-3 transition-colors">
                                Browse Shop
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-[#141414] border border-white/7">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/7">
                                        {['Order #', 'Date', 'Items', 'Total', 'Payment', 'Status', ''].map(h => (
                                            <th key={h} className="px-5 py-3 text-left font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/25">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.data.map(order => (
                                        <tr key={order.id} className="hover:bg-white/2 transition-colors">
                                            <td className="px-5 py-4 font-barlow text-sm font-bold text-white">{order.order_number}</td>
                                            <td className="px-5 py-4 font-barlow text-xs text-white/50">{order.created_at}</td>
                                            <td className="px-5 py-4 font-barlow text-xs text-white/50">{order.items_count} item{order.items_count !== 1 ? 's' : ''}</td>
                                            <td className="px-5 py-4 font-bebas text-base text-white">₱{fmt(order.total)}</td>
                                            <td className="px-5 py-4 font-barlow text-xs text-white/50">{order.payment_method}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 font-barlow text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 border ${STATUS_STYLES[order.status]}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current"/>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Link
                                                    href={`/my-orders/${order.id}`}
                                                    className="font-barlow text-[9px] font-bold tracking-[1px] uppercase border border-white/15 text-white/50 px-3 py-1.5 hover:border-[#D0111A] hover:text-[#D0111A] transition-colors"
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