import Layout from '../components/Layout';
import { usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

const STATUS_STYLES = {
    Pending:   'text-amber-400  border-amber-400/40  bg-amber-400/10',
    Paid:      'text-blue-400   border-blue-400/40   bg-blue-400/10',
    Shipped:   'text-purple-400 border-purple-400/40 bg-purple-400/10',
    Completed: 'text-green-400  border-green-400/40  bg-green-400/10',
};

// ── Order History Tab ────────────────────────────────────────────────────────
function OrderHistory({ orders }) {
    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-5xl mb-4 opacity-30">📦</span>
                <p className="font-bebas text-2xl tracking-widest text-white/30 mb-2">No orders yet</p>
                <p className="font-barlow text-sm text-white/20 mb-5">
                    You haven't placed any orders yet.
                </p>
                <a
                    href="/shop"
                    className="bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-xs font-bold tracking-[2px] uppercase px-5 py-2.5 transition-colors"
                >
                    Browse Shop
                </a>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
                <thead>
                    <tr className="border-b border-white/7">
                        {['Order #', 'Date', 'Items', 'Total', 'Payment', 'Tracking', 'Status', ''].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-barlow text-[9px] font-bold tracking-[3px] uppercase text-white/25">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {orders.map(order => (
                        <tr key={order.id} className="hover:bg-white/2 transition-colors">
                            <td className="px-4 py-3 font-barlow text-sm font-bold text-white">
                                {order.order_number}
                            </td>
                            <td className="px-4 py-3 font-barlow text-xs text-white/50">
                                {order.created_at}
                            </td>
                            <td className="px-4 py-3 font-barlow text-xs text-white/50">
                                {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                            </td>
                            <td className="px-4 py-3 font-bebas text-base text-white">
                                ₱{fmt(order.total)}
                            </td>
                            <td className="px-4 py-3 font-barlow text-xs text-white/50">
                                {order.payment_channel ? `${order.payment_method} / ${order.payment_channel}` : order.payment_method}
                            </td>
                            <td className="px-4 py-3 font-barlow text-xs text-white/50">
                                {order.tracking_number
                                    ? `${order.tracking_courier}: ${order.tracking_number}`
                                    : 'Not available yet'}
                            </td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1.5 font-barlow text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 border ${STATUS_STYLES[order.status] || ''}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <a
                                    href={`/my-orders/${order.id}`}
                                    className="font-barlow text-[9px] font-bold tracking-[1px] uppercase border border-white/15 text-white/40 px-3 py-1.5 hover:border-[#D0111A] hover:text-[#D0111A] transition-colors"
                                >
                                    View
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Edit Info Tab ─────────────────────────────────────────────────────────────
function EditInfo({ user }) {
    const [form, setForm] = useState({
        first_name: user.first_name ?? '',
        last_name:  user.last_name  ?? '',
        email:      user.email      ?? '',
        phone:      user.phone      ?? '',
    });
    const [errors, setErrors]   = useState({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccess('');
        try {
            await axios.patch('/profile/info', form);
            setSuccess('Profile updated successfully!');
            router.reload({ only: ['auth'] });
        } catch (err) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
        } finally {
            setLoading(false);
        }
    }

    const inp = (name, label, type = 'text', placeholder = '') => (
        <div>
            <label className="font-barlow text-[10px] font-bold tracking-[2px] uppercase text-white/50 block mb-1.5">
                {label}
            </label>
            <input
                type={type}
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                placeholder={placeholder}
                className={`w-full bg-[#1E1E1E] border text-white text-sm px-4 py-2.5 outline-none transition-colors
                    ${errors[name] ? 'border-[#D0111A]' : 'border-white/10 focus:border-[#D0111A]'}`}
            />
            {errors[name] && <p className="text-[#D0111A] text-[10px] mt-1">{errors[name][0]}</p>}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {inp('first_name', 'First Name')}
                {inp('last_name', 'Last Name')}
            </div>
            {inp('email', 'Email Address', 'email')}
            {inp('phone', 'Phone Number', 'tel', '09XX XXX XXXX')}

            {success && (
                <div className="bg-green-500/10 border border-green-500/30 px-4 py-3">
                    <p className="text-green-400 text-sm font-barlow">{success}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-xs font-bold tracking-[2px] uppercase px-6 py-3 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
                {loading
                    ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</>
                    : 'Save Changes'
                }
            </button>
        </form>
    );
}

// ── Change Password Tab ───────────────────────────────────────────────────────
function ChangePassword() {
    const [form, setForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors]   = useState({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccess('');
        try {
            await axios.patch('/profile/password', form);
            setSuccess('Password updated successfully!');
            setForm({ current_password: '', password: '', password_confirmation: '' });
        } catch (err) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
            else if (err.response?.data?.message) setErrors({ current_password: [err.response.data.message] });
        } finally {
            setLoading(false);
        }
    }

    const inp = (name, label, placeholder = '') => (
        <div>
            <label className="font-barlow text-[10px] font-bold tracking-[2px] uppercase text-white/50 block mb-1.5">
                {label}
            </label>
            <input
                type="password"
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                placeholder={placeholder || '••••••••'}
                className={`w-full bg-[#1E1E1E] border text-white text-sm px-4 py-2.5 outline-none transition-colors
                    ${errors[name] ? 'border-[#D0111A]' : 'border-white/10 focus:border-[#D0111A]'}`}
            />
            {errors[name] && <p className="text-[#D0111A] text-[10px] mt-1">{errors[name][0]}</p>}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
            {inp('current_password', 'Current Password')}
            {inp('password', 'New Password', 'Min. 8 characters')}
            {inp('password_confirmation', 'Confirm New Password')}

            {success && (
                <div className="bg-green-500/10 border border-green-500/30 px-4 py-3">
                    <p className="text-green-400 text-sm font-barlow">{success}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-xs font-bold tracking-[2px] uppercase px-6 py-3 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
                {loading
                    ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Updating...</>
                    : 'Update Password'
                }
            </button>
        </form>
    );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
export default function Profile({ orders, stats }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const [tab, setTab] = useState('orders');

    const tabs = [
        { id: 'orders',   label: 'Order History' },
        { id: 'info',     label: 'Edit Profile' },
        { id: 'password', label: 'Change Password' },
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-[#0E0E0E]">

                {/* Profile header */}
                <div className="bg-[#0A0A0A] border-b border-white/7">
                    <div className="max-w-5xl mx-auto px-6 py-8">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full bg-[#D0111A]/20 border-2 border-[#D0111A]/40 flex items-center justify-center flex-shrink-0">
                                <span className="font-bebas text-2xl text-white">
                                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h1 className="font-bebas text-3xl tracking-widest text-white leading-none">
                                    {user?.first_name} {user?.last_name}
                                </h1>
                                <p className="font-barlow text-sm text-white/40 mt-1">{user?.email}</p>
                                <p className="font-barlow text-[10px] text-white/25 mt-0.5 tracking-[1px] uppercase">
                                    Member since {user?.created_at}
                                </p>
                            </div>

                            {/* Quick stats */}
                            <div className="flex gap-6">
                                {[
                                    { label: 'Total Orders', value: stats.total_orders },
                                    { label: 'Total Spent',  value: `₱${fmt(stats.total_spent)}` },
                                    { label: 'Completed',    value: stats.completed },
                                    { label: 'Pending',      value: stats.pending },
                                ].map(({ label, value }) => (
                                    <div key={label} className="text-center">
                                        <div className="font-bebas text-2xl text-white leading-none">{value}</div>
                                        <div className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/30 mt-1">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 py-8">

                    {/* Tabs */}
                    <div className="flex gap-0 border-b border-white/7 mb-8">
                        {tabs.map(t => (
                            <button
                                key={t.id}
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

                    {/* Tab content */}
                    <div className="bg-[#141414] border border-white/7">
                        <div className="p-6">
                            {tab === 'orders'   && <OrderHistory orders={orders} />}
                            {tab === 'info'     && <EditInfo user={user} />}
                            {tab === 'password' && <ChangePassword />}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
