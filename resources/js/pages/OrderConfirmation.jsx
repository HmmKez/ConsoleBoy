import Layout from '../components/Layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

const STATUS_STEPS = [
    { key: 'placed', label: 'Order Placed', hint: 'Received logged' },
    { key: 'Pending', label: 'Pending', hint: 'Awaiting confirmation' },
    { key: 'Paid', label: 'Processing', hint: 'Preparing your item' },
    { key: 'Shipped', label: 'Shipped', hint: 'Out for delivery' },
    { key: 'Completed', label: 'Delivered', hint: 'Enjoy your order' },
];

const statusIndexMap = {
    Pending: 1,
    Paid: 2,
    Shipped: 3,
    Completed: 4,
};

function CheckIcon() {
    return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CopyIcon() {
    return (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="9" y="9" width="10" height="10" rx="1.5" />
            <path d="M6 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1" />
        </svg>
    );
}

function ProductPlaceholder() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#2a2a2a,#111)] text-white/70">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Zm-9 7H9v3H7v-3H4v-2h3V8h2v3h3Zm3.5 2A1.5 1.5 0 1 1 17 13.5 1.5 1.5 0 0 1 15.5 15Zm3-3A1.5 1.5 0 1 1 20 10.5 1.5 1.5 0 0 1 18.5 12Z" />
            </svg>
        </div>
    );
}

