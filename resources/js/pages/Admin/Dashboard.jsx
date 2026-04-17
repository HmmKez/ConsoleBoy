import AdminLayout from '../../components/AdminLayout';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

const STATUS_STYLES = {
    Pending:   'text-amber-400  bg-amber-400/10  border-amber-400/30',
    Paid:      'text-blue-400   bg-blue-400/10   border-blue-400/30',
    Shipped:   'text-purple-400 bg-purple-400/10 border-purple-400/30',
    Completed: 'text-green-400  bg-green-400/10  border-green-400/30',
};

export default function Dashboard({ stats, lowStock, recentOrders }) {
    return (
        <AdminLayout title="Dashboard Overview">

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Sales',     value: `₱${fmt(stats.totalSales)}`,  icon: '💰', color: 'border-t-[#D0111A]' },
                    { label: 'Total Orders',    value: stats.totalOrders,             icon: '📦', color: 'border-t-blue-500' },
                    { label: 'Total Customers', value: stats.totalCustomers,          icon: '👥', color: 'border-t-green-500' },
                ].map(({ label, value, icon, color }) => (
                    <div key={label} className={`bg-[#141414] border border-white/7 border-t-2 ${color} p-5`}>
                        <div className="flex justify-between items-start mb-3">
                            <span className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/40">{label}</span>
                            <span className="text-lg">{icon}</span>
                        </div>
                        <div className="font-bebas text-3xl tracking-wide text-white">{value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[1fr_300px] gap-4">
                {/* Recent orders */}
                <div className="bg-[#141414] border border-white/7">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/7">
                        <h2 className="font-bebas text-lg tracking-widest text-white">Recent Orders</h2>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/7">
                                {['Order #','Customer','Total','Status','Date'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/25">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentOrders.map(order => (
                                <tr key={order.id} className="hover:bg-white/2 transition-colors">
                                    <td className="px-5 py-3 font-barlow text-xs font-bold text-white">{order.order_number}</td>
                                    <td className="px-5 py-3 font-barlow text-xs text-white/60">{order.customer}</td>
                                    <td className="px-5 py-3 font-bebas text-sm text-white">₱{fmt(order.total)}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center gap-1 font-barlow text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 border ${STATUS_STYLES[order.status] || ''}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 font-barlow text-xs text-white/30">{order.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Low stock */}
                <div className="bg-[#141414] border border-white/7">
                    <div className="px-5 py-4 border-b border-white/7 flex items-center gap-2">
                        <h2 className="font-bebas text-lg tracking-widest text-white">Low Stock Alert</h2>
                        <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 font-barlow text-[9px] font-bold tracking-[2px] uppercase px-2 py-0.5">
                            {lowStock.length} items
                        </span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {lowStock.length === 0 ? (
                            <p className="px-5 py-6 text-white/30 font-barlow text-sm text-center">All products are well stocked</p>
                        ) : lowStock.map(p => (
                            <div key={p.id} className="flex items-center justify-between px-5 py-3">
                                <div>
                                    <div className="font-barlow text-xs font-bold text-white">{p.name}</div>
                                    <div className="font-barlow text-[10px] text-white/40">{p.brand}</div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bebas text-xl ${p.stock <= 3 ? 'text-red-400' : 'text-amber-400'}`}>
                                        {p.stock}
                                    </div>
                                    <div className="font-barlow text-[9px] tracking-[1px] uppercase text-white/30">left</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}