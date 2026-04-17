import Layout from '../components/Layout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

export default function Checkout({ cartItems, subtotal, shippingFee, total }) {
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', phone: '',
        street: '', barangay: '', city: '', province: '', zip_code: '',
        payment_method: 'Cash on Delivery', order_note: '',
    });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    function set(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: null }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const { data } = await axios.post('/checkout', form);
            if (data.success) {
                router.visit(`/orders/${data.order_id}/confirmation`);
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert(err.response?.data?.message || 'Something went wrong.');
            }
        } finally {
            setLoading(false);
        }
    }

    const field = (name, label, type = 'text', placeholder = '') => (
        <div>
            <label className="font-barlow text-[10px] font-bold tracking-[2px] uppercase text-white/50 block mb-1">
                {label} <span className="text-[#D0111A]">*</span>
            </label>
            <input
                type={type}
                value={form[name]}
                onChange={e => set(name, e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-[#1E1E1E] border text-white text-sm px-3 py-2.5 outline-none transition-colors
                    ${errors[name] ? 'border-[#D0111A]' : 'border-white/10 focus:border-[#D0111A]'}`}
            />
            {errors[name] && (
                <p className="text-[#D0111A] text-[10px] font-barlow mt-1">{errors[name][0]}</p>
            )}
        </div>
    );

    return (
        <Layout>
            <div className="min-h-screen bg-[#0E0E0E] py-10 px-6">
                <h1 className="font-bebas text-4xl tracking-widest text-center text-white mb-8">
                    CHECK<span className="text-[#D0111A]">OUT</span>
                </h1>

                <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-[1fr_360px] gap-6">

                    {/* LEFT — Forms */}
                    <div className="space-y-4">

                        {/* Shipping info */}
                        <div className="bg-[#141414] border border-white/7 p-6">
                            <h2 className="font-bebas text-xl tracking-widest text-white mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-[#D0111A] flex items-center justify-center font-bebas text-sm">1</span>
                                Shipping Information
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {field('first_name', 'First Name')}
                                {field('last_name', 'Last Name')}
                                {field('email', 'Email', 'email')}
                                {field('phone', 'Phone Number', 'tel', '09XX XXX XXXX')}
                            </div>
                            <div className="mt-4 space-y-3">
                                {field('street', 'Street Address', 'text', 'Blk 1 Lot 2, Sample Street')}
                                <div className="grid grid-cols-2 gap-4">
                                    {field('barangay', 'Barangay')}
                                    {field('city', 'City / Municipality')}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {field('province', 'Province')}
                                    {field('zip_code', 'ZIP Code', 'text', '1100')}
                                </div>
                            </div>
                        </div>

                        {/* Payment method */}
                        <div className="bg-[#141414] border border-white/7 p-6">
                            <h2 className="font-bebas text-xl tracking-widest text-white mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-[#D0111A] flex items-center justify-center font-bebas text-sm">2</span>
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                {['Cash on Delivery', 'Bank Transfer'].map(method => (
                                    <label
                                        key={method}
                                        className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors
                                            ${form.payment_method === method
                                                ? 'border-[#D0111A] bg-[#D0111A]/5'
                                                : 'border-white/7 hover:border-white/20'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                            ${form.payment_method === method ? 'border-[#D0111A]' : 'border-white/30'}`}>
                                            {form.payment_method === method && (
                                                <div className="w-2 h-2 rounded-full bg-[#D0111A]" />
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={method}
                                            checked={form.payment_method === method}
                                            onChange={e => set('payment_method', e.target.value)}
                                            className="hidden"
                                        />
                                        <div>
                                            <div className="font-barlow text-sm font-bold text-white">{method}</div>
                                            <div className="font-barlow text-xs text-white/40 mt-0.5">
                                                {method === 'Cash on Delivery'
                                                    ? 'Pay in cash when your order arrives'
                                                    : 'Transfer via BDO, BPI, GCash, or Maya'}
                                            </div>
                                        </div>
                                        <span className="ml-auto text-xl">
                                            {method === 'Cash on Delivery' ? '🤝' : '🏦'}
                                        </span>
                                    </label>
                                ))}

                                {/* Bank details if selected */}
                                {form.payment_method === 'Bank Transfer' && (
                                    <div className="border-l-2 border-[#D0111A] pl-4 mt-2 space-y-1">
                                        <p className="font-barlow text-xs text-white/50">Bank: <span className="text-white">BDO Unibank</span></p>
                                        <p className="font-barlow text-xs text-white/50">Account Name: <span className="text-white">ConsoleBoy Trading</span></p>
                                        <p className="font-barlow text-xs text-white/50">Account No: <span className="text-white">0012-3456-7890</span></p>
                                        <p className="font-barlow text-xs text-white/40 mt-2">Send proof of payment to conchakent@gmail.com</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order note */}
                        <div className="bg-[#141414] border border-white/7 p-6">
                            <h2 className="font-bebas text-xl tracking-widest text-white mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-[#D0111A] flex items-center justify-center font-bebas text-sm">3</span>
                                Order Notes <span className="font-barlow text-sm text-white/30 normal-case font-normal">(Optional)</span>
                            </h2>
                            <textarea
                                value={form.order_note}
                                onChange={e => set('order_note', e.target.value)}
                                placeholder="Special instructions for your order..."
                                rows={3}
                                className="w-full bg-[#1E1E1E] border border-white/10 focus:border-[#D0111A] text-white text-sm px-3 py-2.5 outline-none transition-colors resize-none placeholder-white/20"
                            />
                        </div>
                    </div>

                    {/* RIGHT — Order Summary */}
                    <div className="space-y-4">
                        <div className="bg-[#141414] border border-white/7 p-6 sticky top-20">
                            <h2 className="font-bebas text-xl tracking-widest text-white mb-4">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {cartItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#1E1E1E] border border-white/7 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                            {item.product.image_url
                                                ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover"/>
                                                : <span className="text-lg">🎮</span>
                                            }
                                            <span className="absolute -top-1.5 -right-1.5 bg-[#D0111A] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-barlow text-xs font-bold text-white truncate">{item.product.name}</div>
                                            <div className="font-barlow text-[10px] text-white/40">{item.product.brand}</div>
                                        </div>
                                        <div className="font-barlow text-xs text-white flex-shrink-0">
                                            P {fmt(item.product.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/7 pt-4 space-y-2">
                                <div className="flex justify-between font-barlow text-sm text-white/60">
                                    <span>Subtotal</span><span>P {fmt(subtotal)}</span>
                                </div>
                                <div className="flex justify-between font-barlow text-sm">
                                    <span className="text-white/60">Shipping</span>
                                    <span className={shippingFee === 0 ? 'text-green-400' : 'text-white/60'}>
                                        {shippingFee === 0 ? 'FREE' : `P ${fmt(shippingFee)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bebas text-xl text-white border-t border-white/10 pt-3 mt-2">
                                    <span>TOTAL</span><span>P {fmt(total)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 bg-[#D0111A] hover:bg-[#9E0D14] disabled:opacity-60 text-white font-barlow text-sm font-bold tracking-[3px] uppercase py-3 transition-all hover:shadow-[0_0_20px_rgba(208,17,26,0.4)]"
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>

                            <div className="flex items-center justify-center gap-2 mt-3 text-white/20">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                                </svg>
                                <span className="font-barlow text-[9px] tracking-[2px] uppercase">Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}