export default function OrderConfirmation({ order }) {
    const [copied, setCopied] = useState(false);
    const currentStep = statusIndexMap[order.status] ?? 1;
    const itemCount = order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const firstItem = order.items[0];
    const paymentLabel = order.payment_channel
        ? `${order.payment_method} / ${order.payment_channel}`
        : order.payment_method;

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(order.order_number);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#111111] text-white">
                <section className="border-b border-[#D0111A]">
                    <div className="mx-auto max-w-7xl px-4 py-3 text-center sm:px-6 lg:px-8">
                        <h1 className="font-bebas text-2xl tracking-[0.22em] text-white sm:text-3xl">
                            ORDER <span className="text-[#D0111A]">CONFIRMED</span>
                        </h1>
                    </div>
                </section>

                <section className="border-b border-white/5 bg-[radial-gradient(circle_at_left,#17361d_0%,#101010_52%,#101010_100%)]">
                    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_320px] lg:px-8 lg:py-10">
                        <div className="flex items-start gap-5">
                            <div className="mt-1 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#4CFF64] text-[#0b160d] shadow-[0_0_28px_rgba(76,255,100,0.22)]">
                                <CheckIcon />
                            </div>

                            <div>
                                <p className="font-bebas text-4xl leading-[0.92] tracking-[0.08em] text-white sm:text-5xl">
                                    THANK YOU
                                </p>
                                <p className="font-bebas text-4xl leading-[0.92] tracking-[0.08em] text-white sm:text-5xl">
                                    FOR YOUR <span className="text-[#1DFF5B]">ORDER!</span>
                                </p>
                                <p className="mt-3 max-w-xl font-barlow text-sm text-white/70">
                                    Your order has been received and is now being processed.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-start lg:justify-end">
                            <div className="w-full max-w-[280px] text-right">
                                <p className="font-barlow text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                                    Order Number
                                </p>
                                <div className="mt-2 flex items-center justify-end gap-2">
                                    <div className="bg-white/8 px-3 py-2 font-bebas text-2xl tracking-[0.14em] text-white">
                                        {order.order_number}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
                                    >
                                        <CopyIcon />
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <p className="mt-2 font-barlow text-[10px] text-white/45">
                                    {order.created_at}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <p className="mb-5 font-barlow text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
                        Order Status
                    </p>

                    <div className="grid grid-cols-2 gap-y-6 border-t border-white/10 pt-6 md:grid-cols-5">
                        {STATUS_STEPS.map((step, index) => {
                            const state = index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming';
                            const isComplete = state === 'complete';
                            const isCurrent = state === 'current';

                            return (
                                <div key={step.key} className="relative text-center">
                                    <div
                                        className={`absolute -top-6 left-1/2 hidden h-[1px] w-full -translate-x-0 md:block ${
                                            index === 0
                                                ? 'bg-transparent'
                                                : isComplete || isCurrent
                                                    ? 'bg-[#27e65e]'
                                                    : 'bg-white/10'
                                        }`}
                                    />
                                    <div
                                        className={`relative z-10 mx-auto flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${
                                            isComplete
                                                ? 'border-[#27e65e] bg-[#27e65e]/10 text-[#27e65e]'
                                                : isCurrent
                                                    ? 'border-[#d29a27] bg-[#d29a27]/10 text-[#d29a27]'
                                                    : 'border-white/15 bg-[#171717] text-white/35'
                                        }`}
                                    >
                                        {isComplete ? (
                                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            <span>{index + 1}</span>
                                        )}
                                    </div>
                                    <p
                                        className={`mt-3 font-barlow text-[10px] font-bold uppercase tracking-[0.2em] ${
                                            isComplete ? 'text-[#27e65e]' : isCurrent ? 'text-[#d29a27]' : 'text-white/35'
                                        }`}
                                    >
                                        {step.label}
                                    </p>
                                    <p className="mt-1 font-barlow text-[10px] text-white/22">{step.hint}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
                    <div className="border border-[#7d1b1f] bg-[#141414]">
                        <div className="flex items-center justify-between border-b border-[#7d1b1f] px-4 py-3">
                            <h2 className="font-bebas text-2xl tracking-[0.12em] text-white">
                                ORDER <span className="text-[#D0111A]">ITEMS</span>
                            </h2>
                        </div>

                        <div className="min-h-[320px]">
                            {order.items.map((item, index) => (
                                <div
                                    key={`${item.product_name}-${index}`}
                                    className="flex items-center gap-3 border-b border-[#7d1b1f] px-3 py-3 last:border-b-0"
                                >
                                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden border border-white/10 bg-[#0f0f0f]">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.product_name} className="h-full w-full object-cover" />
                                        ) : (
                                            <ProductPlaceholder />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-barlow text-sm font-bold uppercase tracking-[0.08em] text-white">
                                            {item.product_name}
                                        </p>
                                        <p className="mt-1 font-barlow text-[11px] text-white/35">
                                            Qty {item.quantity} x P {fmt(item.unit_price)}
                                        </p>
                                    </div>

                                    <p className="font-barlow text-sm font-bold uppercase tracking-[0.08em] text-white">
                                        P {fmt(item.subtotal)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="border border-[#7d1b1f] bg-[#141414]">
                        <div className="border-b border-[#7d1b1f] px-4 py-3">
                            <h2 className="font-bebas text-2xl leading-none tracking-[0.12em] text-white">
                                ORDER
                            </h2>
                            <h2 className="font-bebas text-2xl leading-none tracking-[0.12em] text-[#D0111A]">
                                SUMMARY
                            </h2>
                        </div>

                        <div className="space-y-5 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden border border-white/10 bg-[#0f0f0f]">
                                        {firstItem?.image_url ? (
                                            <img src={firstItem.image_url} alt={firstItem.product_name} className="h-full w-full object-cover" />
                                        ) : (
                                            <ProductPlaceholder />
                                        )}
                                    </div>
                                    <div>
                                        <p className="max-w-[120px] font-barlow text-[11px] font-bold uppercase leading-tight tracking-[0.08em] text-white">
                                            {firstItem?.product_name ?? 'Order Item'}
                                        </p>
                                        <p className="mt-1 font-barlow text-[10px] uppercase tracking-[0.18em] text-white/35">
                                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-barlow text-xs font-bold uppercase tracking-[0.08em] text-white">
                                    P {fmt(firstItem?.subtotal ?? 0)}
                                </p>
                            </div>

                            <div className="space-y-2 border-t border-white/10 pt-4 font-barlow text-xs uppercase tracking-[0.16em]">
                                <div className="flex items-center justify-between text-white/75">
                                    <span>Subtotal</span>
                                    <span>P {fmt(order.subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between text-white/75">
                                    <span>Shipping</span>
                                    <span>{Number(order.shipping_fee) === 0 ? 'P 0.00' : `P ${fmt(order.shipping_fee)}`}</span>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="font-bebas text-2xl leading-none tracking-[0.1em] text-white">
                                            TOTAL
                                        </p>
                                        <p className="font-bebas text-2xl leading-none tracking-[0.1em] text-white">
                                            PAID
                                        </p>
                                    </div>
                                    <p className="font-bebas text-4xl leading-none tracking-[0.06em] text-white">
                                        P {fmt(order.total)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-white/10 pt-4 text-[10px] uppercase tracking-[0.18em] text-white/45">
                                <div className="flex items-center justify-between">
                                    <span>Status</span>
                                    <span className="text-white">{order.status}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Payment</span>
                                    <span className="text-right text-white">{paymentLabel}</span>
                                </div>
                                {order.tracking_number && (
                                    <div className="flex items-start justify-between gap-3">
                                        <span>Tracking</span>
                                        <span className="text-right text-white">
                                            {order.tracking_courier}
                                            <br />
                                            {order.tracking_number}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/shop"
                                className="flex w-full items-center justify-center bg-[#D0111A] px-4 py-3 font-barlow text-[11px] font-bold uppercase tracking-[0.25em] text-white transition hover:bg-[#b80f16]"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </aside>
                </section>

                {order.tracking_number && (
                    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
                        <div className="border border-white/10 bg-[#141414] p-5">
                            <div className="font-barlow text-[10px] font-bold uppercase tracking-[0.26em] text-[#D0111A]">
                                Shipment Tracking
                            </div>
                            <p className="mt-2 font-bebas text-2xl tracking-[0.08em] text-white">
                                {order.tracking_courier} - {order.tracking_number}
                            </p>
                            <p className="mt-2 max-w-2xl font-barlow text-sm text-white/45">
                                Your parcel is on the way. Use this tracking number on the courier's official website to check the latest delivery status manually.
                            </p>
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
}
