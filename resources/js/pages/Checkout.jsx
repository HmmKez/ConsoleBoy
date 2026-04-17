import Layout from '../components/Layout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

const PAYMENT_CHANNELS = [
    { value: 'GCash', label: 'GCash', description: 'Mobile wallet transfer' },
    { value: 'Maya', label: 'Maya', description: 'Digital wallet checkout' },
    { value: 'Bank Transfer', label: 'Bank Transfer', description: 'Manual transfer to bank account' },
    { value: 'Debit Card', label: 'Debit Card', description: 'Pay using your debit card' },
    { value: 'Credit Card', label: 'Credit Card', description: 'Pay using your credit card' },
];

export default function Checkout({ cartItems, subtotal, shippingFee, total }) {
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', phone: '',
        street: '', barangay: '', city: '', province: '', zip_code: '',
        payment_method: 'Cash on Delivery', payment_channel: '',
        order_note: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function set(field, value) {
        setForm((prev) => {
            const next = { ...prev, [field]: value };

            if (field === 'payment_method') {
                next.payment_channel = value === 'Bank Transfer'
                    ? (prev.payment_channel || PAYMENT_CHANNELS[0].value)
                    : '';
            }

            return next;
        });

        setErrors((prev) => ({ ...prev, [field]: null }));
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
            <label className="mb-1 block font-barlow text-[10px] font-bold uppercase tracking-[2px] text-white/50">
                {label} <span className="text-[#D0111A]">*</span>
            </label>
            <input
                type={type}
                value={form[name]}
                onChange={(e) => set(name, e.target.value)}
                placeholder={placeholder}
                className={`w-full border px-3 py-2.5 text-sm text-white outline-none transition-colors ${
                    errors[name] ? 'border-[#D0111A]' : 'border-white/10 bg-[#1E1E1E] focus:border-[#D0111A]'
                }`}
            />
            {errors[name] && (
                <p className="mt-1 font-barlow text-[10px] text-[#D0111A]">{errors[name][0]}</p>
            )}
        </div>
    );

    return (
        <Layout>
            <div className="min-h-screen bg-[#0E0E0E] px-6 py-10">
                <h1 className="mb-8 text-center font-bebas text-4xl tracking-widest text-white">
                    CHECK<span className="text-[#D0111A]">OUT</span>
                </h1>

                <form onSubmit={handleSubmit} className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-4">
                        <div className="border border-white/7 bg-[#141414] p-6">
                            <h2 className="mb-4 flex items-center gap-2 font-bebas text-xl tracking-widest text-white">
                                <span className="flex h-6 w-6 items-center justify-center bg-[#D0111A] text-sm font-bebas">1</span>
                                Shipping Information
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {field('first_name', 'First Name')}
                                {field('last_name', 'Last Name')}
                                {field('email', 'Email', 'email')}
                                {field('phone', 'Phone Number', 'tel', '09XX XXX XXXX')}
                            </div>
                            <div className="mt-4 space-y-3">
                                {field('street', 'Street Address', 'text', 'Blk 1 Lot 2, Sample Street')}
                                <div className="grid gap-4 md:grid-cols-2">
                                    {field('barangay', 'Barangay')}
                                    {field('city', 'City / Municipality')}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {field('province', 'Province')}
                                    {field('zip_code', 'ZIP Code', 'text', '1100')}
                                </div>
                            </div>
                        </div>

                        <div className="border border-white/7 bg-[#141414] p-6">
                            <h2 className="mb-4 flex items-center gap-2 font-bebas text-xl tracking-widest text-white">
                                <span className="flex h-6 w-6 items-center justify-center bg-[#D0111A] text-sm font-bebas">2</span>
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                {['Cash on Delivery', 'Bank Transfer'].map((method) => (
                                    <label
                                        key={method}
                                        className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors ${
                                            form.payment_method === method
                                                ? 'border-[#D0111A] bg-[#D0111A]/5'
                                                : 'border-white/7 hover:border-white/20'
                                        }`}
                                    >
                                        <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                                            form.payment_method === method ? 'border-[#D0111A]' : 'border-white/30'
                                        }`}>
                                            {form.payment_method === method && <div className="h-2 w-2 rounded-full bg-[#D0111A]" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={method}
                                            checked={form.payment_method === method}
                                            onChange={(e) => set('payment_method', e.target.value)}
                                            className="hidden"
                                        />
                                        <div>
                                            <div className="font-barlow text-sm font-bold text-white">{method}</div>
                                            <div className="mt-0.5 font-barlow text-xs text-white/40">
                                                {method === 'Cash on Delivery'
                                                    ? 'Pay when the parcel arrives at your address.'
                                                    : 'Choose a digital or manual payment channel before we confirm the order.'}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {form.payment_method === 'Bank Transfer' && (
                                <div className="mt-5 space-y-4 border-t border-white/7 pt-5">
                                    <div>
                                        <div className="mb-3 font-barlow text-[10px] font-bold uppercase tracking-[2px] text-white/50">
                                            Select Payment Type <span className="text-[#D0111A]">*</span>
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                            {PAYMENT_CHANNELS.map((channel) => (
                                                <button
                                                    key={channel.value}
                                                    type="button"
                                                    onClick={() => set('payment_channel', channel.value)}
                                                    className={`border px-4 py-4 text-left transition-colors ${
                                                        form.payment_channel === channel.value
                                                            ? 'border-[#D0111A] bg-[#D0111A]/8'
                                                            : 'border-white/10 bg-[#101010] hover:border-white/25'
                                                    }`}
                                                >
                                                    <div className="font-barlow text-sm font-bold uppercase tracking-[0.12em] text-white">
                                                        {channel.label}
                                                    </div>
                                                    <div className="mt-1 font-barlow text-[11px] text-white/40">
                                                        {channel.description}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.payment_channel && (
                                            <p className="mt-2 font-barlow text-[10px] text-[#D0111A]">{errors.payment_channel[0]}</p>
                                        )}
                                    </div>

                                    <div className="border-l-2 border-[#D0111A] pl-4">
                                        <p className="font-barlow text-xs text-white/50">
                                            Selected: <span className="text-white">{form.payment_channel || 'Choose one'}</span>
                                        </p>
                                        <p className="mt-1 font-barlow text-xs text-white/45">
                                            Bank: <span className="text-white">BDO Unibank</span>
                                        </p>
                                        <p className="font-barlow text-xs text-white/45">
                                            Account Name: <span className="text-white">ConsoleBoy Trading</span>
                                        </p>
                                        <p className="font-barlow text-xs text-white/45">
                                            Account No: <span className="text-white">0012-3456-7890</span>
                                        </p>
                                        <p className="mt-2 font-barlow text-xs text-white/35">
                                            Use the selected payment type as your preferred channel. The order will stay pending until the team confirms it.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border border-white/7 bg-[#141414] p-6">
                            <h2 className="mb-4 flex items-center gap-2 font-bebas text-xl tracking-widest text-white">
                                <span className="flex h-6 w-6 items-center justify-center bg-[#D0111A] text-sm font-bebas">3</span>
                                Order Notes <span className="text-sm font-normal normal-case text-white/30">(Optional)</span>
                            </h2>
                            <textarea
                                value={form.order_note}
                                onChange={(e) => set('order_note', e.target.value)}
                                placeholder="Special instructions for your order..."
                                rows={3}
                                className="w-full resize-none border border-white/10 bg-[#1E1E1E] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#D0111A]"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="sticky top-20 border border-white/7 bg-[#141414] p-6">
                            <h2 className="mb-4 font-bebas text-xl tracking-widest text-white">Order Summary</h2>

                            <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                                {cartItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden border border-white/7 bg-[#1E1E1E]">
                                            {item.product.image_url
                                                ? <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
                                                : <div className="flex h-full items-center justify-center text-lg">🎮</div>
                                            }
                                            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D0111A] text-[8px] font-bold text-white">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate font-barlow text-xs font-bold text-white">{item.product.name}</div>
                                            <div className="font-barlow text-[10px] text-white/40">{item.product.brand}</div>
                                        </div>
                                        <div className="font-barlow text-xs text-white">
                                            P {fmt(item.product.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 border-t border-white/7 pt-4">
                                <div className="flex justify-between font-barlow text-sm text-white/60">
                                    <span>Subtotal</span><span>P {fmt(subtotal)}</span>
                                </div>
                                <div className="flex justify-between font-barlow text-sm">
                                    <span className="text-white/60">Shipping</span>
                                    <span className={shippingFee === 0 ? 'text-green-400' : 'text-white/60'}>
                                        {shippingFee === 0 ? 'FREE' : `P ${fmt(shippingFee)}`}
                                    </span>
                                </div>
                                <div className="mt-2 flex justify-between border-t border-white/10 pt-3 font-bebas text-xl text-white">
                                    <span>TOTAL</span><span>P {fmt(total)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-6 w-full bg-[#D0111A] py-3 font-barlow text-sm font-bold uppercase tracking-[3px] text-white transition-all hover:bg-[#9E0D14] hover:shadow-[0_0_20px_rgba(208,17,26,0.4)] disabled:opacity-60"
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
