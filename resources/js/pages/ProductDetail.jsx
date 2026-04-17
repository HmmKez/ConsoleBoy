import Layout from '../components/Layout';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthModal from '../components/AuthModal';
import axios from 'axios';

function Stars({ value, size = 'text-base' }) {
    const rounded = Math.round(Number(value) || 0);

    return (
        <div className={`flex ${size}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= rounded ? 'text-[#D0111A]' : 'text-white/15'}>
                    ★
                </span>
            ))}
        </div>
    );
}

export default function ProductDetail({ product, related, reviews = [], reviewStats = { count: 0, average: 0 }, canReview = false }) {
    const { props } = usePage();
    const user = props.auth?.user;

    const [qty, setQty] = useState(1);
    const [authModal, setAuthModal] = useState(null);
    const [added, setAdded] = useState(false);
    const [selectedColor, setSelectedColor] = useState(
        product.colors && product.colors.length > 0 ? product.colors[0] : null
    );
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [reviewErrors, setReviewErrors] = useState({});
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    const price = Number(product.price);
    const perks = product.perks ?? [];
    const colors = product.colors ?? [];

    function handleAddToCart() {
        if (!user) {
            setAuthModal('login');
            return;
        }

        axios.post('/cart', { product_id: product.id, quantity: qty })
            .then((res) => {
                if (res.data.success) {
                    setAdded(true);
                    router.reload({ only: ['cartCount'] });
                    setTimeout(() => setAdded(false), 2000);
                }
            })
            .catch((err) => {
                if (err.response && err.response.status !== 200) {
                    alert(err.response?.data?.message || 'Could not add to cart.');
                }
            });
    }

    async function handleReviewSubmit(e) {
        e.preventDefault();

        if (!user) {
            setAuthModal('login');
            return;
        }

        setReviewSubmitting(true);
        setReviewErrors({});

        try {
            await axios.post(`/products/${product.id}/reviews`, reviewForm);
            setReviewForm({ rating: 5, comment: '' });
            router.reload({ only: ['reviews', 'reviewStats', 'canReview'] });
        } catch (err) {
            if (err.response?.status === 403) {
                setReviewErrors({ comment: [err.response.data.message || 'You can only review purchased products.'] });
            } else if (err.response?.data?.errors) {
                setReviewErrors(err.response.data.errors);
            }
        } finally {
            setReviewSubmitting(false);
        }
    }

    return (
        <Layout>
            <div className="min-h-screen max-w-6xl mx-auto bg-[#0E0E0E] px-8 py-8">
                <Link href="/shop" className="mb-8 inline-flex items-center gap-2 font-barlow text-xs font-bold uppercase tracking-[2px] text-white/40 transition-colors hover:text-white">
                    ‹ Go Back
                </Link>

                <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
                    <div>
                        <div className="mb-3 aspect-square overflow-hidden border border-white/7 bg-[#1A1A1A] flex items-center justify-center">
                            {product.image_url
                                ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                : <span className="text-8xl">🎮</span>
                            }
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className={`aspect-square overflow-hidden border bg-[#1A1A1A] ${i === 0 ? 'border-[#D0111A]' : 'border-white/7'}`}>
                                    {product.image_url
                                        ? <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                                        : <div className="flex h-full items-center justify-center text-2xl">🎮</div>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 font-barlow text-[9px] font-bold uppercase tracking-[3px] text-[#D0111A]">
                            {product.brand} · {product.category}
                        </div>
                        <h1 className="mb-3 font-bebas text-4xl leading-tight tracking-widest text-white">
                            {product.name.toUpperCase()}
                        </h1>

                        <div className="mb-4 flex items-center gap-3">
                            <Stars value={reviewStats.average} />
                            <span className="font-barlow text-xs text-white/55">
                                {reviewStats.average ? `${reviewStats.average} average` : 'No rating yet'}
                            </span>
                            <span className="font-barlow text-xs text-white/30">
                                ({reviewStats.count} review{reviewStats.count === 1 ? '' : 's'})
                            </span>
                        </div>

                        <div className="mb-5 font-bebas text-4xl text-white">
                            P {price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </div>

                        {colors.length > 0 && (
                            <div className="mb-5">
                                <div className="mb-2 font-barlow text-[9px] font-bold uppercase tracking-[3px] text-white/40">
                                    Color - <span className="text-white">{selectedColor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {colors.map((color, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            title={color}
                                            className="h-7 w-7 rounded-sm border-2 transition-colors"
                                            style={{
                                                background: color.startsWith('#') ? color : undefined,
                                                borderColor: selectedColor === color ? 'white' : 'transparent',
                                            }}
                                        >
                                            {!color.startsWith('#') && (
                                                <span className="text-[10px] font-bold text-white">{color[0]}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex items-center border border-white/15 bg-[#1A1A1A]">
                                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 text-lg font-bold text-white transition-colors hover:bg-white/10">-</button>
                                <span className="w-10 text-center font-bebas text-xl text-white">{qty}</span>
                                <button type="button" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="h-10 w-10 text-lg font-bold text-white transition-colors hover:bg-white/10">+</button>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className={`flex-1 py-3 font-barlow text-sm font-bold uppercase tracking-[2px] transition-all ${
                                    added
                                        ? 'bg-green-600 text-white'
                                        : 'bg-[#D0111A] text-white hover:bg-[#9E0D14] hover:shadow-[0_0_20px_rgba(208,17,26,0.4)]'
                                }`}
                            >
                                {added ? 'Added!' : 'Add to Cart'}
                            </button>
                        </div>

                        {product.stock === 0 && <p className="mb-3 font-barlow text-xs text-red-400">Out of stock</p>}
                        {product.stock > 0 && product.stock <= 5 && (
                            <p className="mb-3 font-barlow text-xs text-amber-400">Only {product.stock} left in stock.</p>
                        )}

                        {perks.length > 0 && (
                            <div className="mb-5 grid grid-cols-2 gap-2">
                                {perks.map((perk, i) => (
                                    <div key={i} className="border border-white/7 bg-[#1A1A1A] px-3 py-2">
                                        <div className="font-barlow text-[9px] font-bold uppercase tracking-[2px] text-white/70">
                                            {perk.label}
                                        </div>
                                        {perk.value && (
                                            <div className="font-barlow text-[9px] text-white/30">{perk.value}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {product.description && (
                            <div>
                                <div className="mb-2 font-barlow text-[9px] font-bold uppercase tracking-[3px] text-white/40">Description</div>
                                <p className="text-sm leading-relaxed text-white/50">{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                <section className="mb-16 grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
                    <div className="border border-white/7 bg-[#141414] p-5">
                        <h2 className="font-bebas text-2xl tracking-widest text-white">
                            WRITE A <span className="text-[#D0111A]">REVIEW</span>
                        </h2>
                        <p className="mt-2 font-barlow text-xs text-white/40">
                            Reviews are available to customers who purchased this product. Multiple reviews are allowed.
                        </p>

                        {!user && (
                            <button
                                type="button"
                                onClick={() => setAuthModal('login')}
                                className="mt-5 w-full bg-[#D0111A] py-3 font-barlow text-xs font-bold uppercase tracking-[2px] text-white transition-colors hover:bg-[#9E0D14]"
                            >
                                Sign In To Review
                            </button>
                        )}

                        {user && !canReview && (
                            <div className="mt-5 border border-white/10 bg-[#101010] px-4 py-4 font-barlow text-xs leading-relaxed text-white/50">
                                Purchase this product first to leave a review.
                            </div>
                        )}

                        {user && canReview && (
                            <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-2 block font-barlow text-[10px] font-bold uppercase tracking-[3px] text-white/50">
                                        Star Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                                                className={`text-2xl transition-colors ${star <= reviewForm.rating ? 'text-[#D0111A]' : 'text-white/20 hover:text-white/50'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    {reviewErrors.rating && <p className="mt-1 text-[10px] text-[#D0111A]">{reviewErrors.rating[0]}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block font-barlow text-[10px] font-bold uppercase tracking-[3px] text-white/50">
                                        Comment
                                    </label>
                                    <textarea
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                                        rows={5}
                                        placeholder="Share what you liked, performance notes, delivery impressions, or anything future buyers should know."
                                        className="w-full resize-none border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#D0111A]"
                                    />
                                    {reviewErrors.comment && <p className="mt-1 text-[10px] text-[#D0111A]">{reviewErrors.comment[0]}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={reviewSubmitting}
                                    className="w-full bg-[#D0111A] py-3 font-barlow text-xs font-bold uppercase tracking-[2px] text-white transition-colors hover:bg-[#9E0D14] disabled:opacity-60"
                                >
                                    {reviewSubmitting ? 'Posting Review...' : 'Post Review'}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="border border-white/7 bg-[#141414]">
                        <div className="flex items-center justify-between border-b border-white/7 px-5 py-4">
                            <div>
                                <h2 className="font-bebas text-2xl tracking-widest text-white">
                                    CUSTOMER <span className="text-[#D0111A]">REVIEWS</span>
                                </h2>
                                <p className="font-barlow text-xs text-white/35">
                                    {reviewStats.count} review{reviewStats.count === 1 ? '' : 's'} · {reviewStats.average || '0.0'} average rating
                                </p>
                            </div>
                            <Stars value={reviewStats.average} size="text-xl" />
                        </div>

                        {reviews.length === 0 ? (
                            <div className="px-5 py-16 text-center font-barlow text-sm text-white/30">
                                No reviews yet for this product.
                            </div>
                        ) : (
                            <div className="divide-y divide-white/7">
                                {reviews.map((review) => (
                                    <article key={review.id} className="px-5 py-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="font-barlow text-sm font-bold text-white">{review.user.name}</div>
                                                <div className="mt-1 flex items-center gap-3">
                                                    <Stars value={review.rating} />
                                                    <span className="font-barlow text-[11px] uppercase tracking-[0.16em] text-white/30">{review.created_at}</span>
                                                </div>
                                            </div>
                                            <span className="border border-[#D0111A]/30 bg-[#D0111A]/10 px-2 py-1 font-barlow text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6b73]">
                                                {review.rating}/5
                                            </span>
                                        </div>
                                        <p className="mt-4 text-sm leading-relaxed text-white/60">{review.comment}</p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {related && related.length > 0 && (
                    <div>
                        <h2 className="mb-1 font-bebas text-3xl tracking-widest text-white">
                            YOU MAY ALSO <span className="text-[#D0111A]">LIKE</span>
                        </h2>
                        <p className="mb-6 font-barlow text-xs text-white/30">We give you the best of the best.</p>
                        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((p) => (
                                <Link key={p.id} href={`/products/${p.id}`} className="group block overflow-hidden border border-white/7 bg-[#1A1A1A] transition-colors hover:border-[#D0111A]">
                                    <div className="aspect-square overflow-hidden bg-[#1E1E1E]">
                                        {p.image_url
                                            ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            : <div className="flex h-full items-center justify-center text-4xl">🎮</div>
                                        }
                                    </div>
                                    <div className="border-t border-white/7 p-3">
                                        <div className="mb-1 font-barlow text-[9px] font-bold uppercase tracking-[2px] text-[#D0111A]">{p.brand}</div>
                                        <div className="mb-1 font-barlow text-sm font-bold text-white">{p.name}</div>
                                        <div className="font-bebas text-base text-white">
                                            PHP {Number(p.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {authModal && (
                <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={(m) => setAuthModal(m)} />
            )}
        </Layout>
    );
}
